// Those functions are used to support the main view functions.


// Function to add an element to a parent element.
function addElement(parentID, childID, tag, classes, content) {
    const parent = document.getElementById(parentID);
    const child = document.createElement(tag);
    child.setAttribute("id", childID);
    child.setAttribute("class", classes);
    child.innerHTML = content;
    parent.appendChild(child);
}


// Function to remove an element by its ID.
function removeElement(childID) {
    const child = document.getElementById(childID);
    if (child) {  // If the element exists, it is removed.
        child.parentNode.removeChild(child);
    }
}