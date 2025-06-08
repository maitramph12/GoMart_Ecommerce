import Image from 'next/image';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '@/redux/features/cart-slice';
import { formatPrice } from '@/utils/format';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
    slug: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addItemToCart({
      ...addItemToCart,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
    }));
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden">
      <Link href={`/products/${product.slug}`}>
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
          <Image
            src={product.images[0]}
            alt={product.name}
            width={500}
            height={500}
            className="h-full w-full object-cover object-center group-hover:opacity-75"
          />
        </div>
      </Link>
      <div className="p-4">
        <h3 className="text-sm text-gray-700">
          <Link href={`/products/${product.slug}`}>
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-lg font-medium text-gray-900">
          {formatPrice(product.price)}
        </p>
        <button
          onClick={handleAddToCart}
          className="mt-2 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
} 