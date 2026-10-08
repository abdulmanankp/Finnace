import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate } from '../utils/format';
import { TransferModal } from '../components/modals/TransferModal';
import { Plus, ArrowRightLeft, X } from 'lucide-react';

export const AccountsView: React.FC = () => {
  const {
    accounts,
    accountBalances,
    transactions,
    currency,
    addAccount,
  } = useFinance();

  const [selectedAccId, setSelectedAccId] = useState<string>(accounts[0]?.id || '');
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  const [newAccOpening, setNewAccOpening] = useState('');

  const selectedAccount = accounts.find((a) => a.id === selectedAccId) || accounts[0];

  const accountTransactions = transactions.filter(
    (t) => t.account_id === selectedAccount?.id || t.to_account_id === selectedAccount?.id
  );

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName.trim()) return;
    const opening = parseFloat(newAccOpening) || 0;
    const a = await addAccount(newAccName.trim(), opening);
    setSelectedAccId(a.id);
    setNewAccName('');
    setNewAccOpening('');
    setShowAddAccount(false);
  };

  return (
    <div className="space-y-4 pb-24 md:pb-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-white">Accounts</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTransfer(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 font-bold text-xs border border-purple-500/30"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" /> Transfer
          </button>
          <button
            onClick={() => setShowAddAccount(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs"
          >
            <Plus className="w-3.5 h-3.5" /> New
          </button>
        </div>
      </div>

      {/* Add Modal */}
      {showAddAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-xs rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-2xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-white">Add Account</span>
              <button onClick={() => setShowAddAccount(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleAddAccount} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Account Name (e.g. Meezan)..."
                value={newAccName}
                onChange={(e) => setNewAccName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
              <input
                type="number"
                placeholder="Opening Balance (Rs)..."
                value={newAccOpening}
                onChange={(e) => setNewAccOpening(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-2 bg-sky-500 text-slate-950 rounded-xl font-bold"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Account Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {accounts.map((acc) => {
          const bal = accountBalances[acc.id] ?? acc.opening_balance;
          const isSel = acc.id === selectedAccount?.id;

          return (
            <div
              key={acc.id}
              onClick={() => setSelectedAccId(acc.id)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition ${
                isSel
                  ? 'bg-sky-500/10 border-sky-400 ring-1 ring-sky-400'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <span className="text-xs text-slate-400 font-semibold block truncate">
                {acc.name}
              </span>
              <span className="text-lg font-black text-white mt-1 block truncate">
                {formatCurrency(bal, currency)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Account History */}
      {selectedAccount && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-sm text-white">
              {selectedAccount.name} Log
            </span>
            <span className="text-xs font-bold text-sky-400">
              Bal: {formatCurrency(accountBalances[selectedAccount.id] ?? 0, currency)}
            </span>
          </div>

          {accountTransactions.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No transactions.</p>
          ) : (
            <div className="divide-y divide-slate-800/60">
              {accountTransactions.map((tx) => {
                const isIncoming =
                  tx.transaction_type === 'income' ||
                  tx.transaction_type === 'borrow' ||
                  tx.transaction_type === 'repayment_received' ||
                  (tx.transaction_type === 'transfer' && tx.to_account_id === selectedAccount.id);

                return (
                  <div key={tx.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-white">{tx.description}</p>
                      <p className="text-[10px] text-slate-400">{formatDate(tx.transaction_date)}</p>
                    </div>
                    <span
                      className={`font-black ${
                        isIncoming ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isIncoming ? '+' : '-'} {formatCurrency(tx.amount, currency)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <TransferModal
        isOpen={showTransfer}
        onClose={() => setShowTransfer(false)}
        defaultFromAccount={selectedAccount?.id}
      />
    </div>
  );
};
