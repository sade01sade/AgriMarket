import api from "./axios";

export const getAllCommodities = () => api.get("/commodities");
export const getCommodityById = (id) => api.get(`/commodities/${id}`);
export const createCommodity = (data) => api.post("/commodities", data);
export const updateCommodity = (id, data) => api.put(`/commodities/${id}`, data);
export const deactivateCommodity = (id) => api.delete(`/commodities/${id}`);