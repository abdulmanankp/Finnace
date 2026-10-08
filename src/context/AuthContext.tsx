import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSupabaseClient, getStoredSupabaseConfig } from '../lib/supabase';
import { UserProfile } from '../types/finance';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isSupabaseConnected: boolean;
  signIn: (email: string, password?: string) => Promise<{ error?: string }>;
  signUp: (email: string, password?: string, fullName?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'hisaab_current_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    setLoading(true);
    const client = getSupabaseClient();

    if (client) {
      setIsSupabaseConnected(true);
      try {
        const { data: { session } } = await client.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata?.full_name || 'Finance User',
            currency: 'Rs',
          });
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Error fetching Supabase session:', err);
      }
    } else {
      setIsSupabaseConnected(false);
    }

    // Check local stored session
    try {
      const stored = localStorage.getItem(LOCAL_USER_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Default initialized user for immediate access
        const defaultUser: UserProfile = {
          id: 'user_abdul_manan_primary',
          email: 'abdulmanankp0@gmail.com',
          full_name: 'Abdul Manan',
          currency: 'Rs',
        };
        setUser(defaultUser);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(defaultUser));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password = ''): Promise<{ error?: string }> => {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.auth.signInWithPassword({
          email,
          password: password || '123456',
        });
        if (error) return { error: error.message };
        if (data.user) {
          const u: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: data.user.user_metadata?.full_name || email.split('@')[0],
            currency: 'Rs',
          };
          setUser(u);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(u));
          return {};
        }
      } catch (err: any) {
        return { error: err.message || 'Authentication failed' };
      }
    }

    // Local authentication flow
    if (!email || !email.includes('@')) {
      return { error: 'Please enter a valid email address.' };
    }
    const cleanId = 'user_' + email.replace(/[^a-zA-Z0-9]/g, '_');
    const u: UserProfile = {
      id: cleanId,
      email,
      full_name: email.split('@')[0],
      currency: 'Rs',
    };
    setUser(u);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(u));
    return {};
  };

  const signUp = async (email: string, password = '', fullName = ''): Promise<{ error?: string }> => {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { data, error } = await client.auth.signUp({
          email,
          password: password || '123456',
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) return { error: error.message };
        if (data.user) {
          const u: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: fullName || email.split('@')[0],
            currency: 'Rs',
          };
          setUser(u);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(u));
          return {};
        }
      } catch (err: any) {
        return { error: err.message || 'Sign up failed' };
      }
    }

    if (!email || !email.includes('@')) {
      return { error: 'Please enter a valid email address.' };
    }
    const cleanId = 'user_' + email.replace(/[^a-zA-Z0-9]/g, '_');
    const u: UserProfile = {
      id: cleanId,
      email,
      full_name: fullName || email.split('@')[0],
      currency: 'Rs',
    };
    setUser(u);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(u));
    return {};
  };

  const signOut = async () => {
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.auth.signOut();
      } catch (e) {
        console.warn('Supabase signOut error', e);
      }
    }
    localStorage.removeItem(LOCAL_USER_KEY);
    setUser(null);
  };

  const resetPassword = async (email: string): Promise<{ error?: string; message?: string }> => {
    const client = getSupabaseClient();
    if (client) {
      try {
        const { error } = await client.auth.resetPasswordForEmail(email);
        if (error) return { error: error.message };
        return { message: 'Password reset link sent to your email.' };
      } catch (err: any) {
        return { error: err.message || 'Failed to send reset link.' };
      }
    }
    return { message: 'If an account exists with this email, a reset link will be sent.' };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isSupabaseConnected,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
