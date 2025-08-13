import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
  subCategoryName: String,
  subCategorySlug: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  }
}, { timestamps: true });

mongoose.models.SubCategory && delete mongoose.models.SubCategory;

export const SubCategoryModel = mongoose.model("SubCategory", subCategorySchema);
