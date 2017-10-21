CREATE DATABASE bamazon;

use bamazon;
-- Table
CREATE TABLE products(
	item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(50) NOT NULL,
	department_name	VARCHAR(50) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	stock_quantity INTEGER (11) NOT NULL,
	PRIMARY KEY (item_id)
);

Select * FROM products;

-- Table Columns
INSERT INTO products (item_id, product_name, department_name, price, stock_quantity)
VALUES (1,"Blender", "Household", 56.00, 30),
	   (2,"Boots", "Clothing", 250.00, 2),
	   (3,"Pillows", "Household", 111.00, 30),
	   (4,"Headphones", "Electronics", 199.00, 10),
	   (5,"USB Charger", "Electronics", 129.00, 6),
	   (6,"Backpack", "School Supplies", 39.99, 90),
	   (7,"Laptop", "Electronics", 1200.00, 60),
	   (8,"Lamp", "Household", 49.99, 90),
	   (9,"Bluetooth Headset", "Electronics", 22.49, 50),
	   (10,"IphoneX", "Electronics", 1000.00, 0)