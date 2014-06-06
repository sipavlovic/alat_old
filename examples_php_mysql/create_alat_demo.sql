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



-- TABLES

create table test (id INT, name VARCHAR(100));
insert into test values (1,'One');
insert into test values (2,'Two');
insert into test values (3,'Three');




