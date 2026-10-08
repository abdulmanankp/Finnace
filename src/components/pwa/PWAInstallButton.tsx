import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone } from 'lucide-react';
import { IOSInstallModal } from './IOSInstallModal';

interface PWAInstallButtonProps {
  variant?: 'header' | 'banner' | 'settings';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  // If already installed as standalone PWA
  if (isInstalled) {
    if (variant === 'settings') {
      return (
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Installed & Running as PWA
        </div>
      );
    }
    return null;
  }

  // Chromium / Android prompt flow
  if (isInstallable) {
    if (variant === 'settings') {
      return (
        <button
          onClick={install}
          className="flex items-center gap-2 rounded-xl bg-sky-500/10 border border-sky-500/30 px-4 py-2 text-sm font-medium text-sky-300 hover:bg-sky-500/20 transition"
        >
          <Download className="w-4 h-4" />
          Install App to Phone / PC
        </button>
      );
    }

    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-950 shadow-sm hover:brightness-110 active:scale-95 transition"
      >
        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow (or general mobile browser fallback)
  return (
    <>
      <button
        onClick={() => setShowIOSModal(true)}
        className={
          variant === 'settings'
            ? 'flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 transition'
            : 'flex items-center gap-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700 transition'
        }
      >
        <Smartphone className="w-3.5 h-3.5 text-sky-400" />
        <span>{isIOS ? 'Install on iPhone' : 'Install PWA'}</span>
      </button>

      <IOSInstallModal isOpen={showIOSModal} onClose={() => setShowIOSModal(false)} />
    </>
  );
};
