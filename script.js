const API_KEY = '3e2198d5ea932756371770e56a22821f'; 


document.getElementById('weatherForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const city = document.getElementById('cityInput').value;
    getWeather(city);
});

document.getElementById('locationButton').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            getWeatherByLocation(latitude, longitude);
        }, showError);
    } else {
        showError({ message: 'Geolocation is not supported by this browser.' });
    }
});

async function getWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        displayWeather(data);
        getForecast(data.coord.lat, data.coord.lon);
    } catch (error) {
        displayError(error.message);
    }
}

async function getWeatherByLocation(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            throw new Error('Unable to retrieve weather data');
        }
        const data = await response.json();
        displayWeather(data);
        getForecast(lat, lon);
    } catch (error) {
        displayError(error.message);
    }
}

async function getForecast(lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            throw new Error('Unable to retrieve forecast data');
        }
        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        displayError(error.message);
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function displayWeather(weather) {
    const weatherResult = document.getElementById('weatherResult');
    const currentCity = document.getElementById('currentCity');
    currentCity.innerHTML = `Current City: ${weather.name}`;
    weatherResult.innerHTML = `
        <div class="weather-box">
            <p class="bold-p">Temperature</p>
            <p>${weather.main.temp} °C</p>
        </div>
        <div class="weather-box">
            <p class="bold-p">Condition</p>
            <p>${capitalizeFirstLetter(weather.weather[0].description)}</p>
        </div>
        <div class="weather-box">
            <p class="bold-p">Humidity</p>
            <p>${weather.main.humidity} %</p>
        </div>
        <div class="weather-box">
            <p class="bold-p">Sunrise</p>
            <p>${new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}</p>
        </div>
        <div class="weather-box">
            <p class="bold-p">Sunset</p>
            <p>${new Date(weather.sys.sunset * 1000).toLocaleTimeString()}</p>
        </div>
    `;
}

function displayForecast(forecast) {
    const forecastResult = document.querySelector('#forecastResult tbody');
    forecastResult.innerHTML = '';
    forecast.list.forEach((item, index) => {
        if (index % 8 === 0) { // Display one forecast per day
            const date = new Date(item.dt * 1000).toLocaleDateString();
            const condition = capitalizeFirstLetter(item.weather[0].description);
            const temp = item.main.temp;
            const row = `
                <tr>
                    <td>${date}</td>
                    <td>${condition}</td>
                    <td>${temp} °C</td>
                </tr>
            `;
            forecastResult.innerHTML += row;
        }
    });
}

function displayError(message) {
    const weatherResult = document.getElementById('weatherResult');
    weatherResult.innerHTML = `<p class="error">${message}</p>`;
}

function showError(error) {
    displayError(error.message);
}
