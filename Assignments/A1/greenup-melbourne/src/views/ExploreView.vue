<!-- This page helps users find suitable environmental activities. -->
<script setup>
import { ref, computed } from 'vue'
// Store the activity type.
const selectedType = ref('All')

// Store environmental activity information.
const activities = [
  {
    id: 1,
    name: 'Community Tree Planting',
    location: 'Clayton',
    date: '12 September 2026',
    type: 'Tree Planting'
  },
  {
    id: 2,
    name: 'Urban Garden Day',
    location: 'Richmond',
    date: '20 September 2026',
    type: 'Gardening'
  },
  {
    id: 3,
    name: 'Habitat Restoration',
    location: 'Dandenong',
    date: '27 September 2026',
    type: 'Restoration'
  },
]

// Store the ratings.
const ratings = ref({})

// Load previously saved ratings from Local Storage.
const savedRatings = localStorage.getItem('activityRatings')
if (savedRatings) {
  ratings.value = JSON.parse(savedRatings)
}

// Ensure each activity has its own rating list.
activities.forEach((activity) => {

  if (!ratings.value[activity.id]) {
    ratings.value[activity.id] = []
  }

})

// Store the temporary rating when user hovers over these stars.
const tempRatings = ref({})

activities.forEach((activity) => {
  tempRatings.value[activity.id] = 0
})
// Store the rating selected by the user for each activity.
const selectedRatings = ref({})

activities.forEach((activity) => {
  selectedRatings.value[activity.id] = 0
})

// Store the rating submission message for each activity.
const ratingMessages = ref({})

activities.forEach((activity) => {
  ratingMessages.value[activity.id] = ''
})

// Store the type of rating message for each activity.
const ratingMessageTypes = ref({})

activities.forEach((activity) => {
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
  const activityRatings = ratings.value[activityId]

  if (activityRatings.length === 0) 
  {
    return 0
  }

  const total = activityRatings.reduce
  ((sum, rating) => sum + rating.score, 0)

  return (total / activityRatings.length).toFixed(1)
}

// Filter activities according to the type selected by the user.
const filteredAct = computed(() => 
{
  if (selectedType.value === 'All') 
  {
    return activities
  }

  return activities.filter(
    activity => activity.type === selectedType.value
  )
})

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
        v-for="activity in filteredAct"
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