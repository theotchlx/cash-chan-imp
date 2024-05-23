<?php

// This file must not exist in a deployed environment.
// If you choose to keep this file, modify its rights to restrict its access.


// For server deployment with Nginx / Apache / ...  ################################

// Server environment variables (for PHP FPM). Those parameters' values do not appear in the code, they are set in the Nginx/... configuration file.
// This configuration file has restricted access.
// Using environment variables increases modularity and security.
/*
$dbhostaddr = getenv('DB_HOSTADDR');
$dbport = getenv('DB_PORT');
$dbname = getenv('DB_NAME');
$dbuser = getenv('DB_USER');
$dbpassword = getenv('DB_PASSWD');
$secretKey = getenv('TOKENKEY');
*/

// For a local deployment:  ################################
$dbhostaddr = '127.0.0.1';  // IP of the Postgres VM.
$dbport = '5432';  // Port that Postgres is listening to on the VM.
$dbname = 'anything';  // Name of the remote database.
$dbuser = 'anything';  // Name of the remote database's user.
$dbpassword = 'a secure anything';  // Remote database password.
$secretKey = 'a secure anything';  // Secret key used to generate and validate JSON Web tokens.

?>
