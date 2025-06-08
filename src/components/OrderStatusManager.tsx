import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import { toast } from 'react-hot-toast';

interface OrderStatusManagerProps {
  orderId: string;
  currentOrderStatus: string;
  currentPaymentStatus: string;
}

const OrderStatusManager: React.FC<OrderStatusManagerProps> = ({
  orderId,
  currentOrderStatus,
  currentPaymentStatus,
}) => {
  const queryClient = useQueryClient();

  const updateOrderStatusMutation = useMutation({
    mutationFn: (orderStatus: string) =>
      orderService.updateOrderStatus(orderId, orderStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      toast.success('Cập nhật trạng thái đơn hàng thành công');
    },
    onError: () => {
      toast.error('Cập nhật trạng thái đơn hàng thất bại');
    },
  });

  const updatePaymentStatusMutation = useMutation({
    mutationFn: (paymentStatus: 'pending' | 'paid' | 'failed') =>
      orderService.updatePaymentStatus(orderId, paymentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      toast.success('Cập nhật trạng thái thanh toán thành công');
    },
    onError: () => {
      toast.error('Cập nhật trạng thái thanh toán thất bại');
    },
  });

  const orderStatuses = [
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'shipped', label: 'Đang giao hàng' },
    { value: 'delivered', label: 'Đã giao hàng' },
    { value: 'cancelled', label: 'Đã hủy' },
  ];

  const paymentStatuses = [
    { value: 'pending', label: 'Chờ thanh toán' },
    { value: 'paid', label: 'Đã thanh toán' },
    { value: 'failed', label: 'Thanh toán thất bại' },
  ];

  const handleOrderStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateOrderStatusMutation.mutate(e.target.value);
  };

  const handlePaymentStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as 'pending' | 'paid' | 'failed';
    updatePaymentStatusMutation.mutate(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quản lý trạng thái đơn hàng</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Status */}
        <div>
          <label htmlFor="orderStatus" className="block text-sm font-medium text-gray-700 mb-2">
            Trạng thái đơn hàng
          </label>
          <select
            id="orderStatus"
            value={currentOrderStatus}
            onChange={handleOrderStatusChange}
            disabled={updateOrderStatusMutation.isPending}
            className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {orderStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          {updateOrderStatusMutation.isPending && (
            <p className="mt-2 text-sm text-gray-500">Đang cập nhật trạng thái đơn hàng...</p>
          )}
        </div>

        {/* Payment Status */}
        <div>
          <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700 mb-2">
            Trạng thái thanh toán
          </label>
          <select
            id="paymentStatus"
            value={currentPaymentStatus}
            onChange={handlePaymentStatusChange}
            disabled={updatePaymentStatusMutation.isPending}
            className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {paymentStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          {updatePaymentStatusMutation.isPending && (
            <p className="mt-2 text-sm text-gray-500">Đang cập nhật trạng thái thanh toán...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderStatusManager; 