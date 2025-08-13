import { NextResponse } from "next/server";
import { ProductModel } from "@/backend/models/ProductModels";
import {dbConnect} from "@/backend/lib/db"; // if needed

export async function PUT(req, { params }) {
  try {
    await dbConnect(); // if you're using a DB connection file

    const { id } = params;

    const product = await ProductModel.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Moved to trash", product });
  } catch (error) {
    return NextResponse.json({ message: "Failed to trash product", error: error.message }, { status: 500 });
  }
}



export async function GET() {
  try {
    await connectDB();

    const trashedProducts = await ProductModel.find({ isDeleted: true }).sort({ deletedAt: -1 });

    return NextResponse.json(trashedProducts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch trashed products", error: error.message }, { status: 500 });
  }
}

