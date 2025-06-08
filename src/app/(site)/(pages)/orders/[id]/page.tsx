'use client';

import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import OrderDetails from '@/components/OrderDetails';
import OrderItems from '@/components/OrderItems';
import OrderProductCards from '@/components/OrderProductCards';
import OrderStatusManager from '@/components/OrderStatusManager';
import { useParams } from 'next/navigation';

export default function OrderPage() {
  const params = useParams();
  const orderId = params?.id as string;

  if (!orderId) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Không tìm thấy thông tin đơn hàng.</p>
          </div>
        </div>
      </div>
    );
  }

  const { data: order, isPending, error } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getById(orderId),
  });

  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {order && (
          <>
            <OrderDetails order={order} />
            <OrderStatusManager
              orderId={order._id}
              currentOrderStatus={order.orderStatus}
              currentPaymentStatus={order.paymentStatus}
            />
            <OrderItems items={order.items} />
            <OrderProductCards items={order.items} />
          </>
        )}
      </div>
    </div>
  );
} 