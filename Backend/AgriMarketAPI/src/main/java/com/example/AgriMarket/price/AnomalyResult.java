package com.example.AgriMarket.price;


import lombok.*;

@Getter
@AllArgsConstructor
public class AnomalyResult {
    private final boolean anomalous;
    private final boolean insufficientData;
    private final double recentMean;
    private final double stdDev;

    public static AnomalyResult normal() {
        return new AnomalyResult(false, false, 0, 0);
    }

    public static AnomalyResult anomaly(double mean, double stdDev) {
        return new AnomalyResult(true, false, mean, stdDev);
    }

    public static AnomalyResult insufficient() {
        return new AnomalyResult(false, true, 0, 0);
    }
}
