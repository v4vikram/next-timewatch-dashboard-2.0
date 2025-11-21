"use client";
import StaticBreadcrumb from "@/components/DynamicBreadcrumb";
import BlogForm from "@/features/blog/components/BlogForm";

export default function CreateBlogPage() {
  return (
    <div className="p-4">
      <StaticBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "blog", href: "/dashboard/blog" },
          { label: "Create" },
        ]}
      />
      <h1 className="mb-3 font-semibold text-lg">Create Blog</h1>
      <BlogForm mode="create"/>
    </div>
  );
}
