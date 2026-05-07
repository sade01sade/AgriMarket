package com.example.AgriMarket.market;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MarketServiceImpl implements MarketService {

    private final MarketRepository marketRepository;

    @Override
    public MarketDTO create(MarketRequest request) {
        if (marketRepository.existsByNameIgnoreCaseAndCityIgnoreCase(
                request.getName(), request.getCity())) {
            throw new RuntimeException(
                "Market '" + request.getName() + "' already exists in " + request.getCity()
            );
        }

        Market market = Market.builder()
                .name(request.getName())
                .city(request.getCity())
                .region(request.getRegion())
                .description(request.getDescription())
                .active(true)
                .build();

        return MarketDTO.from(marketRepository.save(market));
    }

    @Override
    public MarketDTO update(Long id, MarketRequest request) {
        Market market = findOrThrow(id);

        market.setName(request.getName());
        market.setCity(request.getCity());
        market.setRegion(request.getRegion());
        market.setDescription(request.getDescription());

        return MarketDTO.from(marketRepository.save(market));
    }

    @Override
    public MarketDTO getById(Long id) {
        return MarketDTO.from(findOrThrow(id));
    }

    @Override
    public List<MarketDTO> getAll() {
        return marketRepository.findByActiveTrue()
                .stream()
                .map(MarketDTO::from)
                .collect(Collectors.toList());
    }

    @Override
    public List<MarketDTO> getByCity(String city) {
        return marketRepository.findByCityIgnoreCaseAndActiveTrue(city)
                .stream()
                .map(MarketDTO::from)
                .collect(Collectors.toList());
    }

    @Override
    public void deactivate(Long id) {
        Market market = findOrThrow(id);
        market.setActive(false);
        marketRepository.save(market);
    }

    private Market findOrThrow(Long id) {
        return marketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Market not found with id: " + id));
    }
}
