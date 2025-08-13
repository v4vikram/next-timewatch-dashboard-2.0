import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";

// 🔍 Get wishlist
export async function fetchWishlist() {
  const res = await axiosInstance.get("/api/wishlist");
  return res.data.wishlist?.items || [];
}

// ➕ Add to wishlist
export async function addToWishlist(productId) {
  const res = await axiosInstance.post("/api/wishlist", { productId });
  return res.data;
}

// ❌ Remove from wishlist


export async function removeFromWishlist(productId) {
  try {
    const res = await axiosInstance.delete("/api/wishlist", {
      data: { productId },
    });
    toast.success("Item removed from wishlist"); // ✅ Toast inside service
    return res?.data?.data;
  } catch (err) {
    toast.error("Failed to remove item ❌"); // ✅ Toast on error
    throw err; // still throw so mutation knows it's an error
  }
}

