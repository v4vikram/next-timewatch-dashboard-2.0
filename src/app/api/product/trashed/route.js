import { NextResponse } from "next/server";
import { ProductModel } from "@/backend/models/ProductModels";
import {dbConnect} from "@/backend/lib/db"; // if needed



export async function GET() {
  try {
    await dbConnect();

    const trashedProducts = await ProductModel.find({ isDeleted: true }).sort({ deletedAt: -1 });

    return NextResponse.json({status: 200, success: true, products:trashedProducts });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch trashed products", error: error.message }, { status: 500 });
  }
}

