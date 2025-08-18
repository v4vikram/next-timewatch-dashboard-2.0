import {
  Book,
  Box,
  Calendar,
  ChevronDown,
  Home,
  Inbox,
  List,
  Logs,
  Plus,
  Search,
  Settings,
  SquarePen,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCustomerStore } from "@/store/useCustomerStore";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";

const sidebarItems = [
  {
    label: "Products",
    currentLink: "product",
    icon: <Box className="text-inherit" />,
    items: [
      {
        label: "Create Product",
        childCurrentLink: "create",
        href: "/dashboard/products/create",
        icon: <Plus className="w-4" />,
      },
      {
        label: "Product List",
        childCurrentLink: "product",
        href: "/dashboard/products",
        icon: <List className="w-4" />,
      },
      // {
      //   label: "Create Category",
      //   childCurrentLink: "product",
      //   href: "/dashboard/products/category/create",
      //   icon: <SquarePen  className="w-4" />,
      // },
    ],
  },
  // {
  //   label: "Customer",
  //   currentLink: "customer",
  //   icon: <User className="text-inherit" />,
  //   items: [
  //     {
  //       label: "Create Product",
  //       href: "/dashboard/products/create",
  //       icon: <Plus className="w-4" />,
  //     },
  //     {
  //       label: "Customer List",
  //       childCurrentLink: "customer",
  //       href: "/dashboard/customer",
  //       icon: <List className="w-4" />,
  //     },
  //   ],
  // },
  // {
  //   label: "Blog",
  //   currentLink: "blog",
  //   icon: <Book className="text-inherit" />,
  //   items: [
  //     {
  //       label: "Create Blog",
  //       href: "/dashboard/blog/create",
  //       icon: <Plus className="w-4" />,
  //     },
  //     {
  //       label: "Blog List",
  //       childCurrentLink: "blog",
  //       href: "/dashboard/blog",
  //       icon: <List  className="w-4" />,
  //     },
  //   ],
  // },
];

export function AppSidebar() {
  const pathname = usePathname();
  const parentPath = pathname.split("/")[2];
  const childtPath = pathname.split("/")[3]
    ? pathname.split("/")[3]
    : pathname.split("/")[2];
  const { customers, fetchCustomers } = useCustomerStore();
  const [loading, setLoading] = useState(true);
  // console.log("app customer", customers);

  useEffect(() => {
    fetchCustomers();
    setLoading(false);
  }, []);
  return (
    <Sidebar>
      <SidebarContent className={"gap-0"}>
        {sidebarItems.map((group, idx) => (
          <Collapsible
            key={idx}
            defaultOpen={true}
            className="group/collapsible"
          >
            <SidebarGroup className={"p-2 pb-0"}>
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger
                  className={`flex gap-x-1 cursor-pointer ${
                    group?.currentLink == parentPath
                      ? "bg-primary text-white"
                      : "bg-gray-200"
                  }  p-2 rounded`}
                >
                  <span className="text-inherit">{group.icon}</span>
                  <span className="text-inherit">{group.label}</span>
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 text-inherit" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>

              {/* Collapsible content with transition */}
              <CollapsibleContent className="transition-all duration-300 data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown overflow-hidden">
                {group.items.map((item, itemIdx) => (
                  <SidebarGroupContent key={itemIdx}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-x-1 cursor-pointer hover:bg-muted px-2 py-1 bg-red-200. rounded-md my-1 ml-3`}
                    >
                      {item.icon}
                      <span
                        className={`${
                          item?.childCurrentLink === childtPath
                            ? "font-bold"
                            : ""
                        }`}
                      >
                        {item.label}
                      </span>
                      {!loading && item?.childCurrentLink === "customer" ? (
                        <Badge className="bg-red-500">
                          {customers?.filter((c) => c.status === "new").length}
                        </Badge>
                      ) : (
                        <Skeleton />
                      )}

                      {/* <Badge>.</Badge> */}
                    </Link>
                  </SidebarGroupContent>
                ))}
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
