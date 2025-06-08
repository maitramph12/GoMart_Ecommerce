import axios from 'axios';
import { IUser } from '@/models/User';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const userService = {
  getAll: async (): Promise<IUser[]> => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  },

  getById: async (id: string): Promise<IUser> => {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data;
  },

  create: async (data: Partial<IUser>): Promise<IUser> => {
    const response = await axios.post(`${API_URL}/users`, data);
    return response.data;
  },

  update: async (id: string, data: Partial<IUser>): Promise<IUser> => {
    const response = await axios.put(`${API_URL}/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/users/${id}`);
  },
}; 