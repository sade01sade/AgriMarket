package com.example.AgriMarket.analytics;


import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrendResponse {
    private String commodityName;
    private String commodityUnit;
    private String marketName;
    private String marketCity;
    private List<TrendPoint> points;
}
