let selectedDay = null;
let lastWeather = null;

let isCelsius = true;
let isLoading = false;

document.getElementById('cityInput').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    searchWeatherDemo();
  }
});

function searchWeatherDemo() {
  const city = document.getElementById('cityInput').value.trim();
  isLoading = true;
  showLoading(true);

  // Demo data for Berlin (realistic, no API calls)
  setTimeout(() => {
    lastName = city.split(',')[0];
    lastCountry = city.split(',')[1] ? city.split(',')[1].trim() : 'DE';
    
    // Current
    const baseTemp = 18;
    lastWeather = {
      current: {
        temperature_2m: baseTemp,
        weathercode: 1,
        wind_speed_10m: 12
      },
      hourly: {
        time: Array.from({length: 24}, (_, i) => new Date(Date.now() + i*3600000).toISOString().slice(11, 16)),
        temperature_2m: Array.from({length: 24}, (_, i) => baseTemp + Math.sin(i/4)*3),
        relative_humidity_2m: Array.from({length: 24}, (_, i) => 60 + Math.cos(i/3)*20)
      },
      daily: {
        time: Array.from({length: 7}, (_, i) => new Date(Date.now() + i*86400000).toISOString().slice(0,10)),
        temperature_2m_max: Array.from({length: 7}, (_, i) => baseTemp + 4 + Math.sin(i/2)*2),
        temperature_2m_min: Array.from({length: 7}, (_, i) => baseTemp - 2 + Math.sin(i/2 + 1)*2),
        weathercode: [1, 3, 61, 0, 2, 3, 45]
      }
    };

    renderAll();
    isLoading = false;
    showLoading(false);
    document.getElementById('cityInput').value = '';
  }, 800);
}

function renderAll() {
  if (!lastWeather) return;

  showCurrentWeather(lastWeather, lastName, lastCountry);
  showDetails(lastWeather);
  showForecast(lastWeather);
  showHourly(lastWeather);
}

function showCurrentWeather(weather, name, country) {
  const div = document.getElementById('currentWeather');
  const icon = getWeatherIcon(weather.current.weathercode);

  div.innerHTML = `
    <h2>${name}, ${country}</h2>
    <div class="current-main">
      <span class="weather-icon">${icon}</span>
      <h1>${convertTemp(weather.current.temperature_2m).toFixed(1)}<span class="unit">${getUnit()}</span></h1>
    </div>
    <p>Wind: ${weather.current.wind_speed_10m.toFixed(1)} km/h</p>
  `;
  div.classList.remove('hidden');
}

function showDetails(weather) {
  const div = document.getElementById('details');
  const humidity = weather.hourly.relative_humidity_2m[0];

  div.innerHTML = `
    <div class="details-box">
      <p>Humidity</p> 
      <h3>${humidity.toFixed(0)}%</h3>
    </div>
    <div class="details-box">
      <p>Wind</p> 
      <h3>${weather.current.wind_speed_10m.toFixed(1)} km/h</h3>
    </div>
  `;
  div.classList.remove('hidden');
}

function showForecast(weather) {
  const div = document.getElementById('forecast');

  let html = '<h3>7-Days Forecast</h3><div class="forecast-days">';
  const time = weather.daily.time;
  const maxTemp = weather.daily.temperature_2m_max;
  const minTemp = weather.daily.temperature_2m_min;
  const code = weather.daily.weathercode;

  time.slice(0, 7).forEach((day, i) => {
    const icon = getWeatherIcon(code[i % code.length]);
    html += `
      <div class="day-card">
        <p>${getDayName(day)}</p>
        <span>${icon}</span>
        <p>${convertTemp(maxTemp[i]).toFixed(1)} / ${convertTemp(minTemp[i]).toFixed(1)}${getUnit()}</p>
      </div>
    `;
  });
  html += '</div>';
  div.innerHTML = html;
  div.classList.remove('hidden');
}

function showHourly(weather) {
  const div = document.getElementById('hourly');

  let html = '<h3>Hourly</h3>';
  weather.hourly.time.slice(0, 24).forEach((time, i) => {
    const hour = time.slice(0,5);
    html += `
      <div class="hour-item">
        <p>${hour}</p>
        <span>☀️</span>
        <p>${convertTemp(weather.hourly.temperature_2m[i]).toFixed(1)}${getUnit()}</p>
      </div>
    `;
  });
  div.innerHTML = html;
  div.classList.remove('hidden');
}

function getWeatherIcon(code) {
  const icons = {
    0: '☀️',
    1: '🌤',
    2: '⛅',
    3: '☁️',
    45: '🌫️',
    48: '🌫️',
    61: '🌧️',
    63: '🌧️',
    71: '❄️',
    95: '⛈️'
  };
  return icons[code] || '🌤️'; 
}

function getDayName(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function getUnit() {
  return isCelsius ? '°C' : '°F';
}

function toggleUnit() {
  isCelsius = !isCelsius;
  renderAll();
}

function convertTemp(celsius) {
  return isCelsius ? celsius : (celsius * 9 / 5) + 32;
}

function showLoading(show) {
  const searchBtn = document.querySelector('.search-bar button');
  if (show) {
    searchBtn.textContent = 'Loading...';
    searchBtn.disabled = true;
  } else {
    searchBtn.textContent = 'Search';
    searchBtn.disabled = false;
  }
}

function getLocationWeather() {
  document.getElementById('cityInput').value = 'Your Location';
  searchWeatherDemo();
}

      