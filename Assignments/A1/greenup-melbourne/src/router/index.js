import { createRouter, createWebHistory } from 'vue-router'

// Import the Home page.
import HomeView from '../views/HomeView.vue'

// Create a router for managing navigation between pages
const router = createRouter
(
  {
    // Use broswer history mode to create a normal URL like /about.
    history: createWebHistory(import.meta.env.BASE_URL),

    // Routes of different pages.
    routes: [
      {
        path: '/',
        name: 'home',
        component: HomeView,
      },
      {
        path: '/explore',
        name: 'explore',
        component: () => import('../views/ExploreView.vue'),
      },
      {
        path: '/biodiversity-resources',
        name: 'biodiversity-resources',
        component: () => import('../views/BiodiversityResourcesView.vue'),
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('../views/AboutView.vue'),
      },
      {
        path: '/my-account',
        name: 'my-account',
        component: () => import('../views/MyAccountView.vue'),
      },
      {
        path: '/admin',
        name: 'admin',
        component: () => import('../views/AdminView.vue'),
      },
    ],
  } 
)

export default router
