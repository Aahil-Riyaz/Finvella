import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Card, Button, Input, Select } from '../UIComponents';
import { CATEGORIES } from '../../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function ExpensesView() {
  const { expenses, addExpense, deleteExpense, getCurrencySymbol } = useApp();
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: CATEGORIES[0],
    date: new Date().toISOString().split('T')[0]
  });

  const currency = getCurrencySymbol();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount) return;

    addExpense({
      id: Date.now().toString(),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: newExpense.date
    });

    setNewExpense({ ...newExpense, description: '', amount: '' });
  };

  const chartData = useMemo(() => {
    const data: Record<string, number> = {};
    expenses.forEach(e => {
      data[e.category] = (data[e.category] || 0) + e.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const COLORS = ['#6366f1', '#ec4899', '#8b5cf6', '#14b8a6', '#f59e0b', '#ef4444', '#10b981'];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Expenses</h2>
          <p className="text-gray-500 dark:text-gray-400">Track every penny.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Spent</p>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {currency}{expenses.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Expense Form */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <h3 className="text-lg font-semibold mb-6">Add New</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input 
                label="Description"
                value={newExpense.description}
                onChange={e => setNewExpense({...newExpense, description: e.target.value})}
                placeholder="e.g. Coffee"
              />
              <Input 
                label="Amount"
                type="number"
                value={newExpense.amount}
                onChange={e => setNewExpense({...newExpense, amount: e.target.value})}
                placeholder="0.00"
              />
              <Select 
                label="Category"
                options={CATEGORIES.map(c => ({ value: c, label: c }))}
                value={newExpense.category}
                onChange={e => setNewExpense({...newExpense, category: e.target.value})}
              />
              <Input 
                label="Date"
                type="date"
                value={newExpense.date}
                onChange={e => setNewExpense({...newExpense, date: e.target.value})}
              />
              <div className="pt-4">
                <Button type="submit" className="w-full">Add Expense</Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Chart & List */}
        <div className="lg:col-span-2 space-y-8">
          {expenses.length > 0 ? (
            <Card className="min-h-[300px] flex flex-col">
               <h3 className="text-lg font-semibold mb-4">Breakdown</h3>
               <div className="flex-1 min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
               </div>
            </Card>
          ) : null}

          <Card>
            <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
            <div className="space-y-4">
              {expenses.length === 0 && <p className="text-gray-500 text-center py-8">No expenses yet.</p>}
              {expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-lg">
                      {expense.category[0]}
                    </div>
                    <div>
                      <h4 className="font-semibold">{expense.description}</h4>
                      <p className="text-xs text-gray-500">{expense.date} • {expense.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-red-500">-{currency}{expense.amount.toLocaleString()}</span>
                    <button 
                      onClick={() => deleteExpense(expense.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
