package com.company.project.domain.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "SalesOrderLine")
public class SalesOrderLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sales_order_id", nullable = false)
    private SalesOrder salesOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id")
    private Item item;

    @Column(name = "item_code")
    private String itemCode;

    @Column(name = "description")
    private String description;

    @Column(name = "note")
    private String note;

    @Column(name = "quantity", precision = 15, scale = 2)
    private BigDecimal quantity;

    @Column(name = "price", precision = 15, scale = 2)
    private BigDecimal price;

    @Column(name = "tax_rate", precision = 5, scale = 2)
    private BigDecimal taxRate;

    @Column(name = "excl_amount", precision = 15, scale = 2)
    private BigDecimal exclAmount;

    @Column(name = "tax_amount", precision = 15, scale = 2)
    private BigDecimal taxAmount;

    @Column(name = "incl_amount", precision = 15, scale = 2)
    private BigDecimal inclAmount;

    @Column(name = "line_number")
    private Integer lineNumber;

    public SalesOrderLine() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public SalesOrder getSalesOrder() { return salesOrder; }
    public void setSalesOrder(SalesOrder salesOrder) { this.salesOrder = salesOrder; }
    public Item getItem() { return item; }
    public void setItem(Item item) { this.item = item; }
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
