import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/Product";
import connectDB from "@/lib/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const categoryId = params.id;

  try {
    await connectDB();

    const products = await Product.find({ category: categoryId });

    return NextResponse.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
