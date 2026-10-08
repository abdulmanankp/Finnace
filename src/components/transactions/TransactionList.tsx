import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Transaction } from '../../types/finance';
import { formatCurrency, formatDate } from '../../utils/format';
import { Trash2, Search } from 'lucide-react';

interface TransactionListProps {
  transactions?: Transaction[];
  limit?: number;
  showFilters?: boolean;
  title?: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions: propTxs,
  limit,
  showFilters = false,
  title = 'Recent Activity',
}) => {
  const { transactions: allTxs, accounts, categories, people, currency, deleteTransaction } = useFinance();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterArea, setFilterArea] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const rawList = propTxs || allTxs;

  const filteredList = rawList.filter((tx) => {
    if (filterArea !== 'all' && tx.area !== filterArea) return false;
    if (filterType !== 'all' && tx.transaction_type !== filterType) return false;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const person = people.find((p) => p.id === tx.person_id)?.name.toLowerCase() || '';
      const cat = categories.find((c) => c.id === tx.category_id)?.name.toLowerCase() || '';
      const acc = accounts.find((a) => a.id === tx.account_id)?.name.toLowerCase() || '';
      const desc = tx.description.toLowerCase();
      const amt = String(tx.amount);

      return desc.includes(term) || cat.includes(term) || person.includes(term) || acc.includes(term) || amt.includes(term);
    }
    return true;
  });

  const displayList = limit ? filteredList.slice(0, limit) : filteredList;

  const getEmoji = (tx: Transaction) => {
    if (tx.transaction_type === 'transfer') return '🔄';
    if (tx.transaction_type === 'borrow') return '🤝';
    if (tx.transaction_type === 'lend') return '💸';
    if (tx.transaction_type === 'income') return '💰';
    if (tx.area === 'flat') return '🏠';
    return '👤';
  };

  const getAccountName = (accId: string) => {
    return accounts.find((a) => a.id === accId)?.name || 'Account';
  };

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 sm:p-5 shadow-xl space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-extrabold text-sm text-white">{title}</span>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-32 sm:w-44 bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-2.5 py-1 text-xs text-white placeholder:text-slate-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Filter Chips */}
      {showFilters && (
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none py-1 text-xs">
          {['all', 'flat', 'living'].map((a) => (
            <button
              key={a}
              onClick={() => setFilterArea(a)}
              className={`px-3 py-1 rounded-xl font-bold transition whitespace-nowrap ${
                filterArea === a
                  ? 'bg-sky-500 text-slate-950'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {a === 'all' ? 'All' : a === 'flat' ? '🏠 Flat' : '👤 Living'}
            </button>
          ))}

          {['expense', 'income', 'borrow', 'lend', 'transfer'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(filterType === t ? 'all' : t)}
              className={`px-2.5 py-1 rounded-xl font-bold transition whitespace-nowrap capitalize ${
                filterType === t
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {/* List items */}
      {displayList.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500">No records found.</div>
      ) : (
        <div className="divide-y divide-slate-800/60">
          {displayList.map((tx) => {
            const accName = getAccountName(tx.account_id);
            const isNegative = tx.transaction_type === 'expense' || tx.transaction_type === 'repayment_sent';
            const isPositive = tx.transaction_type === 'income' || tx.transaction_type === 'borrow' || tx.transaction_type === 'repayment_received';

            return (
              <div key={tx.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-base shrink-0">
                    {getEmoji(tx)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate text-xs sm:text-sm">
                      {tx.description}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {accName} • {formatDate(tx.transaction_date)}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 flex items-center gap-2">
                  <span
                    className={`font-black text-xs sm:text-sm ${
                      isPositive
                        ? 'text-emerald-400'
                        : isNegative
                        ? 'text-rose-400'
                        : tx.transaction_type === 'borrow'
                        ? 'text-amber-400'
                        : tx.transaction_type === 'lend'
                        ? 'text-blue-400'
                        : 'text-white'
                    }`}
                  >
                    {isPositive ? '+' : isNegative ? '-' : ''} {formatCurrency(tx.amount, currency)}
                  </span>

                  <button
                    onClick={() => setDeleteConfirmId(tx.id)}
                    className="p-1 text-slate-600 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-xs rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-2xl text-center space-y-3">
            <p className="text-sm font-bold text-white">Delete this entry?</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs font-bold"
              >
                No
              </button>
              <button
                onClick={async () => {
                  await deleteTransaction(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
