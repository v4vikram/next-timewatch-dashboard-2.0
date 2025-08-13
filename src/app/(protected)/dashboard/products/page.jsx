"use client";
import React, { useEffect, useState } from "react";
import { useProductStore } from "@/store/useProductStore";
import StaticBreadcrumb from "@/components/DynamicBreadcrumb";
import { DataTable } from "@/components/DataTable"; // adjust path
import { columns } from "./columns"; // path where you defined above columns
import {
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Trash, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ProductListPage = () => {
  const { products, loading, fetchProducts } = useProductStore();
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-4">
      <StaticBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Products", href: "/dashboard/products" },
        ]}
      />

      <div className="md:flex items-center py-4 justify-between">
        <div className="flex items-center gap-2">
          <Link href={"/dashboard/products/trashed"}>
            <Trash2 />
          </Link>

          <h1 className="font-semibold text-lg">All Products</h1>
          {products.length == 0 ? (
            <span>(0)</span>
          ) : (
            <span>({products?.length})</span>
          )}
        </div>

        <Input
          placeholder="Filter products..."
          value={table.getColumn("productName")?.getFilterValue() ?? ""}
          onChange={(event) => {
            console.log(event.target.value);
            table.getColumn("productName")?.setFilterValue(event.target.value);
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
  );
};

export default ProductListPage;
