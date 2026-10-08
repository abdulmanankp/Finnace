import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../context/AuthContext';
import { FinancialArea } from '../types/finance';
import { SupabaseConfigModal } from '../components/modals/SupabaseConfigModal';
import { PWAInstallButton } from '../components/pwa/PWAInstallButton';
import {
  Sliders,
  Database,
  Tag,
  Plus,
  Trash2,
  RotateCcw,
  AlertTriangle,
  Smartphone,
  Shield,
  Coins,
  CheckCircle,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    categories,
    addCategory,
    deleteCategory,
    currency,
    setCurrency,
    resetToDemoData,
    clearAllData,
  } = useFinance();

  const { user, isSupabaseConnected } = useAuth();

  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState<FinancialArea>('flat');
  const [newCatName, setNewCatName] = useState('');
  const [resetNotice, setResetNotice] = useState<string | null>(null);

  const filteredCategories = categories.filter((c) => c.area === selectedArea);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    await addCategory(newCatName.trim(), selectedArea);
    setNewCatName('');
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset all transactions and accounts to default sample records?')) {
      resetToDemoData();
      setResetNotice('Demo records successfully restored!');
      setTimeout(() => setResetNotice(null), 3000);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear ALL transactions and contacts? This cannot be undone.')) {
      clearAllData();
      setResetNotice('All financial records cleared!');
      setTimeout(() => setResetNotice(null), 3000);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">App Settings & Customization</h2>
        <p className="text-xs text-slate-400">
          Manage categories, currency preferences, database connection, and data safety
        </p>
      </div>

      {resetNotice && (
        <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{resetNotice}</span>
        </div>
      )}

      {/* 1. USER & SECURITY CARD */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Authentication & Data Ownership</h3>
              <p className="text-xs text-slate-400">Every record is linked to your user_id</p>
            </div>
          </div>

          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {isSupabaseConnected ? 'Supabase Live' : 'Local Storage Mode'}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <p className="text-slate-200 font-semibold">{user?.full_name}</p>
            <p className="text-slate-400 font-mono text-[11px]">{user?.email}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">User ID: {user?.id}</p>
          </div>

          <button
            onClick={() => setShowConfigModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 font-semibold transition self-start sm:self-auto"
          >
            <Database className="w-4 h-4" />
            <span>Configure Supabase & View SQL Schema</span>
          </button>
        </div>
      </div>

      {/* 2. PWA & IPHONE INSTALL CARD */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">iPhone & Mobile Installation (PWA)</h3>
              <p className="text-xs text-slate-400">Install to your home screen for instant fullscreen access</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-slate-300">
            Hisaab operates offline and can be added directly to your iOS or Android home screen with no app store required.
          </p>
          <PWAInstallButton variant="settings" />
        </div>
      </div>

      {/* 3. CURRENCY SYMBOL */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Currency Preference</h3>
              <p className="text-xs text-slate-400">Selected symbol used across all balances and statements</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {['Rs', 'PKR', '$', '€', '£', 'AED', 'SAR'].map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition border ${
                currency === c
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* 4. CUSTOM CATEGORIES (FLAT VS LIVING) */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Category Management</h3>
              <p className="text-xs text-slate-400">Configure separate categories for Flat and Living</p>
            </div>
          </div>

          {/* Area Toggle */}
          <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setSelectedArea('flat')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedArea === 'flat' ? 'bg-sky-500/20 text-sky-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              🏠 Flat
            </button>
            <button
              onClick={() => setSelectedArea('living')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                selectedArea === 'living' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              👤 Living
            </button>
          </div>
        </div>

        {/* Add New Category form */}
        <form onSubmit={handleAddCategory} className="flex gap-2">
          <input
            type="text"
            required
            placeholder={`New ${selectedArea === 'flat' ? 'Flat' : 'Living'} category name...`}
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-sky-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-sky-400 transition flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </form>

        {/* Category tags grid */}
        <div className="flex flex-wrap gap-2 pt-2">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 group"
            >
              <span>{cat.name}</span>
              {!cat.is_system && (
                <button
                  onClick={() => deleteCategory(cat.id)}
                  className="text-slate-500 hover:text-rose-400 transition"
                  title="Remove category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 5. DATA RESET & DEMO CONTROLS */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-slate-400" />
          <span>Demo Data & Storage Actions</span>
        </h3>

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            onClick={handleResetDemo}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
            <span>Restore Realistic Sample Data</span>
          </button>

          <button
            onClick={handleClearAll}
            className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/40 border border-rose-800/60 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Clear All User Records</span>
          </button>
        </div>
      </div>

      <SupabaseConfigModal isOpen={showConfigModal} onClose={() => setShowConfigModal(false)} />
    </div>
  );
};
