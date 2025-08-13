import { NextResponse } from "next/server";
import { dbConnect } from "@/backend/lib/db";
import { CustomerModel } from "@/backend/models/CustomerModel"; // adjust if needed

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    const body = await req.json();
    console.log("Incoming body:", body);

    const lead = await CustomerModel.findByIdAndUpdate(id, body, {
      new: true,       // returns the updated document
      runValidators: true, // ensures schema validation
    });

    if (!lead) {
      return NextResponse.json({ success: false, message: "Lead not found" }, { status: 404 });
    }

    console.log("Updated lead:", lead);
    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json({ success: false, message: "Failed to update lead", error: error.message }, { status: 500 });
  }
}
