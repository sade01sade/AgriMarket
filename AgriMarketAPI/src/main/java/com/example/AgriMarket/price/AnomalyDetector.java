package com.example.AgriMarket.price;


import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.MathContext;
import java.util.List;

@Component
public class AnomalyDetector {

    // Flag if price deviates more than 2 standard deviations from the mean
    private static final double THRESHOLD = 2.0;
    // Need at least this many data points to run detection
    private static final int MIN_SAMPLE_SIZE = 3;

    public AnomalyResult analyze(BigDecimal incomingPrice, List<PriceReport> recentReports) {
        if (recentReports.size() < MIN_SAMPLE_SIZE) {
            return AnomalyResult.insufficient();
        }

        List<Double> prices = recentReports.stream()
                .map(r -> r.getPrice().doubleValue())
                .toList();

        double mean = prices.stream()
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0);

        double variance = prices.stream()
                .mapToDouble(p -> Math.pow(p - mean, 2))
                .average()
                .orElse(0);

        double stdDev = Math.sqrt(variance);
        double incoming = incomingPrice.doubleValue();

        // If stdDev is zero all prices are identical — any difference is anomalous
        if (stdDev == 0) {
            boolean isAnomaly = incoming != mean;
            return isAnomaly
                    ? AnomalyResult.anomaly(mean, stdDev)
                    : AnomalyResult.normal();
        }

        double zScore = Math.abs((incoming - mean) / stdDev);
        boolean isAnomaly = zScore > THRESHOLD;

        return isAnomaly
                ? AnomalyResult.anomaly(mean, stdDev)
                : AnomalyResult.normal();
    }
}
