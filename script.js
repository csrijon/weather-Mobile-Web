const daysHistoy = document.querySelector('.dayshistory');
const weathershow = document.querySelector(".weathershow");
const currentTempElem = document.querySelector("#current-temp");
const currentFeellike = document.querySelector("#feels-like");
const currentuv = document.querySelector("#uv-row");
const currentHumidity = document.querySelector("#humidity-row");
const currentwindspeed = document.querySelector("#wind-speed");
const currentpressure = document.querySelector("#pressure");
const currentvisibility = document.querySelector("#visibility");
const todaysname = document.querySelector("#today-name");
const raifallupdate = document.querySelector("#rainfall");
const iconchnage = document.querySelector("#icon");
const cityName = document.querySelector("#city_name");
const permButton = document.querySelector("#askperm");
const permBlur = document.querySelector(".askpermission")


let currentPosition = null;


function generateRow(data) {
    const div = document.createElement('div')
    div.classList.add('row')
    div.innerHTML = `
    <p>${data.date}</p>
    <p><span class="material-symbols-outlined">cloud</span></p>
    <p>${data.day.avgtemp_c}&deg; / ${data.day.maxtemp_c}&deg;</p>`
    return div;
}
function getDayname(name) {
    const date = new Date(name);
    const options = { weekday: 'long' };
    return date.toLocaleDateString(undefined, options);
}

async function updateCityName(data) {
    cityName.innerHTML = `${data["location"]["name"]}`
} 

async function updatedayname(data) {
    const todayDate = data.location.localtime.split(' ')[0];
    const todayDayName = getDayname(todayDate);
    todaysname.innerHTML = `Today is ${todayDayName}`
}
async function updateCurrentTemp(data) {
    currentTempElem.innerHTML = `${data["current"]["temp_c"]}&deg;C`;
}
async function updateDayHistory(data) {
    daysHistoy.innerHTML = '';
    const days = data.forecast.forecastday;
    days.forEach(dayData => {
        const row = generateRow(dayData);
        daysHistoy.appendChild(row);
    });
}

async function updateFeellike(data) {
    currentFeellike.innerHTML = ` ${data["current"]["feelslike_c"]}&deg`;
}
async function updateUV(data) {
    currentuv.innerHTML = `${data["current"]["uv"]}`;
}
async function updateHumidity(data) {
    currentHumidity.innerHTML = `${data["current"]["humidity"]}%`;
}
async function updateWindSpeed(data) {
    currentwindspeed.innerHTML = `${data["current"]["wind_mph"]}`;
}
async function updatePressure(data) {
    currentpressure.innerHTML = `${data["current"]["pressure_mb"]}`
}
async function updateVisibility(data) {
    currentvisibility.innerHTML = `${data["current"]["vis_miles"]}`
}
async function updateWeather(data) {
    raifallupdate.innerHTML = `${data["current"]["condition"]["text"]}`
}
async function iconChnage(data) {
    iconchnage.innerHTML = `${data["current"]["icon"]}`
}

function assignCurentPosition() {
    navigator.geolocation.getCurrentPosition(
        async (position) => { 
            currentPosition = position;
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const locationStr = `${lat},${lon}`;
            const data = await fetchCurrentWeatherByCity(locationStr);
            await updateCityName(data)
            await updateCurrentTemp(data)
            await updateFeellike(data)
            await updateUV(data)
            await updateHumidity(data)
            await updateWindSpeed(data)
            await updatePressure(data)
            await updateVisibility(data)
            await updatedayname(data)
            await updateWeather(data)
            permBlur.style.display = "none"  
            const today = new Date();
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(today.getDate() - 7);
            const historicalData = await fetchWeatherHistory(
                locationStr,
                sevenDaysAgo.toISOString().slice(0, 10),
                today.toISOString().slice(0, 10)
            );
            updateDayHistory(historicalData)
        },
        (error) => {
            console.error(error);
        },
        { enableHighAccuracy: true }
    );
}

permButton.addEventListener("click", (_) => {
    navigator.permissions.query({ name: "geolocation" })
    .then(async (result) => {
        if (result.state === "prompt") {
            assignCurentPosition()
        } else {
            alert("Please enable location services!");
        }
    });
})

document.addEventListener("DOMContentLoaded", () => {
    navigator.permissions.query({ name: "geolocation" })
    .then((result) => {
        if (result.state === "granted") {
            permBlur.style.display = "none" 
            assignCurentPosition()   
        }
    });
})