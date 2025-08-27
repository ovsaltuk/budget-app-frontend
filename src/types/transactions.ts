export interface ITransaction {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  date: string;
  category: string;
  subcategory?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export interface ICreateTransactionData {
  type: 'income' | 'expense';
  amount: number;
  date: string;
  category: string;
  subcategory?: string;
  description?: string;
}

export interface ITransactionFilters {
  type?: 'income' | 'expense';
  category?: string;
  startDate?: string;
  endDate?: string;
}