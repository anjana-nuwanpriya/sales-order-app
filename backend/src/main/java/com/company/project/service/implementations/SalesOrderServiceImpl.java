package com.company.project.service.implementations;

import com.company.project.domain.entity.*;
import com.company.project.dto.*;
import com.company.project.exception.ResourceNotFoundException;
import com.company.project.repository.*;
import com.company.project.service.interfaces.SalesOrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class SalesOrderServiceImpl implements SalesOrderService {

    private final SalesOrderRepository salesOrderRepository;
    private final ClientRepository clientRepository;
    private final ItemRepository itemRepository;

    public SalesOrderServiceImpl(SalesOrderRepository salesOrderRepository,
                                  ClientRepository clientRepository,
                                  ItemRepository itemRepository) {
        this.salesOrderRepository = salesOrderRepository;
        this.clientRepository = clientRepository;
        this.itemRepository = itemRepository;
    }

    @Override
    public List<SalesOrderDTO> getAllOrders() {
        return salesOrderRepository.findAllWithClient().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public SalesOrderDTO getOrderById(Long id) {
        SalesOrder order = salesOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sales order not found with id: " + id));
        return toDTO(order);
    }

    @Override
    @Transactional
    public SalesOrderDTO createOrder(SalesOrderDTO dto) {
        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with id: " + dto.getClientId()));

        SalesOrder order = new SalesOrder();
        order.setClient(client);
        mapDtoToOrder(dto, order);
        addLinesToOrder(order, dto);
        calculateTotals(order);

        return toDTO(salesOrderRepository.save(order));
    }

    @Override
    @Transactional
    public SalesOrderDTO updateOrder(Long id, SalesOrderDTO dto) {
        SalesOrder order = salesOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sales order not found with id: " + id));
        Client client = clientRepository.findById(dto.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with id: " + dto.getClientId()));

        order.setClient(client);
        mapDtoToOrder(dto, order);
        order.clearOrderLines();
        addLinesToOrder(order, dto);
        calculateTotals(order);

        return toDTO(salesOrderRepository.save(order));
    }

    @Override
    @Transactional
    public void deleteOrder(Long id) {
        if (!salesOrderRepository.existsById(id)) {
            throw new ResourceNotFoundException("Sales order not found with id: " + id);
        }
        salesOrderRepository.deleteById(id);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────

    private void mapDtoToOrder(SalesOrderDTO dto, SalesOrder order) {
        order.setCustomerName(dto.getCustomerName());
        order.setAddress1(dto.getAddress1());
        order.setAddress2(dto.getAddress2());
        order.setAddress3(dto.getAddress3());
        order.setSuburb(dto.getSuburb());
        order.setState(dto.getState());
        order.setPostCode(dto.getPostCode());
        order.setInvoiceNo(dto.getInvoiceNo());
        order.setInvoiceDate(dto.getInvoiceDate());
        order.setReferenceNo(dto.getReferenceNo());
        order.setNote(dto.getNote());
    }

    private void addLinesToOrder(SalesOrder order, SalesOrderDTO dto) {
        if (dto.getOrderLines() == null) return;
        AtomicInteger lineNum = new AtomicInteger(1);
        for (SalesOrderLineDTO lineDTO : dto.getOrderLines()) {
            Item item = null;
            if (lineDTO.getItemId() != null) {
                item = itemRepository.findById(lineDTO.getItemId()).orElse(null);
            }

            BigDecimal qty = lineDTO.getQuantity() != null ? lineDTO.getQuantity() : BigDecimal.ZERO;
            BigDecimal price = lineDTO.getPrice() != null ? lineDTO.getPrice() : BigDecimal.ZERO;
            BigDecimal taxRate = lineDTO.getTaxRate() != null ? lineDTO.getTaxRate() : BigDecimal.ZERO;

            BigDecimal exclAmount = qty.multiply(price).setScale(2, RoundingMode.HALF_UP);
            BigDecimal taxAmount = exclAmount.multiply(taxRate).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            BigDecimal inclAmount = exclAmount.add(taxAmount);

            SalesOrderLine line = new SalesOrderLine();
            line.setItem(item);
            line.setItemCode(lineDTO.getItemCode());
            line.setDescription(lineDTO.getDescription());
            line.setNote(lineDTO.getNote());
            line.setQuantity(qty);
            line.setPrice(price);
            line.setTaxRate(taxRate);
            line.setExclAmount(exclAmount);
            line.setTaxAmount(taxAmount);
            line.setInclAmount(inclAmount);
            line.setLineNumber(lineNum.getAndIncrement());

            order.addOrderLine(line);
        }
    }

    private void calculateTotals(SalesOrder order) {
        BigDecimal totalExcl = BigDecimal.ZERO;
        BigDecimal totalTax = BigDecimal.ZERO;
        for (SalesOrderLine line : order.getOrderLines()) {
            totalExcl = totalExcl.add(line.getExclAmount() != null ? line.getExclAmount() : BigDecimal.ZERO);
            totalTax = totalTax.add(line.getTaxAmount() != null ? line.getTaxAmount() : BigDecimal.ZERO);
        }
        order.setTotalExcl(totalExcl);
        order.setTotalTax(totalTax);
        order.setTotalIncl(totalExcl.add(totalTax));
    }

    private SalesOrderDTO toDTO(SalesOrder order) {
        List<SalesOrderLineDTO> lines = new ArrayList<>();
        for (SalesOrderLine line : order.getOrderLines()) {
            SalesOrderLineDTO ldto = new SalesOrderLineDTO();
            ldto.setId(line.getId());
            ldto.setItemId(line.getItem() != null ? line.getItem().getId() : null);
            ldto.setItemCode(line.getItemCode());
            ldto.setDescription(line.getDescription());
            ldto.setNote(line.getNote());
            ldto.setQuantity(line.getQuantity());
            ldto.setPrice(line.getPrice());
            ldto.setTaxRate(line.getTaxRate());
            ldto.setExclAmount(line.getExclAmount());
            ldto.setTaxAmount(line.getTaxAmount());
            ldto.setInclAmount(line.getInclAmount());
            ldto.setLineNumber(line.getLineNumber());
            lines.add(ldto);
        }

        SalesOrderDTO dto = new SalesOrderDTO();
        dto.setId(order.getId());
        dto.setClientId(order.getClient().getId());
        dto.setCustomerName(order.getCustomerName());
        dto.setAddress1(order.getAddress1());
        dto.setAddress2(order.getAddress2());
        dto.setAddress3(order.getAddress3());
        dto.setSuburb(order.getSuburb());
        dto.setState(order.getState());
        dto.setPostCode(order.getPostCode());
        dto.setInvoiceNo(order.getInvoiceNo());
        dto.setInvoiceDate(order.getInvoiceDate());
        dto.setReferenceNo(order.getReferenceNo());
        dto.setNote(order.getNote());
        dto.setTotalExcl(order.getTotalExcl());
        dto.setTotalTax(order.getTotalTax());
        dto.setTotalIncl(order.getTotalIncl());
        dto.setOrderLines(lines);
        return dto;
    }
}
