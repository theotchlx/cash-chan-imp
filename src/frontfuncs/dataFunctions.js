//Used in frontend.js
//defines data functions that talk to server


// This function hashes/encrypts passwords before they are sent over the network.
// It returns the encrypted password.
async function passwordHasher(password) {  // Function is asynchronous as to not freeze UI and processes.
    try {
        // Convert the password string to a Uint8Array buffer.
        const passwordData = new TextEncoder().encode(password);
        // SubtleCrypto is used to generate an SHA-256 cryptographic hash.
        const hashBuffer = await crypto.subtle.digest('SHA-256', passwordData);
        const hashedPassword = Array.from(new Uint8Array(hashBuffer))  // Convert the hash to a hex string.
          .map(byte => byte.toString(16).padStart(2, '0'))
          .join('');  // Hex string (encrypted password).
        return hashedPassword;
    } catch (error) {
        console.error('Error during password hashing:', error);
        throw error;
    }
}


async function getUserInfo() {
    try {
        // Simulate a POST request using fetch. (async/await).
        const response = await fetch('backend.php/getuser', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            const message = await response.text();
            console.log('GET request successful:', message);

            // Handle non-successful response.
            throw new Error(`HTTP Error, Status ${response.status}, Message ${message}`);
        }

        console.log('GET request successful: User info transmitted successfully');

        // Server responds with a json.
        const list = await response.json();

        return list;
    } catch (error) {
        console.error('Error during GET request:', error);
        throw error;
    }
}


// Chans CRUD functions.

// Get the list of chans of the current user.
async function getChansList() {
    try {
        // Simulate a POST request using fetch. (async/await).
        const response = await fetch('backend.php/getchans', {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            // Handle non-successful response.
            const message = await response.text();
            throw new Error(`HTTP Error, Status ${response.status}, Message ${message}`);
        }
        
        if (response.status == 204) {  // User has no Chans.
            const message = 'No chans found';
            console.log('GET request successful:', message);
            return false;
        }

        // Server responds with a json.
        const list = await response.json();

        return list;
    } catch (error) {
        console.error('Error during GET request:', error);
        throw error;
    }
}


// Expenses CRUD functions.

// Get the list of expenses of the current Chan.
async function getChanExpenses(title, owner) {
    try {
        // Simulate a POST request using fetch. (async/await).
        const response = await fetch(`backend.php/getexps?title=${title}&owner=${owner}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            // Handle non-successful response.
            const message = await response.text();
            throw new Error(`HTTP Error, Status ${response.status}, Message ${message}`);
        }
        
        if (response.status == 204) {  // Chan has no expenses.
            const message = 'No expenses found';
            console.log('GET request successful:', message);
            return false;
        }

        // Server responds with a json.
        const list = await response.json();

        return list;
    } catch (error) {
        console.error('Error during GET request:', error);
        throw error;
    }
}


async function getTransExpenses(title, chanTitle, chanOwner) {
    try {
        // Simulate a POST request using fetch. (async/await).
        const response = await fetch(`backend.php/gettrans?title=${title}&chanOwner=${chanOwner}&chanTitle=${chanTitle}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            // Handle non-successful response.
            const message = await response.text();
            throw new Error(`HTTP Error, Status ${response.status}, Message ${message}`);
        }
        
        if (response.status == 204) {  // Chan has no expenses.
            const message = 'No transactions found';
            console.log('GET request successful:', message);
            return false;
        }

        // Server responds with a json.
        const list = await response.json();

        return list;
    } catch (error) {
        console.error('Error during GET request:', error);
        throw error;
    }
}


// Members CRUD functions.

// Get the list of members of the current Chan.
async function getChanMembers(title, owner) {
    try {
        // Simulate a POST request using fetch. (async/await).
        const response = await fetch(`backend.php/getmems?title=${title}&owner=${owner}`, {
            method: 'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            // Handle non-successful response.
            const message = await response.text();
            throw new Error(`HTTP Error, Status ${response.status}, Message ${message}`);
        }
        
        if (response.status == 204) {  // Chan has no members.
            const message = 'No members found';
            console.log('GET request successful:', message);
            return false;
        }

        // Server responds with a json.
        const list = await response.json();

        return list;
    } catch (error) {
        console.error('Error during GET request:', error);
        throw error;
    }
}
