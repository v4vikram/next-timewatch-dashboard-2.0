"use client";

import { useEffect, useState } from "react";
import DynamicBreadcrumb from "@/components/shared/DynamicBreadcrumb";
import BlogForm from "@/features/blog/components/BlogForm";
import {useBlogStore} from "@/features/blog/store/useBlogStore";

export default function EditBlogPage({ params }) {
  const { id } = params; // 🔥 from URL
  const [blog, setBlog] = useState(null);

  const {getBlogBySlug} = useBlogStore();

  useEffect(() => {
    async function fetchBlog() {
      try {
        const data = await getBlogBySlug(id);
        // console.log("blog Data", data)
        setBlog(data?.blog);
      } catch (err) {
        console.log("Fetch blog error:", err);
      }
    }

    fetchBlog();
  }, [id]);

  return (
    <div className="p-4">
      <DynamicBreadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Blog", href: "/dashboard/blog" },
          { label: "Edit" },
        ]}
      />

      <h1 className="mb-3 font-semibold text-lg">Edit Blog</h1>

      {/* 👇 Wait for data */}
      {blog ? <BlogForm mode="edit" blog={blog} /> : <p>Loading...</p>}
    </div>
  );
}
