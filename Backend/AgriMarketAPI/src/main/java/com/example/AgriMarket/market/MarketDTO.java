package com.example.AgriMarket.market;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarketDTO {
    private Long id;
    private String name;
    private String city;
    private String region;
    private String description;
    private boolean active;

    public static MarketDTO from(Market market) {
        return MarketDTO.builder()
                .id(market.getId())
                .name(market.getName())
                .city(market.getCity())
                .region(market.getRegion())
                .description(market.getDescription())
                .active(market.isActive())
                .build();
    }
}
