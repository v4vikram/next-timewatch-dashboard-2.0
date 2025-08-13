// app/api/lead/route.js
import { dbConnect } from "@/backend/lib/db";
import { CustomerModel } from "@/backend/models/CustomerModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  console.log("body!", body)

  // Explicitly apply defaults if not provided
  const leadData = {
    ...body,
    status: body.status || "new",
    type: body.type || "new",
  };

  try {
    const lead = await CustomerModel.create(leadData);
    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json({ success: false, message: "Failed to create lead", error }, { status: 500 });
  }
}
