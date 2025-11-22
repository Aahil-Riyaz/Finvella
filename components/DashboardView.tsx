
import React from 'react';
import { useApp } from '../context/AppContext';
import { Card } from './UIComponents';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardView() {
  const { expenses, budget, goals, getCurrencySymbol } = useApp();
  const currency = getCurrencySymbol();

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const remainingBudget = budget.monthlyIncome - totalExpenses;
  const savingsRate = budget.monthlyIncome > 0 ? ((budget.monthlyIncome - totalExpenses) / budget.monthlyIncome) * 100 : 0;

  // Data for Bar Chart (Last 7 days)
  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const chartData = last7Days.map(date => {
    const val = expenses.filter(e => e.date === date).reduce((acc, curr) => acc + curr.amount, 0);
    return { date: date.slice(5), amount: val };
  });

  // Logic for Next Goal Deadline
  const nextGoal = goals
    .filter(g => g.deadline) // Ensure there is a deadline
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())[0];

  const getDaysLeft = (deadline: string) => {
    const diff = new Date(deadline).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <p className="text-gray-500 dark:text-gray-400">Welcome back, Student.</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-none">
          <div className="flex flex-col h-full justify-between">
            <div>
               <p className="text-gray-400 text-sm font-medium mb-1">Total Balance</p>
               <h3 className="text-4xl font-bold tracking-tight">{currency}{remainingBudget.toLocaleString()}</h3>
            </div>
            <div className="mt-4">
               <div className="flex items-center gap-2 text-sm text-green-400 bg-green-400/10 w-fit px-2 py-1 rounded-lg">
                 <span>+ {savingsRate.toFixed(1)}% savings rate</span>
               </div>
            </div>
          </div>
        </Card>

        <Card>
           <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Expenses</p>
           <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{currency}{totalExpenses.toLocaleString()}</h3>
           <div className="mt-4 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500" style={{ width: '65%' }}></div>
           </div>
           <p className="text-xs text-gray-400 mt-2">65% of monthly budget used</p>
        </Card>

        <Card>
           <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Active Goals</p>
           <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{goals.length}</h3>
           <div className="mt-4 flex -space-x-2 overflow-hidden">
             {goals.slice(0, 3).map((g, i) => (
               <div key={g.id} className={`inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800 bg-indigo-${500 - (i*100)} flex items-center justify-center text-white text-xs font-bold`}>
                 {g.name[0]}
               </div>
             ))}
             {goals.length > 3 && <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs">+</div>}
           </div>
        </Card>
      </div>

      {/* Main Chart Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 min-h-[400px]">
           <h3 className="text-lg font-bold mb-6">Spending Trend</h3>
           <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData}>
                 <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                 <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${currency}${val}`} />
                 <Tooltip 
                   cursor={{fill: 'transparent'}}
                   contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                 />
                 <Bar dataKey="amount" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
               </BarChart>
             </ResponsiveContainer>
           </div>
        </Card>

        {/* Quick Actions / Recent */}
        <Card className="bg-indigo-600 text-white border-none">
          <h3 className="text-xl font-bold mb-4">Quick Tips</h3>
          <ul className="space-y-4">
            <li className="flex gap-3">
               <span className="bg-white/20 rounded-lg p-2 h-fit">🍱</span>
               <div>
                 <p className="font-bold text-sm">Cook at home</p>
                 <p className="text-indigo-200 text-xs">You spent $120 on takeout this week.</p>
               </div>
            </li>
             <li className="flex gap-3">
               <span className="bg-white/20 rounded-lg p-2 h-fit">📚</span>
               <div>
                 <p className="font-bold text-sm">Used Books</p>
                 <p className="text-indigo-200 text-xs">Check the library before buying textbooks.</p>
               </div>
            </li>
          </ul>
          <div className="mt-8 pt-6 border-t border-indigo-500">
            <p className="text-sm font-medium text-indigo-200">Next Goal Deadline</p>
            {nextGoal ? (
              <p className="font-bold">{nextGoal.name} - {getDaysLeft(nextGoal.deadline)} days left</p>
            ) : (
              <p className="font-bold text-indigo-100 opacity-70">No active deadlines</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
