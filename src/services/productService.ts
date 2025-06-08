import { IProduct } from '@/models/Product';
import api from '@/lib/axios';

const API_URL = '/products';

export const productService = {
  // Get all products
  getAll: async (): Promise<IProduct[]> => {
    try {
      const { data } = await api.get(API_URL);
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get single product
  getById: async (id: string): Promise<IProduct> => {
    try {
      const { data } = await api.get(`${API_URL}/${id}`);
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Create product
  create: async (productData: Partial<IProduct>): Promise<IProduct> => {
    try {
      const { data } = await api.post(API_URL, productData);
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product
  update: async (id: string, productData: Partial<IProduct>): Promise<IProduct> => {
    try {
      const { data } = await api.put(API_URL, { id, ...productData });
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`${API_URL}?id=${id}`);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Get products by category
  getByCategory: async ({queryKey}: {queryKey: any}): Promise<IProduct[]> => {
    try {
      const [, query] = queryKey;
      const { data } = await api.get(`/categories/${query?.id}/product`);
      return data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  },

  // Search products
  search: async (query: string): Promise<IProduct[]> => {
    try {
      const { data } = await api.get(API_URL, {
        params: { q: query }
      });
      return data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },
}; 