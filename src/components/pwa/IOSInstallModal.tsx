import React from 'react';
import { Share, PlusSquare, X, Smartphone, CheckCircle } from 'lucide-react';

interface IOSInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IOSInstallModal: React.FC<IOSInstallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center p-2.5 shadow-lg shadow-sky-500/20">
            <Smartphone className="w-7 h-7 text-slate-950 font-bold" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Install Hisaab on iPhone</h3>
            <p className="text-xs text-slate-400">Run like a native app without App Store</p>
          </div>
        </div>

        <div className="space-y-4 my-6 text-sm">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 mt-0.5 shrink-0">
              <Share className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">Step 1: Open Safari Share Menu</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Tap the <strong>Share</strong> icon in the bottom Safari toolbar (box with upward arrow).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5 shrink-0">
              <PlusSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">Step 2: Add to Home Screen</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Scroll down in the action sheet and tap <strong>"Add to Home Screen"</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 mt-0.5 shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">Step 3: Tap 'Add'</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Tap <strong>Add</strong> in the top right corner. The Hisaab icon will appear on your Home Screen!
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 text-slate-950 font-semibold text-sm hover:brightness-110 active:scale-[0.99] transition shadow-lg shadow-emerald-500/10"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};
