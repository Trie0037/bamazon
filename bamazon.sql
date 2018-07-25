DROP DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  productName VARCHAR(255) NULL,
  departmentName VARCHAR(255) NULL,
  price VARCHAR(255) NULL,
  stockQuantity VARCHAR(255) NULL,
  PRIMARY KEY (id)
);

INSERT INTO products (productName, departmentName, price, stockQuantity)
VALUES ("Bamphone", "Electronics", 250, 7);

INSERT INTO products (productName, departmentName, price, stockQuantity)
VALUES ("BamTV","Electronics", 400, 3);

INSERT INTO products (productName, departmentName, price, stockQuantity)
VALUES ("Bampants", "Apparel", 25, 21);

INSERT INTO products (productName, departmentName, price, stockQuantity)
VALUES ("Bamwings", "Meat", 7, 56);
