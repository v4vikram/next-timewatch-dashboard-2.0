import { create } from "zustand";
import axiosInstance from "@/lib/axiosInstance";

const useCareerStore = create((set) => ({
  loading: false,
  careers: [],

  // ✅ CREATE career
  CareerCreate: async (formData) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.post("/form/career", formData);
      set({ loading: false });
      return res.data;
    } catch (error) {
      set({ loading: false });
      console.error("Career create error:", error);
      throw error;
    }
  },

  // ✅ FETCH all careers
  fetchCareers: async () => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get("/form/career");
      set({ careers: res.data?.data, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error("Fetch careers error:", error);
    }
  },
}));

export default useCareerStore;
