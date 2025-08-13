"use client";
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
// import DynamicBreadcrumb from "@/components/DynamicBreadcrumb";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";

export default function DashboardLayout({ children }) {
  const [isLogged, setIsLogged] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const isLogin = localStorage.getItem("userLogin");
    setIsLogged(isLogin);
    // Only redirect if not logged in
    if (!isLogin) {
      router.push("/");
    }
  }, []);


  // 🟡 Wait for `isLogged` check before rendering
  if (isLogged === null) return null;
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="">
          
          <TopBar/>
        </div>
        {/* <div className="p-4">
          <DynamicBreadcrumb />
        </div> */}
        {children}
      </main>
    </SidebarProvider>
  );
}
