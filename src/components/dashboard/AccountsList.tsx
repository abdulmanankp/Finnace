import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/format';
import { Wallet, ArrowRightLeft, CreditCard, Banknote, Smartphone } from 'lucide-react';

interface AccountsListProps {
  onOpenTransfer: () => void;
  onOpenAccountDetail?: (accId: string) => void;
}

export const AccountsList: React.FC<AccountsListProps> = ({
  onOpenTransfer,
  onOpenAccountDetail,
}) => {
  const { accounts, accountBalances, currency } = useFinance();

  const getAccountIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('cash')) return <Banknote className="w-4 h-4 text-emerald-400" />;
    if (lower.includes('easypaisa') || lower.includes('jazzcash'))
      return <Smartphone className="w-4 h-4 text-amber-400" />;
    return <CreditCard className="w-4 h-4 text-sky-400" />;
  };

  return (
    <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-400">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Financial Accounts</h3>
            <p className="text-xs text-slate-400">
              Balances calculated automatically from transactions
            </p>
          </div>
        </div>

        <button
          onClick={onOpenTransfer}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/20 transition"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Transfer</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-4">
        {accounts.map((acc) => {
          const balance = accountBalances[acc.id] ?? acc.opening_balance;
          const isNegative = balance < 0;

          return (
            <div
              key={acc.id}
              onClick={() => onOpenAccountDetail && onOpenAccountDetail(acc.id)}
              className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-950 transition cursor-pointer flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <span className="p-1.5 rounded-lg bg-slate-800 border border-slate-700/60 group-hover:scale-110 transition">
                  {getAccountIcon(acc.name)}
                </span>
                <span className="text-[10px] text-slate-400">
                  Open: {formatCurrency(acc.opening_balance, currency)}
                </span>
              </div>

              <div className="mt-3">
                <span className="text-xs font-medium text-slate-300 block truncate">
                  {acc.name}
                </span>
                <span
                  className={`text-base font-bold tracking-tight block mt-0.5 truncate ${
                    isNegative ? 'text-rose-400' : 'text-white'
                  }`}
                >
                  {formatCurrency(balance, currency)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
