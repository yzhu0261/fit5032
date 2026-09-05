// This is a page helps users to find a suitable activity.
<script setup>
import { ref, computed } from 'vue'
// Store the activity type
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

activities.forEach((activity) => {
  ratings.value[activity.id] = []
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
</style>