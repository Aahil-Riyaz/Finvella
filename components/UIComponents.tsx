import React, { ReactNode } from 'react';

// --- Card ---
export const Card = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`bg-white dark:bg-dark-card rounded-3xl shadow-lg shadow-gray-200/50 dark:shadow-black/30 p-6 transition-all duration-300 ${className}`}>
    {children}
  </div>
);

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }: ButtonProps) => {
  const baseStyle = "rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40",
    secondary: "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600",
    outline: "border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-indigo-500 hover:text-indigo-500",
    danger: "bg-red-500/10 text-red-600 hover:bg-red-500/20",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = ({ label, className = '', ...props }: InputProps) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">{label}</label>}
    <input
      className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
      {...props}
    />
  </div>
);

// --- Select ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const Select = ({ label, options, className = '', ...props }: SelectProps) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ml-1">{label}</label>}
    <div className="relative">
      <select
        className="w-full appearance-none bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  </div>
);

// --- Progress Bar ---
export const ProgressBar = ({ progress, colorClass = "bg-indigo-500" }: { progress: number; colorClass?: string }) => (
  <div className="h-2.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
    <div 
      className={`h-full rounded-full ${colorClass} transition-all duration-1000 ease-out`} 
      style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
    />
  </div>
);
