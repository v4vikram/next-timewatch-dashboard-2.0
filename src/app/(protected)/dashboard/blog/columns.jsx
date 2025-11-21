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
import { useBlogStore } from "@/features/blog/store/useBlogStore";


function AlertDialogDelete({ blogId, children }) {
  const { products, trashProductById } = useBlogStore();
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
            onClick={() => trashProductById(blogId)}
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
    accessorKey: "title",
    header: "Blog Name",
    cell: ({ row }) => row.original.title || "-",
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => row.original.slug || "-",
  },
  {
    accessorKey: "featuredImage",
    header: "Thumbnail",
    cell: ({ row }) => {
      const image = row.original.featuredImage;
      return image ? (
        <Image
          src={`${image}`} // Ensure the URL is correct
          alt="blog"
          width={50}
          height={50}
        />
      ) : (
        "-"
      );
    },
  },
  {
    accessorKey: "mainCategory",
    header: "Category",
    cell: ({ row }) => row.original.mainCategory || "-",
  },
  {
    accessorKey: "subCategory",
    header: "Subcategory",
    cell: ({ row }) => row.original.subCategory || "-",
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
      const blog = row.original;
      return (
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/blog/create/${blog.slug}`}>
            <Edit className="w-5" />
          </Link>
          <AlertDialogDelete blogId={blog._id}>
            <Trash2 className="w-5 cursor-pointer" />
          </AlertDialogDelete>
        </div>
      );
    },
  },
];
