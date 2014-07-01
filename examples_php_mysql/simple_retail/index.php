<?php
    if (sizeof($_POST)>0) {
        //die(json_encode($_POST));
        $ajax_args = json_decode($_POST["args"],true);
        if ($ajax_args["command"]=="test_call") {
            die(json_encode($ajax_args));
        } elseif ($ajax_args["command"]=="check_login") {
            
            // Check login info
            $username = stripslashes($ajax_args["param"]["USERNAME"]);
            $password = stripslashes($ajax_args["param"]["PASSWORD"]);            
            require_once("mysql_open.php");    
            $sql = "SELECT username FROM users WHERE username = :username AND password = :password"; 
            $stm = $conn->prepare($sql);
            $stm->bindValue(':username', $username, PDO::PARAM_STR);
            $stm->bindValue(':password', $password, PDO::PARAM_STR);
            $stm->execute();    
            $rowcount = $stm->rowCount();            
            require_once("mysql_close.php");
            if ($rowcount>0) {
                die("Login success!");
            } else {
                die("Login fail!");
            }
            
        } else {
            die("Unknown callname");
        }
    }
?>

<!DOCTYPE HTML>
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="../../files/css/style.css" />
        <script type="text/javascript" src="../../files/alat.js"></script>
        <script type="text/javascript" src="../../files/alat_gui_classic.js"></script>
        <script type="text/javascript" src="login.js"></script>
    </head>
    <body>
        <?php
            // echo "POST:" . json_encode($_POST) . " SIZE:" . sizeof($_POST);
        ?>
        <Script Language="JavaScript">
            alat.path = '../../';
            login_init();
        </script>
    </body>
</html>