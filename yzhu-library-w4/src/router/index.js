import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'

import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'

import { isAuthenticated } from '../auth'

import AddBookView from '../views/AddBookView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/FireRegister',
    name: 'FireRegister',
    component: FirebaseRegisterView
  },
  {
    path: '/FireLogin',
    name: 'FireLogin',
    component: FirebaseSigninView
  },
  {
    path: '/addbook',
    name: 'AddBook',
    component: AddBookView
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Protect routes that require authentication
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return '/login'
  }
})

export default router