<?php
    $command = 'eval $(ssh-agent -s) ssh-add ~/.ssh/id_rsa_alecbreton && git pull 2>&1';

    $output = '';
    $tmp = shell_exec($command);

    $output .= "<span style=\"color: #6BE234;\">\$</span><span style=\"color: #729FCF;\">{$command}\n</span><br />";
    $output .= htmlentities(trim($tmp)) . "\n<br /><br />";
?>

<!DOCTYPE HTML>
<html lang="en-US">
    <head>
        <meta charset="UTF-8">
        <title>Git Deployment Script</title>
    </head>
    <body>
        <div>
            <?php echo $output; ?>
        </div>
    </body>
</html>