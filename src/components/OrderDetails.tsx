import React from 'react';
import { formatPrice } from '@/utils/format';
import Image from 'next/image';

interface OrderItem {
  product: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  _id: string;
}

interface OrderDetailsProps {
  order: {
    _id: string;
    shippingAddress: {
      fullName: string;
      address: string;
      city: string;
      postalCode: string;
      phone: string;
    };
    items: OrderItem[];
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
    orderStatus: string;
    note: string;
    createdAt: string;
  };
}

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

const OrderDetails: React.FC<OrderDetailsProps> = ({ order }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      {/* Order Header */}
      <div className="border-b pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Đơn hàng #{order._id.slice(-6)}</h2>
            <p className="text-gray-500">Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
              {order.orderStatus === 'pending' && 'Chờ xử lý'}
              {order.orderStatus === 'processing' && 'Đang xử lý'}
              {order.orderStatus === 'shipped' && 'Đang giao hàng'}
              {order.orderStatus === 'delivered' && 'Đã giao hàng'}
              {order.orderStatus === 'cancelled' && 'Đã hủy'}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
              {order.paymentStatus === 'pending' && 'Chờ thanh toán'}
              {order.paymentStatus === 'paid' && 'Đã thanh toán'}
              {order.paymentStatus === 'failed' && 'Thanh toán thất bại'}
            </span>
          </div>
        </div>
      </div>

      {/* Shipping Information */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold mb-3">Thông tin giao hàng</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Người nhận:</p>
            <p className="font-medium">{order.shippingAddress.fullName}</p>
          </div>
          <div>
            <p className="text-gray-600">Số điện thoại:</p>
            <p className="font-medium">{order.shippingAddress.phone}</p>
          </div>
          <div className="col-span-2">
            <p className="text-gray-600">Địa chỉ:</p>
            <p className="font-medium">
              {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold mb-3">Sản phẩm đã đặt</h3>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item._id} className="flex items-center gap-4">
              <div className="w-20 h-20 relative flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-gray-500">Số lượng: {item.quantity}</p>
                <p className="text-gray-500">Đơn giá: {formatPrice(item.price)}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold mb-3">Tổng quan đơn hàng</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Phương thức thanh toán:</span>
            <span className="font-medium">
              {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng'}
            </span>
          </div>
          {order.note && (
            <div className="flex justify-between">
              <span className="text-gray-600">Ghi chú:</span>
              <span className="font-medium">{order.note}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>Tổng cộng:</span>
            <span>{formatPrice(order.totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails; 