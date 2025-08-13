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
import { Button } from "@/components/ui/button";
import { useCustomerStore } from "@/store/useCustomerStore";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

function AlertDialogDelete({ children, customerId }) {
  const { deleteCustomerById } = useCustomerStore();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className={"cursor-pointer"}>
          {children}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete from
            database.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className={"cursor-pointer"}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteCustomerById(customerId)}
            className={"cursor-pointer"}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
function AlertDialogMessage({ children, message }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {/* <Button variant="outline" className={"cursor-pointer"}>
          {children}
        </Button> */}
        <span className={"cursor-pointer"}>{children}</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle></AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className={"cursor-pointer"}>
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const StatusSelectCell = ({ customer }) => {
  const { updateCustomer } = useCustomerStore();
  const [status, setStatus] = useState(customer.status || "new");

  const handleChange = (value) => {
    const cleanValue = value.trim().toLowerCase();
    setStatus(cleanValue);
    updateCustomer(customer._id, { status: cleanValue });
  };

  return (
    <Select value={status} onValueChange={handleChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="new">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-sm">
              new
            </span>
          </SelectItem>
          <SelectItem value="converted">
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-sm">
              converted
            </span>
          </SelectItem>
          <SelectItem value="contacted">
            <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-sm">
              contacted
            </span>
          </SelectItem>
          <SelectItem value="reject">
            <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-sm">
              reject
            </span>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
const TypeSelectCell = ({ customer }) => {
  const { updateCustomer } = useCustomerStore();
  const [type, settype] = useState(customer.type || "");

  const handleChange = (value) => {
    const cleanValue = value.trim().toLowerCase();
    settype(cleanValue);
    updateCustomer(customer._id, { type: cleanValue });
  };

  return (
    <Select value={type} onValueChange={handleChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Select Type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="new">
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-sm">
              new
            </span>
          </SelectItem>
          <SelectItem value="sales">
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-sm">
              sales
            </span>
          </SelectItem>
          <SelectItem value="support">
            <span className="bg-orange-100 text-orange-500 text-xs font-semibold px-2 py-1 rounded-sm">
              support
            </span>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export const columns = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusSelectCell customer={row.original} />,
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <TypeSelectCell customer={row.original} />,
  },
  {
    accessorKey: "name",
    header: "Customer Name",
    cell: ({ row }) => row.original.name || "-",
  },
  {
    accessorKey: "email",
    header: "Customer Email",
    cell: ({ row }) => row.original.email || "-",
  },
  {
    id: "message",
    header: "Message",
    cell: ({ row }) => {
      const message = row?.original?.message;
      return (
        <>
          <AlertDialogMessage message={message}>
            Click for Read
            {/* <Trash2 className="w-5 cursor-pointer" /> */}
          </AlertDialogMessage>
        </>
      );
    },
  },
  {
    accessorKey: "Customer Location",
    header: "location",
    cell: ({ row }) => row.original.location || "-",
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
      const customer = row.original;
      // const { updateCustomer } = useCustomerStore();
      // console.log("status", status);
      return (
        <div className="flex items-center gap-2">
          {/* <Link href={`/dashboard/customer/create/${customer._id}`}>
            <Edit className="w-5" />
          </Link> */}
          {/* <Button variant={"outline"} onClick={() => updateCustomer()}>
            Update
          </Button> */}

          <AlertDialogDelete customerId={customer._id}>
            <Trash2 className="w-5 cursor-pointer" />
          </AlertDialogDelete>
        </div>
      );
    },
  },
];
