<?php
    if (sizeof($_POST)>0) {
        die(json_encode($_POST));
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