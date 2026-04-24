package com.example.AgriMarket.price;


import com.example.AgriMarket.commodity.Commodity;
import com.example.AgriMarket.commodity.CommodityRepository;
import com.example.AgriMarket.market.Market;
import com.example.AgriMarket.market.MarketRepository;
import com.example.AgriMarket.user.User;
import com.example.AgriMarket.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PriceServiceImpl implements PriceService {

    private final PriceReportRepository priceReportRepository;
    private final CommodityRepository commodityRepository;
    private final MarketRepository marketRepository;
    private final UserRepository userRepository;
    private final AnomalyDetector anomalyDetector;

    @Override
    public PriceReportDTO submit(PriceReportRequest request, Long reporterId) {
        Commodity commodity = commodityRepository.findById(request.getCommodityId())
                .orElseThrow(() -> new RuntimeException("Commodity not found"));

        Market market = marketRepository.findById(request.getMarketId())
                .orElseThrow(() -> new RuntimeException("Market not found"));

        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new RuntimeException("Reporter not found"));

        // Run anomaly detection against last 30 days of approved prices
        List<PriceReport> recentReports = priceReportRepository.findRecentApproved(
                commodity.getId(),
                market.getId(),
                LocalDate.now().minusDays(30)
        );

        AnomalyResult anomaly = anomalyDetector.analyze(request.getPrice(), recentReports);

        PriceStatus initialStatus = PriceStatus.PENDING;
        String flagReason = null;

        if (anomaly.isAnomalous()) {
            initialStatus = PriceStatus.FLAGGED;
            flagReason = String.format(
                "Price %.2f deviates significantly from recent average of %.2f (±%.2f)",
                request.getPrice().doubleValue(),
                anomaly.getRecentMean(),
                anomaly.getStdDev()
            );
        }

        PriceReport report = PriceReport.builder()
                .commodity(commodity)
                .market(market)
                .reporter(reporter)
                .price(request.getPrice())
                .reportDate(request.getReportDate())
                .status(initialStatus)
                .flagReason(flagReason)
                .submittedAt(LocalDateTime.now())
                .build();

        return PriceReportDTO.from(priceReportRepository.save(report));
    }

    @Override
    public List<PriceReportDTO> getMyReports(Long reporterId) {
        return priceReportRepository.findByReporterIdOrderBySubmittedAtDesc(reporterId)
                .stream()
                .map(PriceReportDTO::from)
                .collect(Collectors.toList());
    }

    @Override
    public List<PriceReportDTO> getApproved(Long commodityId, Long marketId) {
        List<PriceReport> reports;

        if (commodityId != null && marketId != null) {
            reports = priceReportRepository
                    .findByCommodityIdAndMarketIdAndStatusOrderByReportDateDesc(
                            commodityId, marketId, PriceStatus.APPROVED);
        } else if (commodityId != null) {
            reports = priceReportRepository
                    .findByCommodityIdAndStatusOrderByReportDateDesc(
                            commodityId, PriceStatus.APPROVED);
        } else if (marketId != null) {
            reports = priceReportRepository
                    .findByMarketIdAndStatusOrderByReportDateDesc(
                            marketId, PriceStatus.APPROVED);
        } else {
            reports = priceReportRepository
                    .findByStatusOrderByReportDateDesc(PriceStatus.APPROVED);
        }

        return reports.stream()
                .map(PriceReportDTO::from)
                .collect(Collectors.toList());
    }

    @Override
    public List<PriceReportDTO> getModerationQueue() {
        return priceReportRepository
                .findByStatusInOrderBySubmittedAtDesc(
                        List.of(PriceStatus.PENDING, PriceStatus.FLAGGED))
                .stream()
                .map(PriceReportDTO::from)
                .collect(Collectors.toList());
    }

    @Override
    public PriceReportDTO moderate(Long reportId, ModerationRequest request, Long adminId) {
        PriceReport report = priceReportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Price report not found"));

        if (request.getStatus() == PriceStatus.FLAGGED && request.getFlagReason() == null) {
            throw new RuntimeException("Flag reason is required when flagging a report");
        }

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        report.setStatus(request.getStatus());
        report.setFlagReason(request.getFlagReason());
        report.setReviewedAt(LocalDateTime.now());
        report.setReviewedBy(admin);

        return PriceReportDTO.from(priceReportRepository.save(report));
    }
}
