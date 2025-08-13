import { create } from "zustand";
import axiosInstance from "@/lib/axiosInstance";

export const useProductStore = create((set, get) => ({
  products: [],
  categories: [],
  subCategories: [],
  trashedProducts: [],
  loading: false,
  isProcessing: false,
  error: null,
  fetched: false,
  fetchedTrashed: false,
  createProduct: async (formData) => {
    set({ loading: true, error: null, isProcessing: true });

    try {
      const productCreateResult = await axiosInstance.post(`/product/create`, formData);
      set({
        loading: false,
        error: null,
        isProcessing: false,
        fetched: false,
      });
      return productCreateResult;
    } catch (error) {
      set({
        loading: false,
        error: error?.response?.data?.message || error.message || "Something went wrong",
        isProcessing: false,
      });
      throw error; // optional: rethrow if you want to handle it in the UI
    }
  },


  fetchProducts: async () => {
    if (get().fetched) return; // ← skip if already fetched

    set({ loading: true, error: null });

    try {
      const res = await axiosInstance.get("/product");

      set({
        products: res.data?.products || [],
        loading: false,
        fetched: true, // ✅ important: mark as fetched here!
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchProductById: async (id) => {
    try {
      const res = await axiosInstance.get(`/product/id/${id}`);
      // console.log("res", res?.data?.product)
      set({ product: res?.data?.product || [] });
      return res?.data?.product
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  trashProductById: async (id) => {
    try {
      const res = await axiosInstance.put(`/product/trashed/${id}`);
      set((state) => ({
        products: state.products.filter((p) => p._id !== id),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchTrashedProducts: async (force = false) => {
    if (!force && get().fetchedTrashed) return;

    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get("/product/trashed");
      set({
        trashedProducts: res.data?.products || [],
        loading: false,
        fetchedTrashed: false,
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },


  updateProduct: async ({ id, formData }) => {
    set({ loading: true, error: null, isProcessing: true });
    try {
      const res = await axiosInstance.put(`/product/update/${id}`, formData)
      set({ loading: true, error: null, isProcessing: false, fetched: false, });
    } catch (error) {
      console.error("Product update failed:", error.response?.data?.error || error.message);
    }
  },

  bulkDeleteProducts: async (ids) => {
    try {

      await axiosInstance.post("/product/bulk-delete", { ids });
      set((state) => ({
        // loading: false,
        fetchedTrashed: false,
        trashedProducts: state.trashedProducts.filter((p) => !ids.includes(p._id)),
      }));
    } catch (err) {
      set({ error: err.message });
    }
  },

  restoreProduct: async (id) => {
    try {
      await axiosInstance.post(`/product/restore/${id}`);
      set((state) => ({
        // optionally, re-fetch or update trashedProducts list
        trashedProducts: state.trashedProducts.filter(p => p._id !== id),
        fetchedTrashed: false,
        fetched: false,
      }));
    } catch (err) {
      set({ error: err.message });
    }
  },


  // Category
  createCategory: async (values) => {
    try {
      const res = await axiosInstance.post(`/product/category/parent`, values);
      if (res.data?.message) {
        console.log("✅ Success:", res.data.message);
      }
      await get().getCategory();
    } catch (error) {
      console.error("Category creation failed:", error.response?.data?.error || error.message);
    }
  },
  deleteCategoryById: async (parentCategoryId) => {
    // console.log("values",   values);
    try {
      const res = await axiosInstance.delete(`/product/category/parent`, {
        data: { parentCategoryId }, // ✅ Must be inside 'data'
      });
      if (res.data?.message) {
        console.log("✅ Success:", res.data.message);
      }
      await get().getCategory();
    } catch (error) {
      console.error("Category creation failed:", error.response?.data?.error || error.message);
    }
  },
  deleteSubCategoryById: async (subCategoryId) => {
    // console.log("values",   values);
    try {
      const res = await axiosInstance.delete(`/product/category/child`, {
        data: { subCategoryId }, // ✅ Must be inside 'data'
      });
      if (res.data?.message) {
        console.log("✅ Success:", res.data.message);
      }
      await get().getSubCategory();
    } catch (error) {
      console.error("Category creation failed:", error.response?.data?.error || error.message);
    }
  },
  createSubCategory: async (values) => {
    try {
      const res = await axiosInstance.post(`/product/category/child`, values);
      if (res.data?.message) {
        console.log("✅ Success:", res.data.message);
      }
      await get().getSubCategory();
    } catch (error) {
      console.error("Category creation failed:", error.response?.data?.error || error.message);
    }
  },

  getCategory: async () => {
    try {
      const res = await axiosInstance.get(`/product/category/parent`);
      set({
        categories: res?.data?.categories || [],
      });
      console.log("Categories fetched successfully");
    } catch (error) {
      console.error("Failed to fetch categories:", error.response?.data?.error || error.message);
    }
  },
  getSubCategory: async () => {
    try {
      const res = await axiosInstance.get(`/product/category/child`);
      set({
        subCategories: res?.data?.categories || [],
      });
      console.log("Categories fetched successfully");
    } catch (error) {
      console.error("Failed to fetch categories:", error.response?.data?.error || error.message);
    }
  },




  clearCache: () => {
    set({ fetched: false }); // ← optional: to allow forced refetch
  },
}));
