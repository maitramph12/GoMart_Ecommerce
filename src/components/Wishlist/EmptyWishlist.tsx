import React from 'react';
import Link from 'next/link';

const EmptyWishlist = () => {
  return (
    <div className="text-center py-12">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">No items in wishlist</h3>
      <p className="mt-1 text-sm text-gray-500">Start adding some items to your wishlist.</p>
      <div className="mt-6">
        <Link
          href="/shop"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
};

export default EmptyWishlist; 