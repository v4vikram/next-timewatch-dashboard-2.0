"use client";
import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useProductStore } from "@/store/useProductStore";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/getImageUrl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2 } from "lucide-react";

function AlertDialogDelete({ productId, children }) {
  const { trashProductById, reorderProducts  } = useProductStore();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            "The product will be moved to the trash."
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => trashProductById(productId)}
            className="cursor-pointer"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function TestProductMove({products}) {
  // const { products } = useProductStore();
   const { reorderProducts  } = useProductStore();
  const [groups, setGroups] = useState([]);

  // Group products by subCategoryName
  useEffect(() => {
    if (products?.length > 0) {
      const categoryOrder = [];
      const groupedObj = {};

      products.forEach((p) => {
        const key = p.subCategoryName || "Uncategorized";
        if (!groupedObj[key]) {
          groupedObj[key] = { id: key, title: key, items: [] };
          categoryOrder.push(key);
        }
        groupedObj[key].items.push({
          id: p._id,
          productName: p.productName,
          productSlug: p.productSlug,
          productImage: p.productImage,
          categoryName: p.categoryName,
          subCategoryName: p.subCategoryName,
          status: p.status,
          updatedAt: p.updatedAt,
        });
      });

      const grouped = categoryOrder.map((key) => groupedObj[key]);
      setGroups(grouped);
    }
  }, [products]);

  // Handle drag end
const onDragEnd = async (result) => {
  const { source, destination } = result;
  if (!destination) return;
  if (source.droppableId !== destination.droppableId) return;

  const updatedGroups = groups.map((group) => {
    if (group.id !== source.droppableId) return group;
    const newItems = Array.from(group.items);
    const [moved] = newItems.splice(source.index, 1);
    newItems.splice(destination.index, 0, moved);
    return { ...group, items: newItems };
  });

  setGroups(updatedGroups);

  const movedGroup = updatedGroups.find((g) => g.id === source.droppableId);

  // ⭐ Call Zustand action
  await reorderProducts(movedGroup);
};

  return (
    <div className="p-5">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-2 border-b text-left ">Thumbnail</th>
            <th className="py-2 px-2 border-b text-left ">Product Name</th>
            <th className="py-2 px-2 border-b text-left ">Slug</th>
            <th className="py-2 px-2 border-b text-left ">Category</th>
            <th className="py-2 px-2 border-b text-left ">Subcategory</th>
            <th className="py-2 px-2 border-b text-left ">Status</th>
            <th className="py-2 px-2 border-b text-left ">Updated At</th>
            <th className="py-2 px-2 border-b text-left ">Action</th>
          </tr>
        </thead>
      </table>

      <DragDropContext onDragEnd={onDragEnd}>
        {groups.map((group) => (
          <div key={group.id} className="mb-8">
            <h3 className="font-semibold mb-2 bg-gray-200 p-2">{group.title}</h3>
            <Droppable droppableId={group.id}>
              {(provided) => (
                <table
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="min-w-full border border-gray-200 rounded-md overflow-hidden"
                >
                  <tbody>
                    {group.items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${
                              snapshot.isDragging ? "bg-blue-50" : ""
                            }`}
                          >
                            {/* Thumbnail */}
                            <td className="px-4 py-2 border-b">
                              {item.productImage ? (
                                <Image
                                  src={getImageUrl(item.productImage)}
                                  alt={item.productName}
                                  width={50}
                                  height={50}
                                />
                              ) : (
                                "-"
                              )}
                            </td>

                            {/* Product Name */}
                            <td className="px-4 py-2 border-b">
                              {item.productName}
                            </td>

                            {/* Slug */}
                            <td className="px-4 py-2 border-b">
                              {item.productSlug}
                            </td>

                            {/* Category */}
                            <td className="px-4 py-2 border-b">
                              {item.categoryName}
                            </td>

                            {/* Subcategory */}
                            <td className="px-4 py-2 border-b">
                              {item.subCategoryName}
                            </td>

                            {/* Status */}
                            <td className="px-4 py-2 border-b">
                              {item.status ? (
                                <span
                                  className={`inline-block px-2 py-1 rounded text-sm ${
                                    item.status === "active"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {item.status}
                                </span>
                              ) : (
                                "-"
                              )}
                            </td>

                            {/* Updated At */}
                            <td className="px-4 py-2 border-b text-sm text-gray-500">
                              {new Date(item.updatedAt).toLocaleString(
                                "en-IN",
                                {
                                  timeZone: "Asia/Kolkata",
                                  year: "numeric",
                                  month: "short",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-2 border-b">
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/dashboard/products/create/${item.id}`}
                                >
                                  <Edit className="w-5 cursor-pointer" />
                                </Link>
                                <AlertDialogDelete productId={item.id}>
                                  <Trash2 className="w-5 cursor-pointer" />
                                </AlertDialogDelete>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </tbody>
                </table>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
}
