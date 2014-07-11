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
            readfile('chart_of_acc.js');
            die();
        }
        // Command: populate
        elseif($ajax_args["command"]=="populate") {
            // initial data populate
            require_once("mysql_open.php");    
            $sql = "SELECT id, code, name, account_type_id, typename, parent_account_id FROM v_account"; 
            $stm = $conn->prepare($sql);
            $stm->execute();  
            $data = $stm->fetchAll(PDO::FETCH_NUM);
            $header = array("ID","CODE","NAME","ACCOUNT_TYPE_ID","TYPENAME","PARENT_ACCOUNT_ID");
            $result= array("header"=>$header,"data"=>$data);
            require_once("mysql_close.php");
            die("block.populate_all(" . json_encode($result) . ");");
        }
    }
    
?> 
