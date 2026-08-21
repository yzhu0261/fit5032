<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg bg-light">
      <div class="container">
        <RouterLink class="navbar-brand" to="/">
          GreenUp Melbourne
        </RouterLink>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="mainNavbar">
          <div class="navbar-nav ms-auto">
            <RouterLink class="nav-link" to="/">Home</RouterLink>
            <RouterLink class="nav-link" to="/explore">Explore</RouterLink>
            <RouterLink class="nav-link" to="/biodiversity-resources">Biodiversity & Resources</RouterLink>
            <RouterLink class="nav-link" to="/about">About Us</RouterLink>
            <RouterLink class="nav-link" to="/my-account">My Account</RouterLink>
            <RouterLink class="nav-link" to="/admin">Admin</RouterLink>
          </div>
        </div>
      </div>
    </nav>
  </header>

  <RouterView />

<footer class="bg-success text-white mt-5 py-4">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-12 col-md-6">
        <p class="mb-0">© 2026 GreenUp Melbourne</p>
      </div>

      <div class="col-12 col-md-6 text-md-end">
        <RouterLink class="text-white me-3" to="/">Home</RouterLink>
        <RouterLink class="text-white me-3" to="/explore">Explore</RouterLink>
        <RouterLink class="text-white me-3" to="/biodiversity-resources">Biodiversity & Resources</RouterLink>
        <RouterLink class="text-white me-3" to="/about">About Us</RouterLink>
        <RouterLink class="text-white me-3" to="/my-account">My Account</RouterLink>
        <RouterLink class="text-white" to="/admin">Admin</RouterLink>
      </div>
    </div>
  </div>
</footer>
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
