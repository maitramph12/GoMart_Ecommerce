import Image from 'next/image';
// import { useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '@/redux/features/cartSlice';
import { formatPrice } from '@/utils/format';

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  };
}

export default function CartItem({ item }: CartItemProps) {
  // const dispatch = useDispatch();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      // dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
    }
  };

  const handleRemove = () => {
    // dispatch(removeFromCart(item.id));
  };

  return (
    <div className="flex items-center py-5 border-b">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <Image
          src={item.image}
          alt={item.name}
          width={96}
          height={96}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>{item.name}</h3>
            <p className="ml-4">{formatPrice(item.price * item.quantity)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">{formatPrice(item.price)}</p>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="px-2 py-1 border rounded-l"
            >
              -
            </button>
            <span className="px-4 py-1 border-t border-b">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="px-2 py-1 border rounded-r"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
} 