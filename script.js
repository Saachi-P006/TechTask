const apiKey = "3200bd32d156db5b15fe6706704956e5"; // Replace with your OpenWeather API Key

function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  if (city === "") return;

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const template = document.getElementById("weatherCardTemplate");
      const clone = template.content.cloneNode(true);
      const card = clone.querySelector(".card");

      card.querySelector(".city").textContent = data.name;
      card.querySelector(".temp").textContent = `🌡️ Temp: ${data.main.temp}°C`;
      card.querySelector(".feels").textContent = `🥵 Feels: ${data.main.feels_like}°C`;
      card.querySelector(".condition").textContent = `☁️ Weather: ${data.weather[0].main}`;
      card.querySelector(".humidity").textContent = `💧 Humidity: ${data.main.humidity}%`;
      card.querySelector(".wind").textContent = `💨 Wind: ${data.wind.speed} m/s`;

      card.querySelector(".close-btn").addEventListener("click", () => {
        card.remove();
      });

      card.querySelector(".save-btn").addEventListener("click", () => {
        alert(`${data.name} weather saved!`);
        // Can store in localStorage here if you want
      });

      document.getElementById("weatherCards").appendChild(clone);

      getFiveDayForecast(city, card);
    })
    .catch(error => {
      alert("City not found 😢");
      console.error(error);
    });
}

function getFiveDayForecast(city, cardElement) {
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
      const forecastList = data.list;
      const dailyTemps = {};

      forecastList.forEach(item => {
        const date = item.dt_txt.split(" ")[0];
        if (!dailyTemps[date]) {
          dailyTemps[date] = { temp: item.main.temp, count: 1 };
        } else {
          dailyTemps[date].temp += item.main.temp;
          dailyTemps[date].count++;
        }
      });

      const forecastListElem = cardElement.querySelector(".forecast-list");
      forecastListElem.innerHTML = "";

      Object.entries(dailyTemps).slice(0, 5).forEach(([date, info]) => {
        const avgTemp = (info.temp / info.count).toFixed(1);
        const li = document.createElement("li");
        li.textContent = `${date}: ${avgTemp}°C`;
        forecastListElem.appendChild(li);
      });
    })
    .catch(error => {
      const forecastListElem = cardElement.querySelector(".forecast-list");
      forecastListElem.innerHTML = `<li>Error loading forecast</li>`;
      console.error(error);
    });
}
