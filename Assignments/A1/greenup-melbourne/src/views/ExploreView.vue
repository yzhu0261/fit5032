<!-- This page helps users find suitable environmental activities. -->
<script setup>
import { ref, computed, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { FilterMatchMode } from '@primevue/core/api'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { activities as defaultActivities } from '../data/activities.js'

// Load activities from Firestore and cache them for offline use.
const activities = ref(defaultActivities)

const cachedActivities = localStorage.getItem('cachedActivities')

if (cachedActivities) {
  try {
    const savedActivities = JSON.parse(cachedActivities)

    if (Array.isArray(savedActivities)) {
      activities.value = savedActivities
    }
  } catch (error) {
    console.error('Unable to read cached activities:', error)
  }
}

onMounted(async () => {
  if (!navigator.onLine) return

  try {
    const response = await fetch(
      'https://us-central1-greenup-melbourne-a3.cloudfunctions.net/getActivitiesAPI'
    )

    if (!response.ok) {
      throw new Error('Unable to load activities.')
    }

    const latestActivities = await response.json()

    activities.value = latestActivities
    localStorage.setItem('cachedActivities', JSON.stringify(latestActivities))
  } catch (error) {
    console.error('Unable to update activities:', error)
  }
})

// Import the activity map component.
import ActivityMap from '../components/ActivityMap.vue'

// Store the activity type.
const selectedType = ref('All')

// Store the ratings.
const ratings = ref({})

// Load previously saved ratings from Local Storage.
const savedRatings = localStorage.getItem('activityRatings')
if (savedRatings) {
  ratings.value = JSON.parse(savedRatings)
}

// Ensure each activity has its own rating list.
activities.value.forEach((activity) => {

  if (!ratings.value[activity.id]) {
    ratings.value[activity.id] = []
  }

})

// Store the temporary rating when user hovers over these stars.
const tempRatings = ref({})

activities.value.forEach((activity) => {
  tempRatings.value[activity.id] = 0
})
// Store the rating selected by the user for each activity.
const selectedRatings = ref({})

activities.value.forEach((activity) => {
  selectedRatings.value[activity.id] = 0
})

// Store the rating submission message for each activity.
const ratingMessages = ref({})

activities.value.forEach((activity) => {
  ratingMessages.value[activity.id] = ''
})

// Store the type of rating message for each activity.
const ratingMessageTypes = ref({})

activities.value.forEach((activity) => {
  ratingMessageTypes.value[activity.id] = ''
})

// Submit the selected rating for an activity.
const submitRating = (activityId) => {

  // Check whether the user is logged in.
  const savedCurrentUser = localStorage.getItem('currentUser')

  if (!savedCurrentUser) {
    ratingMessages.value[activityId] =
      'Please log in before submitting a rating.'

    ratingMessageTypes.value[activityId] = 'error'

    return
  }

  const currentUser = JSON.parse(savedCurrentUser)

  const rating = selectedRatings.value[activityId]

  if (rating === 0) {
    ratingMessages.value[activityId] =
      'Please select a rating before submitting.'

    ratingMessageTypes.value[activityId] = 'error'

    return
  }

  // Validate the rating before saving it.
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    ratingMessages.value[activityId] =
      'Invalid rating.'

    ratingMessageTypes.value[activityId] = 'error'
    return
  }

  if (!ratings.value[activityId]) {
    ratings.value[activityId] = []
  }

  // Check whether the current user has already rated this activity.
  const existingRatingIndex = ratings.value[activityId].findIndex(
    (item) => item.email === currentUser.email
  )

  if (existingRatingIndex === -1) {
    // Add a new rating if the user has not rated this activity yet.
    ratings.value[activityId].push({
      email: currentUser.email,
      score: rating
    })

  } else {
    // Update the existing rating if the user has already rated this activity.
    ratings.value[activityId][existingRatingIndex].score = rating
  }

  // Save the updated ratings to Local Storage.
  localStorage.setItem('activityRatings', JSON.stringify(ratings.value))
  ratingMessages.value[activityId] = 'Rating submitted!'

  ratingMessageTypes.value[activityId] = 'success'
}

// Calculate the average rating.
const getAverageRating = (activityId) => {
  const activityRatings = ratings.value[activityId] || []

  if (activityRatings.length === 0) 
  {
    return 0
  }

  const total = activityRatings.reduce
  ((sum, rating) => sum + rating.score, 0)

  return (total / activityRatings.length).toFixed(1)
}

// Filter activities by type.
const filteredAct = computed(() => {
  if (selectedType.value === 'All') {
    return activities.value
  }

  return activities.value.filter(
    activity => activity.type === selectedType.value
  )
})

// Show three activity cards per page.
const cardPage = ref(1)
const cardsPerPage = 3

const totalCardPages = computed(() =>
  Math.ceil(filteredAct.value.length / cardsPerPage)
)

const paginatedActivities = computed(() => {
  const start = (cardPage.value - 1) * cardsPerPage
  return filteredAct.value.slice(start, start + cardsPerPage)
})

// Store the table filters.
const tableFilters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  name: { value: null, matchMode: FilterMatchMode.CONTAINS },
  type: { value: null, matchMode: FilterMatchMode.CONTAINS },
  location: { value: null, matchMode: FilterMatchMode.CONTAINS },
  date: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

// Export the activity data as a CSV file.
const exportCSV = () => {
  const headers = ['Activity Name', 'Activity Type', 'Location', 'Date']

  const rows = activities.value.map((activity) => [
    activity.name,
    activity.type,
    activity.location,
    activity.date
  ])

  // Escape values so commas and quotes are handled correctly.
  const escapeCSV = (value) =>
    `"${String(value).replace(/"/g, '""')}"`

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows.map((row) => row.map(escapeCSV).join(','))
  ].join('\r\n')

  // Create and download the CSV file.
  const blob = new Blob(['\uFEFF', csvContent], {
    type: 'text/csv;charset=utf-8;'
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = 'greenup-activities.csv'
  link.click()

  URL.revokeObjectURL(url)
}

// Export all activities as a PDF table.
const exportPDF = () => {
  const doc = new jsPDF()

  // Add a title to the PDF.
  doc.setFontSize(18)
  doc.text('GreenUp Melbourne - Community Activities', 14, 20)

  // Prepare the activity data.
  const rows = activities.value.map((activity) => [
    activity.name,
    activity.type,
    activity.location,
    activity.date
  ])

  // Add the activity table.
  autoTable(doc, {
    head: [['Activity Name', 'Activity Type', 'Location', 'Date']],
    body: rows,
    startY: 30,
    theme: 'striped',
    styles: {
      fontSize: 9
    },
    headStyles: {
      fillColor: [46, 125, 80]
    }
  })

  // Download the PDF file.
  doc.save('greenup-activities.pdf')
}

</script>

<template>
  <main class="container py-5">
    <h1>Explore Activities</h1>

    <div class="mt-4 mb-4">
      <label for="activityType" class="form-label">
        Filter by activity type
      </label>

      <select
        id="activityType"
        v-model="selectedType"
        @change="cardPage = 1"
        class="form-select"
      >
        <option value="All">All</option>
        <option value="Tree Planting">Tree Planting</option>
        <option value="Gardening">Gardening</option>
        <option value="Restoration">Restoration</option>
      </select>
    </div>

    <div class="row mt-4">
      <!--V-for direction loops throuth all the activities and create one card for each activity.-->
      <!--v-bind:key gives each activities a special identifier.-->
      <!-- col-12 col-md-6 col-lg-4 mb-4: 1 card on small screens, 2 on medium, 3 on large screens -->
      <div
        v-for="activity in paginatedActivities"
        v-bind:key="activity.id"
        class="col-12 col-md-6 col-lg-4 mb-4"
      >
        <div class="card h-100">
          <div class="card-body">
            <h2 class="h5">{{ activity.name }}</h2>
            <p>{{ activity.location }}</p>
            <p>{{ activity.type }}</p>
            <p>{{ activity.date }}</p>
            <div class="rating-section mt-4">
              <p class="mb-2 fw-semibold">Your Rating</p>

              <div class="star-rating">
                <button
                  v-for="star in 5"
                  :key="star"
                  type="button"
                  :class="[
                    'star-button',
                    star <= (tempRatings[activity.id] || selectedRatings[activity.id])
                      ? 'star-filled'
                      : 'star-empty'
                  ]"
                  @mouseenter="tempRatings[activity.id] = star"
                  @mouseleave="tempRatings[activity.id] = 0"
                  @click="selectedRatings[activity.id] = star"
                >
                  {{
                    star <= (tempRatings[activity.id] || selectedRatings[activity.id])
                      ? '★'
                      : '☆'
                  }}
                </button>
              </div>

            <div class="d-flex align-items-center gap-3 mt-3">
              <button
                type="button"
                class="btn btn-success btn-sm"
                @click="submitRating(activity.id)"
              >
                Submit Rating
              </button>

              <!-- Display the rating submission message. -->
              <p
                v-if="ratingMessages[activity.id]"
                :class="[
                  'mb-0 small',
                  ratingMessageTypes[activity.id] === 'error'
                    ? 'text-danger'
                    : 'text-success'
                ]"
              >
                {{ ratingMessages[activity.id] }}
              </p>
            </div>

              <div class="rating-summary mt-3">
                <span class="average-star">★</span>
                <span class="fw-semibold">
                  {{ getAverageRating(activity.id) }} / 5
                </span>
                <span class="text-muted small ms-2">
                  <!-- If there is only 1 rating, then use rating, else use ratings. -->
                  {{ ratings[activity.id].length }}
                  {{ ratings[activity.id].length === 1 ? 'rating' : 'ratings' }}
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-center align-items-center gap-3 mt-3">
      <button
        type="button"
        class="btn btn-outline-success"
        :disabled="cardPage === 1"
        @click="cardPage--"
      >
        Previous
      </button>

      <span>Page {{ cardPage }} of {{ totalCardPages }}</span>

      <button
        type="button"
        class="btn btn-outline-success"
        :disabled="cardPage === totalCardPages"
        @click="cardPage++"
      >
        Next
      </button>
    </div>
  
    <section class="mt-5">
      <h2 class="h4 mb-3">Community Activities Directory</h2>

    <!-- Download the activity data as CSV. -->
    <div class="mb-3">
      <button
        type="button"
        class="btn btn-success"
        @click="exportCSV"
      >
        Export CSV
      </button>

      <button
        type="button"
        class="btn btn-outline-success ms-2"
        @click="exportPDF"
      >
        Export PDF
      </button>
    </div>

      <DataTable
        :value="activities"
        dataKey="id"
        v-model:filters="tableFilters"
        :globalFilterFields="['name', 'type', 'location', 'date']"
        filterDisplay="row"
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10]"
        stripedRows
        showGridlines
      >
        <template #header>
          <div class="d-flex justify-content-end">
            <input
              v-model="tableFilters.global.value"
              type="text"
              class="form-control w-auto"
              placeholder="Search all activities"
              aria-label="Search all activities"
            />
          </div>
        </template>

        <Column field="name" header="Activity Name" sortable>
          <template #filter="{ filterModel, filterCallback }">
            <input
              v-model="filterModel.value"
              type="text"
              class="form-control"
              placeholder="Search name"
              aria-label="Search activity name"
              @input="filterCallback()"
            />
          </template>
        </Column>

        <Column field="type" header="Activity Type" sortable>
          <template #filter="{ filterModel, filterCallback }">
            <input
              v-model="filterModel.value"
              type="text"
              class="form-control"
              placeholder="Search type"
              aria-label="Search activity type"
              @input="filterCallback()"
            />
          </template>
        </Column>

        <Column field="location" header="Location" sortable>
          <template #filter="{ filterModel, filterCallback }">
            <input
              v-model="filterModel.value"
              type="text"
              class="form-control"
              placeholder="Search location"
              aria-label="Search activity location"
              @input="filterCallback()"
            />
          </template>
        </Column>

        <Column
          field="date"
          header="Date"
          sortable
          :sortField="(activity) => new Date(activity.date).getTime()"
        >
          <template #filter="{ filterModel, filterCallback }">
            <input
              v-model="filterModel.value"
              type="text"
              class="form-control"
              placeholder="Search date"
              aria-label="Search activity date"
              @input="filterCallback()"
            />
          </template>
        </Column>

        <template #empty>
          No activities found.
        </template>
      </DataTable>
    </section>

    <!-- Display the interactive activity map. -->
    <ActivityMap :activities="activities" />
  </main>
</template>

<style scoped>
.star-button {
  border: none;
  background: transparent;
  font-size: 1.8rem;
  padding: 0 2px;
  cursor: pointer;
}

.star-filled {
  color: #ffc107;
}

.star-empty {
  color: #212529;
}

.star-button:hover {
  transform: scale(1.15);
}

.rating-summary {
  display: flex;
  align-items: center;
}

.average-star {
  color: #ffc107;
  margin-right: 6px;
  font-size: 1.1rem;
}
</style>