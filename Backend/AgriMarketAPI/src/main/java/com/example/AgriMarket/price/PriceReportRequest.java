package com.example.AgriMarket.price;


import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriceReportRequest {

    @NotNull(message = "Commodity is required")
    private Long commodityId;

    @NotNull(message = "Market is required")
    private Long marketId;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than zero")
    private BigDecimal price;

    @NotNull(message = "Report date is required")
    private LocalDate reportDate;
}
