import { create } from "zustand";
import axiosInstance from "@/lib/axiosInstance";

export const useBlogStore = create((set, get) => ({
  blogs: [],
  categories: [],
  subCategories: [],
  trashedProducts: [],
  loading: false,
  isProcessing: false,
  error: null,
  fetched: false,
  fetchedTrashed: false,
  createBlog: async (formData) => {
    set({ loading: true, error: null, isProcessing: true });

    try {
      const blogCreateResult = await axiosInstance.post(
        `/blog/create`,
        formData
      );
      set({
        loading: false,
        error: null,
        isProcessing: false,
        fetched: false,
      });
      return blogCreateResult;
    } catch (error) {
      set({
        loading: false,
        error:
          error?.response?.data?.message ||
          error.message ||
          "Something went wrong",
        isProcessing: false,
      });
      throw error; // optional: rethrow if you want to handle it in the UI
    }
  },

  clearCache: () => {
    set({ fetched: false }); // ← optional: to allow forced refetch
  },
}));
