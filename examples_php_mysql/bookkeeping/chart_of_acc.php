<?php 
    // Login check
    session_start();
    if (!isset($_SESSION['username'])) {
        header('location:index.php');
    }
    
    function fetch_user_row($conn,$id) {
        $sql = "SELECT id, code, name, account_type_id, 
                       typename, parent_account_id 
                FROM v_account WHERE id = :id"; 
        $stm = $conn->prepare($sql);
        $stm->bindValue(':id',$id,PDO::PARAM_INT);
        $stm->execute();  
        $data = $stm->fetchAll(PDO::FETCH_NUM);
        $header = array("ID","CODE","NAME","ACCOUNT_TYPE_ID","TYPENAME", "PARENT_ACCOUNT_ID");
        $result= array("header"=>$header,"data"=>$data);       
        return $result;
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
        // Command: row_after
        elseif($ajax_args["command"]=="row_after") {
            if ($ajax_args["block"]["status"]=="UPDATE") {
                // die("alert('Params: " . $ajax_args["param"]["PARENT_ACCOUNT_ID"] . "');");
                require_once("mysql_open.php");    
                $id = $ajax_args["param"]["ID"];
                $code = $ajax_args["param"]["CODE"];
                $name = $ajax_args["param"]["NAME"];
                $account_type_id = $ajax_args["param"]["ACCOUNT_TYPE_ID"];
                $parent_account_id = $ajax_args["param"]["PARENT_ACCOUNT_ID"];                
                $sql = "UPDATE account 
                        SET code = :code,
                            name = :name,
                            account_type_id = :account_type_id,
                            parent_account_id = :parent_account_id
                        WHERE id = :id"; 
                $stm = $conn->prepare($sql);
                $stm->bindValue(':id',$id,PDO::PARAM_INT);
                $stm->bindValue(':code',$code,PDO::PARAM_INT);
                $stm->bindValue(':name',$name,PDO::PARAM_STR);
                $stm->bindValue(':account_type_id',$account_type_id,PDO::PARAM_INT);
                $stm->bindValue(':parent_account_id',$parent_account_id,PDO::PARAM_INT);
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
                $sql = "DELETE FROM account WHERE id = :id"; 
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
                $sql = "INSERT account (code, name, account_type_id, parent_account_id) 
                        VALUES (:code, :name, :account_type_id, :parent_account_id)"; 
                $stm = $conn->prepare($sql);
                $stm->bindValue(':code', $ajax_args["param"]["CODE"], PDO::PARAM_INT);
                $stm->bindValue(':name', $ajax_args["param"]["NAME"], PDO::PARAM_STR);
                $stm->bindValue(':account_type_id', $ajax_args["param"]["ACCOUNT_TYPE_ID"], PDO::PARAM_INT);
                $stm->bindValue(':parent_account_id', $ajax_args["param"]["PARENT_ACCOUNT_ID"], PDO::PARAM_INT);
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
