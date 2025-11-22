import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Button, Input, ProgressBar } from '../UIComponents';
import { CATEGORIES } from '../../constants';

export default function BudgetView() {
  const { budget, updateBudget, expenses, getCurrencySymbol } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [tempIncome, setTempIncome] = useState(budget.monthlyIncome.toString());
  const [tempLimits, setTempLimits] = useState<Record<string, number>>(budget.limits);

  const currency = getCurrencySymbol();

  // Calculate spend per category
  const spendByCategory: Record<string, number> = {};
  expenses.forEach(e => {
    // Simple monthly check for demo (assumes current month)
    const expenseDate = new Date(e.date);
    const now = new Date();
    if (expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear()) {
      spendByCategory[e.category] = (spendByCategory[e.category] || 0) + e.amount;
    }
  });

  const totalSpent = Object.values(spendByCategory).reduce((a, b) => a + b, 0);
  const remaining = budget.monthlyIncome - totalSpent;

  const handleSave = () => {
    updateBudget({
      monthlyIncome: parseFloat(tempIncome) || 0,
      limits: tempLimits
    });
    setIsEditing(false);
  };

  const getAIAdvice = () => {
    if (totalSpent > budget.monthlyIncome * 0.9) return "Warning: You have used over 90% of your income. Slow down on non-essentials.";
    if (remaining > budget.monthlyIncome * 0.2) return "Great job! You are on track to save 20% of your income this month.";
    return "Keep tracking your expenses to maintain a healthy financial status.";
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
       <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Monthly Budget</h2>
          <p className="text-gray-500 dark:text-gray-400">Plan your student life.</p>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? 'secondary' : 'primary'}>
          {isEditing ? 'Cancel' : 'Edit Budget'}
        </Button>
      </div>

      {isEditing ? (
        <Card>
          <h3 className="text-xl font-bold mb-6">Budget Settings</h3>
          <div className="space-y-6">
            <Input 
              label="Monthly Income"
              type="number"
              value={tempIncome}
              onChange={e => setTempIncome(e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CATEGORIES.map(cat => (
                <div key={cat}>
                  <label className="text-xs font-medium text-gray-500 uppercase">{cat} Limit</label>
                  <input 
                    type="number"
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 mt-1 outline-none focus:ring-2 focus:ring-indigo-500"
                    value={tempLimits[cat] || ''}
                    onChange={e => setTempLimits({...tempLimits, [cat]: parseFloat(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
            <Button onClick={handleSave} className="w-full">Save Changes</Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white border-none shadow-indigo-500/30">
              <p className="text-indigo-100 text-sm font-medium">Monthly Income</p>
              <p className="text-3xl font-bold mt-1">{currency}{budget.monthlyIncome.toLocaleString()}</p>
            </Card>
             <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-none shadow-emerald-500/30">
              <p className="text-emerald-100 text-sm font-medium">Remaining</p>
              <p className="text-3xl font-bold mt-1">{currency}{remaining.toLocaleString()}</p>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-none shadow-purple-500/30">
              <p className="text-purple-100 text-sm font-medium">Total Spent</p>
              <p className="text-3xl font-bold mt-1">{currency}{totalSpent.toLocaleString()}</p>
            </Card>
          </div>

          {/* AI Tip */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 p-4 rounded-2xl flex gap-3 items-start">
             <span className="text-2xl">💡</span>
             <div>
               <h4 className="font-bold text-amber-800 dark:text-amber-400">Smart Insight</h4>
               <p className="text-sm text-amber-700 dark:text-amber-300">{getAIAdvice()}</p>
             </div>
          </div>

          {/* Categories List */}
          <div className="space-y-4">
            {CATEGORIES.map(cat => {
              const limit = budget.limits[cat] || 0;
              const spent = spendByCategory[cat] || 0;
              const pct = limit > 0 ? (spent / limit) * 100 : 0;
              const isOver = spent > limit && limit > 0;

              return (
                <Card key={cat} className="py-4 px-6">
                  <div className="flex justify-between mb-2">
                    <h4 className="font-bold">{cat}</h4>
                    <span className={`text-sm ${isOver ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                      {currency}{spent} / {limit > 0 ? `${currency}${limit}` : 'No Limit'}
                    </span>
                  </div>
                  <ProgressBar 
                    progress={pct} 
                    colorClass={isOver ? 'bg-red-500' : pct > 80 ? 'bg-amber-500' : 'bg-indigo-500'} 
                  />
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
