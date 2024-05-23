// Display functions below. These are the functions that dynamically modify the HTML using fetched data.
   

// Login, register and home page screen display functions ########################################################################


// This function is used to draw the login screen so that the user can connect and enter the home page; or click the button to display the registration screen.
// Aiming at element with id "mainAppScreen".
function drawLoginScreen() {
    removeElement("motd")
    removeElement("registerScreen");
    removeElement("homePage");
    removeElement("floatScreen");
    removeElement("chanScreen");
    screenSizeNoNavbar();
    displayMOTD()

    // Page content is replaced with login screen.
    addElement("mainAppScreen", "loginScreen", "div", "row mx-auto", 
    `
        <form class="bg-primary bg-opacity-75 bg-gradient row py-5 border border-info rounded-5 col-11 col-md-6 mx-auto" loginRegister" style="box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;">
            <div class="bi-person-circle text-center pe-4 col-11 col-md-12 mx-auto mb-1">
                <input type="text" id="username" name="username" placeholder="Username" required>
            </div>
            <div class="bi-key-fill text-center pe-4 col-11 col-md-12 mx-auto">
                <input type="password" id="password" name="password" placeholder="********" required>
            </div>
            
            <div class="text-center col-12 col-md-12 mx-auto mt-2">
                <button class="rounded-3" type="button" onclick="formLogin()">Login</button>
            </div>
            <br>
            <div class="text-center mt-4 col-12 col-md-12 mx-auto">
                <h5 class="text-warning fw-bold">Don't have an account?</h5>
                <input class="btn btn-success" type="button" onclick="drawRegisterScreen()" value="Click here to register!" style="box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;">
            </div>
        </form>
    `);
}


// This function is used to draw the register screen so that the user buttoncan register an account and enter the home page.
// Aiming at element with id "mainAppScreen".
function drawRegisterScreen() {
    removeElement("loginScreen");

    // Page content is replaced with register screen.
    addElement("mainAppScreen", "registerScreen", "div", "row mx-auto", 
    `
        <form class="bg-primary bg-opacity-75 bg-gradient row py-5 border border-info rounded-5 col-11 col-md-6 mx-auto" style="box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;">
            <div class="bi-person-circle text-center pe-4 col-11 col-md-12 mx-auto">
                <input type="text" id="username" name="username" placeholder="Username" required>
            </div>
            <div class="text-center pe-4 col-11 col-md-12 mx-auto">
                <small class="pe-5" style="font-size: 0.75rem;">Must be 16 characters or less</small>
            </div>
            <div class="bi-envelope-fill text-center pe-4 col-11 col-md-12 mx-auto">
                <input type="email" id="email" name="email" placeholder="Email address" required>
            </div>
            <div class="text-center pe-4 col-11 col-md-12 mx-auto">
                <small class="pe-5" style="font-size: 0.75rem;">Must be a correct email address</small>
            </div>
            <div class="bi-key-fill text-center pe-4 col-11 col-md-12 mx-auto">
                <input type="password" id="password" name="password" placeholder="********" required>
            </div>
            <div class="text-center pe-4 col-11 col-md-12 mx-auto">
                <small style="font-size: 0.75rem;">Must be between 8 and 64 characters</small>
            </div>

            <div class="text-center col-12 col-md-12 mx-auto mt-2">
                <button class="rounded-3" type="button" onclick="formRegister()">register</button>
            </div>
            <br>
            <div class="text-center mt-4 col-12 col-md-12 mx-auto">
                <h5 class="text-warning fw-bold">Already have an account?</h5>
                <input class="btn btn-success" type="button" onclick="drawLoginScreen()" value="Back to login screen." style="box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;">
            </div>
        </form>
    `);
}


// This function is used to draw the home page, to replace the login screen.
// Aiming at element with id "mainAppScreen".
function drawHomePage() {
    removeElement("homePage");
    removeElement("loginScreen");
    removeElement("motd");
    removeElement("floatScreen");
    removeElement("chanScreen");
    removeElement("greenRuler");

    // Page content is replaced with home page.
    addElement("mainAppScreen", "homePage", "div", "", 
    `
    <div id="greenRuler" class="nav-container bg-success p-2 m-1"></div>

    <!-- Common Chans section -->
    <section id="commonChansSect" class="card shadow-sm rounded mb-2 mt-4 p-1 bg-danger">
        <div class="card-header">
            <h4 class="fw-bold"><img src="img/logo_chans.png" class="img-fluid" alt="logo chans" width="48" height="48">Your Common Chans</h4>
        </div>
        <div id="commonChansList" class="card-content list-group px-1 pt-1 border rounded bg-secondary"></div>
    </section>

    <!-- Own Chans section -->
    <section id="ownChansSect" class="card shadow-sm rounded mb-2 mt-1 p-1 bg-primary">
        <div class="card-header">
            <h4 class="fw-bold"><img src="img/logo_depenses.png" class="img-fluid" alt="logo depenses" width="48" height="48">Your Own Chans</h4>
        </div>
        <div id="ownChansList" class="card-content list-group px-1 pt-1 border rounded bg-secondary"></div>
    </section>

    <nav class="navbar navbar-expand bg-secondary bg-gradient ps-3 pe-2 d-md-none fixed-bottom">
        <div class="col-3">
            <button class="fw-bold btn btn-success rounded align-middle" type="button" onclick="disconnect()"><img src="img/logo_disconnect.png" class="img-fluid" alt="logo disconnect" width="64" height="64"></button>
        </div>
        <div class="col-3 offset-3">
            <button class="btn rounded bg-danger" onclick="displayPageSettings()"><img src="img/logo_options.png" class="img-fluid" alt="logo options" width="64" height="64"></button>
        </div>
        <div class="col-3">
            <button class="btn rounded bg-primary" onclick="displayUserSettings()"><img src="img/logo_compte.png" class="img-fluid" alt="logo compte" width="64" height="64"></button>
        </div>
    </nav>

    <nav class="navbar navbar-expand bg-secondary bg-gradient d-md-flex rounded-4 mx-auto fixed-top" style="display: none;">
        <div class="col-md-3">
            <button class="navbar-brand fw-bold btn btn-success rounded align-middle" type="button" onclick="disconnect()" style="height:64px;">Disconnect</button>
        </div>
        <div class="col-md-2 offset-md-5">
            <button class="btn fw-bold rounded bg-danger" onclick="displayPageSettings()"><img src="img/logo_options.png" class="img-fluid" alt="logo options" width="64" height="64">Page Settings</button>
        </div>
        <div class="col-md-2">
            <button class="btn fw-bold rounded bg-primary" onclick="displayUserSettings()"><img src="img/logo_compte.png" class="img-fluid" alt="logo compte" width="64" height="64">Your Account</button>
        </div>
    </nav>
    <a class="d-none" href="https://www.flaticon.com/free-icons/free">Icons from Flaticon</a>
    `);
    displayChansList();
}


// Chans CRUD view functions ########################################################################


function displayChan(chanRowID) {
    const chanRow = document.getElementById(chanRowID).firstElementChild;

    // Get chosen Chan data.
    const title = chanRow.dataset.title;
    const desc = chanRow.dataset.desc;
    const rights = chanRow.dataset.rights;
    const owner = (chanRow.dataset.owner === '') ? '' : chanRow.dataset.owner.substring(3);  // remove 'by ' 

    removeElement("commonChansSect");
    removeElement("ownChansSect");
    removeElement("floatScreen");

    
    // Page content is replaced with register screen.
    addElement("mainAppScreen", "chanScreen", "div", "", 
    `
        <h3 class="text-warning fw-bold text-center">${title}</h3>
        <h4 class="text-warning text-center">${desc}</h4>
        <div id="chanData" 
            data-id="${chanRowID}" 
            data-title="${title}" 
            data-desc="${desc}" 
            data-rights="${rights}" 
            data-owner="${owner}">
        </div>

        <div class="nav-container bg-success p-2 m-1 mb-3"></div>

        <div class="nav-container row justify-content-center m-1" style="width:100%;">
            <div class="col-3 text-center">
                <button class="btn btn-success rounded" onclick="drawHomePage()"><img src="img/logo_home.png" class="img-fluid" alt="logo home" width="64" height="64"></button>
            </div>
            <div class="col-3 text-center">
                <button class="btn btn-danger rounded" onclick="displayDeleteChan()"><img src="img/logo_suppr.png" class="img-fluid" alt="logo supprimer" width="64" height="64"></button>
            </div>
            <div class="col-3 text-center">
                <button class="btn btn-primary rounded" onclick="displayModifyChan()"><img src="img/logo_modifier.png" class="img-fluid" alt="logo modifier" width="64" height="64"></button>
            </div>
        </div>

        <!-- Expenses section -->
        <section id="chanExpensesSect" class="card shadow-sm rounded mb-2 mt-1 p-1 bg-info">
            <div class="card-header">
                <h4 class="fw-bold"><img src="img/logo_depenses.png" class="img-fluid" alt="logo depenses" width="48" height="48">Chan Expenses</h4>
            </div>
            <div id="chanExpensesList" class="card-content list-group px-1 pt-1 border rounded bg-secondary"></div>
        </section>

        <!-- Members section -->
        <section id="chanMembersSect" class="card shadow-sm rounded mb-2 mt-1 p-1 bg-secondary">
            <div class="card-header">
                <h4 class="fw-bold"><img src="img/logo_chans.png" class="img-fluid" alt="logo chans" width="48" height="48">Chan Members</h4>
            </div>
            <div id="chanMembersList" class="card-content list-group px-1 pt-1 border rounded bg-secondary"></div>
        </section>
    `);
    displayChanExpenses();
    displayChanMembers();
}


function displayCreateChan() {
    removeElement("floatScreen");

    addElement("mainAppScreen", "floatScreen", "div", "fixed-top align-middle mt-5", 
    `
        <form class="bg-primary bg-opacity-100 bg-gradient row mt-5 py-5 border border-info rounded-5 col-11 col-md-6 mx-auto" style="box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;">
            <h3 class="text-warning fw-bold text-center">Create Chan</h3>
            <div class="text-center pe-4 col-11 col-md-12 mx-auto">
                <input type="text" id="title" name="title" placeholder="Title" required>
            </div>
            <div class="text-center pe-4 col-11 col-md-12 mx-auto">
                <small class="pe-5" style="font-size: 0.75rem;">Must be less than 32 characters</small>
            </div>
            <div class="text-center pe-4 col-11 col-md-12 mx-auto">
                <input type="text" id="description" name="description" placeholder="Description" required>
            </div>
            <div class="text-center pe-4 col-11 col-md-12 mx-auto">
            <small class="pe-5" style="font-size: 0.75rem;">Must be less than 64 characters</small>
            </div>

            <div class="text-center col-12 col-md-12 mx-auto my-2">
                <button class="rounded-3" type="button" onclick="formCreateChan()">Create Chan</button>
            </div>
            <div class="text-center col-12 col-md-12 mx-auto mt-2">
                <button class="rounded-3" type="button" onclick="removeElement('floatScreen')">Cancel</button>
            </div>
        </form>
    `);
}


function displayAddChan() {
    removeElement("floatScreen");

    addElement("mainAppScreen", "floatScreen", "div", "fixed-top align-middle mt-5", 
    `
        <form class="bg-danger bg-opacity-100 bg-gradient row mt-5 py-5 border border-info rounded-5 col-11 col-md-6 mx-auto" style="box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;">
            <h3 class="text-warning fw-bold text-center">Add Chan</h3>
            <div class="text-center pe-4 col-11 col-md-12 mx-auto">
                <input type="text" id="username" name="username" placeholder="Owner username" required>
            </div>
            <div class="text-center pe-4 col-11 col-md-12 mx-auto">
                <small class="pe-5" style="font-size: 0.75rem;">Must be owner of the following Chan</small>
            </div>
            <div class="text-center pe-4 col-11 col-md-12 mx-auto">
                <input type="text" id="title" name="title" placeholder="Chan title" required>
            </div>
            <div class="text-center col-12 col-md-12 mx-auto mb-2 mt-3">
                <button class="rounded-3" type="button" onclick="formAddChan()">Add Chan</button>
            </div>
            <div class="text-center col-12 col-md-12 mx-auto mt-2">
                <button class="rounded-3" type="button" onclick="removeElement('floatScreen')">Cancel</button>
            </div>
        </form>
    `);
}


function displayDeleteChan() {
    removeElement("floatScreen");

    const chanData = document.getElementById("chanData");
    const title = chanData.dataset.title;

    addElement("mainAppScreen", "floatScreen", "div", "fixed-top align-middle mt-5", 
    `
        <div class="bg-danger bg-opacity-100 bg-gradient row mt-5 py-5 border border-info rounded-5 col-11 col-md-6 mx-auto" style="box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;">
            <h3 class="text-warning fw-bold text-center">Are you sure you want to leave ${title}?</h3>
            <h4 class="text-warning text-center">If you own this Chan, it will be deleted.</h4>
            <div class="text-center col-12 col-md-12 mx-auto my-2">
                <button class="rounded-3" type="button" onclick="frontDeleteChan()">Proceed</button>
            </div>
            <div class="text-center col-12 col-md-12 mx-auto mt-2">
                <button class="rounded-3" type="button" onclick="removeElement('floatScreen')">Cancel</button>
            </div>
        </div>
    `);
}


function displayModifyChan() {
    removeElement("floatScreen");

    const chanData = document.getElementById("chanData");
    const title = chanData.dataset.title;
    const desc = chanData.dataset.desc;

    // Page content is replaced with register screen.
    addElement("mainAppScreen", "floatScreen", "div", "fixed-top align-middle mt-5", 
    `
        <form class="bg-primary bg-opacity-100 bg-gradient row mt-5 py-5 border border-info rounded-5 col-11 col-md-6 mx-auto" style="box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;">
            <h3 class="text-warning fw-bold text-center">Modify Chan</h3>
            <div class="text-center pe-4 col-11 col-md-12 mx-auto">
                <input type="text" id="newTitle" name="newTitle" placeholder="New title" value="${title}" required>
            </div>
            <div class="text-center pe-4 col-11 col-md-12 mx-auto">
                <small class="pe-5" style="font-size: 0.75rem;">Must be less than 32 characters</small>
            </div>
            <div class="text-center pe-4 col-11 col-md-12 mx-auto">
                <input type="text" id="newDescription" name="newDescription" placeholder="New description" value="${desc}" required>
            </div>
            <div class="text-center pe-4 col-11 col-md-12 mx-auto">
            <small class="pe-5" style="font-size: 0.75rem;">Must be less than 64 characters</small>
            </div>

            <div class="text-center col-12 col-md-12 mx-auto my-2">
                <button class="rounded-3" type="button" onclick="formModifyChan()">Modify Chan</button>
            </div>
            <div class="text-center col-12 col-md-12 mx-auto mt-2">
                <button class="rounded-3" type="button" onclick="removeElement('floatScreen')">Cancel</button>
            </div>
        </form>
    `);
}


// This function is used to print the Chans to be displayed on the home page.
// Aiming at element with id "chansList".
function displayChanRow(chanRowID, title, description, rights, owner='') {
    parent = (rights == 't') ? "ownChansList" : "commonChansList";

    addElement(parent, chanRowID, "div", "",
    `
    <button class="list-group-item list-group-item-action list-group-item-action mb-1 rounded list-group-item-info" onclick="displayChan('${chanRowID}')" 
        data-title="${title}" 
        data-desc="${description}" 
        data-rights="${rights}" 
        data-owner="${owner}">
        <strong>${title}</strong> - ${description} <strong>${owner}</strong>
    </button>
    `);
}


function displayChansList() {
    getChansList().then(chans => {
        for (let i = 0; i < chans.length; i++) {
            if (chans[i].rights == 't') {
                displayChanRow('ownchan_'+i, chans[i].title, chans[i].description, chans[i].rights, '');
            } else if (chans[i].rights == 'f') {
                displayChanRow('comchan_'+i, chans[i].title, chans[i].description, chans[i].rights, 'by ' + chans[i].owner);
            }
        }
        addElement("commonChansList", 'chan_opt_com', "div", "",
        `
        <button class="list-group-item list-group-item-action list-group-item-action text-center fw-bold mb-1 rounded list-group-item-info" onclick="displayAddChan()">+</button>
        `);
        addElement("ownChansList", 'chan_opt_own', "div", "",
        `
        <button class="list-group-item list-group-item-action list-group-item-action text-center fw-bold mb-1 rounded list-group-item-info" onclick="displayCreateChan()">+</button>
        `);
    });
}


function eraseChansList(){
    getChansList().then(chans => {
        for (let i = 0; i < chans.length; i++) {
            removeElement("ownchan_"+i);
            removeElement("comchan_"+i);
        }
        removeElement("chan_opt_com");
        removeElement("chan_opt_own");
    });
}


// Expenses CRUD view functions ########################################################################


function displayExpense(expRowID) {
    const chanData = document.getElementById("chanData");
    const chanRowID = chanData.dataset.id;
    const chanTitle = chanData.dataset.title;
    const chanOwner = chanData.dataset.owner;

    const expRow = document.getElementById(expRowID).firstElementChild;

    // Get chosen Chan data.
    const title = expRow.dataset.title;
    const amount = expRow.dataset.amount;
    const date = expRow.dataset.date;

    removeElement("chanScreen");
    removeElement("floatScreen");

    
    // Page content is replaced with register screen.
    addElement("mainAppScreen", "chanScreen", "div", "", 
    `
        <h3 class="text-warning fw-bold text-center">${title}</h3>
        <h4 id="currentAmount" class="text-warning text-center">Total $${amount}</h4>
        <h5 class="text-warning text-center">On ${date}</h5>
        <div id="transData"  
            data-chanRowID="${chanRowID}" 
            data-chanTitle="${chanTitle}" 
            data-chanOwner="${chanOwner}" 
            data-id="${expRowID}" 
            data-title="${title}" 
            data-amount="${amount}" 
            data-date="${date}">
        </div>
        
        <div class="nav-container bg-success p-2 m-1 mb-3"></div>

        <div class="nav-container row justify-content-center m-1" style="width:100%;">
            <div class="col-4 text-center">
                <button class="btn btn-success rounded" onclick="drawHomePage();setTimeout(() => {displayChan('${chanRowID}');}, 200)"><img src="img/logo_home.png" class="img-fluid" alt="logo home" width="64" height="64"></button>
            </div>
            <div class="col-4 text-center">
                <button class="btn btn-danger rounded" onclick="displayDeleteExpense()"><img src="img/logo_suppr.png" class="img-fluid" alt="logo supprimer" width="64" height="64"></button>
            </div>
        </div>

        <!-- Expenses section -->
        <section id="transExpensesSect" class="card shadow-sm rounded mb-2 mt-1 p-1 bg-warning">
            <div class="card-header">
                <h4 class="fw-bold"><img src="img/logo_depenses.png" class="img-fluid" alt="logo depenses" width="48" height="48">Expenses list</h4>
            </div>
            <div id="transExpensesList" class="card-content list-group px-1 pt-1 border rounded bg-secondary"></div>
        </section>
    `);
    displayTransExpenses(chanTitle, chanOwner, chanRowID);
}


function displayCreateExpense() {
    removeElement("floatScreen");

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const today = `${day}/${month}/${year}`;

    addElement("mainAppScreen", "floatScreen", "div", "fixed-top align-middle mt-5", 
    `
        <form class="bg-primary bg-opacity-100 bg-gradient row mt-5 py-5 border border-info rounded-5 col-11 col-md-6 mx-auto" style="box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;">
            <h3 class="text-warning fw-bold text-center">Create transaction</h3>
            <div class="text-center pe-4 col-11 col-md-12 mx-auto">
                <input type="text" id="title" name="title" placeholder="Title" required>
            </div>
            <div class="text-center pe-4 col-11 col-md-12 mx-auto">
                <small class="pe-5" style="font-size: 0.75rem;">Must be less than 32 characters</small>
            </div>
            <div class="text-center pe-4 col-11 col-md-12 mx-auto">
                <input type="text" id="user" name="user" placeholder="Username" required>
            </div>
            <div class="text-center pe-4 col-11 col-md-12 mx-auto">
                <input type="text" id="amount" name="amount" placeholder="69.420" required>
            </div>
            <div class="text-center pe-4 col-11 col-md-12 mx-auto">
                <input type="text" id="date" name="date" placeholder="${today}" value="${today}" required>
            </div>

            <div class="text-center col-12 col-md-12 mx-auto my-2">
                <button class="rounded-3" type="button" onclick="formCreateExpense()">Create transaction</button>
            </div>
            <div class="text-center col-12 col-md-12 mx-auto mt-2">
                <button class="rounded-3" type="button" onclick="removeElement('floatScreen')">Cancel</button>
            </div>
        </form>
    `);
}


function displayDeleteExpense() {
    removeElement("floatScreen");

    addElement("mainAppScreen", "floatScreen", "div", "fixed-top align-middle mt-5", 
    `
        <div class="bg-danger bg-opacity-100 bg-gradient row mt-5 py-5 border border-info rounded-5 col-11 col-md-6 mx-auto" style="box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;">
            <h3 class="text-warning fw-bold text-center">Are you sure you want to remove this transaction?</h3>
            <h4 class="text-warning text-center">This will delete all its expenses.</h4>
            <div class="text-center col-12 col-md-12 mx-auto my-2">
                <button class="rounded-3" type="button" onclick="frontDeleteExpense()">Proceed</button>
            </div>
            <div class="text-center col-12 col-md-12 mx-auto mt-2">
                <button class="rounded-3" type="button" onclick="removeElement('floatScreen')">Cancel</button>
            </div>
        </div>
    `);
}


function displayChanExpenses() {
    const chanData = document.getElementById("chanData");
    const title = chanData.dataset.title;
    const owner = chanData.dataset.owner;

    getChanExpenses(title, owner).then(expenses => {
        for (let i = 0; i < expenses.length; i++) {
            displayExpenseRow('expense_'+i, expenses[i].title, expenses[i].amount, expenses[i].date);
        }
        addElement("chanExpensesList", 'exp_opt', "div", "",
        `
        <button class="list-group-item list-group-item-action list-group-item-action text-center fw-bold mb-1 rounded list-group-item-info" onclick="displayCreateExpense()">+</button>
        `);
    });
}


function displayExpenseRow(expRowID, title, amount, date) {
    addElement("chanExpensesList", expRowID, "div", "",
    `
    <button class="list-group-item list-group-item-action list-group-item-action mb-1 rounded list-group-item-info" onclick="displayExpense('${expRowID}')" 
        data-title="${title}" 
        data-amount="${amount}" 
        data-date="${date}">
        <strong>${title}</strong> - <strong>$${amount}</strong> - ${date}
    </button>
    `);
}


function eraseChanExpenses(title, owner){
    getChanExpenses(title, owner).then(exps => {
        for (let i = 0; i < exps.length; i++) {
            removeElement("expense_"+i);
        }
        removeElement("exp_opt");
    });
}


// Transaction (individual expense part) CRUD view functions ########################################################################


function displayTransaction(transRowID) {
    const transExpData = document.getElementById("transData");
    const chanRowID = transExpData.dataset.chanrowid;
    const chanTitle = transExpData.dataset.chantitle;
    const chanOwner = transExpData.dataset.chanowner;
    const title = transExpData.dataset.title;
    const amount = transExpData.dataset.amount;
    const date = transExpData.dataset.date;

    const transRow = document.getElementById(transRowID).firstElementChild;
    const transOwner = transRow.dataset.owner;
    const part = transRow.dataset.part;

    removeElement("chanScreen");
    removeElement("floatScreen");

    
    // Page content is replaced with register screen.
    addElement("mainAppScreen", "chanScreen", "div", "", 
    `
        <h3 class="text-warning fw-bold text-center">${title}</h3>
        <h4 class="text-warning text-center">Total $${amount}</h4>
        <h5 class="text-warning text-center">On ${date}</h5>
        <h5 class="text-warning text-center">Transaction part $${part} from ${transOwner}</h5>
        <div id="transData"  
            data-chanRowID="${chanRowID}" 
            data-chanTitle="${chanTitle}" 
            data-chanOwner="${chanOwner}" 
            data-transOwner="${transOwner}" 
            data-title="${title}">
        </div>
        
        <div class="nav-container bg-success p-2 m-1 mb-3"></div>

        <div class="nav-container row justify-content-center m-1" style="width:100%;">
            <div class="col-4 text-center">
                <button class="btn btn-success rounded" onclick="drawHomePage();setTimeout(() => {displayChan('${chanRowID}');}, 250)"><img src="img/logo_home.png" class="img-fluid" alt="logo home" width="64" height="64"></button>
            </div>
            <div class="col-4 text-center">
                <button class="btn btn-danger rounded" onclick="displayDeleteTransaction()"><img src="img/logo_suppr.png" class="img-fluid" alt="logo supprimer" width="64" height="64"></button>
            </div>
        </div>
    `);
}


function displayAddExpense() {
    removeElement("floatScreen");

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const today = `${day}/${month}/${year}`;

    addElement("mainAppScreen", "floatScreen", "div", "fixed-top align-middle mt-4", 
    `
        <form class="bg-primary bg-opacity-100 bg-gradient row mt-5 py-5 border border-info rounded-5 col-11 col-md-6 mx-auto" style="box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;">
            <h3 class="text-warning fw-bold text-center">Add expense to transaction</h3>
            <div class="text-center pe-4 col-11 col-md-12 mx-auto">
                <input type="text" id="user" name="user" placeholder="Username" required>
            </div>
            <div class="text-center pe-4 col-11 col-md-12 mx-auto">
                <input type="text" id="amount" name="amount" placeholder="69.420" required>
            </div>
            <div class="text-center pe-4 col-11 col-md-12 mx-auto">
                <input type="text" id="date" name="date" placeholder="${today}" value="${today}" required>
            </div>

            <div class="text-center col-12 col-md-12 mx-auto my-2">
                <button class="rounded-3" type="button" onclick="formAddExpense()">Add expense</button>
            </div>
            <div class="text-center col-12 col-md-12 mx-auto mt-2">
                <button class="rounded-3" type="button" onclick="removeElement('floatScreen')">Cancel</button>
            </div>
        </form>
    `);
}


function displayDeleteTransaction() {
    removeElement("floatScreen");

    addElement("mainAppScreen", "floatScreen", "div", "fixed-top align-middle mt-5", 
    `
        <div class="bg-danger bg-opacity-100 bg-gradient row mt-5 py-5 border border-info rounded-5 col-11 col-md-6 mx-auto" style="box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;">
            <h3 class="text-warning fw-bold text-center">Are you sure you want to remove this expense from this transaction?</h3>
            <div class="text-center col-12 col-md-12 mx-auto my-2">
                <button class="rounded-3" type="button" onclick="frontDeleteTransaction()">Proceed</button>
            </div>
            <div class="text-center col-12 col-md-12 mx-auto mt-2">
                <button class="rounded-3" type="button" onclick="removeElement('floatScreen')">Cancel</button>
            </div>
        </div>
    `);
}


function displayTransExpenses(chanTitle, chanOwner, chanRowID) {
    const transData = document.getElementById("transData");
    const title = transData.dataset.title;

    getTransExpenses(title, chanTitle, chanOwner).then(trans => {
        for (let i = 0; i < trans.length; i++) {
            displayTransRow('trans_'+i, chanRowID, trans[i].owner, trans[i].part);
        }
        addElement("transExpensesList", 'trans_opt', "div", "",
        `
        <button class="list-group-item list-group-item-action list-group-item-action text-center fw-bold mb-1 rounded list-group-item-info" onclick="displayAddExpense()">+</button>
        `);
    });
}


function displayTransRow(transRowID, chanRowID, owner, part) {
    addElement("transExpensesList", transRowID, "div", "",
    `
    <button class="list-group-item list-group-item-action list-group-item-action mb-1 rounded list-group-item-info" onclick="displayTransaction('${transRowID}')" 
        data-owner="${owner}" 
        data-part="${part}">
        <strong>${owner}</strong> - <strong>$${part}</strong>
    </button>
    `);
}


function eraseTransExpenses(title, chanTitle, chanOwner){
    getTransExpenses(title, chanTitle, chanOwner).then(trans => {
        for (let i = 0; i < trans.length; i++) {
            removeElement("trans_"+i);
        }
        removeElement("trans_opt");
    });
}


// Members CRUD view functions ########################################################################


function displayMember(username) {
    const chanData = document.getElementById("chanData");
    const chanRowID = chanData.dataset.id;
    const chanTitle = chanData.dataset.title;
    const chanOwner = chanData.dataset.owner;
    const curChanOwner = (chanOwner === '') ? 'you' : chanOwner;

    removeElement("chanScreen");
    removeElement("floatScreen");

    
    // Page content is replaced with register screen.
    addElement("mainAppScreen", "chanScreen", "div", "", 
    `
        <h3 class="text-warning fw-bold text-center">Chan ${chanTitle} owned by ${curChanOwner}</h3>
        <h4 class="text-warning text-center">Displaying user ${username}</h4>
        <div id="memData"  
            data-chanRowID="${chanRowID}" 
            data-title="${chanTitle}" 
            data-owner="${chanOwner}" 
            data-username="${username}">
        </div>
        
        <div class="nav-container bg-success p-2 m-1 mb-3"></div>

        <div class="nav-container row justify-content-center m-1" style="width:100%;">
            <div class="col-4 text-center">
                <button class="btn btn-success rounded" onclick="drawHomePage();setTimeout(() => {displayChan('${chanRowID}');}, 200)"><img src="img/logo_home.png" class="img-fluid" alt="logo home" width="64" height="64"></button>
            </div>
            <div class="col-4 text-center">
                <button class="btn btn-danger rounded" onclick="displayDeleteMember()"><img src="img/logo_suppr.png" class="img-fluid" alt="logo supprimer" width="64" height="64"></button>
            </div>
        </div>
    `);
}


function displayAddMember() {
    removeElement("floatScreen");

    addElement("mainAppScreen", "floatScreen", "div", "fixed-top align-middle mt-5", 
    `
        <form class="bg-primary bg-opacity-100 bg-gradient row mt-5 py-5 border border-info rounded-5 col-11 col-md-6 mx-auto" style="box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;">
            <h3 class="text-warning fw-bold text-center">Add member</h3>
            <div class="text-center pe-4 col-11 col-md-12 mx-auto">
                <input type="text" id="user" name="user" placeholder="Username" required>
            </div>

            <div class="text-center col-12 col-md-12 mx-auto my-2">
                <button class="rounded-3" type="button" onclick="formAddMember()">Add member</button>
            </div>
            <div class="text-center col-12 col-md-12 mx-auto mt-2">
                <button class="rounded-3" type="button" onclick="removeElement('floatScreen')">Cancel</button>
            </div>
        </form>
    `);
}


function displayDeleteMember() {
    removeElement("floatScreen");

    const username = memData.dataset.username;

    addElement("mainAppScreen", "floatScreen", "div", "fixed-top align-middle mt-5", 
    `
        <div class="bg-danger bg-opacity-100 bg-gradient row mt-5 py-5 border border-info rounded-5 col-11 col-md-6 mx-auto" style="box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;">
            <h3 class="text-warning fw-bold text-center">Are you sure you want to remove ${username} from this Chan?</h3>
            <h4 class="text-warning text-center">This will make the user leave the Chan.</h4>
            <div class="text-center col-12 col-md-12 mx-auto my-2">
                <button class="rounded-3" type="button" onclick="frontDeleteMember()">Proceed</button>
            </div>
            <div class="text-center col-12 col-md-12 mx-auto mt-2">
                <button class="rounded-3" type="button" onclick="removeElement('floatScreen')">Cancel</button>
            </div>
        </div>
    `);
}


function displayMemberRow(memRowID, username) {
    addElement("chanMembersList", memRowID, "div", "",
    `
    <button class="list-group-item list-group-item-action list-group-item-action mb-1 rounded list-group-item-info" onclick="displayMember('${username}')" 
        data-username="${username}">
        <strong>${username}</strong>
    </button>
    `);
}


function displayChanMembers() {
    const chanData = document.getElementById("chanData");
    const title = chanData.dataset.title;
    const owner = chanData.dataset.owner;

    getChanMembers(title, owner).then(members => {
        for (let i = 0; i < members.length; i++) {
            displayMemberRow('member_'+i, members[i].username);
        }
        addElement("chanMembersList", 'mem_opt', "div", "",
        `
        <button class="list-group-item list-group-item-action list-group-item-action text-center fw-bold mb-1 rounded list-group-item-info" onclick="displayAddMember()">+</button>
        `);
    });
}


function eraseChanMembers(title, owner){
    getChanMembers(title, owner).then(chans => {
        for (let i = 0; i < chans.length; i++) {
            removeElement("member_"+i);
        }
        removeElement("mem_opt");
    });
}
