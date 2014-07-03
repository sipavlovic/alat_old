<?php 
    // login check
    session_start();
    if (!isset($_SESSION['username'])) {
        header('location:index.php');
    }
?>

 
<!DOCTYPE HTML>
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="../../files/css/style.css" />
        <script type="text/javascript" src="../../files/alat.js"></script>
        <script type="text/javascript" src="../../files/alat_gui_classic.js"></script>
        <script type="text/javascript" src="main.js"></script>
    </head>
    <body>
        <Script Language="JavaScript">
            alat.path = '../../';
            alat.username = <?php
                echo "'" . $_SESSION['username'] . "'";
            ?>;
            main_init();
        </script>
    </body>
</html>