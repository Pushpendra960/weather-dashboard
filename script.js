const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const loading = document.getElementById("loading");
const error = document.getElementById("error");

const weatherCard = document.getElementById("weatherCard");

const cityName = document.getElementById("cityName");
const currentDate = document.getElementById("currentDate");

const temperature = document.getElementById("temperature");
const weatherCondition = document.getElementById("weatherCondition");

const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const feelsLike = document.getElementById("feelsLike");
const visibility = document.getElementById("visibility");

const weatherIcon = document.getElementById("weatherIcon");

weatherCard.style.display = "none";

searchBtn.addEventListener("click", () => {

    const city = cityInput.value.trim();

    if(city===""){

        showError("Please enter a city name");

        return;

    }

    getWeather(city);

});

cityInput.addEventListener("keypress",function(e){

    if(e.key==="Enter"){

        searchBtn.click();

    }

});

async function getWeather(city){

    loading.style.display="block";

    weatherCard.style.display="none";

    error.style.display="none";

    try{

        // Step 1 Geocoding API

        const geoResponse=await fetch(

        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`

        );

        const geoData=await geoResponse.json();

        if(!geoData.results){

            throw new Error("City not found");

        }

        const latitude=geoData.results[0].latitude;

        const longitude=geoData.results[0].longitude;

        const cityRealName=geoData.results[0].name;

        const country=geoData.results[0].country;



        // Step 2 Weather API

        const weatherResponse=await fetch(

`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code`

        );

        const weatherData=await weatherResponse.json();

        displayWeather(cityRealName,country,weatherData.current);

    }

    catch(err){

        showError(err.message);

    }

    finally{

        loading.style.display="none";

    }

}



function displayWeather(city,country,data){

    cityName.textContent=`${city}, ${country}`;

    currentDate.textContent=new Date().toDateString();

    temperature.textContent=`${data.temperature_2m} °C`;

    humidity.textContent=`${data.relative_humidity_2m} %`;

    windSpeed.textContent=`${data.wind_speed_10m} km/h`;

    feelsLike.textContent=`${data.apparent_temperature} °C`;

    visibility.textContent="Good";



    let condition="Clear";

    let icon="";



    switch(data.weather_code){

        case 0:

            condition="Clear Sky";

            icon="https://openweathermap.org/img/wn/01d@2x.png";

            break;

        case 1:

        case 2:

        case 3:

            condition="Cloudy";

            icon="https://openweathermap.org/img/wn/03d@2x.png";

            break;

        case 45:

        case 48:

            condition="Fog";

            icon="https://openweathermap.org/img/wn/50d@2x.png";

            break;

        case 61:

        case 63:

        case 65:

            condition="Rain";

            icon="https://openweathermap.org/img/wn/10d@2x.png";

            break;

        case 71:

        case 73:

        case 75:

            condition="Snow";

            icon="https://openweathermap.org/img/wn/13d@2x.png";

            break;

        case 95:

            condition="Thunderstorm";

            icon="https://openweathermap.org/img/wn/11d@2x.png";

            break;

        default:

            condition="Partly Cloudy";

            icon="https://openweathermap.org/img/wn/02d@2x.png";

    }

    weatherCondition.textContent=condition;

    weatherIcon.src=icon;

    weatherCard.style.display="block";

}



function showError(message){

    error.style.display="block";

    error.textContent=message;

}