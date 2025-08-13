import { NextResponse } from "next/server";
import { saveUploadedFile } from "@/lib/uploadFile";
import { dbConnect } from "@/backend/lib/db";
import { ProductModel } from "@/backend/models/ProductModels";

export async function POST(req) {
  await dbConnect()
  try {
    const formData = await req.formData();



    const product = {
      categoryName: formData.get("categoryName"),
      subCategoryName: formData.get("subCategoryName"),
      productName: formData.get("productName"),
      productSlug: formData.get("productSlug"),
      description: formData.get("description"),
      datasheetFile: null,
      connectionDiagramFile: null,
      userManualFile: null,
      productkeywords: formData.get("productkeywords"),
      status: formData.get("status"),
      features: [],
      table: [],
    };



    const productImage = formData.get("productImage");
    const datasheetFile = formData.get("datasheetFile");
    const connectionDiagramFile = formData.get("connectionDiagramFile");
    const userManualFile = formData.get("userManualFile");

    // Save datasheet
    if (datasheetFile && datasheetFile.name) {
      product.datasheetFile = await saveUploadedFile(datasheetFile, ["uploads", "docs", "datasheet"]);
    }

    // Save user manual
    if (userManualFile && userManualFile.name) {
      product.userManualFile = await saveUploadedFile(userManualFile, ["uploads", "docs", "user-manual"]);
    }

    // Save diagram
    if (connectionDiagramFile && connectionDiagramFile.name) {
      product.connectionDiagramFile = await saveUploadedFile(connectionDiagramFile, ["uploads", "docs", "diagram"]);
    }

    // Save product image
    if (productImage && productImage.name) {
      const fileUrl = await saveUploadedFile(productImage, ["uploads", "products"]);
      product.productImage = fileUrl;
    }

    // Handle features[]
    let index = 0;
    while (formData.has(`features[${index}][title]`)) {
      const title = formData.get(`features[${index}][title]`);
      const image = formData.get(`features[${index}][image]`);
      let fileUrl = "";

      if (image && image.name) {
        fileUrl = await saveUploadedFile(image, ["uploads", "features"]);
      }

      product.features.push({ title, image: fileUrl });
      index++;
    }

    // Handle table[]
    index = 0;
    while (formData.has(`table[${index}][column1]`)) {
      const col1 = formData.get(`table[${index}][column1]`);
      const col2 = formData.get(`table[${index}][column2]`);
      product.table.push({ column1: col1, column2: col2 });
      index++;
    }


    console.log("🟡 Before saving:", product); // status should show here

    const productCreated = await ProductModel.create(product);
    console.log("✅ After saving:", productCreated); // status should show here too

    return NextResponse.json({ success: true, product: productCreated });
  } catch (error) {
    console.error("❌ Error in POST handler:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

