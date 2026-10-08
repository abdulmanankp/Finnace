import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { useAuth } from '../../context/AuthContext';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import {
  Plus,
  Database,
  LogOut,
  Sliders,
} from 'lucide-react';
import { SupabaseConfigModal } from '../modals/SupabaseConfigModal';

interface NavbarProps {
  onOpenAddModal: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddModal,
  activeView,
  setActiveView,
}) => {
  const { user, signOut, isSupabaseConnected } = useAuth();
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-2.5 transition">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('dashboard')}
              className="flex items-center gap-2 text-left focus:outline-none"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 to-emerald-400 flex items-center justify-center font-black text-slate-950 text-sm shadow-md shadow-sky-500/20">
                H
              </div>
              <span className="font-black text-base tracking-tight text-white">
                Hisaab
              </span>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 ml-4 text-xs font-bold">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  activeView === 'dashboard'
                    ? 'bg-slate-800 text-sky-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveView('transactions')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  activeView === 'transactions'
                    ? 'bg-slate-800 text-sky-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Ledger
              </button>
              <button
                onClick={() => setActiveView('people')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  activeView === 'people'
                    ? 'bg-slate-800 text-sky-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                People
              </button>
              <button
                onClick={() => setActiveView('accounts')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  activeView === 'accounts'
                    ? 'bg-slate-800 text-sky-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Accounts
              </button>
              <button
                onClick={() => setActiveView('reports')}
                className={`px-3 py-1.5 rounded-xl transition ${
                  activeView === 'reports'
                    ? 'bg-slate-800 text-sky-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Reports
              </button>
            </nav>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <PWAInstallButton variant="header" />

            {/* Quick Add */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1 bg-gradient-to-r from-sky-400 to-emerald-400 text-slate-950 font-black px-3 py-1.5 rounded-xl text-xs shadow-md hover:brightness-110 active:scale-95 transition"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add</span>
            </button>

            {/* Avatar & Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200 hover:border-slate-500 transition"
              >
                {user?.full_name?.charAt(0).toUpperCase() || 'A'}
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl py-1.5 z-50 text-xs text-slate-300">
                  <div className="px-3 py-2 border-b border-slate-800 font-medium">
                    <p className="text-white font-bold truncate">{user?.full_name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveView('settings');
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2 text-slate-200"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Settings</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowConfigModal(true);
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center gap-2 text-slate-200"
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Supabase SQL</span>
                  </button>

                  <div className="border-t border-slate-800 mt-1 pt-1">
                    <button
                      onClick={() => {
                        signOut();
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-rose-400 hover:bg-rose-950/30 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <SupabaseConfigModal isOpen={showConfigModal} onClose={() => setShowConfigModal(false)} />
    </>
  );
};
