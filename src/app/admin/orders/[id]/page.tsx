'use client';

import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { orderService } from '@/services/orderService';
import { formatDate } from '@/utils/format';
import { ArrowLeft } from 'lucide-react';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: order, isPending } = useQuery({
    queryKey: ['order', params.id],
    queryFn: () => orderService.getById(params.id),
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: (orderStatus: string) => 
      orderService.updateOrderStatus(params.id, orderStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', params.id] });
      toast.success('Cập nhật trạng thái đơn hàng thành công!');
    },
    onError: (error) => {
      toast.error('Cập nhật trạng thái đơn hàng thất bại.');
      console.error('Lỗi khi cập nhật trạng thái:', error);
    },
  });

  const updatePaymentStatusMutation = useMutation({
    mutationFn: (paymentStatus: string) => 
      orderService.updatePaymentStatus(params.id, paymentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', params.id] });
      toast.success('Cập nhật trạng thái thanh toán thành công!');
    },
    onError: (error) => {
      toast.error('Cập nhật trạng thái thanh toán thất bại.');
      console.error('Lỗi khi cập nhật trạng thái thanh toán:', error);
    },
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Không tìm thấy đơn hàng</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue text-white rounded-md hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center mb-8">
        <button
          onClick={() => router.back()}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          Chi tiết đơn hàng #{order._id?.slice(-6)}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Order Status */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Trạng thái đơn hàng</h2>
              <div className="mt-2">
                <select
                  value={order.orderStatus}
                  onChange={(e) => updateOrderStatusMutation.mutate(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  disabled={updateOrderStatusMutation.isPending}
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="shipped">Đang giao hàng</option>
                  <option value="delivered">Đã giao hàng</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
                {updateOrderStatusMutation.isPending && (
                  <p className="mt-2 text-sm text-gray-500">Đang cập nhật trạng thái đơn hàng...</p>
                )}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Trạng thái thanh toán</h2>
              <div className="mt-2">
                <select
                  value={order.paymentStatus}
                  onChange={(e) => updatePaymentStatusMutation.mutate(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  disabled={updatePaymentStatusMutation.isPending}
                >
                  <option value="pending">Chờ thanh toán</option>
                  <option value="paid">Đã thanh toán</option>
                  <option value="failed">Thanh toán thất bại</option>
                </select>
                {updatePaymentStatusMutation.isPending && (
                  <p className="mt-2 text-sm text-gray-500">Đang cập nhật trạng thái thanh toán...</p>
                )}
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin khách hàng</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Tên khách hàng</p>
                <p className="text-base text-gray-900">{order.shippingAddress.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="text-base text-gray-900">{order.shippingAddress.phone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Địa chỉ</p>
                <p className="text-base text-gray-900">
                  {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-medium text-gray-900">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(item.price * item.quantity)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(item.price)} / sản phẩm
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Tổng cộng</h2>
              <p className="text-2xl font-bold text-gray-900">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(order.totalAmount)}
              </p>
            </div>
          </div>

          {/* Order Notes */}
          {order.note && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Ghi chú</h2>
              <p className="text-gray-600">{order.note}</p>
            </div>
          )}

          {/* Order Dates */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Ngày đặt hàng</p>
                <p className="text-base text-gray-900">{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Cập nhật lần cuối</p>
                <p className="text-base text-gray-900">{formatDate(order.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 