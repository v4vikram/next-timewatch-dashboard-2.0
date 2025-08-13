import { NextResponse } from "next/server";
import { dbConnect } from "@/backend/lib/db";
import { ProductModel } from "@/backend/models/ProductModels";

export async function POST(req) {
  try {
    await dbConnect();

    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid IDs" }, { status: 400 });
    }

    const result = await ProductModel.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Permanent delete error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
