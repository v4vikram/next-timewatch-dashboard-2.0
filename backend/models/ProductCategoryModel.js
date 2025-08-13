import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  categoryName: String,
  categorySlug: String
}, { timestamps: true });

mongoose.models.Category && delete mongoose.models.Category;

export const CategoryModel = mongoose.model("Category", categorySchema);
