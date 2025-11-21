import axiosInstance from "@/lib/axiosInstance";

export const blogAPI = {
  create: (formData) => axiosInstance.post("/blog/create", formData),

  list: () => axiosInstance.get("/blog"),

  single: (slug) => axiosInstance.get(`/blog/slug/${slug}`),

  update: (id, data) => axiosInstance.put(`/blog/update/${id}`, data),

  remove: (id) => axiosInstance.delete(`/blog/${id}`),
};
