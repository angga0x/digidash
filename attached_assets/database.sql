-- Create database
CREATE DATABASE IF NOT EXISTS digiflazz_api;
USE digiflazz_api;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    api_key VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    buyer_sku_code VARCHAR(255) NOT NULL UNIQUE,
    seller_name VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    category ENUM('pulsa', 'data', 'game', 'ewallet', 'bill') NOT NULL,
    brand VARCHAR(255),
    type VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    selling_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    unlimited_stock BOOLEAN NOT NULL DEFAULT false,
    stock INT DEFAULT NULL,
    multi BOOLEAN NOT NULL DEFAULT false,
    start_cut_off TIME DEFAULT NULL,
    end_cut_off TIME DEFAULT NULL,
    last_sync TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    ref_id VARCHAR(255) NOT NULL UNIQUE,
    customer_no VARCHAR(255) NOT NULL,
    buyer_sku_code VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    selling_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    message TEXT,
    rc VARCHAR(10),
    sn VARCHAR(255),
    balance_before DECIMAL(10, 2) NOT NULL,
    balance_after DECIMAL(10, 2) NOT NULL,
    response JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (buyer_sku_code) REFERENCES products(buyer_sku_code)
);

-- Create balance_histories table
CREATE TABLE IF NOT EXISTS balance_histories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('credit', 'debit') NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT NOT NULL,
    balance_before DECIMAL(10, 2) NOT NULL,
    balance_after DECIMAL(10, 2) NOT NULL,
    reference_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    ref_id VARCHAR(255) NOT NULL UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'QRISREALTIME',
    qr_string TEXT,
    qr_link VARCHAR(255),
    pay_url VARCHAR(255),
    trx_id VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    response JSON,
    expired_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create markup_settings table
CREATE TABLE IF NOT EXISTS markup_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category ENUM('pulsa', 'data', 'game', 'ewallet', 'bill') NOT NULL,
    markup_type ENUM('percentage', 'fixed') NOT NULL DEFAULT 'percentage',
    markup_value DECIMAL(10, 2) NOT NULL,
    min_markup DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    max_markup DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_category (category)
);

-- Create webhooks table
CREATE TABLE IF NOT EXISTS webhooks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    url VARCHAR(255) NOT NULL,
    secret_key VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create webhook_logs table
CREATE TABLE IF NOT EXISTS webhook_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    webhook_id INT NOT NULL,
    transaction_id INT NOT NULL,
    payload JSON NOT NULL,
    response TEXT,
    status_code INT,
    attempt_count INT NOT NULL DEFAULT 0,
    last_attempt_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (webhook_id) REFERENCES webhooks(id),
    FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);

-- Create api_logs table
CREATE TABLE IF NOT EXISTS api_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    request_headers JSON,
    request_body JSON,
    response_code INT,
    response_body JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    duration INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert default admin user
INSERT INTO users (username, api_key, role) 
VALUES (
    'admin',
    'ADMIN-KEY-01234567890',
    'admin'
) ON DUPLICATE KEY UPDATE id=id;

-- Insert default markup settings
INSERT INTO markup_settings (category, markup_type, markup_value, min_markup, max_markup) 
VALUES 
('pulsa', 'percentage', 5.00, 500, 5000),
('data', 'percentage', 5.00, 1000, 10000),
('game', 'percentage', 5.00, 1000, 10000),
('ewallet', 'percentage', 5.00, 1000, 10000),
('bill', 'percentage', 2.50, 2000, 20000)
ON DUPLICATE KEY UPDATE id=id;

-- Create indexes
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_balance_histories_user_id ON balance_histories(user_id);
CREATE INDEX idx_balance_histories_type ON balance_histories(type);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);
CREATE INDEX idx_api_logs_user_id ON api_logs(user_id);
CREATE INDEX idx_api_logs_created_at ON api_logs(created_at);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status); 