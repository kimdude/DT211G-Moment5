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
/**
 * Hämtar data med fetchAPI och konverterar till JS-array.
 * 
 * @async getData
 * @returns {Array} En JavaScript array med kurser och program.
 * @var {string} response - Hämtar och sparar data från extern API med fetchAPI.
 * @throws {Error} Om fetchAPI misslyckades.
 * @var data - Konverterar och sparar datan som JS-array.
 * 
 */
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
/**
 * Tar emot array och sorterar dess värden utifrån numeriska värden.
 * 
 * @async retrieveData
 * @var data - Anropar funktion för att hämta arrayen med await/sync.
 * @typedef {Array} sortedData - Sorterar och sparar den sorterade datan med sort().
 * @function sort - Jämför alla värden i arrayen med varandra och sorterar dem i fallande ordning.
 * @property {number} applicantsTotal - Totalt antal ansökningar på respektive kurs och program.
 * @param {string} sortedData - Resultatet med en array sorterad i numerisk ordning.
 * 
 */
async function retrieveData() {
    const data = await getData();

    const sortedData = data.sort((a,b) => b.applicantsTotal - a.applicantsTotal);

        organiseData(sortedData);

}


//Organising data after type and pushing into seperate arrays
/**
 * Tar emot array och delar upp objekt utifrån typ av objekt.
 * 
 * @async organiseData
 * @param {Array} sentData - Array med kurser och program.
 * @var {Array} allPrograms - Sparar en tom array för program.
 * @var {Array} allCourses - Sparar en tom array för kurser.
 * @property {string} type - Definierar typ av objekt från arrayen.
 * @method push - Lägger till objektet med vald typ i matchande array.
 * 
 * @function topPrograms - Skapar array med toplista och lägger till i diagram.
 * @param {Array} allPrograms - Array med program.
 * @param {string} programmen - Typ av utbildningar som arrayen innehåller.
 * @param {number} - Antal utbildningar som toplistan ska innehålla.
 * @param {string} programs - HTML canvas som toplistans diagram ska visas på.
 * 
 */
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
    
    topPrograms(allPrograms, 'programmen', 5, 'pie', programs);
    topPrograms(allCourses, 'kurserna', 6, 'bar', courses);
}


//Selecting top values from array and creating chart
/**
 * 
 * @param {Array} allPrograms - Array med alla program.
 * @var {Array} data - Sparar array för top 5 mest ansökta program.
 * @method push - Lägger till de första 5 programmen i egen array.
 * 
 * @var programs - HTML canvas för att lägga till nytt diagram.
 * @property {string} type - Typ av diagram.
 * @property {object} data - Innehåller datan som diagrammet presenterar.
 * @method map - Använder array med top 5 program och skapar ny array av programnamn och antal sökanden.
 * @property {object} datasets - Specifierar datan som presenteras i diagrammet.
 * @property {string} label - Namn på diagrammet.
 * @property {number} borderWidth - Kantbredd på diagrammet.
 * @property {object} options - Specifierar designalternativ av diagrammet.
 * @property {string} backgroundColor - Bakgrundsfärg på varje block som presenterar data.
 * @property {string} borderColor - Kantfärg på diagrammet.
 * @property {string} hoverBorderColor - Kantfärg när musen förs över.
 * @property {number} hoverBorderWidth - Kantbredd när musen förs över.
 * 
 */
async function topPrograms(allPrograms, educationType, topLimit, type, canvas) {
    
    const data = []

    for(let i = 0; i < topLimit; i++) {
        data.push(allPrograms[i]);
    }
    
    if(canvas !== null) {
        new Chart(canvas, {
            type: type,
            data: {
                labels: data.map(row => row.name),
                datasets: [{
                    label: topLimit + ' mest sökta ' + educationType,
                    data: data.map(row => row.applicantsTotal),
                    borderWidth: 1
                }]
            },
            options: {
                backgroundColor: ['#63dafc','#0bbd96','#1d719d','#6addc4','#082d41'],
                borderColor: ['#082d41'],
                hoverBorderColor: ['#064263'],
                hoverBorderWidth: 3,
            }
        });
        
    }
}