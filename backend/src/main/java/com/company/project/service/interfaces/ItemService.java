package com.company.project.service.interfaces;

import com.company.project.dto.ItemDTO;
import java.util.List;

public interface ItemService {
    List<ItemDTO> getAllItems();
    ItemDTO getItemById(Long id);
}
