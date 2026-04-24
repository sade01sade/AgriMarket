package com.example.AgriMarket.price;


import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ModerationRequest {

    @NotNull(message = "Status is required")
    private PriceStatus status; // APPROVED or FLAGGED

    private String flagReason; // required only when status is FLAGGED
}
