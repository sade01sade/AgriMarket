package com.example.AgriMarket.analytics;


import com.example.AgriMarket.commodity.Commodity;
import com.example.AgriMarket.commodity.CommodityRepository;
import com.example.AgriMarket.market.Market;
import com.example.AgriMarket.market.MarketRepository;
import com.example.AgriMarket.price.PriceReport;
import com.example.AgriMarket.price.PriceReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final PriceReportRepository priceReportRepository;
    private final CommodityRepository commodityRepository;
    private final MarketRepository marketRepository;

    @Override
    public TrendResponse getTrend(Long commodityId, Long marketId, int days) {
        Commodity commodity = commodityRepository.findById(commodityId)
                .orElseThrow(() -> new RuntimeException("Commodity not found"));

        Market market = marketRepository.findById(marketId)
                .orElseThrow(() -> new RuntimeException("Market not found"));

        LocalDate to = LocalDate.now();
        LocalDate from = to.minusDays(days);

        List<PriceReport> reports = priceReportRepository.findForTrend(
                commodityId, marketId, from, to
        );

        // Group reports by date and compute stats per day
        Map<LocalDate, List<PriceReport>> byDate = reports.stream()
                .collect(Collectors.groupingBy(PriceReport::getReportDate));

        List<TrendPoint> points = new ArrayList<>();

        // Walk each day in range so gaps show up clearly
        LocalDate cursor = from;
        while (!cursor.isAfter(to)) {
            List<PriceReport> dayReports = byDate.getOrDefault(cursor, List.of());

            if (!dayReports.isEmpty()) {
                List<BigDecimal> prices = dayReports.stream()
                        .map(PriceReport::getPrice)
                        .toList();

                BigDecimal avg = prices.stream()
                        .reduce(BigDecimal.ZERO, BigDecimal::add)
                        .divide(BigDecimal.valueOf(prices.size()), 2, RoundingMode.HALF_UP);

                BigDecimal min = prices.stream()
                        .min(BigDecimal::compareTo)
                        .orElse(BigDecimal.ZERO);

                BigDecimal max = prices.stream()
                        .max(BigDecimal::compareTo)
                        .orElse(BigDecimal.ZERO);

                points.add(TrendPoint.builder()
                        .date(cursor)
                        .averagePrice(avg)
                        .minPrice(min)
                        .maxPrice(max)
                        .reportCount(dayReports.size())
                        .build());
            }

            cursor = cursor.plusDays(1);
        }

        return TrendResponse.builder()
                .commodityName(commodity.getName())
                .commodityUnit(commodity.getUnit())
                .marketName(market.getName())
                .marketCity(market.getCity())
                .points(points)
                .build();
    }

    @Override
    public CityComparisonResponse compareCities(Long commodityId) {
        Commodity commodity = commodityRepository.findById(commodityId)
                .orElseThrow(() -> new RuntimeException("Commodity not found"));

        LocalDate since = LocalDate.now().minusDays(30);
        LocalDate to = LocalDate.now();

        // Get all active markets
        List<Market> markets = marketRepository.findByActiveTrue();

        List<CityComparisonPoint> cityPoints = new ArrayList<>();

        for (Market market : markets) {
            List<PriceReport> reports = priceReportRepository.findForTrend(
                    commodityId, market.getId(), since, to
            );

            if (reports.isEmpty()) continue;

            List<BigDecimal> prices = reports.stream()
                    .map(PriceReport::getPrice)
                    .toList();

            BigDecimal avg = prices.stream()
                    .reduce(BigDecimal.ZERO, BigDecimal::add)
                    .divide(BigDecimal.valueOf(prices.size()), 2, RoundingMode.HALF_UP);

            BigDecimal min = prices.stream()
                    .min(BigDecimal::compareTo)
                    .orElse(BigDecimal.ZERO);

            BigDecimal max = prices.stream()
                    .max(BigDecimal::compareTo)
                    .orElse(BigDecimal.ZERO);

            // Latest price is the most recent report
            BigDecimal latestPrice = reports.stream()
                    .max((a, b) -> a.getReportDate().compareTo(b.getReportDate()))
                    .map(PriceReport::getPrice)
                    .orElse(BigDecimal.ZERO);

            cityPoints.add(CityComparisonPoint.builder()
                    .city(market.getCity())
                    .marketName(market.getName())
                    .latestPrice(latestPrice)
                    .averagePrice30Days(avg)
                    .minPrice30Days(min)
                    .maxPrice30Days(max)
                    .reportCount(reports.size())
                    .build());
        }

        return CityComparisonResponse.builder()
                .commodityName(commodity.getName())
                .commodityUnit(commodity.getUnit())
                .cities(cityPoints)
                .build();
    }
}
