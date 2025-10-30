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
  const [type, setType] = useState(customer.type || "new");

  const handleChange = (value) => {
    const cleanValue = value.trim().toLowerCase();
    setType(cleanValue);
    updateCustomer(customer._id, { type: cleanValue });
  };

  return (
    <Select value={type} onValueChange={handleChange}>
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
  // console.log("customer==>", customer)
  const { updateCustomer } = useCustomerStore();
  const [type, setType] = useState(customer.type || "");

  const handleChange = (value) => {
    console.log("value", value)
    const cleanValue = value.trim().toLowerCase();
    setType(cleanValue);
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
    accessorKey: "companyName",
    header: "Company Name",
    cell: ({ row }) => row.original.companyName || "-",
  },
  {
    accessorKey: "name",
    header: "Contact Person",
    cell: ({ row }) => row.original.name || "-",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.original.email || "-",
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => row.original.phone || "-",
  },
  {
    accessorKey: "landline",
    header: "Landline",
    cell: ({ row }) => row.original.landline || "-",
  },
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ row }) => row.original.country || "-",
  },
  {
    accessorKey: "state",
    header: "State",
    cell: ({ row }) => row.original.state || "-",
  },
  {
    accessorKey: "pinCode",
    header: "Pin Code",
    cell: ({ row }) => row.original.pinCode || "-",
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => row.original.address || "-",
  },
  {
    accessorKey: "gstCertificate",
    header: "GST Certificate",
    cell: ({ row }) => {
      const file = row.original.gstCertificate;
      return file ? (
        <a
          href={file}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          View GST
        </a>
      ) : (
        "-"
      );
    },
  },
  {
    accessorKey: "panCard",
    header: "PAN Card",
    cell: ({ row }) => {
      const file = row.original.panCard;
      return file ? (
        <a
          href={file}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          View PAN
        </a>
      ) : (
        "-"
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
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
    header: "Updated At",
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
  //     const partner = row.original;
  //     return (
  //       <div className="flex items-center gap-2">
  //         <AlertDialogDelete customerId={partner._id}>
  //           <Trash2 className="w-5 cursor-pointer" />
  //         </AlertDialogDelete>
  //       </div>
  //     );
  //   },
  // },
];

