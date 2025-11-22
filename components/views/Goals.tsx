import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Button, Input, ProgressBar } from '../UIComponents';

export default function GoalsView() {
  const { goals, addGoal, updateGoal, deleteGoal, getCurrencySymbol } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', deadline: '' });
  
  const currency = getCurrencySymbol();

  const handleAdd = () => {
    if (!newGoal.name || !newGoal.target) return;
    addGoal({
      id: Date.now().toString(),
      name: newGoal.name,
      targetAmount: parseFloat(newGoal.target),
      savedAmount: 0,
      deadline: newGoal.deadline
    });
    setShowForm(false);
    setNewGoal({ name: '', target: '', deadline: '' });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Savings Goals</h2>
          <p className="text-gray-500 dark:text-gray-400">Wishlist & Dreams.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} variant="primary">
          {showForm ? 'Close' : '+ New Goal'}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-8 max-w-md mx-auto animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-bold mb-4">Create Goal</h3>
          <div className="space-y-4">
            <Input label="Item Name" placeholder="e.g. MacBook Pro" value={newGoal.name} onChange={e => setNewGoal({...newGoal, name: e.target.value})} />
            <Input label="Target Amount" type="number" placeholder="2000" value={newGoal.target} onChange={e => setNewGoal({...newGoal, target: e.target.value})} />
            <Input label="Deadline" type="date" value={newGoal.deadline} onChange={e => setNewGoal({...newGoal, deadline: e.target.value})} />
            <Button className="w-full" onClick={handleAdd}>Start Saving</Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map(goal => {
          const progress = (goal.savedAmount / goal.targetAmount) * 100;
          const remaining = goal.targetAmount - goal.savedAmount;
          
          return (
            <Card key={goal.id} className="relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => deleteGoal(goal.id)} className="text-gray-400 hover:text-red-500">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                 </button>
              </div>
              
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-500/10 flex items-center justify-center text-2xl">
                  🎁
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Target</span>
                  <p className="font-bold text-lg">{currency}{goal.targetAmount.toLocaleString()}</p>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-1">{goal.name}</h3>
              <p className="text-sm text-gray-500 mb-6">
                by {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : 'Someday'}
              </p>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-indigo-600 dark:text-indigo-400">{Math.round(progress)}%</span>
                  <span className="text-gray-500">{currency}{remaining.toLocaleString()} left</span>
                </div>
                <ProgressBar progress={progress} colorClass="bg-gradient-to-r from-pink-500 to-rose-500" />
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-500 mb-2">Add Funds</p>
                <div className="flex gap-2">
                   <Button size="sm" variant="secondary" onClick={() => updateGoal(goal.id, 10)}>+{currency}10</Button>
                   <Button size="sm" variant="secondary" onClick={() => updateGoal(goal.id, 50)}>+{currency}50</Button>
                   <Button size="sm" variant="secondary" onClick={() => updateGoal(goal.id, 100)}>+{currency}100</Button>
                </div>
              </div>
            </Card>
          );
        })}

        {goals.length === 0 && !showForm && (
            <div className="col-span-full text-center py-20 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl text-gray-400">
              <p className="text-lg">No active goals.</p>
              <p className="text-sm">Add something you want to buy!</p>
            </div>
        )}
      </div>
    </div>
  );
}
