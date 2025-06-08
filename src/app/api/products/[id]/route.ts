import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import mongoose from 'mongoose';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { message: 'ID sản phẩm không hợp lệ' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find product by ID and populate category
    const product = await Product.findById(params.id).populate('category');

    if (!product) {
      return NextResponse.json(
        { message: 'Không tìm thấy sản phẩm' },
        { status: 404 }
      );
    }

    // Convert to plain object and format the response
    const productData = {
      id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      discountedPrice: product.discountedPrice,
      images: product.images,
      category: product.category,
      stock: product.stock,
      slug: product.slug,
      isActive: product.isActive,
      reviews: product.reviews,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    };

    return NextResponse.json(productData);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { message: 'Lỗi khi lấy thông tin sản phẩm' },
      { status: 500 }
    );
  }
}