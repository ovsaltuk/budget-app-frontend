import { useState, useEffect, useCallback } from 'react';
import { transactionService } from '../services/transactionService';
import type { ICreateTransactionData, ITransaction, ITransactionFilters } from '../types/transactions';

export const useTransactions = (filters?: ITransactionFilters) => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [updateTrigger, setUpdateTrigger] = useState(0); // Добавляем updateTrigger

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
  }, [filters]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions, updateTrigger]); // Добавляем updateTrigger в зависимости

  const createTransaction = async (data: Omit<ITransaction, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
    try {
      const newTransaction = await transactionService.createTransaction(data);
      setTransactions(prev => [newTransaction, ...prev]);
      setUpdateTrigger(prev => prev + 1); // Обновляем триггер
      return newTransaction;
    } catch (err) {
      console.error('Error creating transaction:', err);
      throw err;
    }
  };

  const createTransactions = async (data: ICreateTransactionData[]) => {
    try {
      console.log(data);
      const newTransactions = await transactionService.createTransactions(data);
      setTransactions(prev => [...newTransactions, ...prev]);
      setUpdateTrigger(prev => prev + 1); // Обновляем триггер
      return newTransactions;
    } catch (err) {
      console.error('Error creating transactions1:', err);
      throw err;
    }
  };

  const deleteTransaction = async (id: number) => {
    try {
      await transactionService.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      setUpdateTrigger(prev => prev + 1); // Обновляем триггер
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
    createTransactions,
    deleteTransaction,
  };
};