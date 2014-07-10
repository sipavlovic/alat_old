<?php
	$mysql_hostname = 'localhost';
	$mysql_username = 'alat_user';
	$mysql_password = 'alat_user';
	$mysql_dbname = 'alat_demo';
	
	$conn = new PDO('mysql:host='.$mysql_hostname.';dbname='.$mysql_dbname, $mysql_username, $mysql_password) or die("Could not connect to database!");	
?>