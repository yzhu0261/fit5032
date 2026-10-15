<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

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

let map = null

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
      L.marker(coordinates)
        .bindPopup(`
          <strong>${activity.name}</strong>
          <p>Type: ${activity.type}</p>
          <p>Date: ${activity.date}</p>
          <p>Location: ${activity.location}</p>
        `)
        .addTo(markerLayer)
    }
  })
}

onMounted(() => {
  // Create a map centred on Melbourne.
  map = L.map(mapContainer.value, {
    keyboard: false
  }).setView(
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

    <div
      ref="mapContainer"
      class="activity-map"
      aria-label="Interactive map of Melbourne"
    ></div>
  </section>
</template>

<style scoped>
.activity-map {
  height: 450px;
  width: 100%;
  border-radius: 8px;
}
</style>