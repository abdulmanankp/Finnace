import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';
import {
  Account,
  Category,
  Person,
  Transaction,
  FinancialArea,
  TransactionType,
  BorrowDebtRecord,
  LoanGivenRecord,
} from '../types/finance';
import { getSupabaseClient } from '../lib/supabase';

interface FinanceContextType {
  accounts: Account[];
  categories: Category[];
  people: Person[];
  transactions: Transaction[];
  currency: string;
  setCurrency: (c: string) => void;
  // Computed Balances
  accountBalances: Record<string, number>;
  totalAvailableMoney: number;
  totalMoneyOwed: number; // Liabilities (borrowed)
  totalMoneyReceivable: number; // Assets (lent)
  netOwnMoney: number;
  // Area Metrics
  flatMetrics: { income: number; expenses: number; net: number };
  livingMetrics: { income: number; expenses: number; net: number };
  // Debt & Loan breakdown
  borrowedRecords: BorrowDebtRecord[];
  lentRecords: LoanGivenRecord[];
  // Actions
  addTransaction: (tx: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => Promise<Transaction>;
  deleteTransaction: (id: string) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  addAccount: (name: string, openingBalance: number, color?: string) => Promise<Account>;
  updateAccount: (id: string, updates: Partial<Account>) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  addCategory: (name: string, area: FinancialArea, icon?: string) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
  addPerson: (name: string, phone?: string, notes?: string) => Promise<Person>;
  repayDebt: (borrowTxId: string, amount: number, accountId: string, date: string, notes?: string) => Promise<void>;
  receiveLendRepayment: (lendTxId: string, amount: number, accountId: string, date: string, notes?: string) => Promise<void>;
  resetToDemoData: () => void;
  clearAllData: () => void;
  syncWithSupabase: () => Promise<{ success: boolean; message?: string }>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const DEFAULT_ACCOUNTS = (userId: string): Account[] => [
  { id: 'acc_cash', user_id: userId, name: 'Cash', opening_balance: 5000, color: '#10b981', is_default: true, created_at: new Date().toISOString() },
  { id: 'acc_ubl', user_id: userId, name: 'UBL', opening_balance: 0, color: '#3b82f6', is_default: false, created_at: new Date().toISOString() },
  { id: 'acc_other_bank', user_id: userId, name: 'Other Bank', opening_balance: 0, color: '#6366f1', is_default: false, created_at: new Date().toISOString() },
  { id: 'acc_easypaisa', user_id: userId, name: 'Easypaisa', opening_balance: 0, color: '#059669', is_default: false, created_at: new Date().toISOString() },
  { id: 'acc_jazzcash', user_id: userId, name: 'JazzCash', opening_balance: 0, color: '#ea580c', is_default: false, created_at: new Date().toISOString() },
];

const DEFAULT_CATEGORIES = (userId: string): Category[] => [
  // Flat Categories
  { id: 'cat_rent', user_id: userId, name: 'Rent', area: 'flat', is_system: true },
  { id: 'cat_elec', user_id: userId, name: 'Electricity', area: 'flat', is_system: true },
  { id: 'cat_gas', user_id: userId, name: 'Gas', area: 'flat', is_system: true },
  { id: 'cat_net', user_id: userId, name: 'Internet', area: 'flat', is_system: true },
  { id: 'cat_water', user_id: userId, name: 'Water', area: 'flat', is_system: true },
  { id: 'cat_maint', user_id: userId, name: 'Maintenance', area: 'flat', is_system: true },
  { id: 'cat_repair', user_id: userId, name: 'Repair', area: 'flat', is_system: true },
  { id: 'cat_paint', user_id: userId, name: 'Paint', area: 'flat', is_system: true },
  { id: 'cat_furn', user_id: userId, name: 'Furniture', area: 'flat', is_system: true },
  { id: 'cat_clean', user_id: userId, name: 'Cleaning', area: 'flat', is_system: true },
  { id: 'cat_other_flat', user_id: userId, name: 'Other Flat Expense', area: 'flat', is_system: true },

  // Living Categories
  { id: 'cat_food', user_id: userId, name: 'Food', area: 'living', is_system: true },
  { id: 'cat_petrol', user_id: userId, name: 'Petrol / Transport', area: 'living', is_system: true },
  { id: 'cat_mobile', user_id: userId, name: 'Mobile', area: 'living', is_system: true },
  { id: 'cat_edu', user_id: userId, name: 'Education', area: 'living', is_system: true },
  { id: 'cat_shop', user_id: userId, name: 'Shopping', area: 'living', is_system: true },
  { id: 'cat_pers', user_id: userId, name: 'Personal', area: 'living', is_system: true },
  { id: 'cat_med', user_id: userId, name: 'Medical', area: 'living', is_system: true },
  { id: 'cat_ent', user_id: userId, name: 'Entertainment', area: 'living', is_system: true },
  { id: 'cat_other_liv', user_id: userId, name: 'Other Living Expense', area: 'living', is_system: true },
];

const DEFAULT_PEOPLE = (userId: string): Person[] => [
  { id: 'person_saad', user_id: userId, name: 'Saad', notes: 'Flatmate / Friend', created_at: new Date().toISOString() },
  { id: 'person_brow', user_id: userId, name: 'Brow', notes: 'Friend', created_at: new Date().toISOString() },
  { id: 'person_hasseb', user_id: userId, name: 'Hasseb', notes: 'Colleague', created_at: new Date().toISOString() },
];

const getTodayDate = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

const DEFAULT_SEED_TRANSACTIONS = (userId: string): Transaction[] => {
  const today = getTodayDate();
  const yesterday = getTodayDate(-1);
  const twoDaysAgo = getTodayDate(-2);

  return [
    // Income: Rent contribution Rs 10,000 (Flat, UBL)
    {
      id: 'tx_seed_1',
      user_id: userId,
      transaction_type: 'income',
      area: 'flat',
      amount: 10000,
      account_id: 'acc_ubl',
      purpose: 'Rent Contribution',
      description: 'Rent Contribution',
      transaction_date: twoDaysAgo,
      status: 'completed',
      created_at: new Date().toISOString(),
    },
    // Flat: Gas Rs 340 (Cash)
    {
      id: 'tx_seed_2',
      user_id: userId,
      transaction_type: 'expense',
      area: 'flat',
      category_id: 'cat_gas',
      amount: 340,
      account_id: 'acc_cash',
      purpose: 'Gas Bill',
      description: 'Gas Bill',
      transaction_date: yesterday,
      status: 'completed',
      created_at: new Date().toISOString(),
    },
    // Flat: Internet Rs 420 (UBL)
    {
      id: 'tx_seed_3',
      user_id: userId,
      transaction_type: 'expense',
      area: 'flat',
      category_id: 'cat_net',
      amount: 420,
      account_id: 'acc_ubl',
      purpose: 'Internet Bill',
      description: 'Internet Bill',
      transaction_date: yesterday,
      status: 'completed',
      created_at: new Date().toISOString(),
    },
    // Flat: Electricity Rs 3,400 (UBL)
    {
      id: 'tx_seed_4',
      user_id: userId,
      transaction_type: 'expense',
      area: 'flat',
      category_id: 'cat_elec',
      amount: 3400,
      account_id: 'acc_ubl',
      purpose: 'October Electricity Bill',
      description: 'October Electricity Bill',
      transaction_date: today,
      status: 'completed',
      created_at: new Date().toISOString(),
    },
    // Living: Food Rs 300 (Cash)
    {
      id: 'tx_seed_5',
      user_id: userId,
      transaction_type: 'expense',
      area: 'living',
      category_id: 'cat_food',
      amount: 300,
      account_id: 'acc_cash',
      purpose: 'Karachi Biryani',
      description: 'Karachi Biryani',
      transaction_date: yesterday,
      status: 'completed',
      created_at: new Date().toISOString(),
    },
    // Living: Food Rs 240 (Cash)
    {
      id: 'tx_seed_6',
      user_id: userId,
      transaction_type: 'expense',
      area: 'living',
      category_id: 'cat_food',
      amount: 240,
      account_id: 'acc_cash',
      purpose: 'Lunch Burger',
      description: 'Lunch Burger',
      transaction_date: today,
      status: 'completed',
      created_at: new Date().toISOString(),
    },
    // Living: Petrol Rs 320 (Cash)
    {
      id: 'tx_seed_7',
      user_id: userId,
      transaction_type: 'expense',
      area: 'living',
      category_id: 'cat_petrol',
      amount: 320,
      account_id: 'acc_cash',
      purpose: 'Bike Fuel',
      description: 'Bike Fuel',
      transaction_date: today,
      status: 'completed',
      created_at: new Date().toISOString(),
    },
    // Borrow: Saad Rs 610 for Flat (Received into Cash)
    {
      id: 'tx_seed_8',
      user_id: userId,
      transaction_type: 'borrow',
      area: 'flat',
      person_id: 'person_saad',
      amount: 610,
      account_id: 'acc_cash',
      purpose: 'Flat Emergency / Repair',
      description: 'Borrowed from Saad for Flat',
      transaction_date: yesterday,
      status: 'pending',
      created_at: new Date().toISOString(),
    },
    // Lend: Brow Rs 1,900 for Flat (Paid from Cash)
    {
      id: 'tx_seed_9',
      user_id: userId,
      transaction_type: 'lend',
      area: 'flat',
      person_id: 'person_brow',
      amount: 1900,
      account_id: 'acc_cash',
      purpose: 'Flat Expense Share',
      description: 'Gave to Brow for Flat',
      transaction_date: twoDaysAgo,
      status: 'pending',
      created_at: new Date().toISOString(),
    },
  ];
};

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id || 'guest_user';

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currency, setCurrencyState] = useState<string>('Rs');

  // Key names scoped by user
  const storageKey = (key: string) => `hisaab_${userId}_${key}`;

  // Load from local storage or initialize defaults
  useEffect(() => {
    if (!userId) return;

    try {
      const storedAcc = localStorage.getItem(storageKey('accounts'));
      const storedCat = localStorage.getItem(storageKey('categories'));
      const storedPeople = localStorage.getItem(storageKey('people'));
      const storedTx = localStorage.getItem(storageKey('transactions'));
      const storedCur = localStorage.getItem(storageKey('currency'));

      setAccounts(storedAcc ? JSON.parse(storedAcc) : DEFAULT_ACCOUNTS(userId));
      setCategories(storedCat ? JSON.parse(storedCat) : DEFAULT_CATEGORIES(userId));
      setPeople(storedPeople ? JSON.parse(storedPeople) : DEFAULT_PEOPLE(userId));
      setTransactions(storedTx ? JSON.parse(storedTx) : DEFAULT_SEED_TRANSACTIONS(userId));
      if (storedCur) setCurrencyState(storedCur);
    } catch (e) {
      console.error('Error loading finance data', e);
      setAccounts(DEFAULT_ACCOUNTS(userId));
      setCategories(DEFAULT_CATEGORIES(userId));
      setPeople(DEFAULT_PEOPLE(userId));
      setTransactions(DEFAULT_SEED_TRANSACTIONS(userId));
    }
  }, [userId]);

  // Save changes to localStorage
  const saveAccounts = (newAccs: Account[]) => {
    setAccounts(newAccs);
    localStorage.setItem(storageKey('accounts'), JSON.stringify(newAccs));
  };

  const saveCategories = (newCats: Category[]) => {
    setCategories(newCats);
    localStorage.setItem(storageKey('categories'), JSON.stringify(newCats));
  };

  const savePeople = (newPeople: Person[]) => {
    setPeople(newPeople);
    localStorage.setItem(storageKey('people'), JSON.stringify(newPeople));
  };

  const saveTransactions = (newTxs: Transaction[]) => {
    setTransactions(newTxs);
    localStorage.setItem(storageKey('transactions'), JSON.stringify(newTxs));
  };

  const setCurrency = (c: string) => {
    setCurrencyState(c);
    localStorage.setItem(storageKey('currency'), c);
  };

  // -------------------------------------------------------------
  // STRICT ACCOUNTING DERIVATIONS
  // Rule: Balances MUST NEVER be entered manually, always derived!
  // -------------------------------------------------------------

  const accountBalances = useMemo(() => {
    const balances: Record<string, number> = {};

    accounts.forEach((acc) => {
      balances[acc.id] = Number(acc.opening_balance || 0);
    });

    transactions.forEach((tx) => {
      const amt = Number(tx.amount || 0);

      switch (tx.transaction_type) {
        case 'income':
          // Income increases selected account
          if (balances[tx.account_id] !== undefined) {
            balances[tx.account_id] += amt;
          }
          break;

        case 'expense':
          // Expense decreases selected account
          if (balances[tx.account_id] !== undefined) {
            balances[tx.account_id] -= amt;
          }
          break;

        case 'transfer':
          // Transfer decreases source account, increases destination account
          if (balances[tx.account_id] !== undefined) {
            balances[tx.account_id] -= amt;
          }
          if (tx.to_account_id && balances[tx.to_account_id] !== undefined) {
            balances[tx.to_account_id] += amt;
          }
          break;

        case 'borrow':
          // Borrowing receives cash into account (increases cash balance, but is a liability)
          if (balances[tx.account_id] !== undefined) {
            balances[tx.account_id] += amt;
          }
          break;

        case 'repayment_sent':
          // Repaying debt decreases account balance
          if (balances[tx.account_id] !== undefined) {
            balances[tx.account_id] -= amt;
          }
          break;

        case 'lend':
          // Lending money decreases account balance (cash left, but is a receivable)
          if (balances[tx.account_id] !== undefined) {
            balances[tx.account_id] -= amt;
          }
          break;

        case 'repayment_received':
          // Receiving repayment from person increases account balance
          if (balances[tx.account_id] !== undefined) {
            balances[tx.account_id] += amt;
          }
          break;
      }
    });

    return balances;
  }, [accounts, transactions]);

  const totalAvailableMoney = useMemo(() => {
    return Object.values(accountBalances).reduce((acc, b) => acc + b, 0);
  }, [accountBalances]);

  // Breakdown of Debts (Money Borrowed from others)
  const borrowedRecords: BorrowDebtRecord[] = useMemo(() => {
    const borrowTxs = transactions.filter((t) => t.transaction_type === 'borrow');
    const repayments = transactions.filter((t) => t.transaction_type === 'repayment_sent');

    return borrowTxs.map((b) => {
      // Find all repayments linked to this borrow transaction or person
      const relatedRepayments = repayments.filter(
        (r) => r.parent_transaction_id === b.id || (!r.parent_transaction_id && r.person_id === b.person_id)
      );
      const totalRepaid = relatedRepayments.reduce((sum, r) => sum + Number(r.amount), 0);
      const remaining = Math.max(0, b.amount - totalRepaid);

      let status: Transaction['status'] = 'pending';
      if (remaining <= 0) {
        status = 'settled';
      } else if (totalRepaid > 0) {
        status = 'partially_paid';
      }

      const person = people.find((p) => p.id === b.person_id);
      const account = accounts.find((a) => a.id === b.account_id);

      return {
        id: b.id,
        person_id: b.person_id || '',
        person_name: person?.name || 'Unknown',
        amount: b.amount,
        repaid: totalRepaid,
        remaining,
        purpose: b.purpose || b.description || 'General',
        area: b.area || 'flat',
        account_id: b.account_id,
        account_name: account?.name || 'Cash',
        date: b.transaction_date,
        status,
        notes: b.notes || '',
        used_amount: Math.min(b.amount, b.amount - remaining + (b.amount * 0.7)), // Purpose usage illustration
      };
    });
  }, [transactions, people, accounts]);

  // Total Outstanding Borrowed (Money You Owe)
  const totalMoneyOwed = useMemo(() => {
    return borrowedRecords.reduce((sum, r) => sum + r.remaining, 0);
  }, [borrowedRecords]);

  // Breakdown of Loans Given (Money Lent to others)
  const lentRecords: LoanGivenRecord[] = useMemo(() => {
    const lendTxs = transactions.filter((t) => t.transaction_type === 'lend');
    const repaymentsReceived = transactions.filter((t) => t.transaction_type === 'repayment_received');

    return lendTxs.map((l) => {
      const relatedReturns = repaymentsReceived.filter(
        (r) => r.parent_transaction_id === l.id || (!r.parent_transaction_id && r.person_id === l.person_id)
      );
      const totalReturned = relatedReturns.reduce((sum, r) => sum + Number(r.amount), 0);
      const remaining = Math.max(0, l.amount - totalReturned);

      let status: Transaction['status'] = 'pending';
      if (remaining <= 0) {
        status = 'settled';
      } else if (totalReturned > 0) {
        status = 'partially_paid';
      }

      const person = people.find((p) => p.id === l.person_id);
      const account = accounts.find((a) => a.id === l.account_id);

      return {
        id: l.id,
        person_id: l.person_id || '',
        person_name: person?.name || 'Unknown',
        amount: l.amount,
        returned: totalReturned,
        remaining,
        purpose: l.purpose || l.description || 'General',
        area: l.area || 'flat',
        account_id: l.account_id,
        account_name: account?.name || 'Cash',
        date: l.transaction_date,
        status,
        notes: l.notes || '',
      };
    });
  }, [transactions, people, accounts]);

  // Total Outstanding Lent (Money Others Owe You)
  const totalMoneyReceivable = useMemo(() => {
    return lentRecords.reduce((sum, r) => sum + r.remaining, 0);
  }, [lentRecords]);

  // Net Own Money = Total Cash/Bank Available - Borrowed Liabilities
  const netOwnMoney = useMemo(() => {
    return totalAvailableMoney - totalMoneyOwed;
  }, [totalAvailableMoney, totalMoneyOwed]);

  // -------------------------------------------------------------
  // FLAT VS LIVING METRICS (STRICT SEPARATION)
  // Never mix Flat and Living numbers!
  // -------------------------------------------------------------

  const flatMetrics = useMemo(() => {
    let income = 0;
    let expenses = 0;

    transactions.forEach((tx) => {
      if (tx.area === 'flat') {
        if (tx.transaction_type === 'income') {
          income += Number(tx.amount);
        } else if (tx.transaction_type === 'expense') {
          expenses += Number(tx.amount);
        }
      }
    });

    return {
      income,
      expenses,
      net: income - expenses,
    };
  }, [transactions]);

  const livingMetrics = useMemo(() => {
    let income = 0;
    let expenses = 0;

    transactions.forEach((tx) => {
      if (tx.area === 'living') {
        if (tx.transaction_type === 'income') {
          income += Number(tx.amount);
        } else if (tx.transaction_type === 'expense') {
          expenses += Number(tx.amount);
        }
      }
    });

    return {
      income,
      expenses,
      net: income - expenses,
    };
  }, [transactions]);

  // -------------------------------------------------------------
  // MUTATION ACTIONS
  // -------------------------------------------------------------

  const addTransaction = async (txData: Omit<Transaction, 'id' | 'user_id' | 'created_at'>): Promise<Transaction> => {
    const newTx: Transaction = {
      ...txData,
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      user_id: userId,
      created_at: new Date().toISOString(),
    };

    const updated = [newTx, ...transactions];
    saveTransactions(updated);

    // If Supabase client is connected, try to insert into Supabase
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('transactions').insert([newTx]);
      } catch (e) {
        console.warn('Could not sync transaction to Supabase immediately', e);
      }
    }

    return newTx;
  };

  const deleteTransaction = async (id: string): Promise<void> => {
    const updated = transactions.filter((t) => t.id !== id);
    saveTransactions(updated);

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('transactions').delete().eq('id', id);
      } catch (e) {
        console.warn('Could not delete from Supabase', e);
      }
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>): Promise<void> => {
    const updated = transactions.map((t) => (t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t));
    saveTransactions(updated);

    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('transactions').update(updates).eq('id', id);
      } catch (e) {
        console.warn('Could not update in Supabase', e);
      }
    }
  };

  const addAccount = async (name: string, openingBalance: number, color = '#3b82f6'): Promise<Account> => {
    const newAcc: Account = {
      id: 'acc_' + Date.now(),
      user_id: userId,
      name,
      opening_balance: openingBalance,
      color,
      is_default: false,
      created_at: new Date().toISOString(),
    };
    const updated = [...accounts, newAcc];
    saveAccounts(updated);
    return newAcc;
  };

  const updateAccount = async (id: string, updates: Partial<Account>): Promise<void> => {
    const updated = accounts.map((a) => (a.id === id ? { ...a, ...updates } : a));
    saveAccounts(updated);
  };

  const deleteAccount = async (id: string): Promise<void> => {
    const updated = accounts.filter((a) => a.id !== id);
    saveAccounts(updated);
  };

  const addCategory = async (name: string, area: FinancialArea, icon = 'Tag'): Promise<Category> => {
    const newCat: Category = {
      id: 'cat_' + Date.now(),
      user_id: userId,
      name,
      area,
      icon,
      is_system: false,
    };
    const updated = [...categories, newCat];
    saveCategories(updated);
    return newCat;
  };

  const deleteCategory = async (id: string): Promise<void> => {
    const updated = categories.filter((c) => c.id !== id);
    saveCategories(updated);
  };

  const addPerson = async (name: string, phone = '', notes = ''): Promise<Person> => {
    const newPerson: Person = {
      id: 'person_' + Date.now(),
      user_id: userId,
      name,
      phone,
      notes,
      created_at: new Date().toISOString(),
    };
    const updated = [...people, newPerson];
    savePeople(updated);
    return newPerson;
  };

  // Repay borrowed money to someone (decreases account balance, decreases debt)
  const repayDebt = async (
    borrowTxId: string,
    amount: number,
    accountId: string,
    date: string,
    notes = ''
  ): Promise<void> => {
    const borrowRecord = borrowedRecords.find((b) => b.id === borrowTxId);
    const personId = borrowRecord?.person_id;
    const personName = borrowRecord?.person_name || 'Person';

    await addTransaction({
      transaction_type: 'repayment_sent',
      area: borrowRecord?.area || 'flat',
      amount,
      account_id: accountId,
      person_id: personId,
      purpose: `Repayment for ${borrowRecord?.purpose || 'debt'}`,
      description: `Repaid to ${personName}`,
      transaction_date: date,
      notes,
      status: 'completed',
      parent_transaction_id: borrowTxId,
    });
  };

  // Receive repayment for lent money (increases account balance, decreases receivable)
  const receiveLendRepayment = async (
    lendTxId: string,
    amount: number,
    accountId: string,
    date: string,
    notes = ''
  ): Promise<void> => {
    const lendRecord = lentRecords.find((l) => l.id === lendTxId);
    const personId = lendRecord?.person_id;
    const personName = lendRecord?.person_name || 'Person';

    await addTransaction({
      transaction_type: 'repayment_received',
      area: lendRecord?.area || 'flat',
      amount,
      account_id: accountId,
      person_id: personId,
      purpose: `Return of ${lendRecord?.purpose || 'loan'}`,
      description: `${personName} returned money`,
      transaction_date: date,
      notes,
      status: 'completed',
      parent_transaction_id: lendTxId,
    });
  };

  const resetToDemoData = () => {
    const defaultAccs = DEFAULT_ACCOUNTS(userId);
    const defaultCats = DEFAULT_CATEGORIES(userId);
    const defaultPeo = DEFAULT_PEOPLE(userId);
    const defaultTxs = DEFAULT_SEED_TRANSACTIONS(userId);

    saveAccounts(defaultAccs);
    saveCategories(defaultCats);
    savePeople(defaultPeo);
    saveTransactions(defaultTxs);
  };

  const clearAllData = () => {
    saveAccounts(DEFAULT_ACCOUNTS(userId));
    saveCategories(DEFAULT_CATEGORIES(userId));
    savePeople([]);
    saveTransactions([]);
  };

  const syncWithSupabase = async (): Promise<{ success: boolean; message?: string }> => {
    const client = getSupabaseClient();
    if (!client) {
      return { success: false, message: 'Supabase credentials are not configured.' };
    }

    try {
      // 1. Fetch remote accounts
      const { data: remAcc, error: accErr } = await client.from('accounts').select('*');
      if (accErr) throw accErr;
      if (remAcc && remAcc.length > 0) {
        saveAccounts(remAcc);
      }

      // 2. Fetch remote transactions
      const { data: remTxs, error: txErr } = await client.from('transactions').select('*');
      if (txErr) throw txErr;
      if (remTxs && remTxs.length > 0) {
        saveTransactions(remTxs);
      }

      return { success: true, message: 'Successfully synchronized data with Supabase!' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Sync failed.' };
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        accounts,
        categories,
        people,
        transactions,
        currency,
        setCurrency,
        accountBalances,
        totalAvailableMoney,
        totalMoneyOwed,
        totalMoneyReceivable,
        netOwnMoney,
        flatMetrics,
        livingMetrics,
        borrowedRecords,
        lentRecords,
        addTransaction,
        deleteTransaction,
        updateTransaction,
        addAccount,
        updateAccount,
        deleteAccount,
        addCategory,
        deleteCategory,
        addPerson,
        repayDebt,
        receiveLendRepayment,
        resetToDemoData,
        clearAllData,
        syncWithSupabase,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within a FinanceProvider');
  return context;
};
