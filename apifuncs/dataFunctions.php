<?php
// Module of functions that interact with the database.

// I only use parametrized SQL queries as a security measure to avoid SQL injection.
// The database connection is made in the script files that integrate this module; this is to save resources as, database connections are costly.


function registerUserInDB($dbcon, $username, $email, $password){
    // This function checks if the user is in the database from it's username.

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);  // Password is further encrypted when written to db. Bcrypt algorithm is used.

    $query = "INSERT INTO users (username, email, password) VALUES ($1, $2, $3)";
    $result = pg_query_params($dbcon, $query, [$username, $email, $hashedPassword]);
    if ($result) {
        return true;
    }
    return false;
}


function checkUserInDB($dbcon, $username){
    // This function checks if the user is in the database from it's username.
    $query = "SELECT COUNT(*) FROM users WHERE username = $1";
    $result = pg_query_params($dbcon, $query, [$username]);
    if ($result) {
        $row = pg_fetch_row($result);  // Extract row data from postgres query result.
        $count = intval($row[0]);
    
        if ($count > 0) {
            return true; // Username exists at least once (should only exist once in the database).
        } else {
            return false; // Username does not exist (can be registered).
        }
    } else {
        // Error during query execution.
        die('query failed: ' . pg_last_error($dbcon));
    }
}


function checkEmailInDB($dbcon, $email){
    // This function checks if the user is in the database from it's username.

    $query = "SELECT COUNT(*) FROM users WHERE email = $1";
    $result = pg_query_params($dbcon, $query, [$email]);
    if ($result) {
        $row = pg_fetch_row($result);  // Extract row data from postgres query result.
        $count = intval($row[0]);
    
        if ($count > 0) {
            return true; // Email exists at least once (should only exist once in the database).
        } else {
            return false; // Email does not exist (can be registered).
        }
    } else {
        // Error during query execution.
        die('query failed: ' . pg_last_error($dbcon));
    }
}


function checkOwnChanBelongsInDB($dbcon, $userID, $title){
    // This function checks if the given Chan name is the name of a Chan owned by the given user.

    $query = "SELECT COUNT(*) FROM chans c INNER JOIN belongs b ON c.id = b.chanid WHERE b.userid = $1 AND c.title = $2 AND b.rights = 't'";
    $result = pg_query_params($dbcon, $query, [$userID, $title]);
    if ($result) {
        $row = pg_fetch_row($result);  // Extract row data from postgres query result.
        $count = intval($row[0]);

        if ($count > 0) {
            return true; // Chan exists at least once for this owner user (should only exist once in the database, per owner).
        } else {
            return false; // Chan does not exist (can be created).
        }
    } else {
        // Error during query execution.
        die('query failed: ' . pg_last_error($dbcon));
    }
}


function checkChanBelongsInDB($dbcon, $userID, $idowner, $title){
    // This function checks if the user is already a member of the Chan with the given name.
    
    $chanID = getChanID($dbcon, $idowner, $title);
    if ($chanID) {
        $query = "SELECT COUNT(*) FROM chans c INNER JOIN belongs b ON c.id = b.chanid WHERE b.userid = $1 AND c.id = $2 AND b.rights = 'f'";
        $result = pg_query_params($dbcon, $query, [$userID, $chanID]);
        if ($result) {
            $row = pg_fetch_row($result);  // Extract row data from postgres query result.
            $count = intval($row[0]);

            if ($count > 0) {
                return true; // Chan exists at least once for this user.
            } else {
                return false; // Chan does not exist (can be added).
            }
        } else {
            // Error during query execution.
            die('query failed: ' . pg_last_error($dbcon));
        }
    } else {
        return false; // Chan does not exist (can't be added).
    }
}


function checkUserPassword($dbcon, $id, $password){
    // This function checks if the user and password are the correct ones from the database.

    $query = "SELECT password FROM users WHERE id = $1";
    $result = pg_query_params($dbcon, $query, [$id]);
    if ($result) {
        $row = pg_fetch_row($result);  // Extract row data from postgres query result.
        $count = intval($row[0]);

        if ($row) {  // Password row exists.
            return password_verify($password, $row[0]);
        } else {  // No matching result.
            return false;
        }
    } else {
        // Error during query execution.
        die('query failed: ' . pg_last_error($dbcon));
    }
}


function getUserID($dbcon, $username){
    // This function returns the user ID corresponding to a username.

    $query = "SELECT id FROM users WHERE username = $1";
    $result = pg_query_params($dbcon, $query, [$username]);
    if ($result) {
        $row = pg_fetch_row($result);  // Extract row data from postgres query result.
    
        if ($row) {  // Row exists.
            return $row[0];
        } else {  // No matching result.
            return false;
        }
    } else {
        // Error during query execution.
        die('query failed: ' . pg_last_error($dbcon));
    }
}


function getUsername($dbcon, $userID){
    // This function returns the username corresponding to a userID.

    $query = "SELECT username FROM users WHERE id = $1";
    $result = pg_query_params($dbcon, $query, [$userID]);
    if ($result) {
        $row = pg_fetch_row($result);  // Extract row data from postgres query result.
    
        if ($row) {  // Row exists.
            return $row[0];
        } else {  // No matching result.
            return false;
        }
    } else {
        // Error during query execution.
        die('query failed: ' . pg_last_error($dbcon));
    }
}


function getChanID($dbcon, $idowner, $title){
    // This function returns the user ID corresponding to a username.

    $query = "SELECT c.id FROM chans c INNER JOIN belongs b ON b.chanid = c.id WHERE b.userid = $1 AND c.title = $2 AND b.rights = 't'";
    $result = pg_query_params($dbcon, $query, [$idowner, $title]);
    if ($result) {
        $row = pg_fetch_row($result);  // Extract row data from postgres query result.
    
        if ($row) {  // Row exists.
            return $row[0];
        } else {  // No matching result.
            return false;
        }
    } else {
        // Error during query execution.
        die('query failed: ' . pg_last_error($dbcon));
    }
}


function getChanOwnerID($dbcon, $idchan){
    // This function returns the user ID corresponding to a username.

    $query = "SELECT u.id FROM users u INNER JOIN belongs b ON u.id = b.userid WHERE b.chanid = $1 AND b2.rights = 't'";
    $result = pg_query_params($dbcon, $query, [$idchan]);
    if ($result) {
        $row = pg_fetch_row($result);  // Extract row data from postgres query result.
    
        if ($row) {  // Row exists.
            return $row[0];
        } else {  // No matching result.
            return false;
        }
    } else {
        // Error during query execution.
        die('query failed: ' . pg_last_error($dbcon));
    }
}


function getUserEmail($dbcon, $id){
    // This function returns the email corresponding to a user ID.

    $query = "SELECT email FROM users WHERE id = $1";
    $result = pg_query_params($dbcon, $query, [$id]);
    if ($result) {
        $row = pg_fetch_row($result);  // Extract row data from postgres query result.
    
        if ($row) {  // Row exists.
            return $row[0];
        } else {  // No matching result.
            return false;
        }
    } else {
        // Error during query execution.
        die('query failed: ' . pg_last_error($dbcon));
    }
}


// Chans CRUD functions.

function getChansList($dbcon, $userID){
    // This function returns the chans corresponding to a user ID.
 
    $query = "SELECT c.title, c.description, b.rights, (SELECT u.username FROM users u INNER JOIN belongs b2 ON u.id = b2.userid WHERE b2.chanid = c.id AND b2.rights = 't') AS owner FROM chans c INNER JOIN belongs b ON c.id = b.chanid WHERE b.userid = $1";
    $result = pg_query_params($dbcon, $query, [$userID]);
    if ($result) {
        $table = pg_fetch_all($result);
    
        if ($table) {  // Row exists.
            return $table;
        } else {  // No matching result.
            return false;
        }
    } else {
        // Error during query execution.
        die('query failed: ' . pg_last_error($dbcon));
    }
}

function getChansOwner($dbcon, $chanID){
    // This function returns the username of the owner of a Chan.
 
    $query = "SELECT username AS owner FROM chans c INNER JOIN belongs b ON c.id = b.chanid WHERE rights = 't' and chanid = $1";
    $result = pg_query_params($dbcon, $query, [$chanID]);
    if ($result) {
        $table = pg_fetch_all($result);
    
        if ($table) {  // Row exists.
            return $table;
        } else {  // No matching result.
            return false;
        }
    } else {
        // Error during query execution.
        die('query failed: ' . pg_last_error($dbcon));
    }
}


function setNewChanInDB($dbcon, $id, $title, $description, $rights){
    $query = "INSERT INTO chans(title, description) VALUES ($1, $2)";
    $result = pg_query_params($dbcon, $query, [$title, $description]);

    if ($result) {
        $query = "SELECT MAX(c.id) FROM chans c";  // Get id of last created chan.
        $result = pg_query($dbcon, $query);

        if ($result) {
            $row = pg_fetch_row($result);  // Extract row data from postgres query result.

            if ($row) {  // Row exists.
                $chanID = $row[0];
                $query = "INSERT INTO belongs(userid, chanid, rights) VALUES ($1, $2, $3)";
                $result = pg_query_params($dbcon, $query, [$id, $chanID, $rights]);
    
                return $result;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}


function addNewChanInDB($dbcon, $id, $ownername, $title, $rights){
    $ownerID = getUserID($dbcon, $ownername);
    $chanID = getChanID($dbcon, $ownerID, $title);

    if ($chanID) {
        $query = "INSERT INTO belongs(userid, chanid, rights) VALUES ($1, $2, $3)";
        $result = pg_query_params($dbcon, $query, [$id, $chanID, $rights]);
    
        return $result;
    }
    return false;
}


function modifyChanInDB($dbcon, $userID, $newTitle, $newDescription, $title){
    $chanID = getChanID($dbcon, $userID, $title);

    if ($chanID) {
        $query = "UPDATE chans SET title = $1, description = $2 WHERE id = $3";
        $result = pg_query_params($dbcon, $query, [$newTitle, $newDescription, $chanID]);

        return $result;
    } else {
        return false;
    }
}


function leaveChanInDB($dbcon, $userID, $title, $ownername){
    $idowner = getUserID($dbcon, $ownername);
    $chanID = getChanID($dbcon, $idowner, $title);

    if ($chanID) {
        $query = "DELETE FROM fulfills f WHERE f.transid IN (SELECT t.id FROM transactions t WHERE t.chanid = $1) AND f.userid = $2";
        $result = pg_query_params($dbcon, $query, [$chanID, $userID]);  // Delete transactions from fulfills table.

        $query = "DELETE FROM transactions t WHERE t.chanid = $1 AND f.userid = $2 AND t.id IN (SELECT f.transid FROM fulfills f)";
        $result = pg_query_params($dbcon, $query, [$chanID, $userID]);  // Delete Chan from transactions table.

        $query = "DELETE FROM belongs b WHERE b.userid = $1 AND b.chanid = $2";
        $result = pg_query_params($dbcon, $query, [$userID, $chanID]);
    
        return $result;
    }
    return false;
}


function deleteChanInDB($dbcon, $userID, $title){
    $chanID = getChanID($dbcon, $userID, $title);

    if ($chanID) {
        $query = "DELETE FROM fulfills f WHERE f.transid IN (SELECT t.id FROM transactions t WHERE t.chanid = $1)";
        $result = pg_query_params($dbcon, $query, [$chanID]);  // Delete transactions from fulfills table.

        $query = "DELETE FROM transactions t WHERE t.chanid = $1";
        $result = pg_query_params($dbcon, $query, [$chanID]);  // Delete Chan from transactions table.

        $query = "DELETE FROM belongs b WHERE b.chanid = $1";
        $result = pg_query_params($dbcon, $query, [$chanID]);  // Delete Chan from belongs table.

        if ($result) {
            $query = "DELETE FROM chans c WHERE c.id = $1";
            $result = pg_query_params($dbcon, $query, [$chanID]);  // Delete Chan from chans table.

            return $result;
        }
        return false;
    }
    return false;
}


// Expenses CRUD

function getChanExpenses($dbcon, $title, $owner){
    // This function returns the chans corresponding to a user ID.
    $ownerID = getUserID($dbcon, $owner);
    $chanID = getChanID($dbcon, $ownerID, $title);
 
    $query = "SELECT distinct t.title, t.amount, t.date FROM transactions t INNER JOIN fulfills f ON t.id = f.transid WHERE t.chanid = $1";
    $result = pg_query_params($dbcon, $query, [$chanID]);
    if ($result) {
        $table = pg_fetch_all($result);
    
        if ($table) {  // Row exists.
            return $table;
        } else {  // No matching result.
            return false;
        }
    } else {
        // Error during query execution.
        die('query failed: ' . pg_last_error($dbcon));
    }
}

function getTransExpenses($dbcon, $title, $chanTitle, $chanOwner){
    // This function returns the chans corresponding to a user ID.
    $chanOwnerID = getUserID($dbcon, $chanOwner);
    $chanID = getChanID($dbcon, $chanOwnerID, $chanTitle);
 
    $query = "SELECT u.username as owner, f.part FROM fulfills f INNER JOIN users u ON u.id = f.userid INNER JOIN transactions t ON t.id = f.transid WHERE t.chanid = $1 AND t.title = $2";
    $result = pg_query_params($dbcon, $query, [$chanID, $title]);
    if ($result) {
        $table = pg_fetch_all($result);
    
        if ($table) {  // Row exists.
            return $table;
        } else {  // No matching result.
            return false;
        }
    } else {
        // Error during query execution.
        die('query failed: ' . pg_last_error($dbcon));
    }
}


function createExpenseInDB($dbcon, $title, $amount, $user, $chanTitle, $chanOwner, $date){
    $userID = getUserID($dbcon, $user);
    $chanID = getChanID($dbcon, getUserID($dbcon, $chanOwner), $chanTitle);

    if ($chanID) {
        $query = "INSERT INTO transactions(title, amount, date, chanid) VALUES ($1, $2, $3, $4)";
        $result = pg_query_params($dbcon, $query, [$title, $amount, $date, $chanID]);

        if ($result) {
            $query = "SELECT MAX(t.id) FROM transactions t";  // Get id of last created transaction.
            $result = pg_query($dbcon, $query);

            if ($result) {
                $row = pg_fetch_row($result);  // Extract row data from postgres query result.

                if ($row) {  // Row exists.
                    $transID = $row[0];
                    $query = "INSERT INTO fulfills(transid, userid, part) VALUES ($1, $2, $3)";
                    $result = pg_query_params($dbcon, $query, [$transID, $userID, $amount]);
        
                    return $result;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}


function addExpenseInDB($dbcon, $title, $amount, $user, $chanTitle, $chanOwner){
    $userID = getUserID($dbcon, $user);
    $chanID = getChanID($dbcon, getUserID($dbcon, $chanOwner), $chanTitle);

    if ($chanID) {
        $query = "SELECT t.id FROM transactions t WHERE t.chanid = $1 AND t.title = $2";  // Get id of last created transaction.
        $result = pg_query_params($dbcon, $query, [$chanID, $title]);

        if ($result) {
            $row = pg_fetch_row($result);  // Extract row data from postgres query result.

            if ($row) {  // Row exists.
                $transID = $row[0];
                $query = "INSERT INTO fulfills(transid, userid, part) VALUES ($1, $2, $3)";
                $result = pg_query_params($dbcon, $query, [$transID, $userID, $amount]);

                if ($result) {
                    $query = "UPDATE transactions SET amount = $1 + (SELECT amount FROM transactions WHERE title = $2 AND chanid = $3) WHERE title = $2 AND chanid = $3";
                    $result = pg_query_params($dbcon, $query, [$amount, $title, $chanID]);
                }
                
                return $result;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}


function deleteExpenseInDB($dbcon, $expTitle, $chanOwner, $chanTitle){
    $chanID = getChanID($dbcon, getUserID($dbcon, $chanOwner), $chanTitle);

    if ($chanID) {
        $query = "SELECT DISTINCT t.id FROM fulfills f INNER JOIN transactions t ON t.id = f.transid WHERE t.chanid = $1 AND t.title = $2";
        $result = pg_query_params($dbcon, $query, [$chanID, $expTitle]);  // Get expense (whole transaction) id.

        if ($result) {
            $row = pg_fetch_row($result);

            if ($row) {  // Row exists.
                $transID = $row[0];

                $query = "DELETE FROM fulfills WHERE transid = $1";
                $result = pg_query_params($dbcon, $query, [$transID]);  // Remove associated transactions.

                $query = "DELETE FROM transactions t WHERE t.chanid = $1 AND t.title = $2";
                $result = pg_query_params($dbcon, $query, [$chanID, $expTitle]);  // Remove expense.

                return $result;
            }
            return false;
        }
        return false;
    }
    return false;
}


function deleteTransInDB($dbcon, $transOwner, $expTitle, $chanOwner, $chanTitle){
    $transOwnerID = getUserID($dbcon, $transOwner);
    $chanID = getChanID($dbcon, getUserID($dbcon, $chanOwner), $chanTitle);

    if ($chanID) {
        $query = "SELECT DISTINCT t.id FROM fulfills f INNER JOIN transactions t ON t.id = f.transid WHERE t.chanid = $1 AND t.title = $2 and f.userid = $3";
        $result = pg_query_params($dbcon, $query, [$chanID, $expTitle, $transOwnerID]);  // Get expense (whole transaction) id.

        if ($result) {
            $row = pg_fetch_row($result);

            if ($row) {  // Row exists.
                $transID = $row[0];

                $query = "SELECT f.part FROM fulfills f WHERE f.transid = $1 AND f.userid = $2";
                $result = pg_query_params($dbcon, $query, [$transID, $transOwnerID]);

                if ($result) {
                    $row = pg_fetch_row($result);

                    if ($row) {  // Row exists.
                        $amount = $row[0];        

                        $query = "UPDATE transactions SET amount = (SELECT amount FROM transactions WHERE title = $2 AND chanid = $3) - $1 WHERE title = $2 AND chanid = $3";
                        $result = pg_query_params($dbcon, $query, [$amount, $expTitle, $chanID]);
                        if (!$result) {return false;}

                        $query = "DELETE FROM fulfills WHERE transid = $1 AND userid = $2";
                        $result = pg_query_params($dbcon, $query, [$transID, $transOwnerID]);  // Remove associated transactions.
                        
                        return $result;
                    }
                    return false;
                }
                return false;
            }
            return false;
        }
        return false;
    }
    return false;
}


// Members CRUD

function getChanMembers($dbcon, $title, $owner){
    // This function returns the chans corresponding to a user ID.
    $ownerID = getUserID($dbcon, $owner);
    $chanID = getChanID($dbcon, $ownerID, $title);
 
    $query = "SELECT u.username FROM users u INNER JOIN belongs b ON u.id = b.userid WHERE b.chanid = $1";
    $result = pg_query_params($dbcon, $query, [$chanID]);
    if ($result) {
        $table = pg_fetch_all($result);
    
        if ($table) {  // Row exists.
            return $table;
        } else {  // No matching result.
            return false;
        }
    } else {
        // Error during query execution.
        die('query failed: ' . pg_last_error($dbcon));
    }
}


function addMemberInDB($dbcon, $username, $owner, $title){
    $userID = getUserID($dbcon, $username);
    $ownerID = getUserID($dbcon, $owner);
    $chanID = getChanID($dbcon, $ownerID, $title);

    if ($chanID) {
        $query = "INSERT INTO belongs(userid, chanid, rights) VALUES ($1, $2, 'f')";
        $result = pg_query_params($dbcon, $query, [$userID, $chanID]);
    
        return $result;
    }
    return false;
}


function deleteMemberInDB($dbcon, $userID, $memberID, $title){
    $chanID = getChanID($dbcon, $userID, $title);

    if ($chanID) {
        $query = "UPDATE transactions SET amount = (SELECT t.amount FROM transactions t WHERE t.title = $2 AND t.chanid = $3) - (SELECT SUM(f.part) FROM fulfills f INNER JOIN transactions t2 ON f.transid = t2.id WHERE f.transid = t2.id AND f.userid = $1 AND t2.title = $2 AND t2.chanid = $3) WHERE title = $2 AND chanid = $3";
        $result = pg_query_params($dbcon, $query, [$memberID, $title, $chanID]);  // Remove user's part in his transactions.

        $query = "DELETE FROM fulfills WHERE userid = $1";
        $result = pg_query_params($dbcon, $query, [$memberID]);  // Remove user transactions.

        $query = "DELETE FROM belongs WHERE chanid = $1 and userid = $2";
        $result = pg_query_params($dbcon, $query, [$chanID, $memberID]);  // Remove user from Chan.

        return $result;
    }
    return false;
}

function checkExpenseInDB($dbcon, $title, $chanTitle, $chanOwner){
    // This function returns the chans corresponding to a user ID.
    $chanID = getChanID($dbcon, getUserID($dbcon, $chanOwner), $chanTitle);
 
    $query = "SELECT COUNT(t.title) FROM transactions t INNER JOIN fulfills f ON t.id = f.transid WHERE t.chanid = $1 and t.title = $2";
    $result = pg_query_params($dbcon, $query, [$chanID, $title]);
    if ($result) {
        $row = pg_fetch_row($result);  // Extract row data from postgres query result.
        $count = intval($row[0]);

        if ($count > 0) {
            return true; // Transaction exists at least once for this user.
        } else {
            return false; // Transaction does not exist (can be added).
        }
    } else {
        // Error during query execution.
        die('query failed: ' . pg_last_error($dbcon));
    }
}


function getUserInfo($dbcon, $userID) {
    $query = "SELECT u.username, u.email FROM users u WHERE u.id = $1";
    $result = pg_query_params($dbcon, $query, [$userID]);
    if ($result) {
        $result = pg_fetch_row($result);  // Extract row data from postgres query result.

        return $result;
    } else {
        // Error during query execution.
        die('query failed: ' . pg_last_error($dbcon));
}
}

?>