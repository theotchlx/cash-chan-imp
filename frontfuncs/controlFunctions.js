//Used in frontend.js
//defines control functions that talk to server


// The app integrates modified "POST" requests. It is not RESTful : a json data is send to a case switch in the backend instead of using params in the URL to decide how to control the body data.
// This was chosen to choose a solution that least used the URL and most used the sent data.


// This function is a frontend to loginUser.
// It returns nothing? and writes html..?
async function login(username, password) {
    // This function sends the credentials used at login to the server so that they can be verified.
    try {
        // Simulate a POST request using fetch. (async/await).
        const response = await fetch('backend.php/login', {
            method: 'POST',
            credentials: 'include',  // Send the jwt cookie.
            headers: {
                'Content-Type': 'application/json'  // MIME header for JSON.
                // can add more headers if need (for authentication against API, ...)
            },
            body: JSON.stringify({'username': username, 'password': password})  // stringify prevents XSS injection.
        });

        // Server responds with a string.
        const message = await response.text();
        
        if (!response.ok) {
            // Handle non-successful response.
            if (response.status == 401) {
                return [false, message];
            }
            throw new Error(`HTTP Error, Status ${response.status}, Message ${message}`);
        }

        const status = true;  // Login successful.

        console.log('POST request successful:', message);

        return [status, message];
    } catch (error) {
        console.error('Error during login POST request:', error);
        throw error;
    }
}


// This function is a frontend to loginUser.
// It returns nothing? and writes html..?
async function register(username, email, password) {
    // This function sends the credentials used at login to the server so that they can be verified.
    try {
        // Simulate a POST request using fetch. (async/await).
        const response = await fetch('backend.php/register', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'  // MIME header for JSON.
                // can add more headers if need (for authentication against API, ...)>.
            },
            body: JSON.stringify({'username': username, 'email': email, 'password': password})  // stringify prevents XSS injection.
        });

        // Server responds with a string.
        const message = await response.text();

        console.log('POST request successful:', message);
        
        if (!response.ok) {
            // Handle non-successful response.
            if (response.status == 401 || response.status == 409) {
                return [false, message];
            }
            throw new Error(`HTTP Error, Status ${response.status}, Message ${message}`);
        }

        const status = true;  // Registration successful.

        return [status, message];
    } catch (error) {
        console.error('Error during registration POST request:', error);
        throw error;
    }
}


async function createChan(title, description) {
    try {
        // Simulate a POST request using fetch. (async/await).
        const response = await fetch('backend.php/setchan', {
            method: 'POST',
            credentials: 'include',  // Cookies are sent (for authentication, ...)
            headers: {
                'Content-Type': 'application/json'  // MIME header for JSON.
            },
            body: JSON.stringify({'title': title, 'description': description})  // stringify prevents XSS injection.
        });

        // Server responds with a string.
        const message = await response.text();

        console.log('POST request successful:', message);
        
        if (!response.ok) {
            // Handle non-successful response.
            if (response.status == 401 || response.status == 500 || response.status == 409) {
                return [false, message];
            }
            throw new Error(`HTTP Error, Status ${response.status}, Message ${message}`);
        }

        const status = true;  // Creation successful.

        return [status, message];
    } catch (error) {
        console.error('Error during registration POST request:', error);
        throw error;
    }
}


async function addChan(username, title) {
    try {
        // Simulate a POST request using fetch. (async/await).
        const response = await fetch('backend.php/addchan', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'  // MIME header for JSON.
            },
            body: JSON.stringify({'username': username, 'title': title})  // stringify prevents XSS injection.
        });

        // Server responds with a string.
        const message = await response.text();

        console.log('POST request successful:', message);
        
        if (!response.ok) {
            // Handle non-successful response.
            if (response.status == 401 || response.status == 500 || response.status == 409) {
                return [false, message];
            }
            throw new Error(`HTTP Error, Status ${response.status}, Message ${message}`);
        }

        const status = true;  // Creation successful.

        return [status, message];
    } catch (error) {
        console.error('Error during registration POST request:', error);
        throw error;
    }
}


async function modifyChan(newTitle, newDescription, owner, title) {
    try {
        // Simulate a POST request using fetch. (async/await).
        const response = await fetch('backend.php/modchan', {
            method: 'POST',
            credentials: 'include',  // Cookies are sent (for authentication, ...)
            headers: {
                'Content-Type': 'application/json'  // MIME header for JSON.
            },
            body: JSON.stringify({'newTitle': newTitle, 'newDescription': newDescription, 'owner': owner, 'title': title})  // stringify prevents XSS injection.
        });

        // Server responds with a string.
        const message = await response.text();

        console.log('POST request successful:', message);
        
        if (!response.ok) {
            // Handle non-successful response.
            if (response.status == 401 || response.status == 500 || response.status == 409) {
                return [false, message];
            }
            throw new Error(`HTTP Error, Status ${response.status}, Message ${message}`);
        }

        const status = true;  // Creation successful.

        return [status, message];
    } catch (error) {
        console.error('Error during registration POST request:', error);
        throw error;
    }
}


// This function is a frontend to loginUser.
// It returns nothing? and writes html..?
async function deleteChan(title, owner) {
    try {
        // Simulate a POST request using fetch. (async/await).
        const response = await fetch('backend.php/delchan', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'  // MIME header for JSON.
            },
            body: JSON.stringify({'title': title, 'owner': owner})  // stringify prevents XSS injection.
        });

        // Server responds with a string.
        const message = await response.text();

        console.log('POST request successful:', message);
        
        if (!response.ok) {
            // Handle non-successful response.
            if (response.status == 401 || response.status == 500 || response.status == 409) {
                return [false, message];
            }
            throw new Error(`HTTP Error, Status ${response.status}, Message ${message}`);
        }

        const status = true;  // Creation successful.

        return [status, message];
    } catch (error) {
        console.error('Error during registration POST request:', error);
        throw error;
    }
}


async function deleteMember(username, chanOwner, chanTitle) {
    try {
        const response = await fetch('backend.php/delmem', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'username': username, 'chanTitle': chanTitle, 'chanOwner': chanOwner})
        });

        // Server responds with a string.
        const message = await response.text();

        console.log('POST request successful:', message);
        
        if (!response.ok) {
            // Handle non-successful response.
            if (response.status == 401 || response.status == 500 || response.status == 409) {
                return [false, message];
            }
            throw new Error(`HTTP Error, Status ${response.status}, Message ${message}`);
        }

        const status = true;  // Creation successful.

        return [status, message];
    } catch (error) {
        console.error('Error during registration POST request:', error);
        throw error;
    }
}


async function deleteExpense(expTitle, chanOwner, chanTitle) {
    try {
        const response = await fetch('backend.php/delexp', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'expTitle': expTitle, 'chanTitle': chanTitle, 'chanOwner': chanOwner})
        });

        // Server responds with a string.
        const message = await response.text();

        console.log('POST request successful:', message);
        
        if (!response.ok) {
            // Handle non-successful response.
            if (response.status == 401 || response.status == 500 || response.status == 409) {
                return [false, message];
            }
            throw new Error(`HTTP Error, Status ${response.status}, Message ${message}`);
        }

        const status = true;  // Creation successful.

        return [status, message];
    } catch (error) {
        console.error('Error during registration POST request:', error);
        throw error;
    }
}


async function deleteTransaction(transOwner, expTitle, chanOwner, chanTitle) {
    try {
        const response = await fetch('backend.php/deltrans', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'transOwner': transOwner, 'expTitle': expTitle, 'chanTitle': chanTitle, 'chanOwner': chanOwner})
        });

        // Server responds with a string.
        const message = await response.text();

        console.log('POST request successful:', message);
        
        if (!response.ok) {
            // Handle non-successful response.
            if (response.status == 401 || response.status == 500 || response.status == 409) {
                return [false, message];
            }
            throw new Error(`HTTP Error, Status ${response.status}, Message ${message}`);
        }

        const status = true;  // Creation successful.

        return [status, message];
    } catch (error) {
        console.error('Error during registration POST request:', error);
        throw error;
    }
}


async function createExpense(title, amount, user, chanTitle, chanOwner, date) {
    try {
        // Simulate a POST request using fetch. (async/await).
        const response = await fetch('backend.php/setexp', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'title': title, 'amount': amount, 'user': user, 'chanTitle': chanTitle, 'chanOwner': chanOwner, 'date': date})
        });

        // Server responds with a string.
        const message = await response.text();

        console.log('POST request successful:', message);
        
        if (!response.ok) {
            // Handle non-successful response.
            if (response.status == 401 || response.status == 500 || response.status == 409|| response.status == 404) {
                return [false, message];
            }
            throw new Error(`HTTP Error, Status ${response.status}, Message ${message}`);
        }

        const status = true;  // Creation successful.

        return [status, message];
    } catch (error) {
        console.error('Error during registration POST request:', error);
        throw error;
    }
}


async function addExpense(title, amount, user, chanTitle, chanOwner) {
    try {
        // Simulate a POST request using fetch. (async/await).
        const response = await fetch('backend.php/addexp', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'title': title, 'amount': amount, 'user': user, 'chanTitle': chanTitle, 'chanOwner': chanOwner})
        });

        // Server responds with a string.
        const message = await response.text();

        console.log('POST request successful:', message);
        
        if (!response.ok) {
            // Handle non-successful response.
            if (response.status == 401 || response.status == 500 || response.status == 409|| response.status == 404) {
                return [false, message];
            }
            throw new Error(`HTTP Error, Status ${response.status}, Message ${message}`);
        }

        const status = true;  // Creation successful.

        return [status, message];
    } catch (error) {
        console.error('Error during registration POST request:', error);
        throw error;
    }
}


async function addMember(username, owner, title) {
    try {
        // Simulate a POST request using fetch. (async/await).
        const response = await fetch('backend.php/addmem', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'username': username, 'owner': owner, 'title': title})
        });

        // Server responds with a string.
        const message = await response.text();

        console.log('POST request successful:', message);
        
        if (!response.ok) {
            // Handle non-successful response.
            if (response.status == 401 || response.status == 500 || response.status == 409|| response.status == 404) {
                return [false, message];
            }
            throw new Error(`HTTP Error, Status ${response.status}, Message ${message}`);
        }

        const status = true;  // Creation successful.

        return [status, message];
    } catch (error) {
        console.error('Error during registration POST request:', error);
        throw error;
    }
}


// Input validity control functions ########################################################################


function checkUsernameValidity(username) {
    // Username must be 16 characters or less, and contain only letters and numbers.
    return username.length >= 0 && username.length <= 16 && /^[a-zA-Z0-9\p{L}]+$/u.test(username);
}


function checkEmailValidity(email) {
    // Perform email validation.
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;  // "As per the HTML Specification" according to mdn web docs
    return emailRegexp.test(email);                                                // Reference: https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation
}


function checkPasswordValidity(password) {
    // Password must be between 12 and 64 characters and contain no spaces.
    return password.length >= 8 && password.length <= 64 && !/\s/.test(password);
}


function checkTitleValidity(title){
    // title must be 32 characters or less.
    return title.length > 0 && title.length <= 32 && title != '';
}


function checkDescValidity(description){
    // description must be 64 characters or less.
    return description.length > 0 && description.length <= 64 && description != '';
}


function checkAmountValidity(amount) {
    // Amount must not be empty string.
    if (typeof amount !== 'string' || amount.trim() === '') {
        return false;
    }

    const numericAmount = parseFloat(amount);

    // Check conversion success.
    if (isNaN(numericAmount)) {
        return false;
    }

    // Amount must not overflow.
    const maxRealValue = Number.MAX_SAFE_INTEGER;
    return numericAmount < maxRealValue;
}

function checkDateValidity(date) {
    // Regular expression to match the 'day/month/year' format.
    const dateRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

    // Check if the date matches the expected format.
    if (!dateRegex.test(date)) {
        return false;
    }

    // Split the date into day, month, and year.
    const [day, month, year] = date.split('/');

    // Convert the parts to integers in base 10.
    const dayInt = parseInt(day, 10);
    const monthInt = parseInt(month, 10);
    const yearInt = parseInt(year, 10);

    // Check if the date components are valid.
    return !(isNaN(dayInt) || isNaN(monthInt) || isNaN(yearInt) ||
        dayInt < 1 || dayInt > 31 ||
        monthInt < 1 || monthInt > 12 ||
        yearInt < 1000 || yearInt > 9999);
    // Return if date is valid or not.
}


// Authentication control functions ########################################################################


// autoAuth function to check if the jwt cookie is valid to automatically authenticate.
// This function sends the jwt cookie to the backend so it can be validated, so that the client can be auto-logged-in.
async function autoAuth() {
    try {
        const response = await fetch('backend.php/login', {
            method: 'GET',
            credentials: 'include'  // Send the cookie.
        });

        // Server responds with a string.
        const message = await response.text();

        console.log('GET request successful:', message);

        return response.ok;  // Token validated successfully or invalid token depending on ok status.
    } catch (error) {
        console.error('Error during token validation GET request:', error);
        throw error;
    }
}


// This function disables the automatic authentication until the next manual authentication, by removing the jwt cookie.
// The jwt cookie is HTTP-Only (as a security measure), so its deletion is handled by the backend, hence the request.
async function disAutoAuth() {
    try {
        const response = await fetch('backend.php/logout', {
            method: 'GET',
            credentials: 'include'  // Send the cookie.
        });

        // Server responds with a string.
        const message = await response.text();

        console.log('GET request successful:', message);

        return response.ok  // Cookie deleted successfully or deletion failed depending on ok status.
    } catch (error) {
        console.error('Error during token validation GET request:', error);
        throw error;
    }
}
