<script setup>
// Import RouterLink for navigation & RouteView for displaying.
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

// Store the current login user for getting the right navigation bar.
const currentUser = ref(null)

// Restore the login state when the application loads.
const savedCurrentUser = localStorage.getItem('currentUser')
if (savedCurrentUser) {
  currentUser.value = JSON.parse(savedCurrentUser)
}

const updateCurrentUser = () => {

  const savedCurrentUser = localStorage.getItem('currentUser')

  currentUser.value = savedCurrentUser
    ? JSON.parse(savedCurrentUser)
    : null

}

// Listen for login or logout changes.
window.addEventListener('auth-changed', updateCurrentUser)

</script>

<template>
  <header>
    <!-- Bootstrap responsive navigation bar. -->
    <nav class="navbar navbar-expand-lg bg-light position-relative">
      <div class="container">
        <!-- When user click the website name, the web will return the user to the Home page. -->
        <RouterLink class="navbar-brand" to="/">
          GreenUp Melbourne
        </RouterLink>

        <!-- This button will appear on a smaller screens for opening and closing the navigation menu. -->
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

        <!-- ms-auto will move the links to the right side of the page. -->
        <div class="collapse navbar-collapse" id="mainNavbar">
          <div class="navbar-nav ms-auto">
            <RouterLink class="nav-link" to="/">Home</RouterLink>
            <RouterLink class="nav-link" to="/explore">Explore</RouterLink>
            <RouterLink class="nav-link" to="/biodiversity-resources">Biodiversity & Resources</RouterLink>
            <RouterLink class="nav-link" to="/about">About Us</RouterLink>
            <RouterLink class="nav-link" to="/my-account">My Account</RouterLink>
            <RouterLink
              v-if="currentUser && currentUser.role === 'admin'"
              class="nav-link"
              to="/admin"
            >
              Admin
            </RouterLink>
          </div>
        </div>
      </div>
    </nav>
  </header>

<!-- Displays the current page(flex-grow-1 ensures the footer will always be at the bottom). -->
<RouterView class="flex-grow-1" />

<footer class="bg-success text-white mt-5 py-4">
  <div class="container">
    <p class="mb-2">© 2026 GreenUp Melbourne</p>

    <div class="footer-links">
      <RouterLink class="text-white me-3" to="/">Home</RouterLink>
      <RouterLink class="text-white me-3" to="/explore">Explore</RouterLink>
      <RouterLink class="text-white me-3" to="/biodiversity-resources">
        Biodiversity & Resources
      </RouterLink>
      <RouterLink class="text-white me-3" to="/about">About Us</RouterLink>
      <RouterLink class="text-white me-3" to="/my-account">My Account</RouterLink>
    </div>
  </div>
</footer>
</template>

<style scoped>
nav a 
{
  margin-right: 20px;
}

.footer-links a {
  white-space: nowrap;
}

/* Keep the page content in place when open the hamburger menu. */
@media (max-width: 991.98px) {
  #mainNavbar {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: #f8f9fa;
    padding: 10px 20px;
    z-index: 1000;
  }
}
</style>