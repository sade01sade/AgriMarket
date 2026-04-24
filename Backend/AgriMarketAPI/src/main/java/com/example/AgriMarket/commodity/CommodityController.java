package com.example.AgriMarket.commodity;


import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.AgriMarket.common.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/commodities")
@RequiredArgsConstructor
public class CommodityController {

    private final CommodityService commodityService;

    // Anyone authenticated can read commodities
    @GetMapping
    public ResponseEntity<ApiResponse<List<CommodityDTO>>> getAll() {
        return ResponseEntity.ok(
                ApiResponse.success("Commodities fetched", commodityService.getAll())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CommodityDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success("Commodity fetched", commodityService.getById(id))
        );
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<CommodityDTO>>> getByCategory(
            @PathVariable CommodityCategory category) {
        return ResponseEntity.ok(
                ApiResponse.success("Commodities fetched", commodityService.getByCategory(category))
        );
    }

    // Only ADMIN can write
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CommodityDTO>> create(
            @Valid @RequestBody CommodityRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success("Commodity created", commodityService.create(request))
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CommodityDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody CommodityRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success("Commodity updated", commodityService.update(id, request))
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deactivate(@PathVariable Long id) {
        commodityService.deactivate(id);
        return ResponseEntity.ok(ApiResponse.success("Commodity deactivated", null));
    }
}
