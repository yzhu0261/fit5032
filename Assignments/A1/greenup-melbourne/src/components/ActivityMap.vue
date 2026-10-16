<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Import Leaflet marker images so Vite includes them in the build
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Set the default marker icon paths
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow
})

// Receive the activity list from the Explore page.
const props = defineProps({
  activities: {
    type: Array,
    required: true
  }
})

// Approximate coordinates for the activity suburbs.
const activityLocations = {
  Clayton: [-37.924, 145.120],
  Richmond: [-37.819, 145.001],
  Dandenong: [-37.987, 145.215],
  'Box Hill': [-37.819, 145.123],
  Carlton: [-37.800, 144.967],
  Oakleigh: [-37.899, 145.088],
  'Glen Waverley': [-37.879, 145.163],
  Fitzroy: [-37.799, 144.978],
  Scoresby: [-37.899, 145.232],
  Burwood: [-37.850, 145.114],
  Prahran: [-37.851, 144.993],
  Ringwood: [-37.815, 145.229]
}

// Store the map container.
const mapContainer = ref(null)

const userLocation = ref(null)
const locationMessage = ref('')
const locating = ref(false)

let map = null

let userMarker = null

// Store the selected activity type and marker layer.
const selectedMapType = ref('All')
let markerLayer = null

// Display markers for the selected activity type.
const updateMarkers = () => {
  if (!markerLayer) return

  markerLayer.clearLayers()

  const filteredActivities = props.activities.filter(
    (activity) =>
      selectedMapType.value === 'All' ||
      activity.type === selectedMapType.value
  )

  filteredActivities.forEach((activity) => {
    const coordinates = activityLocations[activity.location]

    if (coordinates) {
      let distanceText = ''

      if (userLocation.value) {
        const distance = calculateDistance(
          userLocation.value[0],
          userLocation.value[1],
          coordinates[0],
          coordinates[1]
        )

        distanceText = `<p>Distance: ${distance.toFixed(1)} km</p>`
      }

      L.marker(coordinates)
        .bindPopup(`
          <strong>${activity.name}</strong>
          <p>Type: ${activity.type}</p>
          <p>Date: ${activity.date}</p>
          <p>Location: ${activity.location}</p>
          ${distanceText}
        `)
        .addTo(markerLayer)
    }
  })
}

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const earthRadius = 6371

  const latDifference = (lat2 - lat1) * Math.PI / 180
  const lonDifference = (lon2 - lon1) * Math.PI / 180

  const a =
    Math.sin(latDifference / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(lonDifference / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return earthRadius * c
}

const nearbyActivities = computed(() => {
  if (!userLocation.value) return []

  return props.activities
    .filter((activity) => activityLocations[activity.location])
    .map((activity) => {
      const coordinates = activityLocations[activity.location]

      return {
        ...activity,
        distance: calculateDistance(
          userLocation.value[0],
          userLocation.value[1],
          coordinates[0],
          coordinates[1]
        )
      }
    })
    .sort((a, b) => a.distance - b.distance)
})

const findMyLocation = () => {
  if (!navigator.geolocation) {
    locationMessage.value = 'Geolocation is not supported by your browser.'
    return
  }

  locating.value = true
  locationMessage.value = ''

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords

      userLocation.value = [latitude, longitude]
      updateMarkers()
      locating.value = false

      // Move the map to the user's current location.
      map.setView([latitude, longitude], 13)

      if (userMarker) {
        userMarker.setLatLng([latitude, longitude])
      } else {
        userMarker = L.circleMarker([latitude, longitude], {
          radius: 9,
          color: '#2457A6',
          fillColor: '#2457A6',
          fillOpacity: 0.9
        })
          .addTo(map)
          .bindPopup('You are here')
      }

      locationMessage.value = 'Your location has been found.'
    },
    (error) => {
      locating.value = false
      locationMessage.value = 'Unable to get your location: ' + error.message
    }
  )
}

onMounted(() => {
  // Create a map centred on Melbourne.
  map = L.map(mapContainer.value).setView(
    [-37.8136, 144.9631],
    11
  )

  // Add the OpenStreetMap map layer.
  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; OpenStreetMap contributors'
    }
  ).addTo(map)


// Create a layer to manage activity markers.
markerLayer = L.layerGroup().addTo(map)

// Display all markers when the map first loads.
updateMarkers()
})

onUnmounted(() => {
  // Remove the map when the component is destroyed.
  if (map) {
    map.remove()
  }
})
</script>

<template>
  <section class="mt-5">
    <h2 class="h4 mb-3">Melbourne Activity Map</h2>

    <!-- Filter map markers by activity type. -->
    <div class="mb-3">
        <label for="mapActivityType" class="form-label">
            Filter map by activity type
        </label>

        <select
            id="mapActivityType"
            v-model="selectedMapType"
            class="form-select"
            @change="updateMarkers"
        >
            <option value="All">All</option>
            <option value="Tree Planting">Tree Planting</option>
            <option value="Gardening">Gardening</option>
            <option value="Restoration">Restoration</option>
        </select>
    </div>

    <div class="mb-3">
      <button
        type="button"
        class="btn btn-success"
        :disabled="locating"
        @click="findMyLocation"
      >
        {{ locating ? 'Finding your location...' : 'Find Activities Near Me' }}
      </button>

      <p
        v-if="locationMessage"
        class="mt-2 mb-0"
        role="status"
      >
        {{ locationMessage }}
      </p>
    </div>

    <div
      ref="mapContainer"
      class="activity-map"
      aria-label="Interactive map of Melbourne"
    ></div>

    <div v-if="userLocation && nearbyActivities.length" class="mt-4">
      <h3 class="h5">Nearby Activities</h3>
      <p class="text-muted">
        Activities sorted by straight-line distance from your location.
      </p>

      <ol class="list-group list-group-numbered">
        <li
          v-for="activity in nearbyActivities"
          :key="activity.id"
          class="list-group-item d-flex justify-content-between align-items-center"
        >
          <span>
            <strong>{{ activity.name }}</strong>
            <span class="d-block text-muted">{{ activity.location }}</span>
          </span>

          <span class="badge bg-success rounded-pill">
            {{ activity.distance.toFixed(1) }} km
          </span>
        </li>
      </ol>
    </div>

  </section>
</template>

<style scoped>
.activity-map {
  height: 450px;
  width: 100%;
  border-radius: 8px;
}
</style>