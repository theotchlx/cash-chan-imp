// Auxilliary display functions below.


// changes the app screen size to take into account the absence of navbar.
function screenSizeNoNavbar() {
    const mainAppScreen = document.getElementById("mainAppScreen");
    mainAppScreen.classList.add("screen-size2");  // Screen size for no navbar.
    mainAppScreen.classList.remove("screen-size1");  // Screen size for navbar. (Removing it makes the classes cleaner)
}


// changes the app screen size to take into account the absence of navbar.
function screenSizeNavbar() {
    const mainAppScreen = document.getElementById("mainAppScreen");
    mainAppScreen.classList.add("screen-size1");  // Screen size for  navbar.
    mainAppScreen.classList.remove("screen-size2");  // Screen size for no navbar.
}


// changes the app background to the default Cash-chan clover & money bag.
function setbg1() {  // Cash-chan default background.
    const mainAppScreen = document.getElementsByTagName("body");
    mainAppScreen.classList.remove("bg1");
    mainAppScreen.classList.remove("bg2");
    mainAppScreen.classList.add("bg1");
}


// changes the app background to a high-quality horizontally spinning rat.
function setbg2() {  // High-Quality Horizontally Spinning Rat.
    const mainAppScreen = document.getElementsByTagName("body");
    mainAppScreen.classList.remove("bg2");
    mainAppScreen.classList.remove("bg1");
    mainAppScreen.classList.add("bg2");
}


function changeBackground() {
    const body = document.body;

    if (body.classList.contains("bg1")) {
      // If set1 is present, remove it and add set2
      body.classList.remove("bg1");
      body.classList.add("bg2");
    } else if (body.classList.contains("bg2")) {
      // If set2 is present, remove it and add set1
      body.classList.remove("bg2");
      body.classList.add("bg1");
    }
  }


// This function is used to display the message of the day (MOTD).
// Aiming at element with id "mainAppScreen".
function displayMOTD() {
    // Page content is replaced entirely with login screen.
    //PS: Already safe from injection. So innerhtml is ok.

    const motds = ["Welcome!", "How's it going?", "Hi you!", "Spinning Rat FTW!", "Kilroy was here.", "Dédicace Dorian.", "Not So RESTful.", "Restless, RESTless.", "Monty Python's.", "45 Rue Poliveau !", "Software By DO.", "Free As Beer Or Speech."];
    // Choose an MOTD (message of the day) at random. ("Welcome!" has 50% chance to appear)
    const motd = Math.random() < 0.5 ? motds[0] : motds[Math.floor(Math.random() * (motds.length - 1)) + 1];

    addElement("mainAppScreen", "motd", "div", "row", 
    `
        <div class="col-12 col-md-3 mx-auto pt-3 ">
            <h2 class="text-warning fw-bold text-center">${motd}</h2>
            <br>
        </div>
    `);
}


// This function is used to display a given error under a screen for 5 seconds.
// Aiming at element with given id.
function displayError(id, message) {
    // Error message appears 5 seconds.
    addElement(id, "error", "div", "row", 
    `
        <div class="col-12 col-md-3 mx-auto ">
            <h5 class="text-warning fw-bold text-center">${message}</h5>
        </div>
    `);
    setTimeout(() => {
        removeElement("error");
    }, 5000);  // 5000 milliseconds = 5 seconds.
}


function displayPageSettings() {
    removeElement("floatScreen");

    addElement("mainAppScreen", "floatScreen", "div", "fixed-top align-middle mt-5", 
    `
    <div class="bg-dark bg-opacity-100 bg-gradient row mt-5 py-5 border border-info rounded-5 col-11 col-md-6 mx-auto" style="box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;">
        <h3 class="text-warning fw-bold text-center">Page Settings</h3>
        <div class="text-center col-12 col-md-12 mx-auto my-2">
            <button class="btn btn-info btn-gradient rounded" onclick="changeBackground()">Change background</button>
        </div>
        <div class="text-center col-12 col-md-12 mx-auto mt-2">
            <button class="rounded-3" type="button" onclick="removeElement('floatScreen')">Cancel</button>
        </div>
    </div>
    `);
}


function displayUserSettings() {
    removeElement("floatScreen");
    getUserInfo().then((infolist) => {
        const username = infolist[0];
        const email = infolist[1];

        addElement("mainAppScreen", "floatScreen", "div", "fixed-top align-middle mt-5", 
        `
        <div class="bg-success bg-opacity-100 bg-gradient row mt-5 py-5 border border-info rounded-5 col-11 col-md-6 mx-auto" style="box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;">
            <h3 class="text-warning fw-bold text-center">Your Account</h3>
            <div class="text-center col-12 col-md-12 mx-auto my-2">
                <button class="btn btn-info btn-gradient rounded">Your username is ${username}</button>
            </div>
            <div class="text-center col-12 col-md-12 mx-auto my-2">
                <button class="btn btn-info btn-gradient rounded">Your email is ${email}</button>
            </div>
            <div class="text-center col-12 col-md-12 mx-auto mt-2">
                <button class="rounded-3" type="button" onclick="removeElement('floatScreen')">Cancel</button>
            </div>
        </div>
        `);
    });
}
