import React, { useState } from 'react';
import { X, Database, CheckCircle, Copy, AlertCircle, RefreshCw } from 'lucide-react';
import {
  getStoredSupabaseConfig,
  saveStoredSupabaseConfig,
  SUPABASE_SQL_SCHEMA,
  getSupabaseClient,
} from '../../lib/supabase';
import { useFinance } from '../../context/FinanceContext';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({ isOpen, onClose }) => {
  const currentConfig = getStoredSupabaseConfig();
  const [url, setUrl] = useState(currentConfig?.url || '');
  const [anonKey, setAnonKey] = useState(currentConfig?.anonKey || '');
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ success: boolean; text: string } | null>(null);

  const { syncWithSupabase } = useFinance();

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) {
      saveStoredSupabaseConfig(null);
      setStatusMsg({ success: true, text: 'Supabase configuration cleared. Running in local mode.' });
      return;
    }

    setTesting(true);
    setStatusMsg(null);

    saveStoredSupabaseConfig({
      url: url.trim(),
      anonKey: anonKey.trim(),
    });

    const client = getSupabaseClient();
    if (!client) {
      setTesting(false);
      setStatusMsg({ success: false, text: 'Invalid Supabase client URL or Key.' });
      return;
    }

    try {
      const res = await syncWithSupabase();
      if (res.success) {
        setStatusMsg({ success: true, text: 'Connected to Supabase successfully!' });
      } else {
        setStatusMsg({
          success: true,
          text: 'Saved credentials! Make sure to run the SQL schema in Supabase SQL Editor if tables are missing.',
        });
      }
    } catch (err: any) {
      setStatusMsg({ success: false, text: err.message || 'Connection error' });
    } finally {
      setTesting(false);
    }
  };

  const copySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl max-h-[90vh] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Supabase Authentication & Database</h3>
              <p className="text-xs text-slate-400">PostgreSQL with Row Level Security (RLS)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm">
          {statusMsg && (
            <div
              className={`p-3 rounded-xl border flex items-center gap-2.5 text-xs ${
                statusMsg.success
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-800 text-rose-300'
              }`}
            >
              {statusMsg.success ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-3.5 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Project URL (VITE_SUPABASE_URL)
              </label>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Anon Public Key (VITE_SUPABASE_ANON_KEY)
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={testing}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition disabled:opacity-50"
              >
                {testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
                <span>Save & Connect</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUrl('');
                  setAnonKey('');
                  saveStoredSupabaseConfig(null);
                  setStatusMsg({ success: true, text: 'Cleared! Running in local storage mode.' });
                }}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl transition"
              >
                Clear / Run Local
              </button>
            </div>
          </form>

          {/* SQL DDL Schema */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-200">PostgreSQL Relational Schema & RLS</h4>
                <p className="text-[11px] text-slate-400">
                  Execute this SQL in Supabase SQL Editor to provision tables & security policies.
                </p>
              </div>
              <button
                type="button"
                onClick={copySql}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-medium transition"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied SQL!' : 'Copy SQL'}</span>
              </button>
            </div>

            <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] font-mono text-slate-300 max-h-56 overflow-y-auto whitespace-pre">
              {SUPABASE_SQL_SCHEMA}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
