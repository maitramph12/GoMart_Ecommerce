import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import connectDB from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { orderStatus, paymentStatus } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: 'ID đơn hàng không hợp lệ' },
        { status: 400 }
      );
    }

    if (!orderStatus && !paymentStatus) {
      return NextResponse.json(
        { message: 'Cần cung cấp ít nhất một trạng thái để cập nhật' },
        { status: 400 }
      );
    }

    const { db } = await connectDB();
    const updateData: any = {};

    if (orderStatus) {
      updateData.orderStatus = orderStatus;
    }

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    const result = await db.collection('orders').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'Không tìm thấy đơn hàng' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Cập nhật trạng thái thành công' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Lỗi khi cập nhật trạng thái đơn hàng:', error);
    return NextResponse.json(
      { message: 'Lỗi server khi cập nhật trạng thái' },
      { status: 500 }
    );
  }
} 