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

const TrashProductListPage = () => {
  const { trashedProducts, loading, fetchTrashedProducts } = useProductStore();
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);

  console.log("trashedProducts", trashedProducts);

  const table = useReactTable({
    data: trashedProducts,
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
    fetchTrashedProducts();
  }, []);

  

  return (
    <div className="p-4">
      <StaticBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Products", href: "/dashboard/products" },
          { label: "Trashed", href: "/dashboard/products/Trashed" },
        ]}
      />

      <div className="md:flex items-center py-4 justify-between">
        <div className="flex items-center gap-2">
           <h1 className="font-semibold text-lg">Trash Products</h1>
          {trashedProducts?.length == 0 ? (
            <span>(0)</span>
          ) : (
            <span>({trashedProducts?.length})</span>
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
        <p>Loading products...</p>
      ) : (
        <DataTable columns={columns} table={table} />
      )}
    </div>
  );
};

export default TrashProductListPage;
