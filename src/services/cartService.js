import axiosInstance from "@/lib/axiosInstance";


export const fetchCart = async () => {
  const res = await axiosInstance.get("/api/cart", { withCredentials: true });
  return res?.data?.cart?.items || [];
};

export const addToCartAPI = async ({ productId, quantity }) =>
  await axiosInstance.post("/api/cart/add", { productId, quantity }, { withCredentials: true });

export const removeFromCartAPI = async (productId) =>
  await axiosInstance.post("/api/cart/remove", { productId }, { withCredentials: true });

export const clearCartAPI = async () =>
  await axiosInstance.post("/api/cart/clear", {}, { withCredentials: true });

export const updateCartQuantityAPI = async ({ productId, quantity }) =>
  await axiosInstance.post("/api/cart/update", { productId, quantity }, { withCredentials: true });
