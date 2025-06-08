import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import connectDB from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { orderStatus } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: 'ID đơn hàng không hợp lệ' },
        { status: 400 }
      );
    }

    if (!orderStatus) {
      return NextResponse.json(
        { message: 'Trạng thái đơn hàng không được để trống' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(orderStatus)) {
      return NextResponse.json(
        { message: 'Trạng thái đơn hàng không hợp lệ' },
        { status: 400 }
      );
    }

    const db = await connectDB();
    const result = await db.collection('orders').updateOne(
      { _id: new ObjectId(id) },
      { $set: { orderStatus } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'Không tìm thấy đơn hàng' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Cập nhật trạng thái đơn hàng thành công' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
    return NextResponse.json(
      { message: 'Lỗi server khi cập nhật trạng thái đơn hàng' },
      { status: 500 }
    );
  }
} 