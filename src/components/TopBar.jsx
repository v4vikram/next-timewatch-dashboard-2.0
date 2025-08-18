"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { SidebarTrigger } from "./ui/sidebar";
import { DialogContent } from "@radix-ui/react-dialog";
import MobileTopBar from "./MobileTopBar";

export default function TopBar() {
  const router = useRouter();

  const handleLogout = () => {
    // Perform logout logic here
    localStorage.clear("userLogin");
    console.log("Logged out");
    router.push("/");
  };

  return (
    <header className="w-full h-16 px-4 border-b flex items-center justify-between bg-white sticky top-0">
      {/* Left: Logo */}
      <div className="text-xl font-bold">
        <SidebarTrigger className="cursor-pointer" />
      </div>

      {/* Center: Menu (for future nav items) - optional */}
      <nav className="hidden md:flex space-x-4">
        {/* <a href="#" className="text-sm font-medium text-gray-700 hover:text-black">Home</a> */}
      </nav>

      {/* Right: Avatar + Hamburger */}
      <div className="flex items-center gap-2">
        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src="/avatar.jpg" alt="user" />
              <AvatarFallback><strong>A</strong></AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Hamburger for Mobile */}
       <MobileTopBar/>
      </div>
    </header>
  );
}
