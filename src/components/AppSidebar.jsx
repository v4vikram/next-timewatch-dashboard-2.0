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

export function AppSidebar() {
  const pathname = usePathname();
  const parentPath = pathname.split("/")[2];
  const childtPath = pathname.split("/")[3]
    ? pathname.split("/")[3]
    : pathname.split("/")[2];

  const { customers, fetchCustomers } = useCustomerStore();
  const [loading, setLoading] = useState(true);

  console.log("customers", customers);

  // Track which section is open
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    fetchCustomers();
    setLoading(false);

    // auto-open based on current url
    const initialIndex = sidebarItems.findIndex(
      (group) => group.currentLink === parentPath
    );
    if (initialIndex !== -1) {
      setOpenIndex(initialIndex);
    }
  }, [parentPath]);

  function countNewCustomer(params) {
    return customers.filter((c) => c.type === "new").length;
  }
  // console.log("countNewCustomer()", countNewCustomer());

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
          childCurrentLink: "products",
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
    {
      label: "Customer",
      currentLink: "customer",
      icon: <User className="text-inherit" />,
      items: [
        // {
        //   label: "Create Customer",
        //   href: "/dashboard/products/create",
        //   icon: <Plus className="w-4" />,
        // },
        {
          label: "Customer List",
          childCurrentLink: "customer",
          href: "/dashboard/customer",
          badge: true,
          icon: <List className="w-4" />,
        },
      ],
    },
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

  return (
    <Sidebar>
      <SidebarContent className="gap-0">
        {sidebarItems.map((group, idx) => (
          <Collapsible
            key={idx}
            open={openIndex === idx}
            onOpenChange={
              () => setOpenIndex(openIndex === idx ? null : idx) // toggle
            }
            className="group/collapsible"
          >
            {/* {
              console.log("group", group, parentPath)
            } */}
            <SidebarGroup className="p-2 pb-0">
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger
                  className={`flex gap-x-1 cursor-pointer ${
                    group?.currentLink == childtPath
                      ? "bg-primary text-white"
                      : "bg-gray-200"
                  }  p-2 rounded`}
                >
                  <span className="text-inherit">{group.icon}</span>
                  <span className="text-inherit">{group.label}</span>
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 text-inherit" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>

              <CollapsibleContent className="transition-all duration-300 data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown overflow-hidden">
                {group.items.map((item, itemIdx) => (
                  <SidebarGroupContent
                    key={itemIdx}
                    className={"flex items-center justify-between"}
                  >
                    <Link
                      href={item.href}
                      className={`flex items-center gap-x-1 cursor-pointer hover:bg-muted. px-2 py-1 rounded-md my-1 ml-3 ${
                        item?.childCurrentLink === childtPath
                          ? "bg-muted. font-bold"
                          : ""
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                    {item?.badge && (
                      <Badge
                        variant="secondary"
                        className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center"
                      >
                        <span className="text-[12px] leading-[12px] relative -top-[1px]">new</span> <span>{countNewCustomer()}</span>
                      </Badge>
                    )}
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
