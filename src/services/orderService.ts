import { IOrder } from '@/models/Order';
import api from '@/lib/axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const orderService = {
  // Get all orders
  getAll: async (): Promise<IOrder[]> => {
    const response = await api.get(`${API_URL}/orders`);
    return response.data;
  },

  // Get order by ID
  getById: async (id: string): Promise<IOrder> => {
    const response = await api.get(`${API_URL}/orders/${id}`);
    return response.data;
  },

  // Create new order
  create: async (orderData: Partial<IOrder>): Promise<IOrder> => {
    const response = await api.post(`${API_URL}/orders`, orderData);
    return response.data;
  },

  // Delete order
  delete: async (id: string): Promise<void> => {
    await api.delete(`${API_URL}/orders/${id}`);
  },

  // Update order status
  updateOrderStatus: async (id: string, orderStatus: string): Promise<IOrder> => {
    const response = await api.put(`${API_URL}/orders/${id}/order-status`, { orderStatus });
    return response.data;
  },

  // Update payment status
  updatePaymentStatus: async (id: string, paymentStatus: string): Promise<IOrder> => {
    const response = await api.put(`${API_URL}/orders/${id}/payment-status`, { paymentStatus });
    return response.data;
  },

  // get user orders
  getUserOrders: async (): Promise<IOrder[]> => {
    const response = await api.get(`${API_URL}/orders/user`);
    return response.data;
  },
}; 