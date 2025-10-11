"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useProductStore } from "@/store/useProductStore";
import StaticBreadcrumb from "@/components/DynamicBreadcrumb";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Trash2, X } from "lucide-react";
import TestProductMove from "@/components/TestProductMove";

const ProductListPage = () => {
  const { products, loading, fetchProducts } = useProductStore();
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on productName
  const filteredProducts = useMemo(() => {
    if (!filterText) return products;
    return products.filter((product) =>
      product.productName?.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [products, filterText]);

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
          <span>({filteredProducts?.length || 0})</span>
        </div>

 <div className="relative md:max-w-[250px]">
  <Input
    placeholder="Filter products..."
    value={filterText}
    onChange={(e) => setFilterText(e.target.value)}
    className="pr-8" // add right padding for icon
  />
  {filterText && (
    <X
      className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
      size={16}
      onClick={() => setFilterText("")}
    />
  )}
</div>

      </div>

      {/* Pass filtered products to TestProductMove */}
      <TestProductMove products={filteredProducts} />
    </div>
  );
};

export default ProductListPage;
