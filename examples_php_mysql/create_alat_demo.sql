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
    id int(10) not null auto_increment,
    username varchar(100) not null, 
    password varchar(100),
    primary key (id),
    unique key users_idx1 (username)
);
insert into users (username, password) values ('demo','demo');
insert into users (username, password) values ('guest','guest');
insert into users (username, password) values ('admin','admin');

-- Table PRODUCTS 
create table products (
    id int(10) not null auto_increment,
    name varchar(100) not null,
    unit varchar(10) not null,
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
    id int(10) not null auto_increment,
    name varchar(100) not null,
    location varchar(100) not null,
    primary key (id),
    unique key stores_idx1 (name)
);
insert into stores (name,location) values ('Blue store','East');
insert into stores (name,location) values ('Yellow store','West');
insert into stores (name,location) values ('Black store','North');
insert into stores (name,location) values ('Red store','South');
insert into stores (name,location) values ('White store','Center');


-- Table INVENTORY
create table inventory (
    id int(10) not null auto_increment,
    store_id int(10),
    product_id int(10),
    quantity decimal(10,2),
    price decimal(10,2),
    primary key (id),
    unique key inventory_idx1 (store_id, product_id),
    foreign key (store_id) references stores (id),
    foreign key (product_id) references products (id)    
);
insert into inventory (store_id, product_id, quantity, price) values (1,2,10,4);
insert into inventory (store_id, product_id, quantity, price) values (1,3,20,2);
insert into inventory (store_id, product_id, quantity, price) values (2,2,20,4);


-- VIEW V_INVENTORY
create view v_inventory as
select 
    i.id, 
    i.store_id, s.name as store_name, s.location as store_location,
    i.product_id, p.name as product_name, i.quantity, p.unit, i.price
from inventory i
inner join stores s on s.id = i.store_id
inner join products p on p.id = i.product_id;


