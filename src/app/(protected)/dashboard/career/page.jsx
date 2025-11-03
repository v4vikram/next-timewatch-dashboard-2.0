"use client";
import React, { useEffect, useState } from "react";
import StaticBreadcrumb from "@/components/DynamicBreadcrumb";
import { DataTable } from "@/components/DataTable"; 
import { columns } from "./columns"; // <-- define columns in same folder
import {
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import useCareerStore from "@/store/useCareerStore"; // ✅ Import your Zustand store

const CareerListPage = () => {
  const { careers, loading, fetchCareers } = useCareerStore();
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  console.log("careers", careers)

  const table = useReactTable({
    data: careers,
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
    fetchCareers(); // ✅ Fetch careers on mount
  }, [fetchCareers]);

  return (
    <div className="p-4">
      <StaticBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Career", href: "/dashboard/career" },
          { label: "List", href: "/dashboard/career/list" },
        ]}
      />

      <div className="md:flex items-center py-4 justify-between">
        <div className="flex items-center gap-2">
          <h1 className="font-semibold text-lg">All Career Applications</h1>
          {careers.length === 0 ? (
            <span>(0)</span>
          ) : (
            <span>({careers.length})</span>
          )}
        </div>

        <Input
          placeholder="Filter by name..."
          value={table.getColumn("name")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
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

export default CareerListPage;
