"use client";

import { Formik, FieldArray, Field, Form } from "formik";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import DropzoneUploader from "@/components/DropzoneUploader";
import { Plus, Trash2 } from "lucide-react";
import { Categories } from "@/dummy-data";
import { productCreateSchema } from "@/validationSchema/productSchema";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getOriginalFilename } from "@/lib/stringChanges";
import StaticBreadcrumb from "@/components/DynamicBreadcrumb";
import { useProductStore } from "@/store/useProductStore";
import { toast } from "sonner";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { API_BASE_URL } from "@/lib/variable";

export default function ProductForm() {
  const { product, updateProduct, fetchProductById, isProcessing } =
    useProductStore();
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState("");
  const [selectCategory, setSelectCategory] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const { id } = useParams();
  const [editProduct, setEditProduct] = useState("");
  console.log("fetch product by id", file);

  const initialValues = {
    categoryName: editProduct?.categoryName || "",
    subCategoryName: editProduct?.subCategoryName || "",
    productName: editProduct?.productName || "",
    description: editProduct?.description || "",
    productImage: editProduct?.productImage || "",
    productSlug: editProduct?.productSlug || "",
    datasheetFile: `${editProduct?.datasheetFile}` || "",
    connectionDiagramFile: editProduct?.connectionDiagramFile || "",
    userManualFile: editProduct?.userManualFile || "",
    productkeywords: editProduct?.productkeywords || "",
    features: editProduct?.features?.length
      ? editProduct.features
      : [{ title: "", image: "" }],
    table: editProduct?.table?.length
      ? editProduct.table
      : [{ column1: "", column2: "" }],
    status: editProduct?.status || "draft",
  };

  const handleProductCreate = async (values, { resetForm, setFieldValue }) => {
    try {
      const formData = new FormData();

      // Append simple fields
      formData.append("categoryName", values.categoryName);
      formData.append("subCategoryName", values.subCategoryName);
      formData.append("productName", values.productName);
      formData.append("productSlug", values.productSlug);
      formData.append("description", values.description);
      formData.append("datasheetFile", values.datasheetFile);
      formData.append("connectionDiagramFile", values.connectionDiagramFile);
      formData.append("userManualFile", values.userManualFile);
      formData.append("productkeywords", values.productkeywords);
      formData.append("status", values.status);

      // Append product image (file)
      formData.append("productImage", file); // assuming file is from useState

      // Append features
      values.features.forEach((feature, index) => {
        formData.append(`features[${index}][title]`, feature.title);
        formData.append(`features[${index}][image]`, feature.image); // assuming File
      });

      // Append technical table rows
      values.table.forEach((row, index) => {
        formData.append(`table[${index}][column1]`, row.column1);
        formData.append(`table[${index}][column2]`, row.column2);
      });

      // Debug log FormData entries (optional, for dev)
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // API call wrapped in try-catch
      await updateProduct({ id, formData });

      toast.success("Product updated successfully!", { className: "success" });
      // resetForm(); // Uncomment if you want to clear the form after success
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error(
        err?.response?.data?.message ||
          err.message ||
          "Failed to update product",
        {
          className: "error",
        }
      );
    }
  };

  useEffect(() => {
    async function load() {
      const productUpdatedResult = await fetchProductById(id);
      console.log(productUpdatedResult);
      setEditProduct(productUpdatedResult);
      setSelectCategory(productUpdatedResult?.categoryName);
    }
    load();
  }, []);

  useEffect(() => {
    if (editProduct?.productImage) {
      setFile(`${API_BASE_URL}/${editProduct.productImage}`);
    }
  }, [editProduct]);

  return (
    <div className="p-4">
      <StaticBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Products", href: "/dashboard/products" },
          { label: "Edit Product" },
        ]}
      />
      <h1 className="mb-3 font-semibold text-lg">Edit Product</h1>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        // validationSchema={productCreateSchema}
        onSubmit={handleProductCreate}
      >
        {({ values, errors, touched, handleChange, setFieldValue }) => (
          <Form className="md:grid grid-cols-4 gap-4">
            <div className="flex flex-col md:grid grid-cols-3 gap-4 col-span-3 bg-gray-50 p-4 rounded-sm">
              <div className="col-span-3 md:col-span-2 lg:col-span-1">
                <Label>Product Name</Label>
                <Input
                  name="productName"
                  value={values.productName}
                  onChange={handleChange}
                />
              </div>

              <div className="">
                <Label>Category Name</Label>
                <Select
                  value={values.categoryName}
                  onValueChange={(val) => {
                    setFieldValue("categoryName", val);
                    setSelectCategory(val);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Categories?.map((cat) => (
                      <SelectItem
                        value={cat?.categoryName}
                        key={cat?.categoryName}
                      >
                        {cat?.categoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="">
                <Label>Sub-category Name</Label>
                <Select
                  value={values.subCategoryName}
                  onValueChange={(val) => {
                    setFieldValue("subCategoryName", val);
                    setSelectSubCategory(val);
                  }}
                >
                  <SelectTrigger
                    className="w-full"
                    disabled={selectCategory ? false : true}
                  >
                    <SelectValue placeholder="Select Sub Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Categories?.filter(
                      (cat) => cat?.categoryName == selectCategory
                    ).map((cat) =>
                      cat?.subCategories?.map((subCat) => (
                        <SelectItem value={subCat} key={subCat}>
                          {subCat}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-3">
                <Label>Description</Label>
                <Textarea
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  className={"min-h-[150px]"}
                />
              </div>

              <div className="col-span-2">
                <Label>Product Keywords</Label>
                <Input
                  name="productkeywords"
                  value={values.productkeywords}
                  onChange={handleChange}
                  placeholder="keyword seperate by ,"
                />
              </div>
              <div className="col-span-1">
                <Label>Product Slug</Label>
                <Input
                  name="productSlug"
                  value={values.productSlug}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label>Datasheet File</Label>
                <Input
                  type="file"
                  name="datasheetFile"
                  onChange={(e) => {
                    setFieldValue("datasheetFile", e.currentTarget.files[0]);
                  }}
                />
                {typeof values.datasheetFile === "string" &&
                  values.datasheetFile && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-700">Current file: </span>
                      <a
                        href={`${
                          process.env.NEXT_PUBLIC_BASE_URL_API +
                          values.datasheetFile
                        }`}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        {getOriginalFilename(
                          values.datasheetFile.split("/").pop()
                        )}
                      </a>
                    </div>
                  )}
              </div>

              <div>
                <Label>Connection Diagram File</Label>
                <Input
                  type="file"
                  name="connectionDiagramFile"
                  onChange={(e) => {
                    setFieldValue(
                      "connectionDiagramFile",
                      e.currentTarget.files[0]
                    );
                  }}
                />
                {typeof values.connectionDiagramFile === "string" &&
                  values.connectionDiagramFile && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-700">Current file: </span>
                      <a
                        href={`${
                          process.env.NEXT_PUBLIC_BASE_URL_API +
                          values.connectionDiagramFile
                        }`}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        {getOriginalFilename(
                          values.connectionDiagramFile.split("/").pop()
                        )}
                      </a>
                    </div>
                  )}
              </div>

              <div>
                <Label>User Manual File</Label>
                <Input
                  type="file"
                  name="userManualFile"
                  onChange={(e) => {
                    setFieldValue("userManualFile", e.currentTarget.files[0]);
                  }}
                />
                {typeof values.userManualFile === "string" &&
                  values.userManualFile && (
                    <div className="mt-2 text-sm">
                      <span className="text-gray-700">Current file: </span>
                      <a
                        href={`${
                          process.env.NEXT_PUBLIC_BASE_URL_API +
                          values.userManualFile
                        }`}
                        target="_blank"
                        className="text-blue-600 underline"
                      >
                        {getOriginalFilename(
                          values.userManualFile.split("/").pop()
                        )}
                      </a>
                    </div>
                  )}
              </div>

              {/* Features array with Drag-and-Drop */}
              <div className="col-span-3">
                <Label>Features</Label>
                <FieldArray name="features">
                  {({ push, remove }) => (
                    <DragDropContext
                      onDragEnd={({ source, destination }) => {
                        if (!destination) return;
                        const updated = [...values.features];
                        const [moved] = updated.splice(source.index, 1);
                        updated.splice(destination.index, 0, moved);
                        setFieldValue("features", updated);
                      }}
                    >
                      <Droppable droppableId="features-droppable">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {values.features.map((feature, index) => (
                              <Draggable
                                key={index}
                                draggableId={`features-${index}`}
                                index={index}
                              >
                                {/* {console.log("feature", feature)} */}
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="border border-gray-300 p-3 rounded flex flex-col md:flex-row gap-2 mb-3 bg-white items-center"
                                  >
                                    <span className="cursor-grab">☰</span>
                                    <Input
                                      name={`features[${index}].title`}
                                      placeholder="Title"
                                      value={feature.title}
                                      onChange={handleChange}
                                    />
                                    <Input
                                      name={`features[${index}].image`}
                                      type="file"
                                      onChange={(e) => {
                                        setFieldValue(
                                          `features[${index}].image`,
                                          e.currentTarget.files[0]
                                        );
                                      }}
                                    />
                                    {feature.image && (
                                      <div className="block w-20 h-9 rounded-full overflow-hidden relative">
                                        <Image
                                          src={
                                            typeof feature.image === "string"
                                              ? `${API_BASE_URL}/${feature.image}` // Add base URL
                                              : URL.createObjectURL(
                                                  feature.image
                                                )
                                          }
                                          alt="preview"
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                    )}

                                    <Button
                                      type="button"
                                      onClick={() => remove(index)}
                                    >
                                      <Trash2 />
                                    </Button>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  )}
                </FieldArray>
                <Button
                  type="button"
                  className="mt-2"
                  onClick={() => push({ title: "", image: "" })}
                >
                  <Plus /> Add
                </Button>
              </div>

              {/* Technical Table with Drag-and-Drop */}
              <div className="col-span-3">
                <Label>Technical Table</Label>
                <FieldArray name="table">
                  {({ push, remove }) => (
                    <DragDropContext
                      onDragEnd={({ source, destination }) => {
                        if (!destination) return;
                        const updated = [...values.table];
                        const [moved] = updated.splice(source.index, 1);
                        updated.splice(destination.index, 0, moved);
                        setFieldValue("table", updated);
                      }}
                    >
                      <Droppable droppableId="table-droppable">
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {values.table.map((row, index) => (
                              <Draggable
                                key={index}
                                draggableId={`table-${index}`}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="border border-gray-300 p-3 rounded flex flex-col md:flex-row gap-2 mb-3 bg-white items-center"
                                  >
                                    <span className="cursor-grab">☰</span>
                                    <Input
                                      name={`table[${index}].column1`}
                                      placeholder="Column 1"
                                      value={row.column1}
                                      onChange={handleChange}
                                    />
                                    <Input
                                      name={`table[${index}].column2`}
                                      placeholder="Column 2"
                                      value={row.column2}
                                      onChange={handleChange}
                                    />
                                    <Button
                                      type="button"
                                      onClick={() => remove(index)}
                                    >
                                      <Trash2 />
                                    </Button>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  )}
                </FieldArray>
                <Button
                  type="button"
                  className="mt-2"
                  onClick={() => push({ column1: "", column2: "" })}
                >
                  <Plus /> Add
                </Button>
              </div>
            </div>
            <div className="col-span-1 bg-gray-50 p-4 rounded-sm">
              <div>
                <Label>Product Image</Label>
                <DropzoneUploader
                  preview={preview}
                  setPreview={setPreview}
                  setFile={setFile}
                  initalFile={file}
                />
              </div>
              <div className="mt-3">
                <Label>Status</Label>
                <Select
                  value={values.status}
                  onValueChange={(val) => setFieldValue("status", val)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className={"mt-3 cursor-pointer"}>
                {isProcessing ? "Updating..." : "Update Product"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
