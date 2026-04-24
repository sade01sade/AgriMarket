package com.example.AgriMarket.price;


import com.example.AgriMarket.common.ApiResponse;
import com.example.AgriMarket.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prices")
@RequiredArgsConstructor
public class PriceController {

    private final PriceService priceService;

    // REPORTER submits a price
    @PostMapping
    @PreAuthorize("hasRole('REPORTER')")
    public ResponseEntity<ApiResponse<PriceReportDTO>> submit(
            @Valid @RequestBody PriceReportRequest request,
            @AuthenticationPrincipal User currentUser) {

        PriceReportDTO report = priceService.submit(request, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Price report submitted", report));
    }

    // REPORTER sees their own submissions
    @GetMapping("/my-reports")
    @PreAuthorize("hasRole('REPORTER')")
    public ResponseEntity<ApiResponse<List<PriceReportDTO>>> getMyReports(
            @AuthenticationPrincipal User currentUser) {

        return ResponseEntity.ok(ApiResponse.success(
                "Reports fetched",
                priceService.getMyReports(currentUser.getId())
        ));
    }

    // FARMER queries approved prices with optional filters
    @GetMapping
    @PreAuthorize("hasAnyRole('FARMER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<PriceReportDTO>>> getApproved(
            @RequestParam(required = false) Long commodityId,
            @RequestParam(required = false) Long marketId) {

        return ResponseEntity.ok(ApiResponse.success(
                "Prices fetched",
                priceService.getApproved(commodityId, marketId)
        ));
    }

    // ADMIN sees moderation queue
    @GetMapping("/moderation-queue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<PriceReportDTO>>> getModerationQueue() {
        return ResponseEntity.ok(ApiResponse.success(
                "Moderation queue fetched",
                priceService.getModerationQueue()
        ));
    }

    // ADMIN approves or flags a report
    @PatchMapping("/{id}/moderate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PriceReportDTO>> moderate(
            @PathVariable Long id,
            @Valid @RequestBody ModerationRequest request,
            @AuthenticationPrincipal User currentUser) {

        PriceReportDTO report = priceService.moderate(id, request, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Report moderated", report));
    }
}
