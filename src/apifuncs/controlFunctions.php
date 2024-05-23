<?php
// Module of functions used to validate input (perform authentication, ...)

require_once(__DIR__ . '/dataFunctions.php');

// This script receives the authentication credentials from the client (POST method) and verifies them. (data sent by loginUser function in auxFunctions.js)
// This script calls the Model functions to access the database.
// If the user crendentials are correct, the user is logged in and the session is created. The DOM is updated.


// The app integrates modified "POST" requests. It is not RESTful : a json data is send to a case switch in the backend instead of using params in the URL to decide how to control the body data.
// This was chosen to choose a solution that least used the URL and most used the sent data.
// The app integrates modified "POST" requests. It is not RESTful : this backend script uses a case switch instead of it's URL to decide how to control the body data.


//used in controller.php
function login($dbcon, $username, $password){
    // Perform authentication
    if (
        checkUserInDB($dbcon, $username) === true &&
        checkUserPassword($dbcon, getUserID($dbcon, $username), $password) === true
    ) {
        // Authentication successful.
        http_response_code(200);  // Ok.
        $response = 'Authentication successful';
    } else {
        // Session exists but authentication failed (should not happen in production environment). Happens if user is kept on login screen and attemps to connect again.
        http_response_code(401);  // Unauthorized.
        $response = 'Authentication failed';
        // For more info :  . print_r(checkUserPassword($dbcon, getUserID($dbcon, $username), $password), true) . print_r($_SESSION, true) . pg_last_error($dbcon)
    }
    return $response;
}


//used in controller.php
function register($dbcon, $username, $email, $password){
    // Check if username and email are correct
    if (
        checkUsernameValidity($username) === false ||
        checkEmailValidity($email) === false
    ) {
        http_response_code(401);
        $response = 'Credentials not accepted';
    } elseif (
        checkUserInDB($dbcon, $username) === false &&
        checkEmailInDB($dbcon, $email) === false
    ) {
        if (registerUserInDB($dbcon, $username, $email, $password)) {
            http_response_code(201);  // Created.
            $response = 'Registration successful';
        } else {
            http_response_code(500); // Internal server error.
            $response = 'Registration failed';
        }
    } else {
        http_response_code(409);  // Conflict.
        $response = 'Account already exists';
    }
    return $response;
}


function setNewChan($dbcon, $userID, $title, $description, $rights){
    // Check if title and description are correct
    if (
        checkTitleValidity($title) === false ||
        checkDescValidity($description) === false
    ) {
        http_response_code(401);
        $response = 'Inputs not accepted';
    } elseif (
        checkOwnChanBelongsInDB($dbcon, $userID, $title) === false  // Same user must not own two same chans.
    ) {
        if (setNewChanInDB($dbcon, $userID, $title, $description, $rights)) {
            http_response_code(201);  // Created.
            $response = 'Creation successful';
        } else {
            http_response_code(500); // Internal server error.
            $response = 'Creation failed';
        }
    } else {
        http_response_code(409);  // Conflict.
        $response = 'Chan already exists';
    }
    return $response;
}


function addNewChan($dbcon, $userID, $username, $title, $rights){
    if (
        checkUsernameValidity($username) === false ||
        checkTitleValidity($title) === false
    ) {
        http_response_code(401);
        $response = 'Inputs not accepted';
    } elseif (
        checkChanBelongsInDB($dbcon, $userID, getUserID($dbcon, $username), $title) === false  // Same user must not already be a member of the Chan.
    ) {
        if (addNewChanInDB($dbcon, $userID, $username, $title, $rights)) {
            http_response_code(201);  // Created.
            $response = 'Chan successfully added';
        } else {
            http_response_code(500); // Internal server error.
            $response = 'Cannot add Chan';
        }
    } else {
        http_response_code(409);  // Conflict.
        $response = 'Chan already exists';
    }
    return $response;
}


function modifyChan($dbcon, $userID, $newTitle, $newDescription, $title){
    // Check if title and description are correct
    if (
        checkTitleValidity($newTitle) === false ||
        checkDescValidity($newDescription) === false
    ) {
        http_response_code(401);
        $response = 'Inputs not accepted';
    } elseif (
        checkOwnChanBelongsInDB($dbcon, $userID, $newTitle) === false  // Same user must not own two same chans.
    ) {
        if (modifyChanInDB($dbcon, $userID, $newTitle, $newDescription, $title)) {
            http_response_code(201);  // Created.
            $response = 'Modification successful';
        } else {
            http_response_code(500); // Internal server error.
            $response = 'Modification failed';
        }
    } else {
        http_response_code(409);  // Conflict.
        $response = 'Chan already exists';
    }
    return $response;
}


function leaveChan($dbcon, $userID, $title, $owner){
    if (
        checkTitleValidity($title) === false
    ) {
        http_response_code(401);
        $response = 'Inputs not accepted';
    } elseif (
        checkChanBelongsInDB($dbcon, $userID, getUserID($dbcon, $owner), $title) === true  // Must be a member of the Chan to leave it.
    ) {
        if (leaveChanInDB($dbcon, $userID, $title, $owner)) {
            http_response_code(204);  // No Content.
            $response = 'Deletion successful';
        } else {
            http_response_code(500); // Internal server error.
            $response = 'Deletion failed';
        }
    } else {
        http_response_code(409);  // Conflict.
        $response = 'Chan does not exists';
    }
    return $response;
}


function deleteChan($dbcon, $userID, $title){
    if (
        checkTitleValidity($title) === false
    ) {
        http_response_code(401);
        $response = 'Inputs not accepted';
    } elseif (
        checkOwnChanBelongsInDB($dbcon, $userID, $title) === true  // Must own the Chan to delete it.
    ) {
        if (deleteChanInDB($dbcon, $userID, $title)) {
            http_response_code(204);  // No Content.
            $response = 'Deletion successful';
        } else {
            http_response_code(500); // Internal server error.
            $response = 'Deletion failed';
        }
    } else {
        http_response_code(409);  // Conflict.
        $response = 'Chan does not exists';
    }
    return $response;
}


function createExpense($dbcon, $title, $amount, $user, $chanTitle, $chanOwner, $date){
    // Check if title and description are correct
    if (
        checkTitleValidity($title) === false ||
        checkAmountValidity($amount) === false
    ) {
        http_response_code(401);  // Unauthorized.
        $response = 'Inputs not accepted';
    } elseif (
        checkExpenseInDB($dbcon, $title, $chanTitle, $chanOwner) === true
    ) {
        http_response_code(409);  // Conflict.
        $response = 'Transaction already exists';
    } elseif (
        checkUserInDB($dbcon, $user) === false ||
        checkChanBelongsInDB($dbcon, getUserID($dbcon, $user), getUserID($dbcon, $chanOwner), $chanTitle) === false &&
        checkOwnChanBelongsInDB($dbcon, getUserID($dbcon, $user), $chanTitle) === false
    ) {
        http_response_code(404);  // Not found.
        $response = 'Input user does not exist in this Chan';
    } elseif (
        checkOwnChanBelongsInDB($dbcon, getUserID($dbcon, $chanOwner), $chanTitle) === true
    ) {
        if (createExpenseInDB($dbcon, $title, $amount, $user, $chanTitle, $chanOwner, $date)) {
            http_response_code(201);  // Created.
            $response = 'Creation successful';
        } else {
            http_response_code(500); // Internal server error.
            $response = 'Creation failed';
        }
    } else {
        http_response_code(401);  // Unauthorized.
        $response = 'Input error';
    }
    return $response;
}


function addExpense($dbcon, $title, $amount, $user, $chanTitle, $chanOwner){
    // Check if title and description are correct
    if (
        checkTitleValidity($title) === false ||
        checkUsernameValidity($user) === false ||
        checkTitleValidity($chanTitle) === false ||
        checkAmountValidity($amount) === false
    ) {
        http_response_code(401);  // Unauthorized.
        $response = 'Inputs not accepted';
    } elseif (
        checkExpenseInDB($dbcon, $title, $chanTitle, $chanOwner) === false
    ) {
        http_response_code(404);  // Not found.
        $response = 'Transaction does not exists';
    } elseif (
        checkUserInDB($dbcon, $user) === false ||
        checkChanBelongsInDB($dbcon, getUserID($dbcon, $user), getUserID($dbcon, $chanOwner), $chanTitle) === false &&
        checkOwnChanBelongsInDB($dbcon, getUserID($dbcon, $user), $chanTitle) === false
    ) {
        http_response_code(404);  // Not found.
        $response = 'Input user does not exist in this Chan';
    } elseif (
        checkOwnChanBelongsInDB($dbcon, getUserID($dbcon, $chanOwner), $chanTitle) === true
    ) {
        if (addExpenseInDB($dbcon, $title, $amount, $user, $chanTitle, $chanOwner)) {
            http_response_code(201);  // Created.
            $response = 'Creation successful';
        } else {
            http_response_code(401); // Internal server error.
            $response = 'This user already made an expense';
        }
    } else {
        http_response_code(401);  // Unauthorized.
        $response = 'Input error';
    }
    return $response;
}


function deleteExpense($dbcon, $userID, $expTitle, $chanOwner, $chanTitle){
    if (
        checkChanBelongsInDB($dbcon, $userID, getUserID($dbcon, $chanOwner), $chanTitle) === false &&
        checkOwnChanBelongsInDB($dbcon, $userID, $chanTitle) === false
    ) {
        http_response_code(401);
        $response = 'You are not part of this Chan';
    } elseif (
        checkExpenseInDB($dbcon, $expTitle, $chanTitle, $chanOwner) === true
    ) {
        if (deleteExpenseInDB($dbcon, $expTitle, $chanOwner, $chanTitle)) {
            http_response_code(204);  // No Content.
            $response = 'Deletion successful';
        } else {
            http_response_code(500); // Internal server error.
            $response = 'Deletion failed';
        }
    } else {
        http_response_code(404);
        $response = 'This is not an expense of this Chan';
    }
    return $response;
}


function deleteTransaction($dbcon, $userID, $transOwner, $expTitle, $chanOwner, $chanTitle){
    if (
        checkChanBelongsInDB($dbcon, $userID, getUserID($dbcon, $chanOwner), $chanTitle) === false &&
        checkOwnChanBelongsInDB($dbcon, $userID, $chanTitle) === false
    ) {
        http_response_code(401);
        $response = 'You are not part of this Chan';
    } elseif (
        checkExpenseInDB($dbcon, $expTitle, $chanTitle, $chanOwner) === true
    ) {
        if (deleteTransInDB($dbcon, $transOwner, $expTitle, $chanOwner, $chanTitle)) {
            http_response_code(204);  // No Content.
            $response = 'Deletion successful';
        } else {
            http_response_code(500); // Internal server error.
            $response = 'Deletion failed';
        }
    } else {
        http_response_code(404);
        $response = 'This is transaction is not part of this Chan';
    }
    return $response;
}


// Members CRUD control


function addMember($dbcon, $username, $owner, $title){
    if (
        checkUsernameValidity($username) === false ||
        checkTitleValidity($title) === false
    ) {
        http_response_code(401);  // Unauthorized.
        $response = 'Inputs not accepted';
    } elseif (
        checkUserInDB($dbcon, $username) === false
    ) {
        http_response_code(404);  // Not found.
        $response = 'Input user does not exist';
    } elseif (
        checkChanBelongsInDB($dbcon, getUserID($dbcon, $username), getUserID($dbcon, $owner), $title) === true ||
        checkOwnChanBelongsInDB($dbcon, getUserID($dbcon, $username), $title) === true
    ) {
        http_response_code(404);  // Not found.
        $response = 'Input user already exists in this Chan';
    } elseif (
        checkOwnChanBelongsInDB($dbcon, getUserID($dbcon, $owner), $title) === true
    ) {
        if (addMemberInDB($dbcon, $username, $owner, $title)) {
            http_response_code(201);  // Created.
            $response = 'Creation successful';
        } else {
            http_response_code(500); // Internal server error.
            $response = 'Creation failed';
        }
    } else {
        http_response_code(401);  // Unauthorized.
        $response = 'Input user already exists in Chan'.checkChanBelongsInDB($dbcon, getUserID($dbcon, $username), getUserID($dbcon, $owner), $title).'|'.checkOwnChanBelongsInDB($dbcon, getUserID($dbcon, $username), $title);
    }
    return $response;
}


function deleteMember($dbcon, $userID, $username, $chanOwner, $chanTitle){
    if (
        checkUsernameValidity($username) === false ||
        checkUserInDB($dbcon, $username) === false
    ) {
        http_response_code(404);
        $response = 'User not valid';
    } elseif (
        checkChanBelongsInDB($dbcon, getUserID($dbcon, $username), getUserID($dbcon, $chanOwner), $chanTitle) === false &&
        checkOwnChanBelongsInDB($dbcon, getUserID($dbcon, $username), $chanTitle) === true
    ) {
        http_response_code(401);
        $response = 'You cannot remove this user from this Chan';
    } elseif (
        checkChanBelongsInDB($dbcon, getUserID($dbcon, $username), getUserID($dbcon, $chanOwner), $chanTitle) === false &&
        checkOwnChanBelongsInDB($dbcon, getUserID($dbcon, $username), $chanTitle) === false
    ) {
        http_response_code(401);
        $response = 'This user is not a member of this Chan';
    } elseif (
        checkOwnChanBelongsInDB($dbcon, $userID, $chanTitle) === true  // Must own the Chan to remove a member from it.
    ) {
        if (deleteMemberInDB($dbcon, $userID, getUserID($dbcon, $username), $chanTitle)) {
            http_response_code(204);  // No Content.
            $response = 'Deletion successful';
        } else {
            http_response_code(500); // Internal server error.
            $response = 'Deletion failed';
        }
    } else {
        http_response_code(401);
        $response = 'You are not allowed to remove members';
    }
    return $response;
}


// Below are functions that define validity checks for the received inputs. They are revalidated if the user ever

function checkUsernameValidity($username) {
    // username must be 16 characters or less, and contain no special characters or empty characters (so only letters and numbers)
    return strlen($username) >= 0 && strlen($username) <= 16 && preg_match('/^[a-zA-Z0-9\p{L}]+$/u', $username);
}


function checkEmailValidity($email) {
    // Perform email validation
    return filter_var($email, FILTER_VALIDATE_EMAIL) === $email;
}


function checkAmountValidity($amount) {
    // Amount is not an empty string.
    if (!is_string($amount) || trim($amount) === '') {
        return false;
    }

    $numericAmount = floatval($amount);
    if (!is_numeric($numericAmount)) {
        return false;
    }

    // amount must not overflow.
    $maxRealValue = PHP_INT_MAX;
    if ($numericAmount > $maxRealValue) {
        return false;
    }

    return true;
}


function checkDateValidity($date) {
    // Regular expression to match the 'day/month/year' format.
    $dateRegex = '/^\d{1,2}\/\d{1,2}\/\d{4}$/';

    if (!preg_match($dateRegex, $date)) {
        return false;
    }

    list($day, $month, $year) = explode('/', $date);
    $dayInt = intval($day);
    $monthInt = intval($month);
    $yearInt = intval($year);

    if (
        !is_numeric($dayInt) || !is_numeric($monthInt) || !is_numeric($yearInt) ||
        $dayInt < 1 || $dayInt > 31 ||
        $monthInt < 1 || $monthInt > 12 ||
        $yearInt < 1000 || $yearInt > 9999
    ) {
        return false;
    }

    return true;
}


// Authentication token functions

function validateToken($token){
    global $secretKey;

    list($header, $payload, $signature) = explode('.', $token);

    // Decode payload from Base64Url
    $decodedPayload = str_replace(['-', '_'], ['+', '/'], $payload);
    $decodedPayload = json_decode(base64_decode($decodedPayload), true);

    // Get cookie expiration date
    $expiration = $decodedPayload['exp'];

    // Validate the signature
    $calculatedSignature = base64_encode(hash_hmac('sha256', "$header.$payload", $secretKey, true));

    if ($calculatedSignature === $signature && $expiration - time() > 0) {
        // If signature is valid and cookie is not expired, return the decoded payload
        return $decodedPayload['id'];
    }

    return false; // Signature verification failed or token expired
}


function generateToken($userID){
    global $secretKey;

    $header = base64_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
    $payload = base64_encode(json_encode(['id' => $userID, 'iat' => time(), 'exp' => time() + 3600]));

    // Creating the signature using HMAC with SHA-256
    $signature = base64_encode(hash_hmac('sha256', "$header.$payload", $secretKey, true));

    // Encoding header, payload, and signature to Base64Url


    // Combining the header, payload, and signature to create the token
    $token = "$header.$payload.$signature";// Create token header as a JSON string

    return $token;
}


// Chan checks


function checkTitleValidity($title){
    // username must be 32 characters or less
    return strlen($title) > 0 && strlen($title) <= 32;
}


function checkDescValidity($description){
    // username must be 64 characters or less
    return strlen($description) > 0 && strlen($description) <= 64;
}

?>
