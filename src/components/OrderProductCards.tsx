import React from 'react';
import Image from 'next/image';
import { formatPrice } from '@/utils/format';

interface OrderItem {
  product: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  _id: string;
}

interface OrderProductCardsProps {
  items: OrderItem[];
}

const OrderProductCards: React.FC<OrderProductCardsProps> = ({ items }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết sản phẩm đã đặt</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item._id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-48 w-full">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="p-4">
              <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">{item.name}</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Mã sản phẩm:</span>
                  <span className="font-medium">{item.product.slice(-6)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Đơn giá:</span>
                  <span className="font-medium">{formatPrice(item.price)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Số lượng:</span>
                  <span className="font-medium">{item.quantity}</span>
                </div>
                
                <div className="flex justify-between text-gray-900 font-medium pt-2 border-t">
                  <span>Thành tiền:</span>
                  <span className="text-blue-600">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-gray-900">Tổng số sản phẩm:</span>
          <span className="text-lg font-medium text-gray-900">{items.length} sản phẩm</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-lg font-medium text-gray-900">Tổng số lượng:</span>
          <span className="text-lg font-medium text-gray-900">
            {items.reduce((total, item) => total + item.quantity, 0)} sản phẩm
          </span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xl font-bold text-gray-900">Tổng tiền:</span>
          <span className="text-xl font-bold text-blue-600">
            {formatPrice(items.reduce((total, item) => total + item.price * item.quantity, 0))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderProductCards; 