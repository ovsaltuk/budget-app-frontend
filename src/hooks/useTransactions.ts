import { useState, useEffect, useCallback } from 'react';
import { transactionService } from '../services/transactionService';
import type { ITransaction, ITransactionFilters } from '../types/transactions';

export const useTransactions = (filters?: ITransactionFilters) => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // useCallback для стабильной ссылки на функцию
  const loadTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await transactionService.getTransactions(filters);
      setTransactions(data);
    } catch (err) {
      setError('Ошибка при загрузке транзакций');
      console.error('Error loading transactions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]); // Добавляем filters в зависимости

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]); // Теперь используем loadTransactions в зависимостях

  const createTransaction = async (data: Omit<ITransaction, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    try {
      const newTransaction = await transactionService.createTransaction(data);
      setTransactions(prev => [newTransaction, ...prev]);
      return newTransaction;
    } catch (err) {
      console.error('Error creating transaction:', err);
      throw err;
    }
  };

  const deleteTransaction = async (id: number) => {
    try {
      await transactionService.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting transaction:', err);
      throw err;
    }
  };

  return {
    transactions,
    isLoading,
    error,
    loadTransactions,
    createTransaction,
    deleteTransaction,
  };
};