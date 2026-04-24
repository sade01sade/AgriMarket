package com.example.AgriMarket.market;


import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MarketRepository extends JpaRepository<Market, Long> {
    List<Market> findByActiveTrue();
    List<Market> findByCityIgnoreCaseAndActiveTrue(String city);
    boolean existsByNameIgnoreCaseAndCityIgnoreCase(String name, String city);
}
