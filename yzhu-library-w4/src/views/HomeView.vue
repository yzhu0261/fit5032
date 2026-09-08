<script setup>
import { ref, computed } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import LibraryRegistrationForm from '../components/LibraryRegistrationForm.vue'

const currentUser = ref(null)
const auth = getAuth()

onAuthStateChanged(auth, (user) => {
  currentUser.value = user
})

const userRole = computed(() => {
  if (!currentUser.value) {
    return ''
  }

  if (currentUser.value.email === 'admin5032@example.com') {
    return 'Admin'
  }

  return 'User'
})
</script>

<template>
  <div v-if="currentUser" class="container mt-4">
    <h2>Firebase User</h2>
    <p>Email: {{ currentUser.email }}</p>
    <p>Role: {{ userRole }}</p>
  </div>

  <LibraryRegistrationForm />
</template>