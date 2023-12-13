function getWeather() {
    const apiKey = '97edad0538bc1b3fa1e87a5fd33dfa36'; 
    const city = document.getElementById('cityInput').value;

    saveToSearchHistory(city);

    const getCityApiURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey;

    fetch(getCityApiURL)
    .then(response => response.json())
    .then(data => {
        const lat = data.coord.lat;
        const lon = data.coord.lon;
        const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey;
        fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displaySearchHistory();
            displayWeather(data);
            displayCurrentWeather(data);
        })
        .catch(error => {
            console.log('Error fetching data:', error);
        });
    })
    .catch(error => {
      console.log('Error fetching data:', error);
    });
}
    //Search History
function saveToSearchHistory(city) {
        
        let searchHistory = localStorage.getItem('searchHistory');
        if (!searchHistory) {
          searchHistory = [];
        } else {
          searchHistory = JSON.parse(searchHistory);
        }
      
        if (!searchHistory.includes(city)) {
          searchHistory.push(city);
          localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        }
}

      
function displaySearchHistory() {
        const searchHistoryList = document.getElementById('searchHistoryList');
        searchHistoryList.innerHTML = '';
      
        let searchHistory = localStorage.getItem('searchHistory');

        if (searchHistory) {
          searchHistory = JSON.parse(searchHistory);
          searchHistory.forEach(city => {
            const listItem = document.createElement('li');
            listItem.textContent = city;
            listItem.addEventListener('click', () => {
              document.getElementById('cityInput').value = city;
              getWeather();
            });
            searchHistoryList.appendChild(listItem);
          });
        }
}

  //Current Weather
  function displayCurrentWeather(data) {

    const city = data.city.name;
    const forecast = data.list[0];
    const temperature = forecast.main.temp;
    const windSpeed = forecast.wind.speed;
    const humidity = forecast.main.humidity;

    const weatherIcon = 'https://openweathermap.org/img/wn/' + forecast.weather[0].icon + '.png';
    const date = new Date(forecast.dt * 1000);
    const dateOptions = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    };
    const day = date.toLocaleDateString('en-US', dateOptions);

    const currentWeatherElement = document.getElementById('currentWeather');
    currentWeatherElement.innerHTML = `
      <h1>Current Weather</h1>
      <h2>${city}</h2>
      <img class="weather-icon" src="${weatherIcon}" alt="Weather Icon">
      <p> ${day}</p>
      <p>Temperature: ${temperature}°F</p>
      <p>Wind: ${windSpeed} MPH</p>
      <p>Humidity: ${humidity}%</p>
    `;
    weatherDataElement.appendChild(currentWeatherElement);
}

 //Forcast Weather
  function displayWeather(data) {
    const weatherDataElement = document.getElementById('weatherData');
    weatherDataElement.innerHTML = '';
  
    for (let i = 1; i < data.list.length; i += 8) {
      const forecast = data.list[i];
      const date = new Date(forecast.dt * 1000);
      const dateOptions = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      };
      const day = date.toLocaleDateString('en-US', dateOptions);
      const temperature = forecast.main.temp;
      const weatherIcon = 'https://openweathermap.org/img/wn/' + forecast.weather[0].icon + '.png';
      const windSpeed = forecast.wind.speed;
      const humidity = forecast.main.humidity;

  
      const forecastElement = document.createElement('div');
      forecastElement.classList.add('forecast-item');
      forecastElement.innerHTML = `
        <p> ${day}</p>
        <img class="weather-icon" src="${weatherIcon}" alt="Weather Icon">
        <p>Temp: ${temperature}°F</p>
        <p>Wind: ${windSpeed} MPH</p>
        <p>Humidity: ${humidity}%</p>
      `;
      weatherDataElement.appendChild(forecastElement);
    }
  }