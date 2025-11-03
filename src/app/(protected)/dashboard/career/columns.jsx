"use client";

import { Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import  useCareerStore  from "@/store/useCareerStore";

function AlertDialogDelete({ children, careerId }) {
  const { deleteCareerById } = useCareerStore();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          {children}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently delete this career application from the database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteCareerById(careerId)}
            className="cursor-pointer"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const columns = [
  {
    accessorKey: "fullName",
    header: "Name",
    cell: ({ row }) => row.original.fullName || "-",
  },
  {
    accessorKey: "emailAddress",
    header: "Email",
    cell: ({ row }) => row.original.emailAddress || "-",
  },
  {
    accessorKey: "contactNumber",
    header: "Phone",
    cell: ({ row }) => row.original.contactNumber || "-",
  },
  {
    accessorKey: "roleApplyingFor",
    header: "Position",
    cell: ({ row }) => row.original.roleApplyingFor || "-",
  },
  {
    accessorKey: "coverLetter",
    header: "Cover Letter",
    cell: ({ row }) => (
      <div className="truncate max-w-[200px]" title={row.original.coverLetter}>
        {row.original.coverLetter || "-"}
      </div>
    ),
  },
  {
    accessorKey: "resume",
    header: "Resume",
    cell: ({ row }) => {
      const file = row.original.resume;
      return file ? (
        <a
          href={file}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-600 underline gap-1"
        >
          <FileText className="w-4 h-4" /> View
        </a>
      ) : (
        "-"
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Applied On",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated On",
    cell: ({ row }) => {
      const date = new Date(row.original.updatedAt);
      return date.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
  // {
  //   id: "actions",
  //   header: "Action",
  //   cell: ({ row }) => {
  //     const career = row.original;
  //     return (
  //       <div className="flex items-center gap-2">
  //         <AlertDialogDelete careerId={career._id}>
  //           <Trash2 className="w-5 h-5 text-red-600 cursor-pointer" />
  //         </AlertDialogDelete>
  //       </div>
  //     );
  //   },
  // },
];
