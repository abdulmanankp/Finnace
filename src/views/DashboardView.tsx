import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/format';
import { TransferModal } from '../components/modals/TransferModal';
import { RepaymentModal } from '../components/modals/RepaymentModal';
import { AddTransactionModal } from '../components/modals/AddTransactionModal';
import { TransactionList } from '../components/transactions/TransactionList';
import {
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  HandCoins,
  HeartHandshake,
  ArrowRightLeft,
  ChevronRight,
  Home,
  User,
} from 'lucide-react';
import { BorrowDebtRecord, LoanGivenRecord } from '../types/finance';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  onOpenAddModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const {
    totalAvailableMoney,
    netOwnMoney,
    totalMoneyOwed,
    totalMoneyReceivable,
    flatMetrics,
    livingMetrics,
    accountBalances,
    accounts,
    borrowedRecords,
    lentRecords,
    currency,
  } = useFinance();

  const [modalType, setModalType] = useState<'expense' | 'income' | 'borrow' | 'lend' | null>(null);
  const [showTransfer, setShowTransfer] = useState(false);
  const [selectedDebt, setSelectedDebt] = useState<BorrowDebtRecord | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<LoanGivenRecord | null>(null);

  const activeDebts = borrowedRecords.filter((d) => d.remaining > 0);
  const activeLoans = lentRecords.filter((l) => l.remaining > 0);

  return (
    <div className="space-y-5 pb-24 md:pb-10 max-w-4xl mx-auto">
      {/* 1. HERO BALANCE CARD (Minimal, Huge, Apple-like) */}
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-7 shadow-2xl text-center relative overflow-hidden">
        <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block mb-1">
          Total Available
        </span>
        <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          {formatCurrency(totalAvailableMoney, currency)}
        </div>

        {/* Liabilities quick strip */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs font-semibold">
          <div className="text-slate-400">
            Net Own:{' '}
            <span className="text-emerald-400 font-bold">
              {formatCurrency(netOwnMoney, currency)}
            </span>
          </div>
          {totalMoneyOwed > 0 && (
            <div className="text-slate-400">
              Owe:{' '}
              <span className="text-amber-400 font-bold">
                {formatCurrency(totalMoneyOwed, currency)}
              </span>
            </div>
          )}
          {totalMoneyReceivable > 0 && (
            <div className="text-slate-400">
              Receivable:{' '}
              <span className="text-blue-400 font-bold">
                {formatCurrency(totalMoneyReceivable, currency)}
              </span>
            </div>
          )}
        </div>

        {/* 2. FOUR BIG ACTION BUTTONS */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3 mt-6">
          {/* Expense */}
          <button
            onClick={() => setModalType('expense')}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 transition active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-rose-400" />
            </div>
            <span className="text-xs font-bold text-slate-200">Expense</span>
          </button>

          {/* Income */}
          <button
            onClick={() => setModalType('income')}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 transition active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-xs font-bold text-slate-200">Income</span>
          </button>

          {/* Borrow */}
          <button
            onClick={() => setModalType('borrow')}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 transition active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <HandCoins className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-200">Borrow</span>
          </button>

          {/* Give */}
          <button
            onClick={() => setModalType('lend')}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 transition active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-xs font-bold text-slate-200">Lend</span>
          </button>
        </div>
      </div>

      {/* 3. FLAT VS LIVING (STRICTLY SEPARATE - MINIMAL) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* FLAT */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-sky-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏠</span>
              <span className="font-bold text-base text-white">Flat</span>
            </div>
            <span className="text-xs font-bold text-sky-400">
              Net: {formatCurrency(flatMetrics.net, currency)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Expenses</span>
              <span className="font-extrabold text-rose-400 text-sm mt-0.5 block">
                {formatCurrency(flatMetrics.expenses, currency)}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Income</span>
              <span className="font-extrabold text-emerald-400 text-sm mt-0.5 block">
                {formatCurrency(flatMetrics.income, currency)}
              </span>
            </div>
          </div>
        </div>

        {/* LIVING */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-emerald-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">👤</span>
              <span className="font-bold text-base text-white">Living</span>
            </div>
            <span className="text-xs font-bold text-emerald-400">
              Net: {formatCurrency(livingMetrics.net, currency)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Expenses</span>
              <span className="font-extrabold text-rose-400 text-sm mt-0.5 block">
                {formatCurrency(livingMetrics.expenses, currency)}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Income</span>
              <span className="font-extrabold text-emerald-400 text-sm mt-0.5 block">
                {formatCurrency(livingMetrics.income, currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. ACCOUNTS (Clean Horizontal Pills with Transfer) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Accounts</span>
          <button
            onClick={() => setShowTransfer(true)}
            className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" /> Transfer
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {accounts.map((acc) => {
            const bal = accountBalances[acc.id] ?? acc.opening_balance;
            return (
              <div
                key={acc.id}
                onClick={() => onNavigate('accounts')}
                className="shrink-0 p-3 rounded-2xl bg-slate-950 border border-slate-800/80 min-w-[120px] cursor-pointer hover:border-slate-700 transition"
              >
                <span className="text-[11px] text-slate-400 font-medium block truncate">
                  {acc.name}
                </span>
                <span className="text-sm font-extrabold text-white mt-1 block">
                  {formatCurrency(bal, currency)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. QUICK DEBTS / LOANS STRIP */}
      {(activeDebts.length > 0 || activeLoans.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Debts */}
          {activeDebts.length > 0 && (
            <div className="p-4 rounded-3xl bg-slate-900 border border-amber-500/20 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-amber-400">You Owe:</span>
                <button
                  onClick={() => onNavigate('people')}
                  className="text-slate-400 hover:text-white"
                >
                  All
                </button>
              </div>
              <div className="space-y-1.5">
                {activeDebts.slice(0, 2).map((d) => (
                  <div
                    key={d.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 text-xs"
                  >
                    <div>
                      <span className="font-bold text-white">{d.person_name}</span>
                      <span className="text-[10px] text-slate-400 ml-1.5">({d.purpose})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-400">
                        {formatCurrency(d.remaining, currency)}
                      </span>
                      <button
                        onClick={() => setSelectedDebt(d)}
                        className="px-2 py-0.5 bg-amber-500 text-slate-950 rounded-lg text-[10px] font-bold"
                      >
                        Pay
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loans */}
          {activeLoans.length > 0 && (
            <div className="p-4 rounded-3xl bg-slate-900 border border-blue-500/20 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-blue-400">Owes You:</span>
                <button
                  onClick={() => onNavigate('people')}
                  className="text-slate-400 hover:text-white"
                >
                  All
                </button>
              </div>
              <div className="space-y-1.5">
                {activeLoans.slice(0, 2).map((l) => (
                  <div
                    key={l.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 text-xs"
                  >
                    <div>
                      <span className="font-bold text-white">{l.person_name}</span>
                      <span className="text-[10px] text-slate-400 ml-1.5">({l.purpose})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-400">
                        {formatCurrency(l.remaining, currency)}
                      </span>
                      <button
                        onClick={() => setSelectedLoan(l)}
                        className="px-2 py-0.5 bg-blue-500 text-white rounded-lg text-[10px] font-bold"
                      >
                        Return
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. RECENT TRANSACTIONS */}
      <TransactionList limit={6} title="Recent Activity" />

      {/* MODALS */}
      {modalType && (
        <AddTransactionModal
          isOpen={!!modalType}
          onClose={() => setModalType(null)}
          defaultType={modalType}
        />
      )}

      <TransferModal isOpen={showTransfer} onClose={() => setShowTransfer(false)} />

      <RepaymentModal
        isOpen={!!selectedDebt || !!selectedLoan}
        onClose={() => {
          setSelectedDebt(null);
          setSelectedLoan(null);
        }}
        debt={selectedDebt}
        loan={selectedLoan}
      />
    </div>
  );
};
