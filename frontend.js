// This is the main script controlling index.html.
// This script is called in 'index.html'.


// Login, register functions ########################################################################


async function formLogin(){
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const hashedPassword = await passwordHasher(password);

    if (
        checkUsernameValidity(username) &&
        checkPasswordValidity(password)
    ) {
        login(username, hashedPassword).then(([status, message]) => {
            if (status) {
                drawHomePage();
                screenSizeNavbar();
            } else {
                displayError("mainAppScreen", message);
            }
        });
    } else {
        displayError("mainAppScreen", "Credentials not accepted");
    }

}


async function formRegister(){
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const hashedPassword = await passwordHasher(password);

    if (
        checkUsernameValidity(username) &&
        checkEmailValidity(email) &&
        checkPasswordValidity(password)
    ) {
        register(username, email, hashedPassword).then(([status, message]) => {
            if (status) {
                drawLoginScreen();
            } else {
                displayError("mainAppScreen", message);
            }
        });
    } else {
        displayError("mainAppScreen", "Credentials not accepted");
    }
}


// Chans CRUD functions ########################################################################


async function formCreateChan(){
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    if (
        checkTitleValidity(title) &&
        checkDescValidity(description)
    ) {
        createChan(title, description).then(([status, message]) => {
            if (status) {
                removeElement("floatScreen");
                eraseChansList();
                displayChansList();
            } else {
                displayError("floatScreen", message);
            }
        });
    } else {
        displayError("floatScreen", "Inputs not accepted");
    }
}


async function formAddChan(){
    const username = document.getElementById('username').value;
    const title = document.getElementById('title').value;

    if (
        checkUsernameValidity(username) &&
        checkTitleValidity(title)
    ) {
        addChan(username, title).then(([status, message]) => {
            if (status) {
                removeElement("floatScreen");
                eraseChansList();
                displayChansList();
            } else {
                displayError("floatScreen", message);
            }
        });
    } else {
        displayError("floatScreen", "Inputs not accepted");
    }
}


async function formModifyChan(){
    const newTitle = document.getElementById('newTitle').value;
    const newDescription = document.getElementById('newDescription').value;
    const title = chanData.dataset.title;
    const owner = chanData.dataset.owner;
    const chanRowID = chanData.dataset.id;

    if (
        checkTitleValidity(newTitle) &&
        checkDescValidity(newDescription)
    ) {
        modifyChan(newTitle, newDescription, owner, title).then(([status, message]) => {
            if (status) {
                drawHomePage();
                setTimeout(() => {
                    displayChan(chanRowID);
                }, 200);  // 200 milliseconds = 0.15 seconds.
            } else {
                displayError("floatScreen", message);
            }
        });
    } else {
        displayError("floatScreen", "Inputs not accepted");
    }
}


async function frontDeleteChan(){
    const chanData = document.getElementById("chanData");
    const title = chanData.dataset.title;
    const owner = chanData.dataset.owner;

    deleteChan(title, owner).then(([status, message]) => {
        if (status) {
            removeElement("floatScreen");
            drawHomePage();
        } else {
            console.log(message);
        }
    });
}


// Expenses and transactions CRUD functions ########################################################################


async function formCreateExpense(){
    const chanData = document.getElementById("chanData");
    const chanTitle = chanData.dataset.title;
    const chanOwner = chanData.dataset.owner;
    const title = document.getElementById('title').value;
    const amount = document.getElementById('amount').value;  // Amount the user is concerned about.
    const date = document.getElementById('date').value;
    const user = document.getElementById('user').value;

    if (
        checkUsernameValidity(user) &&
        checkTitleValidity(title) &&
        checkAmountValidity(amount) &&
        checkDateValidity(date)
    ) {
        createExpense(title, amount, user, chanTitle, chanOwner, date).then(([status, message]) => {
            if (status) {
                removeElement("floatScreen");
                eraseChanExpenses(chanTitle, chanOwner);
                displayChanExpenses();
            } else {
                displayError("floatScreen", message);
            }
        });
    } else {
        displayError("floatScreen", "Inputs not accepted" + checkAmountValidity(amount) + ',' + checkDateValidity(date));
    }
}


async function formAddExpense(){
    const transExpData = document.getElementById("transData");
    const chanRowID = transExpData.dataset.chanRowID;
    const chanTitle = transExpData.dataset.chantitle;
    const chanOwner = transExpData.dataset.chanowner;
    const title = transExpData.dataset.title;
    const currentAmount = transExpData.dataset.amount;
    const amount = document.getElementById('amount').value;
    const user = document.getElementById('user').value;
    const newAmount = Number(currentAmount) + Number(amount);

    if (
        checkTitleValidity(title) &&
        checkUsernameValidity(user) &&
        checkAmountValidity(amount)
    ) {
        addExpense(title, amount, user, chanTitle, chanOwner).then(([status, message]) => {
            if (status) {
                removeElement("floatScreen");
                eraseTransExpenses(title, chanTitle, chanOwner);
                displayTransExpenses(chanTitle, chanOwner, chanRowID);

                // Redraw new amount.
                const amountTitle = document.getElementById("currentAmount");
                amountTitle.innerHTML = `Total $${newAmount}`;
            } else {
                displayError("floatScreen", message);
            }
        });
    } else {
        displayError("floatScreen", "Inputs not accepted");
    }
}


async function frontDeleteExpense(){
    const transData = document.getElementById("transData");
    const chanRowID = transData.dataset.chanrowid;
    const chanTitle = transData.dataset.chantitle;
    const chanOwner = transData.dataset.chanowner;
    const expTitle = transData.dataset.title;

    deleteExpense(expTitle, chanOwner, chanTitle).then(([status, message]) => {
        if (status) {
            drawHomePage();
            setTimeout(() => {
                displayChan(chanRowID);
            }, 200);  // 200 milliseconds = 0.15 seconds.
        } else {
            displayError("floatScreen", message);
        }
    });
}


async function frontDeleteTransaction(){
    const transData = document.getElementById("transData");
    const chanRowID = transData.dataset.chanrowid;
    const chanTitle = transData.dataset.chantitle;
    const chanOwner = transData.dataset.chanowner;
    const transOwner = transData.dataset.transowner;
    const expTitle = transData.dataset.title;

    deleteTransaction(transOwner, expTitle, chanOwner, chanTitle).then(([status, message]) => {
        if (status) {
            drawHomePage();
            setTimeout(() => {
                displayChan(chanRowID);
            }, 200);  // 200 milliseconds = 0.15 seconds.
        } else {
            displayError("floatScreen", message);
        }
    });
}


// Members CRUD functions ########################################################################


async function formAddMember(){
    const chanData = document.getElementById("chanData");
    const username = document.getElementById('user').value;
    const title = chanData.dataset.title;
    const owner = chanData.dataset.owner;

    if (
        checkUsernameValidity(username)
    ) {
        addMember(username, owner, title).then(([status, message]) => {
            if (status) {
                removeElement("floatScreen");
                eraseChanMembers(title, owner);
                displayChanMembers();
            } else {
                displayError("floatScreen", message);
            }
        });
    } else {
        displayError("floatScreen", "Inputs not accepted");
    }
}


async function frontDeleteMember(){
    const memData = document.getElementById("memData");
    const chanRowID = memData.dataset.chanrowid;
    const chanTitle = memData.dataset.title;
    const chanOwner = memData.dataset.owner;
    const username = memData.dataset.username;

    deleteMember(username, chanOwner, chanTitle).then(([status, message]) => {
        if (status) {
            drawHomePage();
            setTimeout(() => {
                displayChan(chanRowID);
            }, 200);  // 200 milliseconds = 0.15 seconds.
        } else {
            displayError("floatScreen", message);
        }
    });
}


// This function is used by the 'Disconnect' button.
// It removes the jwt cookie (used to automatically authenticate), and draws the login screen.
function disconnect() {
    disAutoAuth()
    drawLoginScreen()
}


// Main script

autoAuth().then(status => {
    addElement("mainAppScreen", "appTitle", "div", "row mx-auto", 
        `
        <h1 class="text-warning fw-bold text-center mt-3">Cash-chan</h1>
        `
    );
    if (status) {  // Token still valid, login the user directly.
        drawHomePage();
        screenSizeNavbar();
    } else {  // No token or token removed / token expired: user has to reauthenticate.
        drawLoginScreen();
    }
});
