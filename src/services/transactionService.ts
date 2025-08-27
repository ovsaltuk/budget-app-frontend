import type { ICreateTransactionData, ITransaction, ITransactionFilters } from '../types/transactions';
import api from './api';


export const transactionService = {
  // Получить все транзакции пользователя
  getTransactions: async (filters?: ITransactionFilters): Promise<ITransaction[]> => {
    const response = await api.get('/transactions', { 
      params: filters 
    });
    return response.data;
  },

  // Получить конкретную транзакцию по ID
  getTransaction: async (id: number): Promise<ITransaction> => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  // Создать новую транзакцию
  createTransaction: async (data: ICreateTransactionData): Promise<ITransaction> => {
    const response = await api.post('/transactions', data);
    return response.data;
  },

  // Обновить транзакцию
  updateTransaction: async (id: number, data: Partial<ICreateTransactionData>): Promise<ITransaction> => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data;
  },

  // Удалить транзакцию
  deleteTransaction: async (id: number): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },
};