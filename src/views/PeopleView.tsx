import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate } from '../utils/format';
import { BorrowDebtRecord, LoanGivenRecord } from '../types/finance';
import { RepaymentModal } from '../components/modals/RepaymentModal';
import { Plus, X } from 'lucide-react';

export const PeopleView: React.FC = () => {
  const { people, transactions, borrowedRecords, lentRecords, currency, addPerson } = useFinance();

  const [selectedPersonId, setSelectedPersonId] = useState<string>(people[0]?.id || '');
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');

  const [selectedDebt, setSelectedDebt] = useState<BorrowDebtRecord | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<LoanGivenRecord | null>(null);

  const selectedPerson = people.find((p) => p.id === selectedPersonId) || people[0];

  const personDebts = borrowedRecords.filter((d) => d.person_id === selectedPerson?.id);
  const personLoans = lentRecords.filter((l) => l.person_id === selectedPerson?.id);
  const personHistory = transactions.filter((t) => t.person_id === selectedPerson?.id);

  const totalOwedToHim = personDebts.reduce((sum, d) => sum + d.remaining, 0);
  const totalHeOwesMe = personLoans.reduce((sum, l) => sum + l.remaining, 0);

  const handleAddPerson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPersonName.trim()) return;
    const p = await addPerson(newPersonName.trim());
    setSelectedPersonId(p.id);
    setNewPersonName('');
    setShowAddPerson(false);
  };

  return (
    <div className="space-y-4 pb-24 md:pb-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-white">People</h2>
        <button
          onClick={() => setShowAddPerson(true)}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {/* Add Modal */}
      {showAddPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-xs rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-2xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-white">New Contact</span>
              <button onClick={() => setShowAddPerson(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleAddPerson} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Name (e.g. Saad, Brow)..."
                value={newPersonName}
                onChange={(e) => setNewPersonName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
              <button
                type="submit"
                className="w-full py-2 bg-sky-500 text-slate-950 rounded-xl font-bold text-xs"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}

      {/* People Pills Row */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none py-1">
        {people.map((p) => {
          const debts = borrowedRecords.filter((d) => d.person_id === p.id && d.remaining > 0);
          const loans = lentRecords.filter((l) => l.person_id === p.id && l.remaining > 0);
          const hasBalance = debts.length > 0 || loans.length > 0;
          const isSel = p.id === selectedPerson?.id;

          return (
            <button
              key={p.id}
              onClick={() => setSelectedPersonId(p.id)}
              className={`px-4 py-2.5 rounded-2xl border text-xs font-bold shrink-0 transition flex items-center gap-2 ${
                isSel
                  ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md'
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              }`}
            >
              <span>{p.name}</span>
              {hasBalance && (
                <span
                  className={`w-2 h-2 rounded-full ${
                    debts.length > 0 ? 'bg-amber-400' : 'bg-blue-400'
                  }`}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Person Detail Card */}
      {selectedPerson && (
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-black text-white">{selectedPerson.name}</h3>
              <p className="text-xs text-slate-400">Ledger Details</p>
            </div>

            <div className="flex gap-2">
              {totalOwedToHim > 0 && (
                <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-right">
                  <span className="text-[10px] block font-semibold">You Owe</span>
                  <span className="font-black text-xs sm:text-sm">
                    {formatCurrency(totalOwedToHim, currency)}
                  </span>
                </div>
              )}
              {totalHeOwesMe > 0 && (
                <div className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 text-right">
                  <span className="text-[10px] block font-semibold">Owes You</span>
                  <span className="font-black text-xs sm:text-sm">
                    {formatCurrency(totalHeOwesMe, currency)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Active items with 1-tap Pay/Return */}
          <div className="space-y-2">
            {personDebts.map((d) => (
              <div
                key={d.id}
                className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/20 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-white block">
                    Borrowed: {formatCurrency(d.amount, currency)}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Purpose: {d.purpose} ({d.area === 'flat' ? 'Flat' : 'Living'})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-400">
                    Remaining: {formatCurrency(d.remaining, currency)}
                  </span>
                  {d.remaining > 0 ? (
                    <button
                      onClick={() => setSelectedDebt(d)}
                      className="px-2.5 py-1 bg-amber-500 text-slate-950 rounded-xl font-bold text-xs"
                    >
                      Pay
                    </button>
                  ) : (
                    <span className="text-emerald-400 text-xs font-bold">Settled ✓</span>
                  )}
                </div>
              </div>
            ))}

            {personLoans.map((l) => (
              <div
                key={l.id}
                className="p-3.5 rounded-2xl bg-slate-950 border border-blue-500/20 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-white block">
                    Given: {formatCurrency(l.amount, currency)}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Purpose: {l.purpose} ({l.area === 'flat' ? 'Flat' : 'Living'})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-400">
                    Remaining: {formatCurrency(l.remaining, currency)}
                  </span>
                  {l.remaining > 0 ? (
                    <button
                      onClick={() => setSelectedLoan(l)}
                      className="px-2.5 py-1 bg-blue-500 text-white rounded-xl font-bold text-xs"
                    >
                      Return
                    </button>
                  ) : (
                    <span className="text-emerald-400 text-xs font-bold">Settled ✓</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* History */}
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-400 block mb-2">History:</span>
            {personHistory.length === 0 ? (
              <p className="text-xs text-slate-600">No activity.</p>
            ) : (
              <div className="space-y-1.5">
                {personHistory.map((h) => (
                  <div
                    key={h.id}
                    className="p-2.5 rounded-xl bg-slate-950 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-300">{h.description}</span>
                      <span className="text-[10px] text-slate-500 ml-2">
                        {formatDate(h.transaction_date)}
                      </span>
                    </div>
                    <span className="font-bold text-white">
                      {formatCurrency(h.amount, currency)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Repayment Modal */}
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
