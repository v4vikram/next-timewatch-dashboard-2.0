import { dbConnect } from "@/backend/lib/db";
import { slugify } from "@/backend/lib/slugify";
import { CategoryModel } from "@/backend/models/ProductCategoryModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const { categoryName } = await req.json();

    if (!categoryName || categoryName.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Category name is required." },
        { status: 400 }
      );
    }

    const categorySlug = slugify(categoryName);

    // Optional: Prevent duplicate slugs
    const existing = await CategoryModel.findOne({ categorySlug });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Category already exists." },
        { status: 409 }
      );
    }

    const createdCategory = await CategoryModel.create({
      categoryName,
      categorySlug,
    });

    return NextResponse.json({
      success: true,
      message: "Category created successfully",
      category: createdCategory,
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

    const categories = await CategoryModel.find();

    return NextResponse.json({
      success: true,
      message: "Categories fetched successfully",
      categories,
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

    const { parentCategoryId } = await req.json();

    console.log("parentCategoryId", parentCategoryId)
    const deleted = await CategoryModel.findByIdAndDelete(parentCategoryId)
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