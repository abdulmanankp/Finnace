import React from 'react';
import { LayoutDashboard, ReceiptText, Plus, Users, Wallet, BarChart3 } from 'lucide-react';

interface BottomNavProps {
  activeView: string;
  setActiveView: (view: string) => void;
  onOpenAddModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeView,
  setActiveView,
  onOpenAddModal,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 pt-1 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {/* Dashboard */}
        <button
          onClick={() => setActiveView('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
            activeView === 'dashboard' ? 'text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Dashboard</span>
        </button>

        {/* Transactions */}
        <button
          onClick={() => setActiveView('transactions')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
            activeView === 'transactions' ? 'text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ReceiptText className="w-5 h-5" />
          <span className="text-[10px]">History</span>
        </button>

        {/* Prominent Center Add Button */}
        <button
          onClick={onOpenAddModal}
          className="-mt-5 flex flex-col items-center group focus:outline-none"
        >
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-sky-400 via-teal-400 to-emerald-400 flex items-center justify-center text-slate-950 shadow-lg shadow-sky-500/30 group-active:scale-95 transition-all">
            <Plus className="w-7 h-7 stroke-[2.8]" />
          </div>
          <span className="text-[10px] font-bold text-slate-200 mt-1">Add</span>
        </button>

        {/* People */}
        <button
          onClick={() => setActiveView('people')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
            activeView === 'people' ? 'text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px]">People</span>
        </button>

        {/* Reports / Accounts */}
        <button
          onClick={() => setActiveView('accounts')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
            activeView === 'accounts' ? 'text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wallet className="w-5 h-5" />
          <span className="text-[10px]">Accounts</span>
        </button>
      </div>
    </div>
  );
};
