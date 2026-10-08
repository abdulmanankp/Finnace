import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/format';
import { Home, User, ArrowDownLeft, ArrowUpRight, Scale, Plus } from 'lucide-react';

interface AreaSplitCardProps {
  onQuickAdd: (area: 'flat' | 'living', type: 'expense' | 'income') => void;
}

export const AreaSplitCard: React.FC<AreaSplitCardProps> = ({ onQuickAdd }) => {
  const { flatMetrics, livingMetrics, currency } = useFinance();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 🏠 FLAT EXPENSES CARD */}
      <div className="rounded-3xl bg-slate-900/90 border border-sky-500/20 p-5 relative overflow-hidden shadow-xl shadow-sky-950/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-400">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>Flat Finances</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  Strictly Isolated
                </span>
              </h3>
              <p className="text-xs text-slate-400">Rent, Bills, Maintenance & Flat expenses</p>
            </div>
          </div>

          <button
            onClick={() => onQuickAdd('flat', 'expense')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 text-xs font-semibold border border-sky-500/20 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Flat Expense</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 py-4">
          {/* Flat Income */}
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <ArrowDownLeft className="w-3 h-3 text-emerald-400" /> Income
            </span>
            <div className="text-sm sm:text-base font-bold text-emerald-400 mt-1 truncate">
              {formatCurrency(flatMetrics.income, currency)}
            </div>
          </div>

          {/* Flat Expenses */}
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3 text-rose-400" /> Expenses
            </span>
            <div className="text-sm sm:text-base font-bold text-rose-400 mt-1 truncate">
              {formatCurrency(flatMetrics.expenses, currency)}
            </div>
          </div>

          {/* Flat Net Balance */}
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <Scale className="w-3 h-3 text-sky-400" /> Net Balance
            </span>
            <div
              className={`text-sm sm:text-base font-bold mt-1 truncate ${
                flatMetrics.net >= 0 ? 'text-sky-400' : 'text-rose-400'
              }`}
            >
              {formatCurrency(flatMetrics.net, currency)}
            </div>
          </div>
        </div>

        <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
          <span>Rent contributions, utilities & flat repairs</span>
          <span className="text-sky-400 font-medium">Flat Only</span>
        </div>
      </div>

      {/* 👤 LIVING / PERSONAL EXPENSES CARD */}
      <div className="rounded-3xl bg-slate-900/90 border border-emerald-500/20 p-5 relative overflow-hidden shadow-xl shadow-emerald-950/20">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>Living / Personal</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Strictly Isolated
                </span>
              </h3>
              <p className="text-xs text-slate-400">Food, Fuel, Personal, Mobile & Daily Living</p>
            </div>
          </div>

          <button
            onClick={() => onQuickAdd('living', 'expense')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/20 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Living Expense</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 py-4">
          {/* Living Income */}
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <ArrowDownLeft className="w-3 h-3 text-emerald-400" /> Income
            </span>
            <div className="text-sm sm:text-base font-bold text-emerald-400 mt-1 truncate">
              {formatCurrency(livingMetrics.income, currency)}
            </div>
          </div>

          {/* Living Expenses */}
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3 text-rose-400" /> Expenses
            </span>
            <div className="text-sm sm:text-base font-bold text-rose-400 mt-1 truncate">
              {formatCurrency(livingMetrics.expenses, currency)}
            </div>
          </div>

          {/* Living Net Balance */}
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <Scale className="w-3 h-3 text-emerald-400" /> Net Balance
            </span>
            <div
              className={`text-sm sm:text-base font-bold mt-1 truncate ${
                livingMetrics.net >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {formatCurrency(livingMetrics.net, currency)}
            </div>
          </div>
        </div>

        <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
          <span>Food, petrol, shopping & daily personal costs</span>
          <span className="text-emerald-400 font-medium">Living Only</span>
        </div>
      </div>
    </div>
  );
};
