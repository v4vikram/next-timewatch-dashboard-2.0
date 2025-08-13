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
import { useCustomerStore } from "@/store/useCustomerStore";

const CustomerListPage = () => {
  const { customers, loading, fetchCustomers } = useCustomerStore();
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);

  console.log("customers", customers)

  const table = useReactTable({
    data: customers,
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
    fetchCustomers();
  }, []);

  return (
    <div className="p-4">
      <StaticBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Customer", href: "/dashboard/customer" },
          { label: "List", href: "/dashboard/list" },
        ]}
      />

      <div className="md:flex items-center py-4 justify-between">
        <div className="flex items-center gap-2">
          {/* <Link href={"/dashboard/products/trashed"}>
            <Trash2 />
          </Link> */}

          <h1 className="font-semibold text-lg">All Customer</h1>
          {customers.length == 0 ? (
            <span>(0)</span>
          ) : (
            <span>({customers?.length})</span>
          )}
        </div>

        <Input
          placeholder="Filter customers..."
          value={table.getColumn("name")?.getFilterValue() ?? ""}
          onChange={(event) => {
            console.log(event.target.value);
            table.getColumn("name")?.setFilterValue(event.target.value);
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

export default CustomerListPage;
