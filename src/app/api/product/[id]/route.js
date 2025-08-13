import { dbConnect } from "@/backend/lib/db";
import { ProductModel } from "@/backend/models/ProductModels";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const param = await params
  console.log("param", param)
  await dbConnect();
  try {
    const product = await ProductModel.findById(param.id);
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}



