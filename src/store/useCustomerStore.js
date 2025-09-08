import axiosInstance from "@/lib/axiosInstance";
import { create } from "zustand"

export const useCustomerStore = create((set, get) => (
    {
        customers: [],
        loading: false,
        error: null,
        fetched: false,

        fetchCustomers: async () => {
            if (get().fetched) return;
            set({ loading: true, error: null })

            try {
                const res = await axiosInstance.get('/form/customers')
                console.log("res", res)
                set({ customers: res?.data?.customers || [], loading: false, fetched: true })
            }
            catch (error) {
                set({ error, loading: false });
            }
        },
        deleteCustomerById: async (id) => {
            try {
                const res = await axiosInstance.delete(`/form/customer/delete/${id}`)
                const updatedCustomers = get().customers.filter((c) => c._id !== id);
                set({ customers: updatedCustomers });
            } catch (error) {

            }
        },
        updateCustomer: async (id, updatedFields) => {
            try {
                const res = await axiosInstance.put(`/form/customers/${id}`, updatedFields);
                // console.log("resres", res)
                const updatedCustomer = res?.data?.customer;

                const updatedCustomers = get().customers.map((c) =>
                    c._id === id ? updatedCustomer : c
                );

                set({ customers: updatedCustomers });
            } catch (error) {
                console.error("Update failed:", error);
                set({ error, loading: false });
            }
        },
        clearCache: () => {
            set({ fetched: false }); // ← optional: to allow forced refetch
        },
    }
))