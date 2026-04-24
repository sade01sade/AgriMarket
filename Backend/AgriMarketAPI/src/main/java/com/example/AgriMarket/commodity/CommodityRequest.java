package com.example.AgriMarket.commodity;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class CommodityRequest {

    @NotBlank(message = "Commodity name is required")
    private String name;

    @NotNull(message = "Category is required")
    private CommodityCategory category;

    @NotBlank(message = "Unit is required (e.g. kg, sack, litre)")
    private String unit;

    private String description;
}
