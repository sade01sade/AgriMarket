package com.example.AgriMarket.market;


import java.util.List;

public interface MarketService {
    MarketDTO create(MarketRequest request);
    MarketDTO update(Long id, MarketRequest request);
    MarketDTO getById(Long id);
    List<MarketDTO> getAll();
    List<MarketDTO> getByCity(String city);
    void deactivate(Long id);
}
