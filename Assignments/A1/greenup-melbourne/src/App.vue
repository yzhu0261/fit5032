<script setup>
// Import RouterLink for navigation & RouteView for displaying.
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import NetworkStatus from './components/NetworkStatus.vue'
import { Leaf } from 'lucide-vue-next'

// Store the current login user for getting the right navigation bar.
const currentUser = ref(null)

// Restore the login state when the application loads.
const savedCurrentUser = localStorage.getItem('currentUser')
if (savedCurrentUser) {
  currentUser.value = JSON.parse(savedCurrentUser)
}

// Update the current user after login or logout.
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
    <nav class="navbar navbar-expand-lg bg-white">
      <div class="container">

        <!-- When user click the website name, the web will return the user to the Home page. -->
        <RouterLink class="navbar-brand d-flex align-items-center" to="/">
          <span class="brand-icon">
            <Leaf :size="24" :stroke-width="2.2" />
          </span>
          <span class="brand-name">GreenUp Melbourne</span>
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

            <RouterLink class="nav-link" to="/">
              Home
            </RouterLink>

            <RouterLink class="nav-link" to="/explore">
              Explore
            </RouterLink>

            <RouterLink class="nav-link" to="/biodiversity-resources">
              Biodiversity & Resources
            </RouterLink>

            <RouterLink class="nav-link" to="/about">
              About Us
            </RouterLink>

            <RouterLink class="nav-link" to="/my-account">
              My Account
            </RouterLink>

            <!-- Show the Admin link only to the admin users. -->
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

  <NetworkStatus />

  <!-- Displays the current page. -->
  <RouterView class="flex-grow-1" />

  <footer class="bg-success text-white py-3">
    <div class="container">

      <div
        class="d-flex flex-column flex-lg-row
               align-items-lg-center justify-content-between"
      >

        <div class="d-flex align-items-center mb-3 mb-lg-0">
          <span class="footer-icon">
            <Leaf :size="22" :stroke-width="2.2" />
          </span>

          <div>
            <div class="fw-semibold">
              GreenUp Melbourne
            </div>

            <small>
              © 2026 GreenUp Melbourne
            </small>
          </div>
        </div>

        <div class="footer-links">

          <RouterLink class="text-white" to="/">
            Home
          </RouterLink>

          <RouterLink class="text-white" to="/explore">
            Explore
          </RouterLink>

          <RouterLink class="text-white" to="/biodiversity-resources">
            Biodiversity & Resources
          </RouterLink>

          <RouterLink class="text-white" to="/about">
            About Us
          </RouterLink>

          <RouterLink class="text-white" to="/my-account">
            My Account
          </RouterLink>

          <!-- Show the Admin link only to admin users. -->
          <RouterLink
            v-if="currentUser && currentUser.role === 'admin'"
            class="text-white"
            to="/admin"
          >
            Admin
          </RouterLink>

        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.navbar {
  padding-top: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid #e1ebe3;
}

.navbar-brand {
  margin-right: 30px;
}

.brand-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  margin-right: 12px;
  background: #216b45;
  color: #ffffff;
  border-radius: 12px;
}

.brand-name {
  font-size: 20px;
  font-weight: 600;
}

.nav-link {
  margin-left: 10px;
  margin-right: 10px;
}

.nav-link:hover {
  color: #146c43;
}

.router-link-active.nav-link {
  color: #146c43;
  font-weight: 600;
}

.navbar-toggler {
  border: none;
}

.navbar-toggler:focus {
  box-shadow: none;
}

.footer-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  margin-right: 12px;
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  border-radius: 11px;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 20px;
}

.footer-links a {
  text-decoration: none;
  white-space: nowrap;
}

.footer-links a:hover {
  text-decoration: underline;
}

/* Keep the page content in place when open the hamburger menu. */
@media (max-width: 991.98px) {
  #mainNavbar {
    padding-top: 15px;
  }

  .nav-link {
    margin-left: 0;
    margin-right: 0;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .footer-links {
    flex-wrap: wrap;
    gap: 10px 18px;
  }
}

@media (max-width: 767.98px) {
  .footer-links {
    margin-top: 5px;
    gap: 8px 16px;
  }
}
</style>