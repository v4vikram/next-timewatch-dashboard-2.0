"use client";

import { Formik, FieldArray, Field, Form } from "formik";
import { useProductStore } from "@/store/useProductStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import StaticBreadcrumb from "@/components/DynamicBreadcrumb";

// for category

import { DataTable } from "@/components/DataTable";
import { columns } from "./columns";
import { subColumns } from "./subColumns";
import {
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import Link from "next/link";
import { Trash, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductForm() {
  const {
    categories,
    subCategories,
    createCategory,
    getCategory,
    getSubCategory,
    createSubCategory,
    deleteSubCategoryById,
    loading,
  } = useProductStore();
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data: categories,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });
  const subTable = useReactTable({
    data: subCategories,
    columns: subColumns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  const handleCategoryCreate = async (values, { resetForm, setFieldValue }) => {
    try {
      await createCategory(values);

      toast.success("Category created successfully", {
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

  useEffect(() => {
    getCategory();
    getSubCategory();
  }, []);
  console.log("categories", categories);

  return (
    <div className="p-4">
      <StaticBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Products", href: "/dashboard/products" },
          { label: "category", href: "/dashboard/products/category" },
          { label: "Create" },
        ]}
      />
      <h1 className="mb-3 font-semibold text-lg">Create Category</h1>
      <div className="bg-gray-50 p-4 rounded-sm gap-10">
        <div className="flex gap-4">
          <div className="flex-1">
            <Formik
              initialValues={{
                categoryName: "",
                categorySlug: "",
              }}
              // validationSchema={productCreateSchema}
              onSubmit={handleCategoryCreate}
            >
              {({ values, errors, touched, handleChange, setFieldValue }) => (
                <Form className="">
                  <Label>Category Name</Label>
                  <Input
                    name="categoryName"
                    value={values.categoryName}
                    onChange={handleChange}
                  />
                  <Button type="submit" className={"mt-3 cursor-pointer"}>
                    Create Category
                  </Button>
                </Form>
              )}
            </Formik>
          </div>
          <div className="flex-1">
            <Formik
              initialValues={{ parentCategoryId: "", subCategoryName: "" }}
              // validationSchema={productCreateSchema}
              onSubmit={(values, { resetForm, setFieldValue }) => {
                console.log("Sub-category values:", values);
                createSubCategory(values);
                // Handle sub-category creation logic here
                // You can call an API or update the state as needed
                toast.success("Sub-category created successfully", {
                  className: "success",
                });
              }}
            >
              {({ values, errors, touched, handleChange, setFieldValue }) => (
                <Form className="">
                  <div className="mb-3">
                    <Label>Parent Category Name</Label>
                    <Select
                      value={values.parentCategoryId}
                      onValueChange={(value) =>
                        setFieldValue("parentCategoryId", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((cat) => (
                          <SelectItem value={cat?._id} key={cat?._id}>
                            {cat?.categoryName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="">
                    <Label>Sub-Category Name</Label>
                    <Input
                      name="subCategoryName"
                      value={values.subCategoryName}
                      onChange={handleChange}
                    />
                    <Button type="submit" className={"mt-3 cursor-pointer"}>
                      Create Sub-Category
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        {/* Category section */}
        <div className="flex.">
          <div className="md:flex. items-center py-4 justify-between">
            <Input
              placeholder="Filter products..."
              value={table.getColumn("categoryName")?.getFilterValue() ?? ""}
              onChange={(event) => {
                console.log(event.target.value);
                table
                  .getColumn("categoryName")
                  ?.setFilterValue(event.target.value);
              }}
              className="md:max-w-[250px]"
            />
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-[40px]" />
                  <Skeleton className="h-10 w-[150px]" />
                  <Skeleton className="h-10 w-[100px]" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <DataTable columns={columns} table={table} />
          )}
        </div>
        {/* Sub Category section */}
        <div className="flex.">
          <div className="md:flex. items-center py-4 justify-between">
            <Input
              placeholder="Filter products..."
              value={table.getColumn("categoryName")?.getFilterValue() ?? ""}
              onChange={(event) => {
                console.log(event.target.value);
                table
                  .getColumn("categoryName")
                  ?.setFilterValue(event.target.value);
              }}
              className="md:max-w-[250px]"
            />
          </div>

          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-10 w-[40px]" />
                  <Skeleton className="h-10 w-[150px]" />
                  <Skeleton className="h-10 w-[100px]" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <DataTable columns={subColumns} table={subTable} />
          )}
        </div>
      </div>
    </div>
  );
}
