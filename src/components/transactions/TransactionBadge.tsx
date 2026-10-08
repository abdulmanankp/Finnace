import React from 'react';
import { TransactionType, FinancialArea, TransactionStatus } from '../../types/finance';

export const TypeBadge: React.FC<{ type: TransactionType }> = ({ type }) => {
  switch (type) {
    case 'income':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          Income
        </span>
      );
    case 'expense':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
          Expense
        </span>
      );
    case 'borrow':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          Borrowed
        </span>
      );
    case 'lend':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
          Lent
        </span>
      );
    case 'repayment_sent':
    case 'repayment_received':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30">
          Repayment
        </span>
      );
    case 'transfer':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-500/15 text-slate-400 border border-slate-500/30">
          Transfer
        </span>
      );
    default:
      return null;
  }
};

export const AreaBadge: React.FC<{ area: FinancialArea | null | undefined }> = ({ area }) => {
  if (!area) return null;
  if (area === 'flat') {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
        🏠 Flat
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      👤 Living
    </span>
  );
};

export const StatusBadge: React.FC<{ status: TransactionStatus }> = ({ status }) => {
  switch (status) {
    case 'settled':
    case 'completed':
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400">
          Settled
        </span>
      );
    case 'partially_paid':
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-400">
          Partially Paid
        </span>
      );
    case 'pending':
      return (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-rose-500/10 text-rose-400">
          Unpaid
        </span>
      );
    default:
      return null;
  }
};
