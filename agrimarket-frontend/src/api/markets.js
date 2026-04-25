import api from "./axios";

export const getAllMarkets = () => api.get("/markets");
export const getMarketById = (id) => api.get(`/markets/${id}`);
export const getMarketsByCity = (city) => api.get(`/markets/city/${city}`);
export const createMarket = (data) => api.post("/markets", data);
export const updateMarket = (id, data) => api.put(`/markets/${id}`, data);
export const deactivateMarket = (id) => api.delete(`/markets/${id}`);