"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-background">
      <AlertCircle className="text-destructive mb-4 w-12 h-12" />
      <h1 className="text-4xl font-bold mb-2">Page Not Found</h1>
      <p className="text-muted-foreground mb-6">
        Sorry, the page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link href="/dashboard">
        <Button variant="default">Go to Dashboard   </Button>
      </Link>
    </div>
  );
}
