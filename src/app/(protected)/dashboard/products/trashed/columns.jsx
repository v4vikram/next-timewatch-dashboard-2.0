import { ColumnDef } from "@tanstack/react-table";
import { ArchiveRestore, Edit, Recycle, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { useProductStore } from "@/store/useProductStore";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/variable";
import { getImageUrl } from "@/lib/getImageUrl";

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "productName",
    header: "Product Name",
    cell: ({ row }) => row.original.productName || "-",
  },
  {
    accessorKey: "productSlug",
    header: "Slug",
    cell: ({ row }) => row.original.productSlug || "-",
  },
  {
    accessorKey: "productImage",
    header: "Thumbnail",
    cell: ({ row }) => {
      const image = row.original.productImage;
      return image ? (
        <Image
          src={getImageUrl(image)}
          alt="Product"
          width={50}
          height={50}
        />
      ) : (
        "-"
      );
    },
  },
  {
    accessorKey: "categoryName",
    header: "Category",
    cell: ({ row }) => row.original.categoryName || "-",
  },
  {
    accessorKey: "subCategoryName",
    header: "Subcategory",
    cell: ({ row }) => row.original.subCategoryName || "-",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      return status ? (
        <span
          className={`inline-block px-2 py-1 rounded text-sm ${
            status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </span>
      ) : (
        "-"
      );
    },
  },

  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const product = row.original;
      const { bulkDeleteProducts, restoreProduct } = useProductStore(); // ✅ call from hook

      const handleDeleteProduct = async () => {
        const confirmed = window.confirm("Delete this product?");
        if (confirmed) {
          await bulkDeleteProducts([product._id]); // ✅ pass as array
        }
      };

      return (
        <div className="flex items-center gap-2">
          <ArchiveRestore   onClick={() => restoreProduct(product._id)} className="cursor-pointer">Restore</ArchiveRestore>

          <Trash2
            className="w-5 cursor-pointer"
            onClick={handleDeleteProduct}
          />
        </div>
      );
    },
  },
];
