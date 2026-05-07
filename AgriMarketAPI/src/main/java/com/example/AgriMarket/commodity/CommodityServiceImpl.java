package com.example.AgriMarket.commodity;


import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommodityServiceImpl implements CommodityService {

    private final CommodityRepository commodityRepository;

    @Override
    public CommodityDTO create(CommodityRequest request) {
        if (commodityRepository.existsByNameIgnoreCase(request.getName())) {
            throw new RuntimeException("Commodity already exists: " + request.getName());
        }

        Commodity commodity = Commodity.builder()
                .name(request.getName())
                .category(request.getCategory())
                .unit(request.getUnit())
                .description(request.getDescription())
                .active(true)
                .build();

        return CommodityDTO.from(commodityRepository.save(commodity));
    }

    @Override
    public CommodityDTO update(Long id, CommodityRequest request) {
        Commodity commodity = findOrThrow(id);

        commodity.setName(request.getName());
        commodity.setCategory(request.getCategory());
        commodity.setUnit(request.getUnit());
        commodity.setDescription(request.getDescription());

        return CommodityDTO.from(commodityRepository.save(commodity));
    }

    @Override
    public CommodityDTO getById(Long id) {
        return CommodityDTO.from(findOrThrow(id));
    }

    @Override
    public List<CommodityDTO> getAll() {
        return commodityRepository.findByActiveTrue()
                .stream()
                .map(CommodityDTO::from)
                .collect(Collectors.toList());
    }

    @Override
    public List<CommodityDTO> getByCategory(CommodityCategory category) {
        return commodityRepository.findByCategoryAndActiveTrue(category)
                .stream()
                .map(CommodityDTO::from)
                .collect(Collectors.toList());
    }

    @Override
    public void deactivate(Long id) {
        Commodity commodity = findOrThrow(id);
        commodity.setActive(false);
        commodityRepository.save(commodity);
    }

    private Commodity findOrThrow(Long id) {
        return commodityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commodity not found with id: " + id));
    }
}
