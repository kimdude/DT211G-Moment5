"use strict"
//Fetching elements from html-document
const openBtn = document.getElementById("openMenu");
const closeBtn = document.getElementById("closeMenu");
const mainMenu = document.getElementById("navContainer");
const loadBtn = document.getElementById("btn");
const loadIcon = document.getElementById("loadIcon");
const programs = document.getElementById("programChart");

window.onload = retrieveData();

//Checking value of null and adding eventlisteners if variable exists
openBtn.addEventListener('click', displayMenu);
closeBtn.addEventListener('click', displayMenu);
if(loadBtn !== null) {
    loadBtn.addEventListener('click', displayLoad);
}

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

//Fetching API with try/catch och async/await
async function getData() {
    try {
        const response = await fetch('https://studenter.miun.se/~mallar/dt211g/');

        if(!response.ok) {
            throw new Error('Ett fel har uppträtt. Felaktigt svar från servern.');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Fel har uppstått:', error.message);
    }

}

//Sorting data after applicantsTotal and sending to function organise
async function retrieveData() {
    const data = await getData();

    const sortedData = data.sort((a,b) => b.applicantsTotal - a.applicantsTotal);
   
    organiseData(sortedData);
}

//Organising data after type
async function organiseData(sentData) {
    const allPrograms = [];
    const allCourses = [];

    for(let i = 0; i < sentData.length; i++) {

        if(sentData[i].type === "Program") {

            allPrograms.push(sentData[i]);

        } else if(sentData[i].type === "Kurs") {

            allCourses.push(sentData[i]);

        }
    }
    
    topPrograms(allPrograms);
    topCourses(allCourses);
}

//Selecting top 6 values from all programs
async function topPrograms(allPrograms) {
    console.log(allPrograms);
}

//Selecting top 6 values from all courses
async function topCourses(allCourses) {
    console.log(allCourses);
}

//Create chart
if(programs != null) {
    new Chart(programs, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Top 6 populäraste kurserna',
                data: [],
                borderWidth: 1
            }]
        },
        options: {
            backgroundColor: ['grey','black','darkred']
        }
    });
}