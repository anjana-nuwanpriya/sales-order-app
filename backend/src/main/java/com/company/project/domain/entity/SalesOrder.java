package com.company.project.domain.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "SalesOrder")
public class SalesOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "address1")
    private String address1;

    @Column(name = "address2")
    private String address2;

    @Column(name = "address3")
    private String address3;

    @Column(name = "suburb")
    private String suburb;

    @Column(name = "state")
    private String state;

    @Column(name = "post_code")
    private String postCode;

    @Column(name = "invoice_no")
    private String invoiceNo;

    @Column(name = "invoice_date")
    private LocalDate invoiceDate;

    @Column(name = "reference_no")
    private String referenceNo;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @Column(name = "total_excl", precision = 15, scale = 2)
    private BigDecimal totalExcl;

    @Column(name = "total_tax", precision = 15, scale = 2)
    private BigDecimal totalTax;

    @Column(name = "total_incl", precision = 15, scale = 2)
    private BigDecimal totalIncl;

    @OneToMany(mappedBy = "salesOrder", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<SalesOrderLine> orderLines = new ArrayList<>();

    public SalesOrder() {}

    public void addOrderLine(SalesOrderLine line) {
        orderLines.add(line);
        line.setSalesOrder(this);
    }

    public void clearOrderLines() {
        for (SalesOrderLine line : orderLines) {
            line.setSalesOrder(null);
        }
        orderLines.clear();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String v) { this.customerName = v; }
    public String getAddress1() { return address1; }
    public void setAddress1(String v) { this.address1 = v; }
    public String getAddress2() { return address2; }
    public void setAddress2(String v) { this.address2 = v; }
    public String getAddress3() { return address3; }
    public void setAddress3(String v) { this.address3 = v; }
    public String getSuburb() { return suburb; }
    public void setSuburb(String v) { this.suburb = v; }
    public String getState() { return state; }
    public void setState(String v) { this.state = v; }
    public String getPostCode() { return postCode; }
    public void setPostCode(String v) { this.postCode = v; }
    public String getInvoiceNo() { return invoiceNo; }
    public void setInvoiceNo(String v) { this.invoiceNo = v; }
    public LocalDate getInvoiceDate() { return invoiceDate; }
    public void setInvoiceDate(LocalDate v) { this.invoiceDate = v; }
    public String getReferenceNo() { return referenceNo; }
    public void setReferenceNo(String v) { this.referenceNo = v; }
    public String getNote() { return note; }
    public void setNote(String v) { this.note = v; }
    public BigDecimal getTotalExcl() { return totalExcl; }
    public void setTotalExcl(BigDecimal v) { this.totalExcl = v; }
    public BigDecimal getTotalTax() { return totalTax; }
    public void setTotalTax(BigDecimal v) { this.totalTax = v; }
    public BigDecimal getTotalIncl() { return totalIncl; }
    public void setTotalIncl(BigDecimal v) { this.totalIncl = v; }
    public List<SalesOrderLine> getOrderLines() { return orderLines; }
    public void setOrderLines(List<SalesOrderLine> orderLines) { this.orderLines = orderLines; }
}
