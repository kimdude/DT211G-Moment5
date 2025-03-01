"use strict"
//Fetching elements from html-document
const openBtn = document.getElementById("openMenu");
const closeBtn = document.getElementById("closeMenu");
const mainMenu = document.getElementById("navContainer");
const loadBtn = document.getElementById("btn");
const loadIcon = document.getElementById("loadIcon");
const programs = document.getElementById("programChart");
const courses = document.getElementById("courseChart");

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

//Selecting top 6 values from all programs and creating chart
async function topPrograms(allPrograms) {
    
    const data = []

    for(let i = 0; i < 6; i++) {
        data.push(allPrograms[i]);
    }

    new Chart(programs, {
        type: 'pie',
        data: {
            labels: data.map(row => row.name),
            datasets: [{
                label: '6 mest sökta programmen',
                data: data.map(row => row.applicantsTotal),
                borderWidth: 1
            }]
        },
        options: {
            backgroundColor: ['#63dafc','#0bbd96','#1d719d','#6addc4','#082d41','#008f70'],
            borderColor: ['#082d41'],
            hoverBorderColor: '#064263',
            hoverBorderWidth: 3,
        }
    });
    
}

//Selecting top 6 values from all courses
async function topCourses(allCourses) {
    const data = []

    for(let i = 0; i < 6; i++) {
        data.push(allCourses[i]);
    }

    new Chart(courses, {
        type: 'bar',
        data: {
            labels: data.map(row => row.name),
            datasets: [{
                label: '6 mest sökta kurserna',
                data: data.map(row => row.applicantsTotal),
                borderWidth: 1
            }]
        },
        options: {
            backgroundColor: ['#63dafc','#0bbd96','#1d719d','#6addc4','#082d41','#008f70'],
            borderColor: ['#082d41'],
            hoverBorderColor: '#064263',
            hoverBorderWidth: 3,
        }
    });
}