import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await connectDB();
    
    // Check if connection is successful
    if (db.connection.readyState === 1) {
      return NextResponse.json({
        status: 'success',
        message: 'Database connection is successful',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        status: 'error',
        message: 'Database connection is not ready',
        state: db.connection.readyState
      }, { status: 503 });
    }
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message
    }, { status: 500 });
  }
} 