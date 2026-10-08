export type TransactionType =
  | 'income'
  | 'expense'
  | 'transfer'
  | 'borrow'
  | 'lend'
  | 'repayment_received'
  | 'repayment_sent';

export type FinancialArea = 'flat' | 'living';

export type TransactionStatus = 'completed' | 'pending' | 'partially_paid' | 'settled';

export interface Account {
  id: string;
  user_id: string;
  name: string;
  opening_balance: number;
  color?: string;
  is_default?: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  user_id: string;
  name: string;
  area: FinancialArea;
  icon?: string;
  is_system?: boolean;
}

export interface Person {
  id: string;
  user_id: string;
  name: string;
  phone?: string;
  notes?: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  transaction_type: TransactionType;
  area: FinancialArea | null;
  amount: number;
  category_id?: string | null;
  account_id: string; // From / Source Account (or Received Into Account for Income/Borrow)
  to_account_id?: string | null; // For transfers
  person_id?: string | null; // For borrow, lend, repayments
  purpose?: string | null; // e.g. "Flat Rent", "Electricity", "Biryani"
  description: string; // e.g. "October Electricity Bill"
  transaction_date: string; // YYYY-MM-DD
  notes?: string | null;
  status: TransactionStatus;
  parent_transaction_id?: string | null; // Links repayment to original borrow or lend
  created_at: string;
  updated_at?: string;
}

export interface BorrowDebtRecord {
  id: string;
  person_id: string;
  person_name: string;
  amount: number; // original borrowed
  repaid: number;
  remaining: number;
  purpose: string;
  area: FinancialArea;
  account_id: string;
  account_name: string;
  date: string;
  status: TransactionStatus;
  notes?: string;
  used_amount?: number; // for purpose tracking e.g. Used: Rs 3,500, Remaining: Rs 1,500
}

export interface LoanGivenRecord {
  id: string;
  person_id: string;
  person_name: string;
  amount: number; // original lent
  returned: number;
  remaining: number;
  purpose: string;
  area: FinancialArea;
  account_id: string;
  account_name: string;
  date: string;
  status: TransactionStatus;
  notes?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  currency: string;
}
