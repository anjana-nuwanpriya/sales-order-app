-- ============================================================
-- Sales Order Management System - MySQL Schema
-- SPIL Labs (Pvt) Ltd.
-- ============================================================

CREATE DATABASE IF NOT EXISTS SalesOrderDB;
USE SalesOrderDB;

-- ─── Client Table ─────────────────────────────────────────────
CREATE TABLE Client (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(200) NOT NULL,
    address1      VARCHAR(255),
    address2      VARCHAR(255),
    address3      VARCHAR(255),
    suburb        VARCHAR(100),
    state         VARCHAR(50),
    post_code     VARCHAR(20)
);

-- ─── Item Table ───────────────────────────────────────────────
CREATE TABLE Item (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    item_code   VARCHAR(50)   NOT NULL UNIQUE,
    description VARCHAR(255)  NOT NULL,
    price       DECIMAL(15,2) NOT NULL DEFAULT 0
);

-- ─── SalesOrder Table ─────────────────────────────────────────
CREATE TABLE SalesOrder (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    client_id     BIGINT        NOT NULL,
    customer_name VARCHAR(200),
    address1      VARCHAR(255),
    address2      VARCHAR(255),
    address3      VARCHAR(255),
    suburb        VARCHAR(100),
    state         VARCHAR(50),
    post_code     VARCHAR(20),
    invoice_no    VARCHAR(100),
    invoice_date  DATE,
    reference_no  VARCHAR(100),
    note          TEXT,
    total_excl    DECIMAL(15,2) DEFAULT 0,
    total_tax     DECIMAL(15,2) DEFAULT 0,
    total_incl    DECIMAL(15,2) DEFAULT 0,
    CONSTRAINT fk_order_client FOREIGN KEY (client_id) REFERENCES Client(id)
);

-- ─── SalesOrderLine Table ─────────────────────────────────────
CREATE TABLE SalesOrderLine (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    sales_order_id  BIGINT        NOT NULL,
    item_id         BIGINT,
    item_code       VARCHAR(50),
    description     VARCHAR(255),
    note            VARCHAR(500),
    quantity        DECIMAL(15,2) DEFAULT 0,
    price           DECIMAL(15,2) DEFAULT 0,
    tax_rate        DECIMAL(5,2)  DEFAULT 0,
    excl_amount     DECIMAL(15,2) DEFAULT 0,
    tax_amount      DECIMAL(15,2) DEFAULT 0,
    incl_amount     DECIMAL(15,2) DEFAULT 0,
    line_number     INT,
    CONSTRAINT fk_line_order FOREIGN KEY (sales_order_id) REFERENCES SalesOrder(id) ON DELETE CASCADE,
    CONSTRAINT fk_line_item  FOREIGN KEY (item_id) REFERENCES Item(id)
);

-- ─── Seed Data ────────────────────────────────────────────────
INSERT INTO Client (customer_name, address1, address2, address3, suburb, state, post_code) VALUES
('Acme Corporation',      '123 Main Street',     'Suite 100', '',           'Springfield', 'VIC', '3000'),
('Global Tech Solutions', '45 Innovation Drive', '',          '',           'Melbourne',   'VIC', '3004'),
('Pacific Trading Co',    '789 Harbor Road',     'Level 3',   'Building B', 'Sydney',      'NSW', '2000'),
('Sunrise Industries',    '22 Commerce Street',  '',          '',           'Brisbane',    'QLD', '4000'),
('Delta Enterprises',     '5 Business Park',     'Unit 7',    '',           'Perth',       'WA',  '6000');

INSERT INTO Item (item_code, description, price) VALUES
('ITM001', 'Office Chair - Ergonomic',          299.99),
('ITM002', 'Standing Desk - Height Adjustable', 549.00),
('ITM003', 'Monitor 27-inch 4K',                699.95),
('ITM004', 'Mechanical Keyboard',               129.00),
('ITM005', 'Wireless Mouse',                     79.50),
('ITM006', 'USB-C Hub 7-Port',                   59.99),
('ITM007', 'Webcam HD 1080p',                   119.00),
('ITM008', 'Noise-Cancelling Headphones',       249.99),
('ITM009', 'Laptop Stand Adjustable',            49.99),
('ITM010', 'Cable Management Kit',               24.95);