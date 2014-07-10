<?php 
    // Login check
    session_start();
    if (!isset($_SESSION['username'])) {
        header('location:index.php');
    }
    
    function fetch_user_row($conn,$id) {
        $sql = "SELECT id, username, password FROM user WHERE id = :id"; 
        $stm = $conn->prepare($sql);
        $stm->bindValue(':id',$id,PDO::PARAM_INT);
        $stm->execute();  
        $data = $stm->fetchAll(PDO::FETCH_NUM);
        $header = array("ID","USERNAME","PASSWORD");
        $result= array("header"=>$header,"data"=>$data,"test"=>100);       
        return $result;
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
            $sql = "SELECT id, username, password FROM user"; 
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
            // die("alert('Status: " . $ajax_args["block"]["status"] . "');");
            // die("alert('Args: ".json_encode($ajax_args)."');");
            // die("alert('Args: ".json_encode($_POST)."');");
            if ($ajax_args["block"]["status"]=="UPDATE") {
                require_once("mysql_open.php");    
                $id = $ajax_args["param"]["ID"];
                $password = $ajax_args["param"]["PASSWORD"];
                $sql = "UPDATE user SET password = :password WHERE id = :id"; 
                $stm = $conn->prepare($sql);
                $stm->bindValue(':id',$id,PDO::PARAM_INT);
                $stm->bindValue(':password',$password,PDO::PARAM_STR);
                $stm->execute();  
                $result = fetch_user_row($conn,$id);
                require_once("mysql_close.php");
                $ret = "";
                //$ret = $ret . "alert('Row updated. Id:'+".$id.");";
                //$ret = $ret . "alert('".json_encode($result)."');";
                $ret = $ret . "block.populate_row(".json_encode($result).");";
                die($ret);
            }
            elseif ($ajax_args["block"]["status"]=="DELETE") {
                require_once("mysql_open.php");    
                $id = $ajax_args["param"]["ID"];
                $sql = "DELETE FROM user WHERE id = :id"; 
                $stm = $conn->prepare($sql);
                $stm->bindValue(':id',$id,PDO::PARAM_INT);
                $stm->execute();  
                require_once("mysql_close.php");
                $ret = "";
                //$ret = $ret . "alert('Row deleted. Id:'+".$id.");";
                die($ret);
            }
            elseif ($ajax_args["block"]["status"]=="INSERT") {
                require_once("mysql_open.php");    
                $sql = "INSERT user (username, password) VALUES (:username,:password)"; 
                $stm = $conn->prepare($sql);
                $stm->bindValue(':username', $ajax_args["param"]["USERNAME"], PDO::PARAM_STR);
                $stm->bindValue(':password', $ajax_args["param"]["PASSWORD"], PDO::PARAM_STR);
                $stm->execute(); 
                $id = $conn->lastInsertId();
                $result = fetch_user_row($conn,$id);
                require_once("mysql_close.php");
                $ret = "";
                //$ret = $ret . "alert('Row inserted. Id:'+".$id.");";
                //$ret = $ret . "alert('".json_encode($result)."');";
                $ret = $ret . "block.populate_row(".json_encode($result).");";
                die($ret);
            }
        }
        
    }
?> 
