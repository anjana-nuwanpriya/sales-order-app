package com.company.project.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class SalesOrderDTO {
    private Long id;

    @NotNull(message = "Client ID is required")
    private Long clientId;

    @NotBlank(message = "Customer name is required")
    private String customerName;

    private String address1;
    private String address2;
    private String address3;
    private String suburb;
    private String state;
    private String postCode;
    private String invoiceNo;
    private LocalDate invoiceDate;
    private String referenceNo;
    private String note;
    private BigDecimal totalExcl;
    private BigDecimal totalTax;
    private BigDecimal totalIncl;

    @Valid
    private List<SalesOrderLineDTO> orderLines;

    public SalesOrderDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }
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
    public List<SalesOrderLineDTO> getOrderLines() { return orderLines; }
    public void setOrderLines(List<SalesOrderLineDTO> orderLines) { this.orderLines = orderLines; }
}
