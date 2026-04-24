package com.example.AgriMarket.analytics;


import com.example.AgriMarket.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    // Price trend for a commodity in a specific market over N days
    @GetMapping("/trend")
    @PreAuthorize("hasAnyRole('FARMER', 'ADMIN', 'REPORTER')")
    public ResponseEntity<ApiResponse<TrendResponse>> getTrend(
            @RequestParam Long commodityId,
            @RequestParam Long marketId,
            @RequestParam(defaultValue = "30") int days) {

        return ResponseEntity.ok(ApiResponse.success(
                "Trend fetched",
                analyticsService.getTrend(commodityId, marketId, days)
        ));
    }

    // Compare same commodity across all cities
    @GetMapping("/compare")
    @PreAuthorize("hasAnyRole('FARMER', 'ADMIN', 'REPORTER')")
    public ResponseEntity<ApiResponse<CityComparisonResponse>> compareCities(
            @RequestParam Long commodityId) {

        return ResponseEntity.ok(ApiResponse.success(
                "City comparison fetched",
                analyticsService.compareCities(commodityId)
        ));
    }
}
