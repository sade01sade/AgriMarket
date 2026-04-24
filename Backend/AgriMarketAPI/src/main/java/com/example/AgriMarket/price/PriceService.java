package com.example.AgriMarket.price;


import java.util.List;

public interface PriceService {

    // Reporter
    PriceReportDTO submit(PriceReportRequest request, Long reporterId);
    List<PriceReportDTO> getMyReports(Long reporterId);

    // Farmer — approved only, with filters
    List<PriceReportDTO> getApproved(Long commodityId, Long marketId);

    // Admin
    List<PriceReportDTO> getModerationQueue();
    PriceReportDTO moderate(Long reportId, ModerationRequest request, Long adminId);
}
