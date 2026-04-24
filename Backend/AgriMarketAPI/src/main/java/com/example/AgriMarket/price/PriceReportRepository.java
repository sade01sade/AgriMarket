package com.example.AgriMarket.price;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface PriceReportRepository extends JpaRepository<PriceReport, Long> {

    // For farmers — only approved prices
    List<PriceReport> findByStatusOrderByReportDateDesc(PriceStatus status);

    // Filter by commodity and status
    List<PriceReport> findByCommodityIdAndStatusOrderByReportDateDesc(
            Long commodityId, PriceStatus status);

    // Filter by market and status
    List<PriceReport> findByMarketIdAndStatusOrderByReportDateDesc(
            Long marketId, PriceStatus status);

    // Filter by commodity + market + status
    List<PriceReport> findByCommodityIdAndMarketIdAndStatusOrderByReportDateDesc(
            Long commodityId, Long marketId, PriceStatus status);

    // Reporter's own submissions
    List<PriceReport> findByReporterIdOrderBySubmittedAtDesc(Long reporterId);

    // Admin moderation queue — pending and flagged
    List<PriceReport> findByStatusInOrderBySubmittedAtDesc(List<PriceStatus> statuses);

    // For anomaly detection — recent approved prices for same commodity + market
    @Query("""
            SELECT p FROM PriceReport p
            WHERE p.commodity.id = :commodityId
            AND p.market.id = :marketId
            AND p.status = 'APPROVED'
            AND p.reportDate >= :since
            ORDER BY p.reportDate DESC
            """)
    List<PriceReport> findRecentApproved(
            @Param("commodityId") Long commodityId,
            @Param("marketId") Long marketId,
            @Param("since") LocalDate since);

    // For trend computation
    @Query("""
            SELECT p FROM PriceReport p
            WHERE p.commodity.id = :commodityId
            AND p.market.id = :marketId
            AND p.status = 'APPROVED'
            AND p.reportDate BETWEEN :from AND :to
            ORDER BY p.reportDate ASC
            """)
    List<PriceReport> findForTrend(
            @Param("commodityId") Long commodityId,
            @Param("marketId") Long marketId,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to);
}
