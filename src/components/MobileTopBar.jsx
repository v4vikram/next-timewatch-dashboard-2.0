"use client";

import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MobileTopBar() {
  const router = useRouter();

  const handleLogout = () => {
    // logout logic here
    console.log("Logout");
  };

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="ghost">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent side="right">
          <div className="mt-4 space-y-4">
            <button
              onClick={() => router.push("/profile")}
              className="w-full text-left text-sm font-medium"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left text-sm font-medium text-red-600"
            >
              Logout
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
