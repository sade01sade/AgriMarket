package com.example.AgriMarket.analytics;


public interface AnalyticsService {
    TrendResponse getTrend(Long commodityId, Long marketId, int days);
    CityComparisonResponse compareCities(Long commodityId);
}
