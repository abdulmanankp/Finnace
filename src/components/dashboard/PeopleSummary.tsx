import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from '../../utils/format';
import { Users, HandCoins, HeartHandshake, CheckCircle2, ChevronRight } from 'lucide-react';
import { BorrowDebtRecord, LoanGivenRecord } from '../../types/finance';

interface PeopleSummaryProps {
  onRepayDebt: (debt: BorrowDebtRecord) => void;
  onReceiveLoan: (loan: LoanGivenRecord) => void;
  onOpenPeopleView: () => void;
}

export const PeopleSummary: React.FC<PeopleSummaryProps> = ({
  onRepayDebt,
  onReceiveLoan,
  onOpenPeopleView,
}) => {
  const { borrowedRecords, lentRecords, currency } = useFinance();

  const activeDebts = borrowedRecords.filter((d) => d.remaining > 0);
  const activeLoans = lentRecords.filter((l) => l.remaining > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. PEOPLE YOU OWE (DEBTS / LIABILITIES) */}
      <div className="rounded-3xl bg-slate-900/90 border border-amber-500/20 p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <HandCoins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">People You Owe</h3>
              <p className="text-xs text-slate-400">Borrowed liabilities & remaining debt</p>
            </div>
          </div>

          <button
            onClick={onOpenPeopleView}
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-0.5"
          >
            <span>Ledger</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5 pt-3">
          {activeDebts.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500 flex flex-col items-center gap-1.5">
              <CheckCircle2 className="w-6 h-6 text-emerald-500/60" />
              <span>You don't owe any money to anyone right now.</span>
            </div>
          ) : (
            activeDebts.slice(0, 3).map((debt) => (
              <div
                key={debt.id}
                className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white truncate">
                      {debt.person_name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {debt.area === 'flat' ? '🏠 Flat' : '👤 Living'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    Purpose: <span className="text-slate-300">{debt.purpose}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Original: {formatCurrency(debt.amount, currency)} • Repaid:{' '}
                    {formatCurrency(debt.repaid, currency)}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-black text-amber-400">
                    {formatCurrency(debt.remaining, currency)}
                  </div>
                  <button
                    onClick={() => onRepayDebt(debt)}
                    className="mt-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-semibold transition"
                  >
                    Repay
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. PEOPLE WHO OWE YOU (RECEIVABLES / LENT) */}
      <div className="rounded-3xl bg-slate-900/90 border border-blue-500/20 p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">People Who Owe You</h3>
              <p className="text-xs text-slate-400">Money lent / payments on behalf of others</p>
            </div>
          </div>

          <button
            onClick={onOpenPeopleView}
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-0.5"
          >
            <span>Ledger</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5 pt-3">
          {activeLoans.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-500 flex flex-col items-center gap-1.5">
              <CheckCircle2 className="w-6 h-6 text-slate-600" />
              <span>No outstanding money given to others.</span>
            </div>
          ) : (
            activeLoans.slice(0, 3).map((loan) => (
              <div
                key={loan.id}
                className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white truncate">
                      {loan.person_name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {loan.area === 'flat' ? '🏠 Flat' : '👤 Living'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    Purpose: <span className="text-slate-300">{loan.purpose}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Given: {formatCurrency(loan.amount, currency)} • Returned:{' '}
                    {formatCurrency(loan.returned, currency)}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-black text-blue-400">
                    {formatCurrency(loan.remaining, currency)}
                  </div>
                  <button
                    onClick={() => onReceiveLoan(loan)}
                    className="mt-1 px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-semibold transition"
                  >
                    Returned
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
