import axiosInstance from "@/lib/axiosInstance";


export const fetchProducts = async () => {
  const res = await axiosInstance.get("/api/products");
  return res.data.data; // Adjust based on your actual API structure
};

export const fetchProductById = async (id) => {
  const res = await axiosInstance.get(`/api/products/${id}`);
  return res.data.data;
};

export const createProductService = async (formData) => {
  const productCreateResult = await axiosInstance.post(`/product`, formData);
}

// Add other product-related API methods here if needed
