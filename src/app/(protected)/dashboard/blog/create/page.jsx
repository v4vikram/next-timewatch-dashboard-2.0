"use client";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";

import Editor from "@/components/Editor";
import DropzoneUploader from "@/components/DropzoneUploader";
import StaticBreadcrumb from "@/components/DynamicBreadcrumb";
import seoFriendlySlug from "@/backend/lib/seoFriendlySlug";


const productCategory = [
  {
    category: "time attendance and access control",
    subCategories: [
      "Fingerprint Devices",
      "Face Recognition Terminals",
      "Card-based Systems",
    ],
  },
  {
    category: "entrance control",
    subCategories: ["Turnstiles", "Speed Gates", "Full Height Turnstiles"],
  },
  {
    category: "parking and traffic control",
    subCategories: ["Boom Barriers", "Tyre Killers", "Parking Sensors"],
  },
  {
    category: "inspection control",
    subCategories: ["X-Ray Machines", "Metal Detectors", "Baggage Scanners"],
  },
  {
    category: "software and applications",
    subCategories: [
      "Attendance Software",
      "Visitor Management",
      "Payroll Integration",
    ],
  },
  {
    category: "ul listed em locks",
    subCategories: [
      "Standard EM Locks",
      "Waterproof EM Locks",
      "High Holding Force Locks",
    ],
  },
  {
    category: "accessories",
    subCategories: ["Exit Buttons", "Power Supplies", "Brackets & Mounts"],
  },
];

const Create = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState("");


  const initialValues = {
    title: "",
    content: "",
    description: "",
    mainCategory: "",
    subCategory: "",
    keywords: "",
    slug: "",
    status: "draft",
    featuredImage: null,
  };

  const handleSubmit = async (values, { resetForm }) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("content", values.content);
    formData.append("featuredImage", file);
    formData.append("mainCategory", values.mainCategory);
    formData.append("subCategory", values.subCategory);
    formData.append("keywords", values.keywords);
    formData.append("slug", values.slug);
    formData.append("status", values.status);

    for(let pair of formData.entries()){
       console.log(`${pair[0]}:`, pair[1]);
    }

    try {
      
    } catch (error) {
      
    }
  };

  useEffect(() => {
    const handleDragOver = (e) => e.preventDefault();
    window.addEventListener("dragover", handleDragOver);
    return () => window.removeEventListener("dragover", handleDragOver);
  }, []);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      // validationSchema={createBlogValidationSchema}
    >
      {({ values, setFieldValue }) => {
        const handleMainCategoryChange = (e) => {
          const selected = e.target.value;
          const found = productCategory.find(
            (cat) => cat.category === selected
          );
          setSubCategories(found?.subCategories || []);
          setFieldValue("mainCategory", selected);
          setFieldValue("subCategory", "");
        };

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
            <Form
              className="md:grid grid-cols-4 gap-4"
              encType="multipart/form-data"
            >
              <div className="flex flex-col gap-4 col-span-3 bg-gray-50 p-4 rounded-sm">
                <div className="mb-4">
                  <Field
                    name="title"
                    placeholder="Title"
                    className="w-full border p-2 rounded mb-0 border-border-gray"
                    value={values?.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      console.log("title", title);
                      setFieldValue("title", title);

                      const generatedSlug = seoFriendlySlug(title);
                      setFieldValue("slug", generatedSlug);
                    }}
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="text-red-500 text-sm mb-0"
                  />
                </div>

                <div>
                  <Field
                    name="description"
                    as="textarea"
                    placeholder="Description"
                    className="w-full border p-2 rounded border-border-gray"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="sticky top-0">
                  <Editor
                    name="content"
                    value={values.content}
                    onChange={(val) => setFieldValue("content", val)}
                    modules={{
                      toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ["bold", "italic", "underline", "strike"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["link", "image", "video"],
                        ["clean"],
                      ],
                    }}
                    formats={[
                      "header",
                      "bold",
                      "italic",
                      "underline",
                      "strike",
                      "list",
                      "link",
                      "image",
                      "video",
                    ]}
                    className="min-h-56"
                  />
                </div>
              </div>

              <div className="col-span-1 bg-gray-50 p-4 rounded-sm sticky top-0">
                <div className="mb-2">
                  <label className="font-semibold text-font-200">
                    Featured Image
                  </label>
                  <DropzoneUploader
                    preview={preview}
                    setPreview={setPreview}
                    setFile={setFile}
                    initalFile={file}
                  />
                </div>

                <label>Main Category</label>
                <select
                  name="mainCategory"
                  value={values.mainCategory}
                  onChange={handleMainCategoryChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Select Main Category</option>
                  {productCategory.map((cat) => (
                    <option key={cat.category} value={cat.category}>
                      {cat.category}
                    </option>
                  ))}
                </select>

                <label className="mt-4">Sub Category</label>
                <select
                  name="subCategory"
                  value={values.subCategory}
                  onChange={(e) => setFieldValue("subCategory", e.target.value)}
                  className="border p-2 rounded w-full"
                  disabled={!subCategories.length}
                >
                  <option value="">Select Sub Category</option>
                  {subCategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>

                <div className="mb-2">
                  <label className="font-semibold text-font-200">Tags</label>
                  <Field
                    name="keywords"
                    placeholder="Enter keywords (comma separated)"
                    className="w-full border border-border-gray p-2 rounded"
                  />
                </div>

                <div>
                  <label className="font-semibold text-font-200">Slug</label>
                  <Field
                    name="slug"
                    placeholder="Slug (URL-friendly)"
                    value={values.slug}
                    className="w-full border p-2 rounded border-border-gray"
                    disabled
                  />

                  <ErrorMessage
                    name="slug"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div>
                  <label className="font-semibold text-font-200">Status</label>
                  <Field
                    as="select"
                    name="status"
                    className="w-full border p-2 rounded border-border-gray"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </Field>
                  <ErrorMessage
                    name="status"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-main-gray border border-border-gray rounded mt-2 cursor-pointer"
                >
                  Create
                </button>
              </div>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
};

export default Create;
