<template>
  <div class="container">
    <div class="header">
      <h1>WEATHER APP</h1>

      <div class="search-bar">
        <input
          type="text"
          v-model="city"
          placeholder="Enter city name"
          class="search-input"
        />

        <button
          @click="searchByCity"
          class="search-button"
        >
          Search
        </button>
      </div>
    </div>

    <main>
      <!-- Only display weather information when data is available -->
      <div v-if="weatherData">

        <!-- Display city and country returned from the API -->
        <h2>
          {{ weatherData.name }}, {{ weatherData.sys.country }}
        </h2>

        <div>
          <!-- Display the weather icon -->
          <img :src="iconUrl" alt="Weather Icon" />

          <!-- Display temperature -->
          <p>{{ temperature }} °C</p>
        </div>

        <div>
          <!-- Display current weather description -->
          <span>{{ weatherData.weather[0].description }}</span>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// Replace this with your own OpenWeather API key
const apikey = '9c026eb04a14a4150396a912b64d14ee'

// Reactive state
const city = ref('')
const weatherData = ref(null)
const hourlyForecast = ref([])
const dailyForecast = ref([])

// Convert temperature from Kelvin to Celsius
const temperature = computed(() => {
  return weatherData.value
    ? Math.floor(weatherData.value.main.temp - 273)
    : null
})

// Get the weather icon URL
const iconUrl = computed(() => {
  return weatherData.value
    ? `https://api.openweathermap.org/img/w/${weatherData.value.weather[0].icon}.png`
    : null
})

// Send request to OpenWeather API
const fetchWeatherData = async (url) => {
  try {
    const response = await axios.get(url)

    // Use .value to update ref variables
    weatherData.value = response.data
  } catch (error) {
    console.error('Error fetching weather data:', error)
  }
}

// Get weather based on the user's current location
const fetchCurrentLocationWeather = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords

      const url =
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}`

      await fetchWeatherData(url)
    })
  }
}

// Search weather by city name
const searchByCity = async () => {
  if (city.value) {
    const url =
      `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${apikey}`

    await fetchWeatherData(url)
  }
}

// Run when the page loads
onMounted(() => {
  fetchCurrentLocationWeather()
})
</script>