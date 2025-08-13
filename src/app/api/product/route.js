import { NextResponse } from 'next/server';
import { dbConnect } from '@/backend/lib/db';
import { ProductModel } from '@/backend/models/ProductModels';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

// GET method
export async function GET() {
  try {
    await dbConnect();
    const products = await ProductModel.find({ isDeleted: false }).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, products },
      { status: 200, headers: corsHeaders() }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500, headers: corsHeaders() }
    );
  }
}

// OPTIONS preflight handler
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: corsHeaders(),
  });
}
