package com.example.AgriMarket.market;


import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarketRequest {

    @NotBlank(message = "Market name is required")
    private String name;

    @NotBlank(message = "City is required")
    private String city;

    private String region;

    private String description;
}
