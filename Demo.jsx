import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useProductStore } from "@/store/useProductStore";
import { Checkbox } from "@/components/ui/checkbox";

export const columns = (bulkDeleteProducts) => [
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
          src={process.env.NEXT_PUBLIC_BASE_URL_API + image}
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

      const handleDeleteProduct = async () => {
        const confirmed = window.confirm("Delete this product?");
        if (confirmed) {
          await bulkDeleteProducts([product._id]);
        }
      };

      return (
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/products/create/${product._id}`}>
            <Edit className="w-5" />
          </Link>
          <Trash2 className="w-5 cursor-pointer" onClick={handleDeleteProduct} />
        </div>
      );
    },
  },
];
