
import type { IUser } from '../types/user';
import api from './api';

export interface ILoginData {
    login: string;
    password: string;
}

export interface IAuthResponse {
    message: string;
    token: string;
    user: IUser;
}

export const authService = {
  login: async (data: ILoginData): Promise<IAuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
};