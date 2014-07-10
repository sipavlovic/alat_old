<?php
    session_start();
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
                //header('location:main.php');
                //die("Login success!");
                $_SESSION['username'] = $username;
                die("window.location='main.php'");
            } else {
                die("alert('Invalid username or password!');");
            }
            
        } else {
            die("Unknown command");
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
        <Script Language="JavaScript">
            alat.path = '../../';
            login_init();
        </script>
    </body>
</html>