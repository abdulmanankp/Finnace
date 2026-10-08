import React from 'react';
import { useFinance } from '../context/FinanceContext';
import { TransactionList } from '../components/transactions/TransactionList';
import { Download, Plus } from 'lucide-react';

interface TransactionsViewProps {
  onOpenAddModal: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({ onOpenAddModal }) => {
  const { transactions, accounts, categories, people, currency } = useFinance();

  const exportCSV = () => {
    if (transactions.length === 0) return;

    const headers = ['Date', 'Type', 'Area', 'Category/Purpose', 'Description', 'Amount', 'Currency', 'Account', 'Notes', 'Status'];
    const rows = transactions.map((t) => {
      const cat = categories.find((c) => c.id === t.category_id)?.name || t.purpose || '';
      const acc = accounts.find((a) => a.id === t.account_id)?.name || '';
      return [
        t.transaction_date,
        t.transaction_type,
        t.area || 'Transfer',
        `"${cat.replace(/"/g, '""')}"`,
        `"${t.description.replace(/"/g, '""')}"`,
        t.amount,
        currency,
        `"${acc.replace(/"/g, '""')}"`,
        `"${(t.notes || '').replace(/"/g, '""')}"`,
        t.status,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hisaab_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 pb-20 md:pb-8">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Transaction Ledger</h2>
          <p className="text-xs text-slate-400">Complete audit trail of all cash and bank movements</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-400 to-emerald-400 text-slate-950 font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      <TransactionList showFilters={true} title="All Recorded Transactions" />
    </div>
  );
};
