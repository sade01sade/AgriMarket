package com.example.AgriMarket.price;


import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriceReportDTO {
    private Long id;
    private String commodityName;
    private String commodityUnit;
    private String marketName;
    private String marketCity;
    private String reporterName;
    private BigDecimal price;
    private LocalDate reportDate;
    private PriceStatus status;
    private String flagReason;
    private LocalDateTime submittedAt;

    public static PriceReportDTO from(PriceReport report) {
        return PriceReportDTO.builder()
                .id(report.getId())
                .commodityName(report.getCommodity().getName())
                .commodityUnit(report.getCommodity().getUnit())
                .marketName(report.getMarket().getName())
                .marketCity(report.getMarket().getCity())
                .reporterName(report.getReporter().getFullName())
                .price(report.getPrice())
                .reportDate(report.getReportDate())
                .status(report.getStatus())
                .flagReason(report.getFlagReason())
                .submittedAt(report.getSubmittedAt())
                .build();
    }
}