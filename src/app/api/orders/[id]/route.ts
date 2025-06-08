import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

// GET /api/orders/[id] - Get a specific order
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const order = await Order.findById(params.id)
    
    if (!order) {
      return NextResponse.json(
        { message: 'Không tìm thấy đơn hàng' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { message: 'Lỗi khi lấy thông tin đơn hàng' },
      { status: 500 }
    );
  }
}

// PUT /api/orders/[id] - Update an order
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    const {
      items,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      orderStatus,
      note
    } = body;

    const order = await Order.findById(params.id);
    if (!order) {
      return NextResponse.json(
        { message: 'Không tìm thấy đơn hàng' },
        { status: 404 }
      );
    }

    // Update order fields
    if (items) order.items = items;
    if (totalAmount) order.totalAmount = totalAmount;
    if (shippingAddress) order.shippingAddress = shippingAddress;
    if (paymentMethod) order.paymentMethod = paymentMethod;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (orderStatus) order.orderStatus = orderStatus;
    if (note !== undefined) order.note = note;

    await order.save();
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { message: 'Lỗi khi cập nhật đơn hàng' },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/[id] - Delete an order
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const order = await Order.findById(params.id);
    
    if (!order) {
      return NextResponse.json(
        { message: 'Không tìm thấy đơn hàng' },
        { status: 404 }
      );
    }

    await Order.findByIdAndDelete(params.id);
    return NextResponse.json(
      { message: 'Đơn hàng đã được xóa thành công' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { message: 'Lỗi khi xóa đơn hàng' },
      { status: 500 }
    );
  }
} 