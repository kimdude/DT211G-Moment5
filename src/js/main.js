"use strict"

//Fetching elements from html-document
const openBtn = document.getElementById("openMenu");
const closeBtn = document.getElementById("closeMenu");
const mainMenu = document.getElementById("navContainer");
const loadBtn = document.getElementById("btn");
const loadIcon = document.getElementById("loadIcon");
const programs = document.getElementById("programChart");
const courses = document.getElementById("courseChart");
const mapDiv = document.getElementById("map");
const input = document.getElementById("searchInput");
const search = document.getElementById("searchBtn");

window.onload = () => {
    retrieveData();
} 

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


//Checking if HTML div exists
if(mapDiv !== null) {

    search.addEventListener('click', function() {
        fetchLocation(input.value);
    });


    //Creating map
    /**
     * Skapar ny karta i HTML-filen.
     * @method L.map - Initierar ny karta.
     * @param mapDiv - Väljer HTML-elementet som kartan placeras i.
     * 
     * @method setView - Väljer koordinater och zoom-level kartan visar.
     * @param {number} - Latitud från koordinaterna.
     * @param {number} - Longitud från koordinaterna.
     * @param {number} - Zoom-level.
     * 
     */
    let map = L.map(mapDiv).setView([62.3928714, 17.285290500000002],13);

    /**
     * Lägger till markör på kartan.
     * @var marker - Variabel som refererar till markören.
     * 
     * @method L.marker - Skapar ny markör.
     * @param {number} - Latitud från koordinaterna.
     * @param {number} - Longitud från koordinaterna.
     * @method addTo - Lägger till nytt lager för markören.
     * 
     */
    let marker = L.marker([62.3928714, 17.285290500000002]).addTo(map);

    /**
     * Ritar ut kartan i stycken.
     * @method tileLayer - Skapar nytt lager med hjälp av url-mall.
     * @property {number} maxZoom - Hur långt användare kan max zooma in på kartan.
     * @property {string} attribution - Länk med attribution till utvecklarna bakom programvarorna.
     * 
     */
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 17,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);


    //Fetching data to convert places into coordinates
    /**
     * Hämtar data med fetchAPI och konverterar till JS-array.
     * 
     * @async fetchLocation
     * @var {string} response - Hämtar data med fetchAPI.
     * @param search - Platsen användaren söker.
     * @throws {Error} Om fetchAPI misslyckades.
     * @var data - Konverterar och sparar datan som JS-array.
     * @function sendLocation - Hämtar koordinater utifrån namn på en plats.
     * 
     */
    async function fetchLocation(search){
    try {
        const response = await fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + search);

        if(!response.ok) {
            throw new Error('Felaktigt svar från servern.')
        }

        const data = await response.json();
        sendLocation(data);

    } catch(error) {
        console.error('Ett fel har uppstått:', error.message)
    }
    }


    //Sending location data
    /**
     * @async sendLocation
     * 
     * @param {Array} location - Plats som användaren söker.
     * @param place - Loopar igenom varje plats i arrayen.
     * @property {number} lat - Skapar array av latitud för sökt plats.
     * @property {number} lon - Skapar array av longitude för sökt plats.
     * @function locate - Visar latitud och longitud på kartan.
     * 
     */
    async function sendLocation(location) {

    const latitude = location.map(place => place.lat);
    const longitude = location.map(place => place.lon);

    locate(latitude[0],longitude[0]);
    }


    //Creating a map
    /**
     * Flyttar kartan och markör till valda koordinater.
     * @param {number} lat - Latitud.
     * @param {number} lon - Longitud.
     * 
     * @method removeLayer - Tar bort lager.
     * @method L.marker - Skapar ny markör.
     * @method addTo - Lägger till nytt lager för markören.
     * 
     * @method flyTo - Flyttar på kartvyn.
     */
    function locate(lat,lon) {

    map.removeLayer(marker);
    marker = L.marker([lat,lon]).addTo(map);

    map.flyTo(new L.LatLng(lat,lon),13);

    }
}

