import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Expense, Goal, Budget, CurrencyCode, UserProfile, ChatMessage } from '../types';
import { CURRENCIES } from '../constants';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  updateDoc, 
  query,
  orderBy,
} from 'firebase/firestore';

interface AppState {
  user: UserProfile | null;
  loading: boolean;
  expenses: Expense[];
  goals: Goal[];
  budget: Budget;
  currencyCode: CurrencyCode;
  theme: 'light' | 'dark';
  chatHistory: ChatMessage[];
  toggleTheme: () => void;
  setCurrencyCode: (code: CurrencyCode) => void;
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, amount: number) => void;
  deleteGoal: (id: string) => void;
  updateBudget: (budget: Budget) => void;
  getCurrencySymbol: () => string;
  addChatMessage: (message: ChatMessage) => void;
  clearChatHistory: () => void;
  loginAsGuest: () => void;
  logout: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

// Local Storage Keys for Guest Mode
const GUEST_KEYS = {
  EXPENSES: 'finvella_guest_expenses',
  GOALS: 'finvella_guest_goals',
  BUDGET: 'finvella_guest_budget',
  CHAT: 'finvella_guest_chat',
  MODE: 'finvella_guest_mode',
  CURRENCY: 'finvella_guest_currency',
  THEME: 'finvella_guest_theme'
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [budget, setBudget] = useState<Budget>({ monthlyIncome: 0, limits: {} });
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>('USD');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Helper to save guest data
  const saveGuestData = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // 1. Handle Authentication State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        // Firebase User
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          isGuest: false
        });
        await loadUserData(currentUser.uid);
      } else {
        // Check for Guest Mode
        const isGuestMode = localStorage.getItem(GUEST_KEYS.MODE) === 'true';
        if (isGuestMode) {
          setUser({
            uid: 'guest',
            email: null,
            displayName: 'Guest',
            photoURL: null,
            isGuest: true
          });
          loadGuestData();
        } else {
          // No User
          setUser(null);
          setExpenses([]);
          setGoals([]);
          setBudget({ monthlyIncome: 0, limits: {} });
          setChatHistory([]);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Load Data from Firestore
  const loadUserData = async (uid: string) => {
    try {
      // Load Settings (Budget, Currency, Theme)
      const settingsRef = doc(db, 'users', uid, 'settings', 'config');
      const settingsSnap = await getDoc(settingsRef);
      
      if (settingsSnap.exists()) {
        const data = settingsSnap.data();
        if (data.budget) setBudget(data.budget);
        if (data.currencyCode) setCurrencyCode(data.currencyCode);
        if (data.theme) setTheme(data.theme);
      }

      // Load Expenses
      const expensesQuery = query(collection(db, 'users', uid, 'expenses'));
      const expensesSnap = await getDocs(expensesQuery);
      const loadedExpenses = expensesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
      setExpenses(loadedExpenses);

      // Load Goals
      const goalsQuery = query(collection(db, 'users', uid, 'goals'));
      const goalsSnap = await getDocs(goalsQuery);
      const loadedGoals = goalsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Goal));
      setGoals(loadedGoals);

      // Load Chat History
      const chatQuery = query(collection(db, 'users', uid, 'chat'), orderBy('timestamp', 'asc')); 
      const chatSnap = await getDocs(chatQuery);
      const loadedChat = chatSnap.docs.map(doc => ({ ...doc.data() } as ChatMessage));
      setChatHistory(loadedChat);

    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  // Load Data from LocalStorage (Guest)
  const loadGuestData = () => {
    try {
      const lsExpenses = JSON.parse(localStorage.getItem(GUEST_KEYS.EXPENSES) || '[]');
      const lsGoals = JSON.parse(localStorage.getItem(GUEST_KEYS.GOALS) || '[]');
      const lsBudget = JSON.parse(localStorage.getItem(GUEST_KEYS.BUDGET) || '{"monthlyIncome": 0, "limits": {}}');
      const lsChat = JSON.parse(localStorage.getItem(GUEST_KEYS.CHAT) || '[]');
      const lsCurrency = localStorage.getItem(GUEST_KEYS.CURRENCY) as CurrencyCode || 'USD';
      const lsTheme = localStorage.getItem(GUEST_KEYS.THEME) as 'light' | 'dark' || 'dark';

      setExpenses(lsExpenses);
      setGoals(lsGoals);
      setBudget(lsBudget);
      setChatHistory(lsChat);
      setCurrencyCode(lsCurrency);
      setTheme(lsTheme);
    } catch (e) {
      console.error("Error loading guest data", e);
    }
  };

  // 3. Apply Theme
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // 4. Actions

  const loginAsGuest = () => {
    localStorage.setItem(GUEST_KEYS.MODE, 'true');
    setUser({
      uid: 'guest',
      email: null,
      displayName: 'Guest',
      photoURL: null,
      isGuest: true
    });
    loadGuestData();
  };

  const logout = async () => {
    if (user?.isGuest) {
      localStorage.removeItem(GUEST_KEYS.MODE);
      setUser(null);
      setChatHistory([]);
      setExpenses([]);
      setGoals([]);
    } else {
      await signOut(auth);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    if (user?.isGuest) {
      localStorage.setItem(GUEST_KEYS.THEME, newTheme);
    } else if (user) {
      setDoc(doc(db, 'users', user.uid, 'settings', 'config'), { theme: newTheme }, { merge: true });
    }
  };

  const handleSetCurrencyCode = (code: CurrencyCode) => {
    setCurrencyCode(code);
    if (user?.isGuest) {
      localStorage.setItem(GUEST_KEYS.CURRENCY, code);
    } else if (user) {
      setDoc(doc(db, 'users', user.uid, 'settings', 'config'), { currencyCode: code }, { merge: true });
    }
  };

  const addExpense = async (expense: Expense) => {
    const newExpenses = [expense, ...expenses];
    setExpenses(newExpenses);
    
    if (user?.isGuest) {
      saveGuestData(GUEST_KEYS.EXPENSES, newExpenses);
    } else if (user) {
      await setDoc(doc(db, 'users', user.uid, 'expenses', expense.id), expense);
    }
  };

  const deleteExpense = async (id: string) => {
    const newExpenses = expenses.filter(e => e.id !== id);
    setExpenses(newExpenses);

    if (user?.isGuest) {
      saveGuestData(GUEST_KEYS.EXPENSES, newExpenses);
    } else if (user) {
      await deleteDoc(doc(db, 'users', user.uid, 'expenses', id));
    }
  };

  const addGoal = async (goal: Goal) => {
    const newGoals = [...goals, goal];
    setGoals(newGoals);

    if (user?.isGuest) {
      saveGuestData(GUEST_KEYS.GOALS, newGoals);
    } else if (user) {
      await setDoc(doc(db, 'users', user.uid, 'goals', goal.id), goal);
    }
  };

  const updateGoal = async (id: string, amount: number) => {
    let updatedGoal: Goal | undefined;
    const newGoals = goals.map(g => {
      if (g.id === id) {
        updatedGoal = { ...g, savedAmount: g.savedAmount + amount };
        return updatedGoal;
      }
      return g;
    });
    setGoals(newGoals);

    if (user?.isGuest) {
      saveGuestData(GUEST_KEYS.GOALS, newGoals);
    } else if (user && updatedGoal) {
      await updateDoc(doc(db, 'users', user.uid, 'goals', id), { savedAmount: updatedGoal.savedAmount });
    }
  };

  const deleteGoal = async (id: string) => {
    const newGoals = goals.filter(g => g.id !== id);
    setGoals(newGoals);

    if (user?.isGuest) {
      saveGuestData(GUEST_KEYS.GOALS, newGoals);
    } else if (user) {
      await deleteDoc(doc(db, 'users', user.uid, 'goals', id));
    }
  };

  const updateBudget = async (newBudget: Budget) => {
    setBudget(newBudget);
    if (user?.isGuest) {
      saveGuestData(GUEST_KEYS.BUDGET, newBudget);
    } else if (user) {
      setDoc(doc(db, 'users', user.uid, 'settings', 'config'), { budget: newBudget }, { merge: true });
    }
  };

  // CRITICAL FIX: Use functional state updates to prevent race conditions and stale closures
  const addChatMessage = async (message: ChatMessage) => {
    setChatHistory(prevHistory => {
      const newHistory = [...prevHistory, message];
      
      // Side-effect: Persistence
      // We do the persistence here to ensure we are saving the exact state we just computed
      if (user?.isGuest) {
        saveGuestData(GUEST_KEYS.CHAT, newHistory);
      } else if (user) {
        // Fire and forget Firestore save
        setDoc(doc(db, 'users', user.uid, 'chat', message.id), message)
          .catch(err => console.error("Failed to save chat", err));
      }
      
      return newHistory;
    });
  };

  const clearChatHistory = async () => {
    setChatHistory([]);
    if (user?.isGuest) {
      saveGuestData(GUEST_KEYS.CHAT, []);
    } else if (user) {
      // Optional: Implement cloud delete if needed
      console.log("Clear chat requested for cloud user"); 
    }
  };

  const getCurrencySymbol = () => {
    return CURRENCIES.find(c => c.code === currencyCode)?.symbol || '$';
  };

  return (
    <AppContext.Provider value={{
      user,
      loading,
      expenses,
      goals,
      budget,
      currencyCode,
      theme,
      chatHistory,
      toggleTheme,
      setCurrencyCode: handleSetCurrencyCode,
      addExpense,
      deleteExpense,
      addGoal,
      updateGoal,
      deleteGoal,
      updateBudget,
      getCurrencySymbol,
      addChatMessage,
      clearChatHistory,
      loginAsGuest,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};