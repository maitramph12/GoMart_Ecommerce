"use client";

import { orderService } from "@/services/orderService";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Image from "next/image";

interface OrderItem {
  _id: string;
  product: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
  };
}

const getOrderStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow text-yellow-800";
    case "processing":
      return "bg-blue text-blue-800";
    case "shipped":
      return "bg-purple text-purple-800";
    case "delivered":
      return "bg-green text-green-800";
    case "cancelled":
      return "bg-red text-red-800";
    default:
      return "bg-gray text-gray-800";
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow text-yellow-800";
    case "paid":
      return "bg-green text-green-800";
    case "failed":
      return "bg-red text-red-800";
    default:
      return "bg-gray text-gray-800";
  }
};

export default function OrdersPage() {
  const { data: orders, isLoading, error } = useQuery<any>({
    queryKey: ["userOrders"],
    queryFn: orderService.getUserOrders,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Error loading orders</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-32">
      <h1 className="text-2xl font-bold mb-6">Đơn hàng của tôi</h1>
      {orders?.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Bạn chưa có đơn hàng nào</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders?.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">
                      Đơn hàng #{order._id.slice(-6)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(order.createdAt), "dd MMMM yyyy", {
                        locale: vi,
                      })}
                    </p>
                    <p className="text-sm text-gray-500">
                      Phương thức thanh toán: {order.paymentMethod.toUpperCase()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getOrderStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {order.orderStatus}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getPaymentStatusColor(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="relative w-20 h-20">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">
                          Số lượng: {item.quantity}
                        </p>
                        <p className="text-sm text-gray-500">
                          Giá: {item.price.toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">
                        Giao đến: {order.shippingAddress.fullName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.shippingAddress.address}, {order.shippingAddress.city}
                      </p>
                      <p className="text-sm text-gray-500">
                        Mã bưu điện: {order.shippingAddress.postalCode}
                      </p>
                      <p className="text-sm text-gray-500">
                        SĐT: {order.shippingAddress.phone}
                      </p>
                      {order.note && (
                        <p className="text-sm text-gray-500 mt-2">
                          Ghi chú: {order.note}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Tổng tiền:</p>
                      <p className="text-lg font-bold">
                        {order.totalAmount.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 