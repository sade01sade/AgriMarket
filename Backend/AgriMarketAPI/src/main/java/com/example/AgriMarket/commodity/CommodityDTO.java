package com.example.AgriMarket.commodity;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommodityDTO {
    private Long id;
    private String name;
    private CommodityCategory category;
    private String unit;
    private String description;
    private boolean active;

    public static CommodityDTO from(Commodity commodity) {
        return CommodityDTO.builder()
                .id(commodity.getId())
                .name(commodity.getName())
                .category(commodity.getCategory())
                .unit(commodity.getUnit())
                .description(commodity.getDescription())
                .active(commodity.isActive())
                .build();
    }
}
