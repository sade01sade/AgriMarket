package com.example.AgriMarket.market;


import com.example.AgriMarket.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/markets")
@RequiredArgsConstructor
public class MarketController {

    private final MarketService marketService;

    // Anyone authenticated can read markets
    @GetMapping
    public ResponseEntity<ApiResponse<List<MarketDTO>>> getAll() {
        return ResponseEntity.ok(
                ApiResponse.success("Markets fetched", marketService.getAll())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MarketDTO>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(
                ApiResponse.success("Market fetched", marketService.getById(id))
        );
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<ApiResponse<List<MarketDTO>>> getByCity(@PathVariable String city) {
        return ResponseEntity.ok(
                ApiResponse.success("Markets fetched", marketService.getByCity(city))
        );
    }

    // Only ADMIN can write
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MarketDTO>> create(
            @Valid @RequestBody MarketRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success("Market created", marketService.create(request))
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<MarketDTO>> update(
            @PathVariable Long id,
            @Valid @RequestBody MarketRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success("Market updated", marketService.update(id, request))
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deactivate(@PathVariable Long id) {
        marketService.deactivate(id);
        return ResponseEntity.ok(ApiResponse.success("Market deactivated", null));
    }
}
