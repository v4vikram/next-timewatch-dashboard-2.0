import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useProductStore } from "@/store/useProductStore";
import { Checkbox } from "@/components/ui/checkbox";

function AlertDialogDelete({ categoryId, children }) {
  const { products, trashProductById, deleteCategoryById } = useProductStore();
  console.log("categoryId", categoryId);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className={"flex items-center"}>
            <span>"The product will be moved to the trash."</span>
            {/* <Trash2 className="text-red-500"/> */}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className={"cursor-pointer"}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteCategoryById(categoryId)}
            className={"cursor-pointer"}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const columns = [
  {
    accessorKey: "categoryName",
    header: "Category",
    cell: ({ row }) => row.original.categoryName || "-",
  },

  {
    accessorKey: "categorySlug",
    header: "Slug",
    cell: ({ row }) => row.original.categorySlug || "-",
  },

  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      const date = new Date(row.original.updatedAt);
      return date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata", // optional, for IST
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          {/* <Link href={`/dashboard/products/create/${product._id}`}>
            <Edit className="w-5" />
          </Link> */}
          {console.log("row.original", row.original)}
          <AlertDialogDelete categoryId={row.original._id}>
            <Trash2 className="w-5 cursor-pointer" />
          </AlertDialogDelete>
        </div>
      );
    },
  },
];
