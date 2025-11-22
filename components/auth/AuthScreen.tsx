
import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  OAuthProvider,
  updateProfile
} from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useApp } from '../../context/AppContext';

type AuthMode = 'login' | 'signup';

export default function AuthScreen() {
  const { loginAsGuest } = useApp();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        if (!username) throw new Error("Username is required");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: username });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAppleLogin = async () => {
    setError('');
    const provider = new OAuthProvider('apple.com');
    try {
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-canva-bg text-white flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {mode === 'login' ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-gray-400 text-sm">
            {mode === 'login' ? 'Log in or sign up in seconds' : 'Start your financial journey today'}
          </p>
        </div>

        {/* Social Buttons */}
        <div className="space-y-3">
           {/* Apple */}
           <button 
             onClick={handleAppleLogin}
             className="w-full h-12 bg-black border border-gray-700 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-900 transition-all font-medium text-white relative overflow-hidden"
           >
             <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.62 4.37-1.62.89 0 2.23.34 3.06 1.22-4.84 1.88-3.68 8.84.65 10.83-.49 1.23-1.38 2.79-2.13 3.8H17.05zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.54 4.52-3.74 4.25z"/></svg>
             Continue with Apple
           </button>

           {/* Google */}
           <button 
             onClick={handleGoogleLogin}
             className="w-full h-12 bg-white text-gray-900 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-100 transition-all font-medium relative overflow-hidden"
           >
             <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
             Continue with Google
           </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center py-2">
           <div className="flex-grow border-t border-gray-800"></div>
           <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">
             {mode === 'login' ? 'Or log in with email' : 'Or create an account'}
           </span>
           <div className="flex-grow border-t border-gray-800"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
           {mode === 'signup' && (
             <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 ml-1">USERNAME</label>
                <input 
                  type="text"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full h-12 bg-canva-input border border-gray-800 rounded-lg px-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
             </div>
           )}

           <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 ml-1">EMAIL</label>
              <input 
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full h-12 bg-canva-input border border-gray-800 rounded-lg px-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
           </div>

           <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 ml-1">PASSWORD</label>
              <input 
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full h-12 bg-canva-input border border-gray-800 rounded-lg px-4 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
           </div>

           {error && (
             <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">
               {error}
             </p>
           )}

           <button 
             type="submit"
             disabled={isLoading}
             className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
           >
             {isLoading ? 'Processing...' : mode === 'login' ? 'Log In' : 'Create Account'}
           </button>
        </form>

        {/* Toggle */}
        <div className="text-center space-y-6">
          <p className="text-gray-400 text-sm">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-white font-semibold hover:underline"
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>

           <button 
            onClick={loginAsGuest}
            className="text-gray-500 hover:text-white transition-colors text-sm font-medium"
           >
             Continue as Guest
           </button>
        </div>

      </div>
    </div>
  );
}
