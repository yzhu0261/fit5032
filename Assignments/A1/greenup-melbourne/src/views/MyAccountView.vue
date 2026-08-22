<script setup>
import { ref } from 'vue'

// Store the user's input (The initial values are empty).
const email = ref('')
const password = ref('')

// Store validation error messages.
const emailError = ref('')
const passwordError = ref('')

// email must be like string@string.string
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Prompts relative error information.
const validateForm = () => 
{
  emailError.value = ''
  passwordError.value = ''

  if (email.value === '') 
  {
    emailError.value = 'Email is required.'
  }
  else if (!emailPattern.test(email.value))
  {
    emailError.value = 'Invalid email address.'
  }

  if (password.value === '') 
  {
    passwordError.value = 'Password is required.'
  }
  else if (password.value.length < 8)
  {
    passwordError.value = 'Password must be at least 8 characters.'
  }

  if (emailError.value === '' && passwordError.value ==='')
  {
    localStorage.setItem('registeredEmail', email.value)
  }
}

// The web will keep the input email even if the web is refreshed.
const savedEmail = localStorage.getItem('registeredEmail')
if (savedEmail)
{
  email.value = savedEmail
}
</script>

<template>
  <main class="container py-5">
    <h1>My Account</h1>
    <p>Create an account to join GreenUp Melbourne activities.</p>

    <form class="mt-4" @submit.prevent="validateForm">
      <div class="mb-3">
        <label for="email" class="form-label">Email Address</label>

        <!-- v-model will create a 2-way binding between the input and the email. -->
        <input
          id="email"
          v-model="email"
          type="email"
          class="form-control"
        />

        <p v-if="emailError" class="text-danger mt-1">
          {{ emailError }}
        </p>
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Password</label>

        <!-- Bind the input to the password. -->
        <input
          id="password"
          v-model="password"
          type="password"
          class="form-control"
        />

        <p v-if="passwordError" class="text-danger mt-1">
          {{ passwordError }}
        </p>
      </div>

      <button type="submit" class="btn btn-success">
        Register
      </button>
    </form>
  </main>
</template>