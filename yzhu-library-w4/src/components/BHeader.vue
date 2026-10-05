<template> 
  <div class="container"> 
    <header class="d-flex justify-content-center py-3"> 
      <ul class="nav nav-pills"> 

        <li class="nav-item"> 
          <router-link 
            to="/" 
            class="nav-link" 
            active-class="active" 
            aria-current="page" 
          > 
            Home (Week 5) 
          </router-link> 
        </li> 
 
        <li class="nav-item"> 
          <router-link 
            to="/about" 
            class="nav-link" 
            active-class="active" 
          > 
            About 
          </router-link> 
        </li>

        <!-- Add Book page for Week 8 -->
        <li class="nav-item">
          <router-link
            to="/addbook"
            class="nav-link"
            active-class="active"
          >
            Add Book
          </router-link>
        </li>

        <!-- Get Book Count page for Week 9 -->
        <li class="nav-item">
          <router-link
            to="/getbookcount"
            class="nav-link"
            active-class="active"
          >
            Get Book Count
          </router-link>
        </li>

        <!-- Count Book API page for Week 10 -->
        <li class="nav-item">
          <router-link
            to="/CountBookAPI"
            class="nav-link"
            active-class="active"
          >
            Count Book API
          </router-link>
        </li>

        <!-- Get Weather page for Week 10 -->
        <li class="nav-item">
          <router-link
            to="/WeatherCheck"
            class="nav-link"
            active-class="active"
          >
            Get Weather
          </router-link>
        </li>
 
        <li class="nav-item"> 
          <a href="#" class="nav-link">Contact us</a> 
        </li> 
 
        <!-- Show Login when user is not authenticated --> 
        <li class="nav-item" v-if="!isAuthenticated"> 
          <router-link 
            to="/login" 
            class="nav-link" 
            active-class="active" 
          > 
            Login 
          </router-link> 
        </li> 
 
        <!-- Show Logout when user is authenticated --> 
        <li class="nav-item" v-else> 
          <button 
            type="button" 
            class="nav-link btn btn-link" 
            @click="handleLogout" 
          > 
            Logout 
          </button> 
        </li> 
 
        <!-- Firebase authentication page for Week 7 --> 
        <li class="nav-item"> 
          <router-link 
            to="/FireLogin" 
            class="nav-link" 
            active-class="active" 
          > 
            Firebase Login 
          </router-link>
        </li> 

      </ul> 
    </header> 
  </div> 
</template> 
 
<script setup> 
import { useRouter } from 'vue-router' 
import { isAuthenticated, logout } from '../auth' 
 
const router = useRouter() 
 
const handleLogout = () => { 
  logout() 
  router.push('/login') 
} 
</script>