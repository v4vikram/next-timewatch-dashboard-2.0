import { create } from "zustand";
import { blogAPI } from "../api/blog.api";

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
            const result = await blogAPI.create(formData);

            set({
                loading: false,
                error: null,
                isProcessing: false,
                fetched: false,
            });

            return result;
        } catch (error) {
            set({
                loading: false,
                isProcessing: false,
                error:
                    error?.response?.data?.message ||
                    error.message ||
                    "Something went wrong",
            });

            throw error;
        }
    },

    // ✔ UPDATE BLOG
    updateBlog: async (id, formData) => {
        set({ isProcessing: true, error: null });

        try {
            const res = await blogAPI.update(id, formData);

            set({ isProcessing: false });
            return res.data;
        } catch (error) {
            const message =
                error?.response?.data?.message || "Update failed";

            set({ isProcessing: false, error: message });
            throw error;
        }
    },
    // Get All
    getAllBlog: async () => {
        set({ loading: true, error: null });

        try {
            const res = await blogAPI.list();
            console.log("all blog", res?.data)

            set({ loading: false, blogs: res?.data?.blogs });
            return res?.data;   // return the blog object
        } catch (error) {
            set({
                loading: false,
                error:
                    error?.response?.data?.message ||
                    error.message ||
                    "Failed to get blog",
            });

            throw error;
        }
    },

    getBlogBySlug: async (slug) => {
        set({ loading: true, error: null });

        try {
            const res = await blogAPI.single(slug);

            set({ loading: false });
            return res?.data;   // return the blog object
        } catch (error) {
            set({
                loading: false,
                error:
                    error?.response?.data?.message ||
                    error.message ||
                    "Failed to get blog",
            });

            throw error;
        }
    },
    deleteProduct: async (slug) => {
        set({ loading: true, error: null });

        try {
            const res = await blogAPI.single(slug);

            set({ loading: false });
            return res?.data;   // return the blog object
        } catch (error) {
            set({
                loading: false,
                error:
                    error?.response?.data?.message ||
                    error.message ||
                    "Failed to get blog",
            });

            throw error;
        }
    },




    clearCache: () => set({ fetched: false }),
}));
