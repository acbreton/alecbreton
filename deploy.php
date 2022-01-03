<?php
    $tmp = shell_exec('eval $(ssh-agent -s) && ssh-add ~/.ssh/id_rsa_alecbreton && git pull 2>&1');
?>

<!DOCTYPE HTML>
<html lang="en-US">
    <head>
        <meta charset="UTF-8">
        <title>Git Deployment Script</title>
    </head>
    <body>
        $<?php echo htmlentities(trim($tmp)); ?>
    </body>
</html>