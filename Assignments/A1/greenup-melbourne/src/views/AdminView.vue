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

const formatActivityDate = (date) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date
  }

  const [year, month, day] = date.split('-')

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  ).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const activityList = ref([])
const activityListError = ref('')

const newActivity = ref({
  name: '',
  type: 'Tree Planting',
  location: '',
  date: ''
})

const addActivityError = ref('')
const addActivitySuccess = ref('')

const handleAddActivity = async () => {
  addActivityError.value = ''
  addActivitySuccess.value = ''

  try {
    const functions = getFunctions(app, 'us-central1')
    const addActivity = httpsCallable(functions, 'addActivity')

    await addActivity(newActivity.value)

    addActivitySuccess.value = 'Activity added successfully.'

    newActivity.value = {
      name: '',
      type: 'Tree Planting',
      location: '',
      date: ''
    }

    await loadActivities()
    await loadActivityStats()
  } catch (error) {
    console.error(error)
    addActivityError.value = 'Unable to add activity.'
  }
}

const handleDeleteActivity = async (activity) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete "${activity.name}"?`
  )

  if (!confirmed) return

  try {
    const functions = getFunctions(app, 'us-central1')
    const deleteActivity = httpsCallable(functions, 'deleteActivity')

    await deleteActivity({ id: String(activity.id) })

    await loadActivities()
    await loadActivityStats()
  } catch (error) {
    console.error('Unable to delete activity:', error)
    window.alert('Unable to delete activity.')
  }
}

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

const userList = ref([])
const userListError = ref('')

const loadUsers = async () => {
  try {
    const functions = getFunctions(app, 'us-central1')
    const getUsers = httpsCallable(functions, 'getUsers')

    const result = await getUsers()
    userList.value = result.data.users
  } catch (error) {
    console.error('Unable to load users:', error)
    userListError.value = 'Unable to load registered users.'
  }
}

const handleToggleUser = async (user) => {
  if (user.role === 'Admin') return

  const action = user.disabled ? 'enable' : 'disable'

  const confirmed = window.confirm(
    `Are you sure you want to ${action} "${user.email}"?`
  )

  if (!confirmed) return

  try {
    const functions = getFunctions(app, 'us-central1')
    const setUserDisabled = httpsCallable(functions, 'setUserDisabled')

    await setUserDisabled({
      uid: user.uid,
      disabled: !user.disabled
    })

    await loadUsers()
  } catch (error) {
    console.error('Unable to update user:', error)
    window.alert('Unable to update user account.')
  }
}

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

const loadActivities = async () => {
  try {
    const response = await fetch(
      'https://us-central1-greenup-melbourne-a3.cloudfunctions.net/getActivitiesAPI'
    )

    if (!response.ok) {
      throw new Error('Unable to load activities.')
    }

    activityList.value = await response.json()
  } catch (error) {
    activityListError.value = 'Unable to load activities.'
    console.error(error)
  }
}

onMounted(async () => {
  await loadActivityStats()
  await loadActivities()

  try {
    const auth = getAuth(app)
    await auth.authStateReady()

    if (!auth.currentUser) {
      throw new Error('User is not logged in.')
    }

    await loadUsers()

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

    <div class="card mt-4">
      <div class="card-body">
        <h2 class="h5 mb-3">Registered Users</h2>

        <p v-if="userListError" class="text-danger">
          {{ userListError }}
        </p>

        <div v-else class="table-responsive">
          <table class="table table-striped table-hover" style="min-width: 750px;">
            <thead>
              <tr>
                <th scope="col">Email</th>
                <th scope="col">UID</th>
                <th scope="col">Role</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="user in userList" :key="user.uid">
                <td>{{ user.email }}</td>
                <td>{{ user.uid }}</td>
                <td>{{ user.role }}</td>
                <td>{{ user.disabled ? 'Disabled' : 'Active' }}</td>
                <td>
                  <button
                    v-if="user.role !== 'Admin'"
                    type="button"
                    class="btn btn-sm"
                    :class="user.disabled ? 'btn-outline-success' : 'btn-outline-danger'"
                    @click="handleToggleUser(user)"
                  >
                    {{ user.disabled ? 'Enable' : 'Disable' }}
                  </button>
                  <span v-else class="text-muted">Protected</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Activity management section. -->
    <div class="card mt-4">
      <div class="card-body">
        <h2 class="h5 mb-3">Activity Management</h2>

        <form class="mb-4" @submit.prevent="handleAddActivity">
          <h3 class="h6 mb-3">Add New Activity</h3>

          <div class="row g-3">
            <div class="col-12 col-md-6">
              <label for="activityName" class="form-label">Activity Name</label>
              <input
                id="activityName"
                v-model.trim="newActivity.name"
                type="text"
                class="form-control"
                required
              />
            </div>

            <div class="col-12 col-md-6">
              <label for="activityType" class="form-label">Activity Type</label>
              <select
                id="activityType"
                v-model="newActivity.type"
                class="form-select"
                required
              >
                <option value="Tree Planting">Tree Planting</option>
                <option value="Gardening">Gardening</option>
                <option value="Restoration">Restoration</option>
              </select>
            </div>

            <div class="col-12 col-md-6">
              <label for="activityLocation" class="form-label">Location</label>
              <input
                id="activityLocation"
                v-model.trim="newActivity.location"
                type="text"
                class="form-control"
                required
              />
            </div>

            <div class="col-12 col-md-6">
              <label for="activityDate" class="form-label">Date</label>
              <input
                id="activityDate"
                v-model="newActivity.date"
                type="date"
                class="form-control"
                required
              />
            </div>
          </div>

          <p v-if="addActivityError" class="text-danger mt-3">
            {{ addActivityError }}
          </p>

          <p v-if="addActivitySuccess" class="text-success mt-3">
            {{ addActivitySuccess }}
          </p>

          <button type="submit" class="btn btn-success mt-3">
            Add Activity
          </button>
        </form>

        <p v-if="activityListError" class="text-danger">
          {{ activityListError }}
        </p>

        <div v-else class="table-responsive">
          <table class="table table-striped table-hover" style="min-width: 750px;">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Type</th>
                <th scope="col">Location</th>
                <th scope="col">Date</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="activity in activityList" :key="activity.id">
                <td>{{ activity.name }}</td>
                <td>{{ activity.type }}</td>
                <td>{{ activity.location }}</td>
                <td>{{ formatActivityDate(activity.date) }}</td>
                <td>
                  <button
                    type="button"
                    class="btn btn-outline-danger btn-sm"
                    @click="handleDeleteActivity(activity)"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>

          </table>
        </div>
      </div>
    </div>
  </main>
</template>