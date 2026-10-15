<!-- This page helps administrators to manage activities. -->
<script setup>
import { computed, onMounted, ref } from 'vue'
import { getFunctions, httpsCallable } from 'firebase/functions'
import app from '../firebase.js'
import { activities } from '../data/activities.js'

// Calculate the activity statistics.
const totalActivities = computed(() => activities.length)

const treePlantingCount = computed(
  () => activities.filter((activity) => activity.type === 'Tree Planting').length
)

const gardeningCount = computed(
  () => activities.filter((activity) => activity.type === 'Gardening').length
)

// Load registered user statistics from Firebase.
const totalUsers = ref(null)
const adminUsers = ref(null)
const regularUsers = ref(null)
const userStatsError = ref('')

onMounted(async () => {
  try {
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

    <!-- Keep the existing activity management section. -->
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