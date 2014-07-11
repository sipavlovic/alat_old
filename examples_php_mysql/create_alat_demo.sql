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


-- TABLES (BOOKKEEPING EXAMPLE)

-- Table USER
create table user (
    id int(10) not null auto_increment,
    username varchar(100) not null, 
    password varchar(100),
    primary key (id),
    unique key user_idx1 (username)
);
insert into user (username, password) values ('demo','demo');
insert into user (username, password) values ('guest','guest');
insert into user (username, password) values ('admin','admin');


-- Table ACCOUNT_TYPE
create table account_type (
    id int(10) not null,
    typename varchar(100) not null,
    debit_factor int(10),  -- 1 or -1
    credit_factor int(10), -- 1 or -1
    primary key (id),
    unique key acc_type_idx1 (typename)    
);
/*
                    Debit       Credit
----------------------------------------
Asset               Increase    Decrease
Liability           Decrease    Increase
Capital             Decrease    Increase
Income (revenue)    Decrease    Increase
Expense             Increase    Decrease
*/
insert into account_type (id,typename,debit_factor,credit_factor) values (1,'Asset',            1,-1);
insert into account_type (id,typename,debit_factor,credit_factor) values (2,'Liability',       -1, 1);
insert into account_type (id,typename,debit_factor,credit_factor) values (3,'Capital',         -1, 1);
insert into account_type (id,typename,debit_factor,credit_factor) values (4,'Income (revenue)',-1, 1);
insert into account_type (id,typename,debit_factor,credit_factor) values (5,'Expense',          1,-1);


-- Table ACCOUNT
create table account (
    id int(10) not null auto_increment,
    code int(10),
    name varchar(100) not null,
    account_type_id int(10) not null,
    parent_account_id int(10),
    primary key (id),
    unique key account_idx1 (name),    
    unique key account_idx2 (code),
    foreign key (account_type_id) references account_type (id),
    foreign key (parent_account_id) references account (id)
);    
insert into account (code,name,account_type_id,parent_account_id) values (1000,'Asset Accounts',1,null);
insert into account (code,name,account_type_id,parent_account_id) values (2000,'Liability Accounts',2,null);
insert into account (code,name,account_type_id,parent_account_id) values (3000,'Capital Accounts',3,null);
insert into account (code,name,account_type_id,parent_account_id) values (4000,'Income (revenue) Accounts',4,null);
insert into account (code,name,account_type_id,parent_account_id) values (5000,'Expense Accounts',5,null);


-- View V_ACCOUNT
create view v_account as 
select
    a.id,
    a.code,
    a.name,
    a.account_type_id,
    t.typename,
    t.debit_factor,
    t.credit_factor,
    a.parent_account_id
from account a
left outer join account_type t on a.account_type_id = t.id; 



-- Table TRANSACTION_STATUS
create table transaction_status (
    id int(10) not null,
    name varchar(100),
    primary key (id),
    unique key trans_status_idx1 (name)
);
insert into transaction_status (id,name) values (1,'Opened');
insert into transaction_status (id,name) values (2,'Closed');


-- Table TRANSACTION
create table transaction (
    id int(10) not null auto_increment,
    create_date date not null,
    comment varchar(100) not null,
    trans_status_id int(10) not null,
    primary key (id),
    foreign key (trans_status_id) references transaction_status (id)
);


-- Table TRANSACTION_NUMSEQ (Numbering sequence)
create table transaction_numseq (
    num int(10) not null auto_increment,
    trans_id int(10) not null,
    create_date date not null,
    primary key (num),
    unique key trans_numseq_idx1 (trans_id),
    foreign key (trans_id) references transaction (id)    
);


-- Table TRANSACTION_ENTRY
create table transaction_entry (
    id int(10) not null auto_increment,
    trans_id int(10) not null,
    account_id int(10) not null,
    comment varchar(100),
    debit decimal(10,2),
    credit decimal(10,2),
    primary key (id),
    foreign key (trans_id) references transaction (id),
    foreign key (account_id) references account (id)
);




