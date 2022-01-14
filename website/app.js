// WeatherMapAPI Constans 
const BASE_URL = `https://api.openweathermap.org/data/2.5/weather`;
const API_KEY = "37f80f8ec9958a0e288f4d54f32f9ef4";

// DOM Elements
const generateBtn = document.querySelector("#generate");
const zipCodeInput = document.querySelector("#zip");
const feelingsInput = document.querySelector("#feelings");
const errorMessage = document.querySelector("#error");

// DOM Elements for projectData
const tempEntry = document.querySelector("#temp");
const dateEntry = document.querySelector("#date");
const contentEntry = document.querySelector("#content");

// Sends project data to the server to store it
async function sendProjectData(data){
    return fetch("/api/project", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
}

// Requests the project data from the server
async function getProjectData(){
    const res = await fetch("/api/project");
    return await res.json();
}

// Uses WeatherMapAPI to get temperature using zip code
async function getTemperatureByZipCode(zipCode){
    const res = await fetch(`${BASE_URL}?appid=${API_KEY}&zip=${zipCode}&units=imperial`);
    const data = await res.json();

    if(!res.ok) throw new Error("City not found! Enter a valid zip code");

    return data.main.temp;
}

// Generates current date in DD-MM-YYYY format
function getCurrentDate(){
    const d = new Date();
    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
}

// Handles button UI
// disable button on click
function buttonState(btn){
    const content = btn.innerHTML;

    return {
        loading(){
            btn.disabled = true;
            btn.innerHTML = "loading..."
        },
        steady(){
            btn.disabled = false;
            btn.innerHTML = content;
        }
    }
}

// Displays error message in <div id="error"></div>
function reportError(msg){
    errorMessage.innerHTML = msg;
}

// Resets input values
// Used data is successfully sent to the server.
function resetInputValues(){
    feelingsInput.value = "";
    zipCodeInput.value = "";
}

// Displays { temperature, date, feelings } in DOM.
function displayProjectData(data){
    tempEntry.innerHTML = data.temperature || "";
    dateEntry.innerHTML = data.date || "";
    contentEntry.innerHTML = data.useResponse || "";
}

generateBtn.addEventListener("click", () => {
    const { loading, steady } = buttonState(generateBtn);
    
    // button becomes disabled and content = loading...
    loading();

    // reset error message every new request
    reportError("");

    getTemperatureByZipCode(zipCodeInput.value)
        .then(temp => {
            const userResponse = feelingsInput.value;

            if(!userResponse) throw new Error("please enter your feelings about the weather");

            sendProjectData({
                temperature: temp,
                date: getCurrentDate(),
                useResponse: feelingsInput.value
            })
        })
        .then(async () => {
            const projectData = await getProjectData();
            displayProjectData(projectData);
            resetInputValues();
        })
        /* 
            Report errors in case of:
             - Network Errors.
             - Invalid ZIP code.
             - Empty Feelings.
        */
        .catch(err => reportError(err.message))
        // reset button content and props to default.
        .then(() => steady())
});

/* 
    Bootstrap app UI
    
    Fetchs the project data and displays in DOM
*/
(function(){
    getProjectData().then(displayProjectData);
})()