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



-- TABLES (SIMPLIFIED ACCOUNTING EXAMPLE)

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

-- Table ACCOUNT_TYPES
create table account_types (
    id int(10) not null auto_increment,
    typename varchar(100) not null,
    debit_factor int(10),  -- 1 or -1
    credit_factor int(10), -- 1 or -1
    primary key (id),
    unique key acc_types_idx1 (typename)    
);
/*
                    Debit       Credit
----------------------------------------
Asset               Increase    Decrease
Liability           Decrease    Increase
Income (revenue)    Decrease    Increase
Expense             Increase    Decrease
Capital             Decrease    Increase
*/
insert into account_types (typename,debit_factor,credit_factor) values ('Asset',            1,-1);
insert into account_types (typename,debit_factor,credit_factor) values ('Liability',       -1, 1);
insert into account_types (typename,debit_factor,credit_factor) values ('Income (revenue)',-1, 1);
insert into account_types (typename,debit_factor,credit_factor) values ('Expense',          1,-1);
insert into account_types (typename,debit_factor,credit_factor) values ('Capital',         -1, 1);


-- Table ACCOUNTS

-- Table TRANS_JOURNAL

-- Table TRANS_JOURNAL_ENTRIES





