"use client";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import { useBlogStore } from "../store/useBlogStore";
import ImageUploader from "@/components/shared/ImageUploader";
import BlogEditor from "./BlogEditor";
import { useState, useEffect } from "react";
import { blogCategories } from "../utils/blogCategories";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { blogSchema } from "../validations/blog.schema";
import toast from "react-hot-toast";
import { generateWithAI } from "../utils/generateWithAI";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, Trash2 } from "lucide-react";

export default function BlogForm({ mode = "create", blog = null }) {
  const [aiLoading, setAiLoading] = useState(false);
  const [promt, setPromt] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const { createBlog, updateBlog, loading } = useBlogStore();

  // ---------- INITIAL VALUES ----------
  const initialValues = {
    title: blog?.title || "",
    content: blog?.content || "",
    description: blog?.description || "",
    mainCategory: blog?.mainCategory || "",
    subCategory: blog?.subCategory || "",
    keywords: blog?.keywords || "",
    slug: blog?.slug || "",
    status: blog?.status || "draft",
    featuredImage: blog?.featuredImage || null,
    metaTitle: blog?.metaTitle || "",
    faq: blog?.faq || [],
  };

  console.log("blog?.faq", blog?.faq);

  // ---------- SET SUBCATEGORIES WHEN EDITING ----------
  useEffect(() => {
    if (blog?.mainCategory) {
      const found = blogCategories.find(
        (cat) => cat.category === blog.mainCategory
      );
      setSubCategories(found?.subCategories || []);
    }
  }, [blog]);

  // ---------- SUBMIT HANDLER ----------
  const handleSubmit = async (values) => {
    console.log("values", values);
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        // console.log("key",key, values[key]);

        if (values[key]) formData.append(key, values[key]);
      });

      // Append product faq
      values.faq.forEach((row, index) => {
        // console.log(row,index,"==>")
        formData.append(`faq[${index}][column1]`, row.column1);
        formData.append(`faq[${index}][column2]`, row.column2);
      });

      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      // CREATE
      if (mode === "create") {
        const res = await createBlog(formData);
        toast.success("Blog created successfully!");
      }

      // UPDATE
      if (mode === "edit") {
        // console.log("blog", blog)
        const res = await updateBlog(blog._id, formData);
        toast.success("Blog updated successfully!");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  // ---------- MAIN UI ----------
  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={blogSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, handleChange }) => {
        // category
        const handleMainCategoryChange = (e) => {
          const selected = e.target.value;
          const found = blogCategories.find((cat) => cat.category === selected);
          setSubCategories(found?.subCategories || []);
          setFieldValue("mainCategory", selected);
          setFieldValue("subCategory", "");
        };

        return (
          <Form className="md:grid grid-cols-4 gap-4">
            {/* LEFT SIDE */}
            <div className="col-span-3 bg-gray-50 p-4 rounded-sm flex flex-col gap-4">
              {/* TITLE + SLUG */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label>Title</Label>
                  <Field
                    as={Input}
                    name="title"
                    placeholder="Enter blog title"
                    onChange={(e) => {
                      const title = e.target.value;
                      setFieldValue("title", title);
                      if (mode === "create") {
                        setFieldValue(
                          "slug",
                          title.toLowerCase().replace(/\s+/g, "-")
                        );
                      }
                    }}
                  />
                </div>

                <div className="flex-1">
                  <Label>Slug</Label>
                  <Field as={Input} name="slug" placeholder="auto-generated" />
                </div>
              </div>

              <div className="flex gap-4">
                {/* Tags */}
                <div className="flex-1">
                  <Label>Tags</Label>
                  <Field
                    as={Input}
                    name="keywords"
                    placeholder="Enter keywords"
                  />
                </div>
                <div className="flex-1">
                  <Label>Meta Title</Label>
                  <Field
                    as={Input}
                    name="metaTitle"
                    placeholder="Enter Meta Title"
                  />
                </div>
              </div>

              {/* SEO Description */}
              <div>
                <Label>Description (SEO)</Label>
                <Field
                  name="description"
                  as="textarea"
                  className="w-full border p-2 rounded"
                />
              </div>

              {/* AI Generated Content */}
              <div className="mb-4">
                <Field
                  as="textarea"
                  name="promt"
                  placeholder="Write a prompt for your AI-generated blog…"
                  onChange={(e) => {
                    setPromt(e.target.value);
                  }}
                  className="w-full border p-2 rounded mb-0 border-border-gray"
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    onClick={async () => {
                      const result = await generateWithAI(promt, setAiLoading);
                      setFieldValue("content", result.html);
                      console.log("aiBlog", result);
                    }}
                    className="px-3 py-2 bg-blue-600 text-white rounded"
                    disabled={aiLoading}
                  >
                    {aiLoading ? "Generating..." : "Generate Content With AI"}
                  </Button>

                  <Button
                    type="button"
                    onClick={() => {
                      // quick clear AI content
                      setFieldValue("content", "");

                      toast.success("Cleared AI content");
                    }}
                  >
                    Clear AI Content
                  </Button>
                </div>
              </div>

              {/* EDITOR */}
              <div className="blog-editor-container">
                <BlogEditor
                  value={values.content}
                  onChange={(html) => setFieldValue("content", html)}
                />
              </div>

              {/* Blog faq */}
              <div className="mt-14">
                <Label>Blog FAQ</Label>
                <FieldArray name="faq">
                  {({ push, remove }) => (
                    <>
                      <DragDropContext
                      // onDragEnd={(result) => {
                      //   const { source, destination } = result;
                      //   if (!destination) return;

                      //   const reorderedTable = [...values.faq];
                      //   const [removed] = reorderedTable.splice(
                      //     source.index,
                      //     1
                      //   );
                      //   reorderedTable.splice(destination.index, 0, removed);

                      //   setFieldValue("faq", reorderedTable);
                      // }}
                      >
                        <Droppable droppableId="table-droppable">
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              {values.faq.map((row, index) => (
                                <Draggable
                                  key={index}
                                  draggableId={`faq-${index}`}
                                  index={index}
                                >
                                  {/* {
                                    console.log("row", row)
                                  } */}
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="border border-gray-300 p-3 rounded flex flex-col md:flex-row gap-2 mb-3 bg-white items-center"
                                    >
                                      <span className="cursor-grab">☰</span>
                                      <Input
                                        name={`faq[${index}].column1`}
                                        placeholder="Column 1"
                                        value={row.column1}
                                        onChange={handleChange}
                                      />
                                      <Input
                                        name={`faq[${index}].column2`}
                                        placeholder="Column 2"
                                        value={row.column2}
                                        onChange={handleChange}
                                      />
                                      <Button
                                        type="button"
                                        onClick={() => remove(index)}
                                      >
                                        <Trash2 />
                                      </Button>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>

                      <Button
                        type="button"
                        className="mt-2"
                        onClick={() => push({ column1: "", column2: "" })}
                      >
                        <Plus />
                        Add
                      </Button>
                    </>
                  )}
                </FieldArray>
              </div>

              {/* SEO jsonLd */}
              <div>
                <Label>json Ld (SEO)</Label>
                <Field
                  name="jsonLd"
                  as="textarea"
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="col-span-1 bg-gray-50 p-4 rounded-sm sticky top-0">
              {/* FEATURE IMAGE */}
              <Label>Feature Image</Label>
              <ImageUploader
                value={values.featuredImage}
                defaultImage={blog?.featuredImage || null}
                onChange={(file) => setFieldValue("featuredImage", file)}
              />

              {/* Main Category */}
              <div>
                <Label>Main Category</Label>
                <select
                  value={values.mainCategory}
                  onChange={handleMainCategoryChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Select</option>
                  {blogCategories.map((cat) => (
                    <option key={cat.category} value={cat.category}>
                      {cat.category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub Category */}
              <div>
                <Label>Sub Category</Label>
                <select
                  value={values.subCategory}
                  onChange={(e) => setFieldValue("subCategory", e.target.value)}
                  className="border p-2 rounded w-full"
                  disabled={!subCategories.length}
                >
                  <option value="">Select</option>
                  {subCategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              {/* STATUS */}
              <Label>Status</Label>
              <Field
                as="select"
                name="status"
                className="border p-2 rounded w-full"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Field>

              {/* BUTTON */}
              <Button type="submit" disabled={loading} className="w-full mt-4">
                {loading
                  ? mode === "create"
                    ? "Creating..."
                    : "Updating..."
                  : mode === "create"
                  ? "Create Blog"
                  : "Update Blog"}
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
