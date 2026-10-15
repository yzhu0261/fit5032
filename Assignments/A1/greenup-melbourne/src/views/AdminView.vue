<!-- This page helps administrators to manage activities. -->
<script setup>
import { onMounted, ref } from 'vue'
import { getFunctions, httpsCallable } from 'firebase/functions'
import app from '../firebase.js'
import { uploadActivities } from '../uploadActivities.js'
import { getAuth } from 'firebase/auth'
import Chart from 'primevue/chart'
import { computed } from 'vue'

// Upload environmental activities to Firestore.
const handleUploadActivities = async () => {
  try {
    await uploadActivities()
    alert('Activities uploaded successfully!')
  } catch (error) {
    console.error('Activity upload failed:', error)
    alert('Unable to upload activities.')
  }
}

// Activity statistics loaded from Firestore.
const totalActivities = ref(null)
const treePlantingCount = ref(null)
const gardeningCount = ref(null)
const restorationCount = ref(null)
const activityStatsError = ref('')

const chartType = ref('bar')

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: chartType.value === 'pie'
    }
  }
}))

const chartData = computed(() => ({
  labels: ['Tree Planting', 'Gardening', 'Restoration'],
  datasets: [
    {
      label: 'Number of Activities',
      data: [
        treePlantingCount.value ?? 0,
        gardeningCount.value ?? 0,
        restorationCount.value ?? 0
      ],
      backgroundColor: ['#2F855A', '#4299E1', '#D69E2E']
    }
  ]
}))

// Load registered user statistics from Firebase.
const totalUsers = ref(null)
const adminUsers = ref(null)
const regularUsers = ref(null)
const userStatsError = ref('')

// Load activity statistics through Cloud Functions.
const loadActivityStats = async () => {
  try {
    const functions = getFunctions(app, 'us-central1')
    const getActivityStats = httpsCallable(functions, 'getActivityStats')
    const result = await getActivityStats()

    totalActivities.value = result.data.totalActivities
    treePlantingCount.value = result.data.counts['Tree Planting']
    gardeningCount.value = result.data.counts['Gardening']
    restorationCount.value = result.data.counts['Restoration']
  } catch (error) {
    activityStatsError.value = 'Unable to load activity statistics.'
    console.error(error)
  }
}

onMounted(async () => {
  await loadActivityStats()

  try {
    const auth = getAuth(app)
    await auth.authStateReady()

    if (!auth.currentUser) {
      throw new Error('User is not logged in.')
    }

    const functions = getFunctions(app, 'us-central1')
    const getUserStats = httpsCallable(functions, 'getUserStats')
    const result = await getUserStats()

    totalUsers.value = result.data.totalUsers
    adminUsers.value = result.data.adminUsers
    regularUsers.value = result.data.regularUsers
  } catch (error) {
    userStatsError.value = 'Unable to load user statistics.'
    console.error(error)
  }
})
</script>

<template>
  <main class="container py-5">
    <h1>Admin Dashboard</h1>

    <p>
      Overview of GreenUp Melbourne environmental activities.
    </p>

    <!-- Upload activities to Firestore. -->
    <button
      type="button"
      class="btn btn-success mb-3"
      @click="handleUploadActivities"
    >
      Upload Activities to Firestore
    </button>

    <div class="card mt-4">
      <div class="card-body">
        <h2 class="h5 mb-3">Activity Statistics</h2>

        <div class="mb-3">
          <label for="chartType" class="form-label">Chart Type</label>
          <select
            id="chartType"
            v-model="chartType"
            class="form-select"
          >
            <option value="bar">Bar Chart</option>
            <option value="pie">Pie Chart</option>
          </select>
        </div>

        <p v-if="activityStatsError" class="text-danger">
          {{ activityStatsError }}
        </p>

        <p v-else-if="totalActivities === null">
          Loading activity statistics...
        </p>

        <div v-else class="mx-auto" style="max-width: 650px;">
          <Chart
            :type="chartType"
            :data="chartData"
            :options="chartOptions"
            style="height: 350px;"
          />
        </div>
      </div>
    </div>

    <!-- Display activity statistics. -->
    <div class="row mt-4">
      <div class="col-12 col-md-4 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h2 class="h6">Total Activities</h2>
            <p class="display-6 mb-0">{{ totalActivities }}</p>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-4 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h2 class="h6">Tree Planting</h2>
            <p class="display-6 mb-0">{{ treePlantingCount }}</p>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-4 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h2 class="h6">Gardening</h2>
            <p class="display-6 mb-0">{{ gardeningCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="card mt-3">
      <div class="card-body">
        <h2 class="h6">Total Registered Users</h2>

        <p v-if="userStatsError" class="text-danger mb-0">
          {{ userStatsError }}
        </p>

        <p v-else class="display-6 mb-0">
          {{ totalUsers === null ? 'Loading...' : totalUsers }}
        </p>
      </div>
    </div>

    <div class="row mt-3">
      <div class="col-12 col-md-6 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h2 class="h6">Admin Users</h2>
            <p v-if="userStatsError" class="text-danger mb-0">
              {{ userStatsError }}
            </p>
            <p v-else class="display-6 mb-0">
              {{ adminUsers === null ? 'Loading...' : adminUsers }}
            </p>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h2 class="h6">Regular Users</h2>
            <p v-if="userStatsError" class="text-danger mb-0">
              {{ userStatsError }}
            </p>
            <p v-else class="display-6 mb-0">
              {{ regularUsers === null ? 'Loading...' : regularUsers }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Activity management section. -->
    <div class="card mt-4">
      <div class="card-body">
        <h2 class="h5">Activity Management</h2>
        <p class="mb-0">
          Activity management features will be added in a later version.
        </p>
      </div>
    </div>
  </main>
</template>