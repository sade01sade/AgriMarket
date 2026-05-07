package com.example.AgriMarket.commodity;


import java.util.List;

public interface CommodityService {
    CommodityDTO create(CommodityRequest request);
    CommodityDTO update(Long id, CommodityRequest request);
    CommodityDTO getById(Long id);
    List<CommodityDTO> getAll();
    List<CommodityDTO> getByCategory(CommodityCategory category);
    void deactivate(Long id);
}
