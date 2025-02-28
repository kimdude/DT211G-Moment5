"use strict"
//Fetching elements from html-document
const openBtn = document.getElementById("openMenu");
const closeBtn = document.getElementById("closeMenu");
const mainMenu = document.getElementById("navContainer");
const loadBtn = document.getElementById("btn");
const loadIcon = document.getElementById("loadIcon");

//Checking value of null and adding eventlisteners if variable exists
openBtn.addEventListener('click', displayMenu);
closeBtn.addEventListener('click', displayMenu);
loadBtn.addEventListener('click', displayLoad);

//Toggle main menu i mobile-version
function displayMenu() {
    const style = window.getComputedStyle(mainMenu);

    if(style.display === "none") {
        mainMenu.style.display = "block";
        openBtn.style.display = "none";
    } else {
        mainMenu.style.display = "none";
        openBtn.style.display = "block";
    }
}

//Toggle load Icon
function displayLoad() {
    const style = window.getComputedStyle(loadIcon);

    if(style.visibility === "hidden") {
        loadIcon.style.visibility = "visible";
    } else {
        loadIcon.style.visibility = "hidden";
    }
}