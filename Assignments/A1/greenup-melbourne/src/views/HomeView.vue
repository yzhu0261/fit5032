// This is the Home Page, users will start from here.
<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main>
    <section class="container py-5">
      <h1>GreenUp Melbourne</h1>
      <p>
        Discover local greening activities and help make Melbourne greener.
      </p>

      <RouterLink class="btn btn-success" to="/explore">
        Explore Activities
      </RouterLink>
    </section>
  </main>
</template>