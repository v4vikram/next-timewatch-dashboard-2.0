// app/api/customer/[id]/route.js
import { dbConnect } from "@/backend/lib/db";
import { CustomerModel } from "@/backend/models/CustomerModel";
import { NextResponse } from "next/server";

export async function DELETE(_, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    const deleted = await CustomerModel.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error("Customer delete error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
