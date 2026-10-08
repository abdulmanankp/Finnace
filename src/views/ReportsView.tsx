import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/format';

export const ReportsView: React.FC = () => {
  const {
    transactions,
    categories,
    flatMetrics,
    livingMetrics,
    totalAvailableMoney,
    totalMoneyOwed,
    totalMoneyReceivable,
    currency,
  } = useFinance();

  const totalExpenses = flatMetrics.expenses + livingMetrics.expenses;
  const totalIncome = flatMetrics.income + livingMetrics.income;

  // Breakdown of Flat expenses by category
  const flatCategoryBreakdown = categories
    .filter((c) => c.area === 'flat')
    .map((cat) => {
      const sum = transactions
        .filter((t) => t.category_id === cat.id && t.transaction_type === 'expense')
        .reduce((s, t) => s + t.amount, 0);
      return { name: cat.name, amount: sum };
    })
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  // Breakdown of Living expenses by category
  const livingCategoryBreakdown = categories
    .filter((c) => c.area === 'living')
    .map((cat) => {
      const sum = transactions
        .filter((t) => t.category_id === cat.id && t.transaction_type === 'expense')
        .reduce((s, t) => s + t.amount, 0);
      return { name: cat.name, amount: sum };
    })
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="space-y-4 pb-24 md:pb-10 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-white">Summary</h2>
        <span className="text-xs font-bold text-slate-400 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
          This Month
        </span>
      </div>

      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 block">Income</span>
          <span className="text-lg font-black text-emerald-400 mt-1 block">
            {formatCurrency(totalIncome, currency)}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 block">Expenses</span>
          <span className="text-lg font-black text-rose-400 mt-1 block">
            {formatCurrency(totalExpenses, currency)}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 block">🏠 Flat Total</span>
          <span className="text-lg font-black text-sky-400 mt-1 block">
            {formatCurrency(flatMetrics.expenses, currency)}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 block">👤 Living Total</span>
          <span className="text-lg font-black text-emerald-400 mt-1 block">
            {formatCurrency(livingMetrics.expenses, currency)}
          </span>
        </div>
      </div>

      {/* Flat vs Living Bar */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-sky-400">🏠 Flat ({formatCurrency(flatMetrics.expenses, currency)})</span>
          <span className="text-emerald-400">👤 Living ({formatCurrency(livingMetrics.expenses, currency)})</span>
        </div>
        <div className="w-full bg-slate-950 h-4 rounded-full overflow-hidden flex border border-slate-800">
          <div
            className="bg-sky-400 h-full"
            style={{ width: `${(flatMetrics.expenses / (totalExpenses || 1)) * 100}%` }}
          />
          <div
            className="bg-emerald-400 h-full"
            style={{ width: `${(livingMetrics.expenses / (totalExpenses || 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Categories Side by Side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Flat */}
        <div className="p-4 rounded-3xl bg-slate-900 border border-sky-500/20 space-y-2.5">
          <span className="text-xs font-bold text-sky-400 block">🏠 Flat Breakdown</span>
          {flatCategoryBreakdown.map((item) => (
            <div key={item.name} className="flex justify-between text-xs py-1 border-b border-slate-800/40">
              <span className="text-slate-300">{item.name}</span>
              <span className="font-bold text-white">{formatCurrency(item.amount, currency)}</span>
            </div>
          ))}
        </div>

        {/* Living */}
        <div className="p-4 rounded-3xl bg-slate-900 border border-emerald-500/20 space-y-2.5">
          <span className="text-xs font-bold text-emerald-400 block">👤 Living Breakdown</span>
          {livingCategoryBreakdown.map((item) => (
            <div key={item.name} className="flex justify-between text-xs py-1 border-b border-slate-800/40">
              <span className="text-slate-300">{item.name}</span>
              <span className="font-bold text-white">{formatCurrency(item.amount, currency)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
