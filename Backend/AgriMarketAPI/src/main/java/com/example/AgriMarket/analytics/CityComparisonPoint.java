package com.example.AgriMarket.analytics;


import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CityComparisonPoint {
    private String city;
    private String marketName;
    private BigDecimal latestPrice;
    private BigDecimal averagePrice30Days;
    private BigDecimal minPrice30Days;
    private BigDecimal maxPrice30Days;
    private int reportCount;
}
