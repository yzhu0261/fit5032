<script setup>
// Store environmental actibity information.
const activities = [
  {
    id: 1,
    name: 'Community Tree Planting',
    location: 'Clayton',
    date: '12 September 2026',
  },
  {
    id: 2,
    name: 'Urban Garden Day',
    location: 'Richmond',
    date: '20 September 2026',
  },
  {
    id: 3,
    name: 'Habitat Restoration',
    location: 'Dandenong',
    date: '27 September 2026',
  },
]
</script>

<template>
  <main class="container py-5">
    <h1>Explore Activities</h1>

    <div class="row mt-4">
      <!--V-for direction loops throuth all the activities and create one card for each activity.-->
      <!--v-bind:key gives each activities a special identifier.-->
      <!-- col-12 col-md-6 col-lg-4 mb-4: 1 card on small screens, 2 on medium, 3 on large screens -->
      <div
        v-for="activity in activities"
        v-bind:key="activity.id"
        class="col-12 col-md-6 col-lg-4 mb-4"
      >
        <div class="card h-100">
          <div class="card-body">
            <h2 class="h5">{{ activity.name }}</h2>
            <p>{{ activity.location }}</p>
            <p>{{ activity.date }}</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>