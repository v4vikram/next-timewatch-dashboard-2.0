// models/Customer.js
import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    location: String,
    message: String,
    source: { type: String, default: "website" }, // e.g., website, chatbot
    status: {
      type: String,
      enum: ["new", "contacted", "converted", "reject"],
      default: "new",
    },
    type: {
      type: String,
      enum: ["new", "sales", "support"],
      default: "new",
    },
  },
  { timestamps: true }
);

export const CustomerModel = mongoose.models.Customer || mongoose.model("Customer", customerSchema);
