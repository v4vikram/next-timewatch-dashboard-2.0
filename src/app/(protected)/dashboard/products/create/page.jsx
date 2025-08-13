"use client";

import { Formik, FieldArray, Field, Form } from "formik";
import { useProductStore } from "@/store/useProductStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
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
import { toast } from "sonner";
import StaticBreadcrumb from "@/components/DynamicBreadcrumb";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function ProductForm() {
  const { createProduct, isProcessing } = useProductStore();
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState("");
  const [selectCategory, setSelectCategory] = useState("");

  const initialValues = {
    categoryName: "",
    subCategoryName: "",
    productName: "",
    productSlug: "",
    description: "",
    productImage: "",
    datasheetFile: "",
    connectionDiagramFile: "",
    userManualFile: "",
    productkeywords: "",
    features: [{ title: "", image: "" }],
    table: [{ column1: "", column2: "" }],
    status: "draft",
  };

  const handleProductCreate = async (values, { resetForm, setFieldValue }) => {
    try {
      const formData = new FormData();

      // Append simple fields
      formData.append("categoryName", values.categoryName);
      formData.append("subCategoryName", values.subCategoryName);
      formData.append("productName", values.productName);
      formData.append("description", values.description);
      formData.append("datasheetFile", values.datasheetFile);
      formData.append("connectionDiagramFile", values.connectionDiagramFile);
      formData.append("userManualFile", values.userManualFile);
      formData.append("productkeywords", values.productkeywords);
      formData.append("status", values.status);

      // Append product image
      formData.append("productImage", file);

      // Append features
      values.features.forEach((feature, index) => {
        formData.append(`features[${index}][title]`, feature.title);
        formData.append(`features[${index}][image]`, feature.image);
      });

      // Append table
      values.table.forEach((row, index) => {
        formData.append(`table[${index}][column1]`, row.column1);
        formData.append(`table[${index}][column2]`, row.column2);
      });

      // Debug log FormData
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const res = await createProduct(formData); 
      console.log("Product created:", res);

      toast.success("Product created successfully", {
        className: "success",
      });

      // Optionally reset form
      // resetForm();
    } catch (err) {
      console.error("Product creation error:", err);
      toast.error(
        `Error: ${
          err?.response?.data?.message || err.message || "Unexpected error"
        }`,
        {
          className: "error",
        }
      );
    }
  };

  // Helper to reorder list
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  return (
    <div className="p-4">
      <StaticBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Products", href: "/dashboard/products" },
          { label: "Create Product" },
        ]}
      />
      <h1 className="mb-3 font-semibold text-lg">Create Product</h1>
      <Formik
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
                  onValueChange={(val) => setFieldValue("subCategoryName", val)}
                >
                  <SelectTrigger
                    className="w-full"
                    disabled={!selectCategory ? true : false}
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
              </div>

              {/* Features array */}
              <div className="col-span-3">
                <Label>Features</Label>
                <FieldArray name="features">
                  {({ push, remove }) => (
                    <>
                      <DragDropContext
                        onDragEnd={(result) => {
                          if (!result.destination) return;
                          const items = reorder(
                            values.features,
                            result.source.index,
                            result.destination.index
                          );
                          setFieldValue("features", items);
                        }}
                      >
                        <Droppable droppableId="droppable-features">
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="space-y-3"
                            >
                              {values.features.map((feature, index) => (
                                <Draggable
                                  key={`feature-${index}`}
                                  draggableId={`feature-${index}`}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="border border-gray-300 p-3 rounded flex flex-col md:flex-row gap-2 items-center"
                                    >
                                      <span className="cursor-grab">☰</span>
                                      <Input
                                        name={`features[${index}].title`}
                                        placeholder="Title"
                                        value={feature.title}
                                        onChange={handleChange}
                                      />
                                      <Input
                                        type="file"
                                        onChange={(e) =>
                                          setFieldValue(
                                            `features[${index}].image`,
                                            e.currentTarget.files[0]
                                          )
                                        }
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
                      <Button
                        type="button"
                        className="mt-2"
                        onClick={() => push({ title: "", image: "" })}
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        Add Feature
                      </Button>
                    </>
                  )}
                </FieldArray>
              </div>

              {/* Table array */}
              <div className="col-span-3">
                <Label>Technical Table</Label>
                <FieldArray name="table">
                  {({ push, remove }) => (
                    <>
                      <DragDropContext
                        onDragEnd={(result) => {
                          const { source, destination } = result;
                          if (!destination) return;

                          const reorderedTable = [...values.table];
                          const [removed] = reorderedTable.splice(
                            source.index,
                            1
                          );
                          reorderedTable.splice(destination.index, 0, removed);

                          setFieldValue("table", reorderedTable);
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

                      <Button
                        type="button"
                        className="mt-2"
                        onClick={() => push({ column1: "", column2: "" })}
                      >
                        <Plus />
                        Add
                      </Button>
                    </>
                  )}
                </FieldArray>
              </div>
            </div>
            <div className="col-span-1 bg-gray-50 p-4 rounded-sm">
              <div>
                <Label>Product Image</Label>
                <DropzoneUploader
                  preview={preview}
                  setPreview={setPreview}
                  setFile={setFile}
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
                {isProcessing ? "Creating..." : "Create Product"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
