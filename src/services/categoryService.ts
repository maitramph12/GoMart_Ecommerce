import axios from 'axios';
import { ICategory } from '@/models/Category';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const categoryService = {
  // Get all categories
  getAll: async (): Promise<ICategory[]> => {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
  },

  // Get single category
  getById: async (id: string): Promise<ICategory> => {
    const response = await axios.get(`${API_URL}/categories/${id}`);
    return response.data;
  },

  // Create category
  create: async (data: Partial<ICategory>): Promise<ICategory> => {
    const response = await axios.post(`${API_URL}/categories`, data);
    return response.data;
  },

  // Update category
  update: async (id: string, data: Partial<ICategory>): Promise<ICategory> => {
    const response = await axios.put(`${API_URL}/categories/${id}`, data);
    return response.data;
  },

  // Delete category
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/categories/${id}`);
  },

  // Get subcategories
  getSubcategories: async (parentId: string): Promise<ICategory[]> => {
    const response = await axios.get(`${API_URL}/categories`, {
      params: { parent: parentId }
    });
    return response.data;
  },

  // Get category tree
  getCategoryTree: async (): Promise<ICategory[]> => {
    const response = await axios.get(`${API_URL}/categories`, {
      params: { tree: true }
    });
    return response.data;
  },
}; 