import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import { AuthView } from './views/AuthView';
import { DashboardView } from './views/DashboardView';
import { TransactionsView } from './views/TransactionsView';
import { PeopleView } from './views/PeopleView';
import { AccountsView } from './views/AccountsView';
import { ReportsView } from './views/ReportsView';
import { SettingsView } from './views/SettingsView';
import { Navbar } from './components/navigation/Navbar';
import { BottomNav } from './components/navigation/BottomNav';
import { AddTransactionModal } from './components/modals/AddTransactionModal';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';

const MainAppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 via-teal-400 to-emerald-400 p-[2px] animate-spin">
            <div className="w-full h-full bg-slate-950 rounded-[14px]" />
          </div>
          <span className="text-xs font-semibold text-slate-400 tracking-wider">
            Loading Hisaab...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthView />;
  }

  return (
    <FinanceProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
        {/* Top Navbar for desktop & mobile header */}
        <Navbar
          activeView={activeView}
          setActiveView={setActiveView}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {activeView === 'dashboard' && (
            <DashboardView
              onNavigate={setActiveView}
              onOpenAddModal={() => setIsAddModalOpen(true)}
            />
          )}

          {activeView === 'transactions' && (
            <TransactionsView onOpenAddModal={() => setIsAddModalOpen(true)} />
          )}

          {activeView === 'people' && <PeopleView />}

          {activeView === 'accounts' && <AccountsView />}

          {activeView === 'reports' && <ReportsView />}

          {activeView === 'settings' && <SettingsView />}
        </main>

        {/* Bottom Nav for mobile touch devices */}
        <BottomNav
          activeView={activeView}
          setActiveView={setActiveView}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />

        {/* Global Add Transaction Modal */}
        <AddTransactionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />

        {/* Offline PWA Indicator */}
        <OfflineIndicator />
      </div>
    </FinanceProvider>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
