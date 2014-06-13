/****************************************
CREATE MYSQL DATABASE alat_demo 
Login as root@localhost to mysql 
and execute this script to 
create alat_demo database and 
alat_user user.
These are used in alat examples_php_mysql.
*****************************************/



-- DATABASE AND USER

-- Drop alat_demo if already exists
drop database if exists alat_demo;

-- Create database alat_demo
create database alat_demo;

-- Change to alat_demo
use alat_demo;

-- Grant all privileges on alat_demo to user alat_user (create user if it does not exists)
grant all on `alat_demo`.* to 'alat_user'@'localhost' identified by 'alat_user';



-- TABLES (SIMPLIFIED RETAIL EXAMPLE)

-- Table USERS
create table users (
    id 		int(10) not null auto_increment,
    username 	varchar(100) not null, 
    password 	varchar(100),
    primary key (id),
    unique key users_idx1 (username)
);
insert into users (username, password) values ('demo','demo');
insert into users (username, password) values ('guest','guest');
insert into users (username, password) values ('admin','admin');

-- Table PRODUCTS 
create table products (
    id 		int(10) not null auto_increment,
    name 	varchar(100) not null,
    unit 	varchar(10) not null,
    primary key (id),
    unique key products_idx1 (name)
);
insert into products (name, unit) values ('Salt','kg');
insert into products (name, unit) values ('Sugar','kg');
insert into products (name, unit) values ('Milk','l');
insert into products (name, unit) values ('Potato','kg');
insert into products (name, unit) values ('Flour','kg');
insert into products (name, unit) values ('Candy','pcs');

-- Table STORES
create table stores (
    id 		int(10) not null auto_increment,
    name 	varchar(100) not null,
    location 	varchar(100) not null,
    primary key (id),
    unique key stores_idx1 (name)
);
insert into stores (name,location) values ('Blue store','East');
insert into stores (name,location) values ('Yellow store','West');
insert into stores (name,location) values ('Black store','North');
insert into stores (name,location) values ('Red store','South');
insert into stores (name,location) values ('White store','Center');


-- Table STOCK
create table stock (
    id 		int(10) not null auto_increment,
    store_id 	int(10) not null,
    product_id 	int(10) not null,
    quantity 	decimal(10,2),
    price 	decimal(10,2),
    primary key (id),
    unique key stock_idx1 (store_id, product_id),
    foreign key (store_id) references stores (id),
    foreign key (product_id) references products (id)    
);
insert into stock (store_id, product_id, quantity, price) values (1,2,10,4);
insert into stock (store_id, product_id, quantity, price) values (1,3,20,2);
insert into stock (store_id, product_id, quantity, price) values (2,2,20,4);


-- VIEW V_STOCK
create view v_stock as
select 
    i.id, 
    i.store_id, s.name as store_name, s.location as store_location,
    i.product_id, p.name as product_name, i.quantity, p.unit, i.price
from stock i
inner join stores s on s.id = i.store_id
inner join products p on p.id = i.product_id;


-- Table PARTNERS
create table partners (
    id 		int(10) not null auto_increment,
    name 	varchar(100) not null,
    location 	varchar(100) not null,
    primary key (id),
    unique key partners_idx1 (name)
);
insert into partners (name, location) values ('John & Sons','Eastern Side');
insert into partners (name, location) values ('Liliput Inc.','West Beach');
insert into partners (name, location) values ('John Smith','Sunny Street');
insert into partners (name, location) values ('Maria Cruz','South Side');
insert into partners (name, location) values ('Machinery Ltd.','North City');


-- Table PURCHASE_DOCS
create table purchase_docs (
    id 			int(10) not null auto_increment,
    creation_date 	date not null,
    store_id 		int(10) not null,
    supplier_id		int(10) not null,
    transaction_date 	date,
    primary key (id),
    foreign key (supplier_id) references partners (id),
    foreign key (store_id) references stores (id)
);

-- Table PURCHASE_PRODS
create table purchase_prods (
    id 			int(10) not null auto_increment,
    purchase_docs_id 	int(10) not null,
    product_id 		int(10) not null,
    quantity 		decimal(10,2),
    primary key (id),
    foreign key (purchase_docs_id) references purchase_docs (id),
    foreign key (product_id) references products (id)
);
    
-- Table SALES_DOCS
create table sales_docs (
    id 			int(10) not null auto_increment,
    creation_date 	date not null,
    store_id 		int(10) not null,
    customer_id		int(10) not null,
    transaction_date 	date,
    primary key (id),
    foreign key (customer_id) references partners (id),
    foreign key (store_id) references stores (id)
);

-- Table SALES_PRODS
create table sales_prods (
    id 			int(10) not null auto_increment,
    sales_docs_id 	int(10) not null,
    product_id 		int(10) not null,
    quantity 		decimal(10,2),
    price		decimal(10,2),
    primary key (id),
    foreign key (sales_docs_id) references sales_docs (id),
    foreign key (product_id) references products (id)
);
 


