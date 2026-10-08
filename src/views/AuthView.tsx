import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, User, ArrowRight, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { PWAInstallButton } from '../components/pwa/PWAInstallButton';

export const AuthView: React.FC = () => {
  const { signIn, signUp, resetPassword, isSupabaseConnected } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('abdulmanankp0@gmail.com');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('Abdul Manan');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        const res = await signIn(email, password);
        if (res.error) {
          setErrorMsg(res.error);
        }
      } else if (mode === 'signup') {
        const res = await signUp(email, password, fullName);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          setSuccessMsg('Account created successfully! Logging you in...');
        }
      } else if (mode === 'forgot') {
        const res = await resetPassword(email);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          setSuccessMsg(res.message || 'Password reset instructions dispatched.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 selection:bg-emerald-500 selection:text-white">
      {/* Background radial gradient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* App Emblem & Brand */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-400 via-teal-400 to-emerald-400 p-[2px] mx-auto shadow-xl shadow-sky-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <span className="text-3xl font-black bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                H
              </span>
            </div>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Hisaab</h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Personal money tracking separating Flat & Living expenses, liabilities, and accounts
          </p>
        </div>

        {/* Auth Card */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl p-6 sm:p-7 backdrop-blur-xl space-y-5">
          {/* Mode Switcher */}
          <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl transition ${
                mode === 'signin'
                  ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl transition ${
                mode === 'signup'
                  ? 'bg-gradient-to-r from-sky-500 to-emerald-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'signup' && (
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Abdul Manan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-300">Password</label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-sky-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-white focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-sky-400 via-teal-400 to-emerald-400 hover:brightness-110 active:scale-[0.99] transition shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>
                {loading
                  ? 'Verifying...'
                  : mode === 'signin'
                  ? 'Access Dashboard'
                  : mode === 'signup'
                  ? 'Create Isolated Account'
                  : 'Send Reset Link'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {mode === 'forgot' && (
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className="text-xs text-sky-400 hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          )}

          {/* Quick Demo Credentials Pill */}
          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Row Level Security Enforced
            </span>
            <span className="text-slate-500">
              {isSupabaseConnected ? 'Live Supabase' : 'Offline / Local'}
            </span>
          </div>
        </div>

        {/* PWA iPhone Install pill */}
        <div className="text-center">
          <PWAInstallButton variant="banner" />
        </div>
      </div>
    </div>
  );
};
