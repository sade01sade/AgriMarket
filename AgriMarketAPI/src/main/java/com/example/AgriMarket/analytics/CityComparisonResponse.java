package com.example.AgriMarket.analytics;


import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CityComparisonResponse {
    private String commodityName;
    private String commodityUnit;
    private List<CityComparisonPoint> cities;
}
