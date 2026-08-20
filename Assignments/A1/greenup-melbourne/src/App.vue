<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg bg-light">
      <div class="container">
        <RouterLink class="navbar-brand" to="/">GreenUp Melbourne</RouterLink>

        <div class="navbar-nav">
          <RouterLink class="nav-link" to="/">Home</RouterLink>
          <RouterLink class="nav-link" to="/explore">Explore</RouterLink>
          <RouterLink class="nav-link" to="/biodiversity-resources">Biodiversity & Resources</RouterLink>
          <RouterLink class="nav-link" to="/about">About Us</RouterLink>
          <RouterLink class="nav-link" to="/my-account">My Account</RouterLink>
          <RouterLink class="nav-link" to="/admin">Admin</RouterLink>
        </div>
      </div>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  padding: 20px
}

nav {
  margin-top: 10px;
}

nav a {
  margin-right: 20px;
}

</style>
