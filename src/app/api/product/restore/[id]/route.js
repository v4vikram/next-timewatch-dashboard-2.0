import { NextResponse } from "next/server";
import { ProductModel } from "@/backend/models/ProductModels";
import { dbConnect } from "@/backend/lib/db";

export async function POST(req, { params }) {
  await dbConnect();

  const { id } = params;

  try {
    const product = await ProductModel.findById(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    product.isDeleted = false;
    await product.save();

    return NextResponse.json({
      success: true,
      message: "Product restored",
      product,
    });
  } catch (error) {
    console.error("Restore Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
