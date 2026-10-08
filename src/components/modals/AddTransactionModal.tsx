import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { FinancialArea, TransactionType } from '../../types/finance';
import {
  X,
  Plus,
  Check,
} from 'lucide-react';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: TransactionType;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'expense',
}) => {
  const {
    accounts,
    categories,
    people,
    currency,
    addTransaction,
    addPerson,
  } = useFinance();

  const [activeTab, setActiveTab] = useState<TransactionType>(defaultType);
  const [area, setArea] = useState<FinancialArea>('flat');
  const [amount, setAmount] = useState<string>('');
  const [selectedCatId, setSelectedCatId] = useState<string>('');
  const [accountId, setAccountId] = useState<string>(accounts[0]?.id || 'acc_cash');
  const [toAccountId, setToAccountId] = useState<string>(accounts[1]?.id || 'acc_ubl');
  const [personId, setPersonId] = useState<string>(people[0]?.id || '');
  const [title, setTitle] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // Quick add person
  const [newPersonInput, setNewPersonInput] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');

  if (!isOpen) return null;

  const currentCategories = categories.filter((c) => c.area === area);

  // Emojis for categories
  const getCatEmoji = (name: string) => {
    const l = name.toLowerCase();
    if (l.includes('rent')) return '🏠';
    if (l.includes('elec') || l.includes('bijli')) return '⚡';
    if (l.includes('gas')) return '🔥';
    if (l.includes('net') || l.includes('internet')) return '🌐';
    if (l.includes('water') || l.includes('pani')) return '💧';
    if (l.includes('food') || l.includes('khana') || l.includes('biryani')) return '🍔';
    if (l.includes('petrol') || l.includes('fuel') || l.includes('transport')) return '⛽';
    if (l.includes('mobile') || l.includes('phone')) return '📱';
    if (l.includes('shop')) return '🛍️';
    if (l.includes('med') || l.includes('doctor')) return '💊';
    if (l.includes('repair') || l.includes('maint')) return '🔧';
    return '🏷️';
  };

  const handleQuickAddPerson = async () => {
    if (!newPersonName.trim()) return;
    const p = await addPerson(newPersonName.trim());
    setPersonId(p.id);
    setNewPersonName('');
    setNewPersonInput(false);
  };

  const addAmountPreset = (val: number) => {
    const curr = parseFloat(amount) || 0;
    setAmount(String(curr + val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return;

    if (activeTab === 'transfer') {
      if (accountId === toAccountId) return;
      const fromName = accounts.find((a) => a.id === accountId)?.name || 'Account';
      const toName = accounts.find((a) => a.id === toAccountId)?.name || 'Account';
      await addTransaction({
        transaction_type: 'transfer',
        area: null,
        amount: num,
        account_id: accountId,
        to_account_id: toAccountId,
        description: `${fromName} ➔ ${toName}`,
        transaction_date: date,
        status: 'completed',
      });
    } else if (activeTab === 'borrow') {
      const p = people.find((item) => item.id === personId);
      const pName = p ? p.name : 'Someone';
      await addTransaction({
        transaction_type: 'borrow',
        area,
        amount: num,
        account_id: accountId,
        person_id: personId || undefined,
        purpose: title || (area === 'flat' ? 'Flat Rent/Bill' : 'Living'),
        description: `Borrowed from ${pName}`,
        transaction_date: date,
        status: 'pending',
      });
    } else if (activeTab === 'lend') {
      const p = people.find((item) => item.id === personId);
      const pName = p ? p.name : 'Friend';
      await addTransaction({
        transaction_type: 'lend',
        area,
        amount: num,
        account_id: accountId,
        person_id: personId || undefined,
        purpose: title || 'Loan / Support',
        description: `Given to ${pName}`,
        transaction_date: date,
        status: 'pending',
      });
    } else {
      const c = categories.find((cat) => cat.id === selectedCatId);
      const finalTitle = title.trim() || c?.name || (activeTab === 'income' ? 'Income' : 'Expense');
      await addTransaction({
        transaction_type: activeTab,
        area,
        amount: num,
        category_id: selectedCatId || undefined,
        account_id: accountId,
        purpose: c?.name || finalTitle,
        description: finalTitle,
        transaction_date: date,
        status: 'completed',
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 pt-4 pb-2 flex items-center justify-between border-b border-slate-800">
          <span className="font-bold text-base text-white">Add Entry</span>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 1. TYPE SELECTOR (Simple Pills) */}
          <div className="flex gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('expense')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition text-center whitespace-nowrap ${
                activeTab === 'expense'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('income')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition text-center whitespace-nowrap ${
                activeTab === 'income'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('borrow')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition text-center whitespace-nowrap ${
                activeTab === 'borrow'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Borrow
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('lend')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition text-center whitespace-nowrap ${
                activeTab === 'lend'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Give
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('transfer')}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition text-center whitespace-nowrap ${
                activeTab === 'transfer'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Transfer
            </button>
          </div>

          {/* 2. FLAT vs LIVING (Big 1-Tap Toggle) */}
          {activeTab !== 'transfer' && (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setArea('flat');
                  setSelectedCatId('');
                }}
                className={`py-3 px-3 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2 transition ${
                  area === 'flat'
                    ? 'bg-sky-500/20 border-sky-400 text-sky-300 ring-1 ring-sky-400'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}
              >
                <span className="text-xl">🏠</span>
                <span>Flat</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setArea('living');
                  setSelectedCatId('');
                }}
                className={`py-3 px-3 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2 transition ${
                  area === 'living'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-1 ring-emerald-400'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}
              >
                <span className="text-xl">👤</span>
                <span>Living</span>
              </button>
            </div>
          )}

          {/* 3. BIG AMOUNT INPUT + PRESETS */}
          <div className="space-y-2">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400">
                {currency}
              </span>
              <input
                type="number"
                step="any"
                required
                autoFocus
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-16 pr-4 py-3.5 text-3xl font-black text-white focus:outline-none focus:border-sky-400 placeholder:text-slate-700"
              />
            </div>

            {/* Quick buttons: +100, +500, +1000, +5000 */}
            <div className="flex gap-2">
              {[100, 500, 1000, 5000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => addAmountPreset(val)}
                  className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition active:scale-95"
                >
                  +{val}
                </button>
              ))}
            </div>
          </div>

          {/* 4. ONE-TAP CATEGORY PILLS (For Expense/Income) */}
          {(activeTab === 'expense' || activeTab === 'income') && (
            <div className="space-y-1.5">
              <span className="text-xs text-slate-400 font-semibold block">Category:</span>
              <div className="grid grid-cols-3 gap-2">
                {currentCategories.map((c) => {
                  const isSel = selectedCatId === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setSelectedCatId(c.id);
                        if (!title) setTitle(c.name);
                      }}
                      className={`py-2 px-2 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition text-center truncate ${
                        isSel
                          ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold'
                          : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{getCatEmoji(c.name)}</span>
                      <span className="truncate">{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. PERSON SELECTION (For Borrow/Lend) */}
          {(activeTab === 'borrow' || activeTab === 'lend') && (
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold">
                  {activeTab === 'borrow' ? 'From:' : 'To:'}
                </span>
                <button
                  type="button"
                  onClick={() => setNewPersonInput(!newPersonInput)}
                  className="text-sky-400 font-semibold flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" /> New
                </button>
              </div>

              {newPersonInput && (
                <div className="flex gap-2 p-1.5 bg-slate-950 rounded-xl border border-slate-800">
                  <input
                    type="text"
                    placeholder="Person name..."
                    value={newPersonName}
                    onChange={(e) => setNewPersonName(e.target.value)}
                    className="flex-1 bg-transparent px-2 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleQuickAddPerson}
                    className="px-3 py-1 bg-sky-500 text-slate-950 rounded-lg text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {people.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPersonId(p.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                      personId === p.id
                        ? 'bg-amber-400 text-slate-950 border-amber-300'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 6. ONE-TAP ACCOUNT PILLS */}
          {activeTab === 'transfer' ? (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 mb-1 block">From Account:</span>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <span className="text-slate-400 mb-1 block">To Account:</span>
                <select
                  value={toAccountId}
                  onChange={(e) => setToAccountId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <span className="text-xs text-slate-400 font-semibold block">Account:</span>
              <div className="flex flex-wrap gap-2">
                {accounts.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAccountId(a.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                      accountId === a.id
                        ? 'bg-emerald-400 text-slate-950 border-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {a.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 7. OPTIONAL TITLE & DATE */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <input
              type="text"
              placeholder="Title (Optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
            />
          </div>

          {/* 8. BIG SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl font-black text-sm text-slate-950 bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 hover:brightness-110 active:scale-[0.99] transition shadow-lg shadow-sky-500/20"
          >
            Save {amount ? `${currency} ${amount}` : ''}
          </button>
        </form>
      </div>
    </div>
  );
};
