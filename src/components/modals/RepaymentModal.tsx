import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { X, CheckCircle2, Wallet, Calendar } from 'lucide-react';
import { BorrowDebtRecord, LoanGivenRecord } from '../../types/finance';

interface RepaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  debt?: BorrowDebtRecord | null;
  loan?: LoanGivenRecord | null;
}

export const RepaymentModal: React.FC<RepaymentModalProps> = ({
  isOpen,
  onClose,
  debt,
  loan,
}) => {
  const { accounts, currency, repayDebt, receiveLendRepayment } = useFinance();

  const isDebtRepayment = !!debt;
  const target = debt || loan;

  const [amount, setAmount] = useState<string>(target ? String(target.remaining) : '');
  const [accountId, setAccountId] = useState<string>(accounts[0]?.id || 'acc_cash');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');

  if (!isOpen || !target) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    if (isDebtRepayment && debt) {
      await repayDebt(debt.id, numAmount, accountId, date, notes);
    } else if (loan) {
      await receiveLendRepayment(loan.id, numAmount, accountId, date, notes);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-white">
              {isDebtRepayment ? 'Repay Debt to ' + debt.person_name : 'Record Return from ' + loan?.person_name}
            </h3>
            <p className="text-xs text-slate-400">
              Purpose: {target.purpose} ({target.area === 'flat' ? '🏠 Flat' : '👤 Living'})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Balance Card */}
        <div className="my-4 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
              Remaining Balance
            </span>
            <span className="text-xl font-bold text-amber-400">
              {currency} {target.remaining.toLocaleString()}
            </span>
          </div>
          <div className="text-right text-xs text-slate-400">
            <div>Original: {currency} {target.amount.toLocaleString()}</div>
            {isDebtRepayment ? (
              <div>Repaid: {currency} {debt?.repaid.toLocaleString()}</div>
            ) : (
              <div>Returned: {currency} {loan?.returned.toLocaleString()}</div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Repayment Amount ({currency})
            </label>
            <input
              type="number"
              step="any"
              required
              max={target.remaining}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-lg font-bold text-white focus:outline-none focus:border-sky-500"
            />
            {parseFloat(amount) === target.remaining && (
              <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Will settle this record in full!
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              {isDebtRepayment ? 'Paid From Account' : 'Received Into Account'}
            </label>
            <div className="relative">
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500 appearance-none"
              >
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
              <Wallet className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
                <Calendar className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Notes</label>
              <input
                type="text"
                placeholder="Optional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-sky-400 to-emerald-400 hover:brightness-110 active:scale-[0.99] transition shadow-lg shadow-sky-500/20"
          >
            Confirm Repayment
          </button>
        </form>
      </div>
    </div>
  );
};
