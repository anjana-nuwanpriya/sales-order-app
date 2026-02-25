package com.company.project.service.interfaces;

import com.company.project.dto.SalesOrderDTO;
import java.util.List;

public interface SalesOrderService {
    List<SalesOrderDTO> getAllOrders();
    SalesOrderDTO getOrderById(Long id);
    SalesOrderDTO createOrder(SalesOrderDTO dto);
    SalesOrderDTO updateOrder(Long id, SalesOrderDTO dto);
    void deleteOrder(Long id);
}
