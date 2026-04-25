import api from "./axios";

export const submitPrice = (data) => api.post("/prices", data);
export const getMyReports = () => api.get("/prices/my-reports");
export const getApprovedPrices = (params) => api.get("/prices", { params });
export const getModerationQueue = () => api.get("/prices/moderation-queue");
export const moderateReport = (id, data) => api.patch(`/prices/${id}/moderate`, data);