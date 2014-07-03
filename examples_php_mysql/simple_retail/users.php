<?php 
    // Login check
    session_start();
    if (!isset($_SESSION['username'])) {
        header('location:index.php');
    }

    // If post args
    if (sizeof($_POST)>0) {
        $ajax_args = json_decode($_POST["args"],true);
        
        // Command: init
        if ($ajax_args["command"]=="init") {
            // Load users.js
            header('Content-Type: text/javascript');
            readfile('users.js');
            die();
        }
        // Command: populate
        elseif($ajax_args["command"]=="populate") {
            // initial data populate
            require_once("mysql_open.php");    
            $sql = "SELECT id, username, password FROM users"; 
            $stm = $conn->prepare($sql);
            $stm->execute();  
            $data = $stm->fetchAll(PDO::FETCH_NUM);
            $header = array("ID","USERNAME","PASSWORD");
            $result= array("header"=>$header,"data"=>$data);
            require_once("mysql_close.php");
            die("block.populate_all(" . json_encode($result) . ");");
        }
        // Command: row_after
        elseif($ajax_args["command"]=="row_after") {
            die("alert('Status: " . $ajax_args["block"]["status"] . "');");
        }
        
    }
?> 
