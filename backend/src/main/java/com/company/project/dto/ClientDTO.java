package com.company.project.dto;

public class ClientDTO {
    private Long id;
    private String customerName;
    private String address1;
    private String address2;
    private String address3;
    private String suburb;
    private String state;
    private String postCode;

    public ClientDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
}
