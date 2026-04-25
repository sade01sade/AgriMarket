import api from "./axios";

export const getTrend = (commodityId, marketId, days = 30) =>
  api.get("/analytics/trend", { params: { commodityId, marketId, days } });

export const compareCities = (commodityId) =>
  api.get("/analytics/compare", { params: { commodityId } });