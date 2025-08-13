import { dbConnect } from "@/backend/lib/db";
import { slugify } from "@/backend/lib/slugify";
import { SubCategoryModel } from "@/backend/models/ProdcutSubCategoryModel";
import { CategoryModel } from "@/backend/models/ProductCategoryModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const { parentCategoryId, subCategoryName } = await req.json();

    if (!parentCategoryId || !subCategoryName) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const category = await CategoryModel.findById(parentCategoryId);
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    const subCategory = await SubCategoryModel.create({
      subCategoryName,
      subCategorySlug: slugify(subCategoryName),
      category: parentCategoryId,
    });

    return NextResponse.json({
      success: true,
      message: "Subcategory created successfully",
      subCategory,
    });
  } catch (error) {
    console.error("❌ Error in POST handler:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const categories = await SubCategoryModel.find().populate("category", "categoryName");
    const formatted = categories.map(sub => ({
  _id: sub._id,
  subCategoryName: sub.subCategoryName,
  subCategorySlug: sub.subCategorySlug,
  categoryName: sub.category?.categoryName || "Unknown"
}));

    return NextResponse.json({
      success: true,
      message: "Categories fetched successfully",
      categories:formatted,
    });
  } catch (error) {
    console.error("❌ Error in GET handler:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    // console.log("await req.json()", await req.json())

    const { subCategoryId } = await req.json();

    console.log("subCategoryId", subCategoryId)
    const deleted = await SubCategoryModel.findByIdAndDelete(subCategoryId)
    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });


  } catch (error) {
    console.error("❌ Error deleting category:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
