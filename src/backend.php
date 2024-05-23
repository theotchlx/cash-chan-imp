<?php
// This is the backend script. It handles and validates inputs from the client, then performs actions (login, register, send data, ...)
require_once __DIR__ . '/apifuncs/controlFunctions.php';
require_once __DIR__ . '/apifuncs/dataFunctions.php';

require_once __DIR__ . '/secrets.php';

// Establishing database connection. It is established now to avoid having to reconnect every time, which would be resource-intensive.
$dbcon = pg_connect("hostaddr=$dbhostaddr port=$dbport dbname=$dbname user=$dbuser password=$dbpassword");
if (!$dbcon) {  // Database connection failed.
    http_response_code(500);  // Internal server error.
    $response = 'Connection failed';  // Not sending an explicit error message to the client as a security measure.
    header('Content-Type: text/plain');
    echo $response;
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
    if ($_SERVER['REQUEST_URI'] === '/backend.php/login') {  // Client sends a login request
        // Extract username and password from POST data.
        $username = isset($postData['username']) ? $postData['username'] : '';  // If user sends empty data (undefined) it is set to '' and will be caught in validation functions.
        $password = isset($postData['password']) ? $postData['password'] : '';

        $token = generateToken(getUserID($dbcon, $username));

        // Creating an HTTP-only cookie with an expiry time of 1 hour
        setcookie('jwt', $token, [
            'expires' => time() + 3600,
            'path' => '/',
            'domain' => '',
            'secure' => false,  // For https.
            'httponly' => true,  // Only modifiable by the backend.
            'samesite' => 'Strict'
        ]);

        $response = login($dbcon, $username, $password);
        
        header('Content-Type: text/plain');

    } elseif ($_SERVER['REQUEST_URI'] === '/backend.php/register') {  // Client sends a registration request
        // Extract username, email and password from POST data.
        $username = isset($postData['username']) ? $postData['username'] : '';
        $email = isset($postData['email']) ? $postData['email'] : '';
        $password = isset($postData['password']) ? $postData['password'] : '';

        $response = register($dbcon, $username, $email, $password);

        header('Content-Type: text/plain');

    } else {  // Other cases apart from login or register.
        $clientToken = $_COOKIE['jwt'] ?? false;  // Getting the token from the cookie
        if($clientToken) {  // The cookie exists, we have the token
            $userID = validateToken($clientToken);
            if ($userID) {  // Token is valid

                if ($_SERVER['REQUEST_URI'] === '/backend.php/setchan') {  // Client sends a request to create a new Chan
                    // Extract title and description from POST data.
                    $title = isset($postData['title']) ? $postData['title'] : '';
                    $description = isset($postData['description']) ? $postData['description'] : '';
                    $rights = 't';  // Client user is the owner of this new Chan.
            
                    $response = setNewChan($dbcon, $userID, $title, $description, $rights);
            
                    header('Content-Type: text/plain');

                } elseif ($_SERVER['REQUEST_URI'] === '/backend.php/addchan') {  // Client sends a request to add a Chan
                    // Extract title, description and rights from POST data.
                    $username = isset($postData['username']) ? $postData['username'] : '';
                    $title = isset($postData['title']) ? $postData['title'] : '';
                    $rights = 'f';  // Client user is only a member of this new Chan.
            
                    $response = addNewChan($dbcon, $userID, $username, $title, $rights);
            
                    header('Content-Type: text/plain');

                } elseif ($_SERVER['REQUEST_URI'] === '/backend.php/modchan') {  // Client sends a request to create a new Chan
                    // Extract title and description from POST data.
                    $newTitle = isset($postData['newTitle']) ? $postData['newTitle'] : '';
                    $newDescription = isset($postData['newDescription']) ? $postData['newDescription'] : '';
                    $title = isset($postData['title']) ? $postData['title'] : '';
                    $owner = isset($postData['owner']) ? $postData['owner'] : '';
                    $rights = ($owner === '') ? 't' : 'f';  // Determine is client is chan owner or not.
                    
                    if ($rights === 't') {
                        $response = modifyChan($dbcon, $userID, $newTitle, $newDescription, $title);
                    } else {
                        http_response_code(401);  // Unauthorized.
                        $response = "This Chan does not belong to you";
                    }
            
                    header('Content-Type: text/plain');

                } elseif ($_SERVER['REQUEST_URI'] === '/backend.php/delchan') {  // Client sends a request to leave or delete a Chan
                    // Extract title and owner from POST data.
                    $title = isset($postData['title']) ? $postData['title'] : '';
                    $owner = isset($postData['owner']) ? $postData['owner'] : '';
                    $rights = ($owner === '') ? 't' : 'f';  // Determine if client is chan owner or not.
                    
                    if ($rights === 't') {
                        $response = deleteChan($dbcon, $userID, $title);
                    } else {
                        $response = leaveChan($dbcon, $userID, $title, $owner);
                    }
            
                    header('Content-Type: text/plain');
                
                } elseif ($_SERVER['REQUEST_URI'] === '/backend.php/setexp') {
                    $title = isset($postData['title']) ? $postData['title'] : '';
                    $amount = isset($postData['amount']) ? $postData['amount'] : '';
                    $user = isset($postData['user']) ? $postData['user'] : '';
                    $chanTitle = isset($postData['chanTitle']) ? $postData['chanTitle'] : '';
                    $chanOwner = isset($postData['chanOwner']) ? $postData['chanOwner'] : '';
                    $date = isset($postData['date']) ? $postData['date'] : '';
                    $chanOwner = ($chanOwner === '') ? getUsername($dbcon, $userID) : $chanOwner;
            
                    $response = createExpense($dbcon, $title, $amount, $user, $chanTitle, $chanOwner, $date);
            
                    header('Content-Type: text/plain');
                
                } elseif ($_SERVER['REQUEST_URI'] === '/backend.php/addexp') {
                    $title = isset($postData['title']) ? $postData['title'] : '';
                    $amount = isset($postData['amount']) ? $postData['amount'] : '';
                    $user = isset($postData['user']) ? $postData['user'] : '';
                    $chanTitle = isset($postData['chanTitle']) ? $postData['chanTitle'] : '';
                    $chanOwner = isset($postData['chanOwner']) ? $postData['chanOwner'] : '';
                    $chanOwner = ($chanOwner === '') ? getUsername($dbcon, $userID) : $chanOwner;
            
                    $response = addExpense($dbcon, $title, $amount, $user, $chanTitle, $chanOwner);
            
                    header('Content-Type: text/plain');
                
                } elseif ($_SERVER['REQUEST_URI'] === '/backend.php/delexp') {
                    $expTitle = isset($postData['expTitle']) ? $postData['expTitle'] : '';
                    $chanTitle = isset($postData['chanTitle']) ? $postData['chanTitle'] : '';
                    $chanOwner = isset($postData['chanOwner']) ? $postData['chanOwner'] : '';
                    $chanOwner = ($chanOwner === '') ? getUsername($dbcon, $userID) : $chanOwner;
            
                    $response = deleteExpense($dbcon, $userID, $expTitle, $chanOwner, $chanTitle);
            
                    header('Content-Type: text/plain');
                
                } elseif ($_SERVER['REQUEST_URI'] === '/backend.php/deltrans') {
                    $transOwner = isset($postData['transOwner']) ? $postData['transOwner'] : '';
                    $expTitle = isset($postData['expTitle']) ? $postData['expTitle'] : '';
                    $chanTitle = isset($postData['chanTitle']) ? $postData['chanTitle'] : '';
                    $chanOwner = isset($postData['chanOwner']) ? $postData['chanOwner'] : '';
                    $chanOwner = ($chanOwner === '') ? getUsername($dbcon, $userID) : $chanOwner;
            
                    $response = deleteTransaction($dbcon, $userID, $transOwner, $expTitle, $chanOwner, $chanTitle);
            
                    header('Content-Type: text/plain');
                
                } elseif ($_SERVER['REQUEST_URI'] === '/backend.php/addmem') {
                    $username = isset($postData['username']) ? $postData['username'] : '';
                    $owner = isset($postData['owner']) ? $postData['owner'] : '';
                    $title = isset($postData['title']) ? $postData['title'] : '';
                    $owner = ($owner === '') ? getUsername($dbcon, $userID) : $owner;
            
                    $response = addMember($dbcon, $username, $owner, $title);
            
                    header('Content-Type: text/plain');
                
                } elseif ($_SERVER['REQUEST_URI'] === '/backend.php/delmem') {
                    $username = isset($postData['username']) ? $postData['username'] : '';
                    $chanTitle = isset($postData['chanTitle']) ? $postData['chanTitle'] : '';
                    $chanOwner = isset($postData['chanOwner']) ? $postData['chanOwner'] : '';
                    $chanOwner = ($chanOwner === '') ? getUsername($dbcon, $userID) : $chanOwner;
            
                    $response = deleteMember($dbcon, $userID, $username, $chanOwner, $chanTitle);
            
                    header('Content-Type: text/plain');

                } else {
                    // Does not match any case: error
                    http_response_code(400);  // Bad request.
                    header('Content-Type: text/plain');
                    $response = 'Not a standard case';
                }
            } else {
                // Token is invalid, return an unauthorized response
                http_response_code(401);  // Unauthorized.
                header('Content-Type: text/plain');
                $response = 'Invalid token';
            }
        } else {  // There is no token cookie
            // Cookie is expired or has been deleted by the client browser
            http_response_code(401);  // Unauthorized.
            header('Content-Type: text/plain');
            $response = 'No authentication cookie';
        }
    }
    


// GET requests handling

} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $clientToken = $_COOKIE['jwt'] ?? false;  // Getting the token from the cookie
    if($clientToken) {  // Client has a jwt cookie.
        $userID = validateToken($clientToken);
        if ($userID) {  // Token is valid: we can authorize the client to login with only his cookie.
            if ($_SERVER['REQUEST_URI'] === '/backend.php/login') {  // The client is performing autoAuth() (login by validated jwt cookie)
                http_response_code(200);  // Ok.
                header('Content-Type: text/plain');
                $response = 'Valid token';

            } elseif ($_SERVER['REQUEST_URI'] === '/backend.php/logout') {  // The client is performing disAutoAuth() (disable auto login after clicking on 'disconnect')
                setcookie('jwt', '', [
                    'expires' => time() - 3600,
                    'path' => '/',
                    'samesite' => 'Strict'
                ]);

                http_response_code(200);  // Ok.
                header('Content-Type: text/plain');
                $response = 'Valid token';

            } elseif ($_SERVER['REQUEST_URI'] === '/backend.php/getuser') {
                $infolist = getUserInfo($dbcon, $userID);

                if ($infolist) {
                    http_response_code(200);  // Ok.
                    header('Content-Type: application/json');
                    $response = json_encode($infolist);
                } else {
                    http_response_code(404);  // Not found.
                    header('Content-Type: text/plain');
                    $response = 'User info not found';
                }

            } elseif ($_SERVER['REQUEST_URI'] === '/backend.php/getchans') {
                $chansList = getChansList($dbcon, $userID);

                if ($chansList) {
                    http_response_code(200);  // Ok.
                    header('Content-Type: application/json');
                    $response = json_encode($chansList);
                } else {
                    http_response_code(204);  // No content.
                    header('Content-Type: text/plain');
                    $response = 'No chans found';
                }  // User has no Chans.

            } elseif (strpos($_SERVER['REQUEST_URI'], '/backend.php/getexps') === 0) {  // If string starts with /backend.php/getexps.
                $queryString = parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY);  // Parse the url and return it's components.
                parse_str($queryString, $queryParams);  // Parse string into variables
                $title = isset($queryParams['title']) ? $queryParams['title'] : '';
                $owner = isset($queryParams['owner']) ? $queryParams['owner'] : '';
                if ($owner === '') {$owner = getUsername($dbcon, $userID);}

                $chanExpenses = getChanExpenses($dbcon, $title, $owner);

                if ($chanExpenses) {
                    http_response_code(200);  // Ok.
                    header('Content-Type: application/json');
                    $response = json_encode($chanExpenses);
                } else {
                    http_response_code(204);  // No content.
                    header('Content-Type: text/plain');
                    $response = 'No expenses found';
                }  // Chan has no expenses.

            } elseif (strpos($_SERVER['REQUEST_URI'], '/backend.php/gettrans') === 0) {  // If string starts with /backend.php/getexps.
                $queryString = parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY);  // Parse the url and return it's components.
                parse_str($queryString, $queryParams);  // Parse string into variables
                $title = isset($queryParams['title']) ? $queryParams['title'] : '';
                $chanTitle = isset($queryParams['chanTitle']) ? $queryParams['chanTitle'] : '';
                $chanOwner = isset($queryParams['chanOwner']) ? $queryParams['chanOwner'] : '';
                if ($chanOwner === '') {$chanOwner = getUsername($dbcon, $userID);}

                $transExpenses = getTransExpenses($dbcon, $title, $chanTitle, $chanOwner);

                if ($transExpenses) {
                    http_response_code(200);  // Ok.
                    header('Content-Type: application/json');
                    $response = json_encode($transExpenses);
                } else {
                    http_response_code(204);  // No content.
                    header('Content-Type: text/plain');
                    $response = 'No expenses found';
                }  // Chan has no expenses.

            } elseif (strpos($_SERVER['REQUEST_URI'], '/backend.php/getmems') === 0) {
                $queryString = parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY);
                parse_str($queryString, $queryParams);
                $title = isset($queryParams['title']) ? $queryParams['title'] : '';
                $owner = isset($queryParams['owner']) ? $queryParams['owner'] : '';
                if ($owner === '') {$owner = getUsername($dbcon, $userID);}

                $chanMembers = getChanMembers($dbcon, $title, $owner);

                if ($chanMembers) {
                    http_response_code(200);  // Ok.
                    header('Content-Type: application/json');
                    $response = json_encode($chanMembers);
                } else {
                    http_response_code(204);  // No content.
                    header('Content-Type: text/plain');
                    $response = 'No members found';
                }  // Chan has no expenses.
                
            } else {
                // Does not match any get query: error
                http_response_code(400);  // Bad request.
                header('Content-Type: text/plain');
                $response = 'Not a standard query';
            }
        } else {
            // Token is invalid, return an unauthorized response
            http_response_code(401);  // Unauthorized.
            header('Content-Type: text/plain');
            $response = 'Invalid token';
        }
    } else {  // There is no token cookie
        // Cookie is expired or has been deleted by the client browser
        http_response_code(401);  // Unauthorized.
        header('Content-Type: text/plain');
        $response = 'No authentication cookie';
    }
} else {
    // If the request method is not POST nor GET, return an error
    http_response_code(403);  // Forbidden.
    header('Content-Type: text/plain');
    $response = 'Method not supported';
}

// Send the response back to the client.
echo $response;
exit;  // Exiting right after sending back a response.
