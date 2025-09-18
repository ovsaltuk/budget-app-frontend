import type {
  ICreateTransactionData,
  ITransaction,
  ITransactionFilters,
} from "../types/transactions";
import api from "./api";

export const transactionService = {
  // Получить все транзакции пользователя
  getTransactions: async (
    filters?: ITransactionFilters
  ): Promise<ITransaction[]> => {
    const response = await api.get("/transactions", {
      params: filters,
    });
    return response.data;
  },

  // Получить конкретную транзакцию по ID
  getTransaction: async (id: number): Promise<ITransaction> => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },
  // Обновить транзакцию
  updateTransaction: async (
    id: number,
    data: Partial<ICreateTransactionData>
  ): Promise<ITransaction> => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data;
  },

  // Удалить транзакцию
  deleteTransaction: async (id: number): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },

  // Массовое удаление транзакций
  deleteTransactions: async (ids: number[]): Promise<void> => {
    try {
      console.log("Deleting transactions with IDs:", ids);
      const response = await api.post("/transactions/delete-multiple", { ids });
      console.log("Bulk delete response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Bulk delete error:", error);
      throw error;
    }
  },

  // Создать новую транзакцию
  createTransaction: async (
    data: ICreateTransactionData
  ): Promise<ITransaction> => {
    const response = await api.post("/transactions", data);
    return response.data;
  },

  // Массовое создание транзакций
  createTransactions: async (
    data: ICreateTransactionData[]
  ): Promise<ITransaction[]> => {
    try {
      console.log("Sending bulk data:", data);
      const response = await api.post("/transactions/bulk", data);
      console.log("Bulk response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Bulk create error:", error);
      throw error;
    }
  },
};
