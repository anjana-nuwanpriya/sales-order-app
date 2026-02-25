package com.company.project.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class SalesOrderLineDTO {
    private Long id;
    private Long itemId;
    private String itemCode;
    private String description;
    private String note;

    @NotNull(message = "Quantity is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Quantity must be greater than 0")
    private BigDecimal quantity;

    private BigDecimal price;
    private BigDecimal taxRate;
    private BigDecimal exclAmount;
    private BigDecimal taxAmount;
    private BigDecimal inclAmount;
    private Integer lineNumber;

    public SalesOrderLineDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }
    public String getItemCode() { return itemCode; }
    public void setItemCode(String v) { this.itemCode = v; }
    public String getDescription() { return description; }
    public void setDescription(String v) { this.description = v; }
    public String getNote() { return note; }
    public void setNote(String v) { this.note = v; }
    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal v) { this.quantity = v; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal v) { this.price = v; }
    public BigDecimal getTaxRate() { return taxRate; }
    public void setTaxRate(BigDecimal v) { this.taxRate = v; }
    public BigDecimal getExclAmount() { return exclAmount; }
    public void setExclAmount(BigDecimal v) { this.exclAmount = v; }
    public BigDecimal getTaxAmount() { return taxAmount; }
    public void setTaxAmount(BigDecimal v) { this.taxAmount = v; }
    public BigDecimal getInclAmount() { return inclAmount; }
    public void setInclAmount(BigDecimal v) { this.inclAmount = v; }
    public Integer getLineNumber() { return lineNumber; }
    public void setLineNumber(Integer v) { this.lineNumber = v; }
}
