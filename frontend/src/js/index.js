const API_BASE = window.location.origin + '/api';
    let currentCityData = null;
//frontend code to fetch the weather data from the backend and display it on the page
    async function searchWeather(cityNameOverride) {
      const city = cityNameOverride || document.getElementById('cityInput').value;
      if (!city) return;
        const res = await fetch(`${API_BASE}/weather?city=${encodeURIComponent(city)}`);
        const data = await res.json();

        if (!res.ok) {
          alert(data.error || 'Error with the request');
          return;
        }

        currentCityData = data;
        document.getElementById('resCity').innerText = `${data.cityName}, ${data.country}`;
        document.getElementById('resTemp').innerText = data.temperature;
        document.getElementById('resHumidity').innerText = `${data.humidity}%`;
        document.getElementById('resVisibility').innerText = `${(data.visibility / 1000).toFixed(1)} km`;
        document.getElementById('resPressure').innerText = `${Math.round(data.pressure)} hPa`;
        document.getElementById('resWind').innerText = data.windspeed;
        document.getElementById('resDate').innerText = formatWeatherDate(data.time, data.timezone);
        const weatherIconElement = document.querySelector('.weather-icon');
        if (weatherIconElement) {
          weatherIconElement.innerText = weatherIcon(data.weathercode);
        }
        document.getElementById('weatherResult').style.display = 'block';
    }

    function formatWeatherDate(time, timezone) {
      return new Intl.DateTimeFormat('en', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        timeZone: timezone
      }).format(new Date(`${time}:00Z`));
    }

    async function saveFavorite() {
      if (!currentCityData) return;

      try {
        const res = await fetch(`${API_BASE}/favorites`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cityName: currentCityData.cityName,
            country: currentCityData.country,
            latitude: currentCityData.latitude,
            longitude: currentCityData.longitude
          })
        });

        const data = await res.json();
        if (!res.ok) {
          alert(data.error || 'Error with the request');
        } else {
          loadFavorites();
        }
      } catch (err) {
        alert('Error saving favorite.');
      }
    }

    async function loadFavorites() {
      try {
        const res = await fetch(`${API_BASE}/favorites`);
        const favorites = await res.json();

        const container = document.getElementById('favContainer');
        const clearButton = document.getElementById('clearFavoritesButton');
        clearButton.disabled = favorites.length === 0;
        if (favorites.length === 0) {
          container.innerHTML = '<p>No favorite cities registered.</p>';
          return;
        }

        container.innerHTML = favorites.map(fav => `
          <div class="fav-item" data-city="${encodeURIComponent(fav.cityName)}">
            <span><strong>${fav.cityName}</strong> (${fav.country})</span>
            <button class="remove-fav-btn" type="button" onclick="event.stopPropagation(); removeFavorite('${fav._id}')" aria-label="Remove ${fav.cityName}">×</button>
          </div>
        `).join('');

        container.querySelectorAll('.fav-item').forEach(item => {
          item.addEventListener('click', () => searchWeather(decodeURIComponent(item.dataset.city)));
        });
      } catch (err) {
        document.getElementById('favContainer').innerText = 'Error loading favorites.';
      }
    }

    async function removeFavorite(favoriteId) {
      try {
        const res = await fetch(`${API_BASE}/favorites/${favoriteId}`, { method: 'DELETE' });
        if (!res.ok) {
          const data = await res.json();
          alert(data.error || 'Error removing favorite.');
          return;
        }
        loadFavorites();
      } catch (err) {
        alert('Error removing favorite.');
      }
    }

    async function clearFavorites() {
      if (!confirm('Remove all favorite cities?')) return;

      try {
        const res = await fetch(`${API_BASE}/favorites`, { method: 'DELETE' });
        if (!res.ok) {
          const data = await res.json();
          alert(data.error || 'Error clearing favorites.');
          return;
        }
        loadFavorites();
      } catch (err) {
        alert('Error clearing favorites.');
      }
    }

    loadFavorites();