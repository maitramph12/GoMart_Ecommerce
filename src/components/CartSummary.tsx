import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { formatPrice } from '@/utils/format';

export default function CartSummary() {
  const { total } = useSelector((state: any) => state.cartReducer);

  return (
    <div className="mt-8">
      <div className="flow-root">
        <div className="border-t border-gray-200 py-6">
          <div className="flex justify-between text-base font-medium text-gray-900">
            <p>Subtotal</p>
            <p>{formatPrice(total)}</p>
          </div>
          <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
          <div className="mt-6">
            <button
              type="button"
              className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 