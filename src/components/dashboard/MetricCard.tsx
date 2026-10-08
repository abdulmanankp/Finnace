import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  amount: string;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  theme?: 'sky' | 'emerald' | 'rose' | 'amber' | 'blue' | 'purple' | 'slate';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  amount,
  subtitle,
  icon: Icon,
  badge,
  theme = 'slate',
  onClick,
}) => {
  const themeClasses = {
    sky: 'border-sky-500/20 bg-sky-950/20 text-sky-400 group-hover:border-sky-500/40',
    emerald: 'border-emerald-500/20 bg-emerald-950/20 text-emerald-400 group-hover:border-emerald-500/40',
    rose: 'border-rose-500/20 bg-rose-950/20 text-rose-400 group-hover:border-rose-500/40',
    amber: 'border-amber-500/20 bg-amber-950/20 text-amber-400 group-hover:border-amber-500/40',
    blue: 'border-blue-500/20 bg-blue-950/20 text-blue-400 group-hover:border-blue-500/40',
    purple: 'border-purple-500/20 bg-purple-950/20 text-purple-400 group-hover:border-purple-500/40',
    slate: 'border-slate-800 bg-slate-900/60 text-slate-400 group-hover:border-slate-700',
  }[theme];

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-4.5 border bg-slate-900/80 backdrop-blur-sm transition relative overflow-hidden group ${
        onClick ? 'cursor-pointer hover:bg-slate-900' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-xs font-semibold text-slate-400 tracking-tight block">
            {title}
          </span>
          <div className="text-2xl font-black text-white mt-1.5 tracking-tight">
            {amount}
          </div>
        </div>
        <div className={`p-2.5 rounded-xl border ${themeClasses} transition`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        {subtitle && <span>{subtitle}</span>}
        {badge && (
          <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};
