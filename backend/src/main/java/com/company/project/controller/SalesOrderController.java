package com.company.project.controller;

import com.company.project.dto.SalesOrderDTO;
import com.company.project.service.interfaces.SalesOrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class SalesOrderController {

    private final SalesOrderService salesOrderService;

    public SalesOrderController(SalesOrderService salesOrderService) {
        this.salesOrderService = salesOrderService;
    }

    @GetMapping
    public ResponseEntity<List<SalesOrderDTO>> getAllOrders() {
        return ResponseEntity.ok(salesOrderService.getAllOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalesOrderDTO> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(salesOrderService.getOrderById(id));
    }

    // @Valid triggers Bean Validation on the incoming DTO
    @PostMapping
    public ResponseEntity<SalesOrderDTO> createOrder(@Valid @RequestBody SalesOrderDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(salesOrderService.createOrder(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SalesOrderDTO> updateOrder(@PathVariable Long id, @Valid @RequestBody SalesOrderDTO dto) {
        return ResponseEntity.ok(salesOrderService.updateOrder(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        salesOrderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}
