<?php
require_once(__DIR__ . '/apifuncs/controlFunctions.php');

// Establishing database connection. It is established now to avoid having to reconnect every time, which would be resource-intensive.
$dbcon = pg_connect("hostaddr=192.168.122.137 port=5432 dbname=postgres user=cashchan password=cashchan");
if (!$dbcon) {  // Database connection failed.
    $response = array('status' => 'error', 'message' => 'Connection failed');  // Not sending an explicit error message to the client as a security measure.
    header('Content-Type: application/json');  // Please clean me those ridiculous headers.
    echo json_encode($response);
    die('Connection failed: ' . pg_last_error());  // die (like exit) stops the script immediatly (so it doesn't crash further down).
}
// If successfully established, the connection will close automatically when this script ends.


// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {  // php://input is a read-only stream that allows you to read raw data from the request body.
    // First, we read the POST raw body data (it is json in this case).
    $postData = file_get_contents('php://input');
    // Then we decode it into a PHP array.
    $postData = json_decode($postData, true);  // true to decode to an array.
    // $postData will be null if decoding failed.

    // This script handles different control cases.
    switch ($postData['case']) {
        case 'login':
            // Extract username and password from POST data.
            $username = $postData['username'];
            $password = $postData['password'];

            $response = login($dbcon, $username, $password);
            header('Content-Type: application/json');
            echo json_encode($response);

            break;
        case 'register':
            // Extract username and password from POST data.
            $username = $postData['username'];
            $email = $postData['email'];
            $password = $postData['password'];

            $response = register($dbcon, $username, $email, $password);
            header('Content-Type: application/json');
            echo json_encode($response);

            break;
        default:
            // Does not match any case: error
            $response = array('status' => 'error', 'message' => 'Not a standard case');

            // Send the JSON response back to the client
            //header('HTTP/1.1 200 OK'); maybe integrate the 200 codes later ?
            header('Content-Type: application/json');
            echo json_encode($response);
    }
} else {
    $response = array('status' => 'error', 'message' => 'Method not allowed');
    // If the request method is not POST, return an error
    header('HTTP/1.1 405 Method Not Allowed');
    header('Allow: POST');
    echo json_encode($response);
}
