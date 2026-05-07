package com.example.AgriMarket.commodity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "commodities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Commodity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true)
    private String name;

    @Enumerated(EnumType.STRING)
    private CommodityCategory category;

    @NotBlank
    private String unit;

    private String description;

    private boolean active = true;
}
