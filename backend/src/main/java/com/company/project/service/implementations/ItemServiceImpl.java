package com.company.project.service.implementations;

import com.company.project.domain.entity.Item;
import com.company.project.dto.ItemDTO;
import com.company.project.exception.ResourceNotFoundException;
import com.company.project.repository.ItemRepository;
import com.company.project.service.interfaces.ItemService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;

    public ItemServiceImpl(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    @Override
    public List<ItemDTO> getAllItems() {
        return itemRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public ItemDTO getItemById(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + id));
        return toDTO(item);
    }

    private ItemDTO toDTO(Item i) {
        ItemDTO dto = new ItemDTO();
        dto.setId(i.getId());
        dto.setItemCode(i.getItemCode());
        dto.setDescription(i.getDescription());
        dto.setPrice(i.getPrice());
        return dto;
    }
}
