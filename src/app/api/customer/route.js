// app/api/customer/route.js
import { dbConnect } from "@/backend/lib/db";
import { CustomerModel } from "@/backend/models/CustomerModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const customers = await CustomerModel.find({})
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      customers,
    });
  } catch (error) {
    console.error("Get Customers Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}
