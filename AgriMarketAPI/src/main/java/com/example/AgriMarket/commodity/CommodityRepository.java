package com.example.AgriMarket.commodity;


import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CommodityRepository extends JpaRepository<Commodity, Long> {
    List<Commodity> findByActiveTrue();
    List<Commodity> findByCategoryAndActiveTrue(CommodityCategory category);
    Optional<Commodity> findByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);
}
