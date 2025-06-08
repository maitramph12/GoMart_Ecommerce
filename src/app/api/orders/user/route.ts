import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    console.log("hello" , token);
    
    
   
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
    

    await connectDB();
    const orders = await Order.find({ user: decoded.userId })
      .sort({ createdAt: -1 })

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json(
      { message: 'Lỗi khi lấy danh sách đơn hàng' },
      { status: 500 }
    );
  }
} 