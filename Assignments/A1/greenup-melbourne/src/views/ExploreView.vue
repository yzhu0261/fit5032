<script setup>
import { ref, computed } from 'vue'
// Store the activity type
const selectedType = ref('All')

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

// Store environmental actibity information.
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
          </div>
        </div>
      </div>
    </div>
  </main>
</template>