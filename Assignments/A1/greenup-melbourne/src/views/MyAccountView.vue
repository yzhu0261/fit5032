// This is a page help users to manage their accounts.
<script setup>
import { ref } from 'vue'

// Store the user's input (The initial values are empty).
const email = ref('')
const password = ref('')

// Store validation error messages.
const emailError = ref('')
const passwordError = ref('')

// Store success message when successfully register.
const successMessage = ref('')

// email must be like string@string.string
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Validate email when the user leaves the email input.
const validateEmail = () => {
  emailError.value = ''

  if (email.value === '') {
    emailError.value = 'Email is required.'
  } else if (!emailPattern.test(email.value)) {
    emailError.value = 'Invalid email address.'
  }
}

// Validate password when the user leaves the password input.
const validatePassword = () => {
  passwordError.value = ''

  if (password.value === '') {
    passwordError.value = 'Password is required.'
  } else if (password.value.length < 8) {
    passwordError.value = 'Password must be at least 8 characters.'
  }
}

// Prompts relative error information.
const validateForm = () => {

  successMessage.value = ''

  validateEmail()

  validatePassword()

  if (emailError.value === '' && passwordError.value === '') {

    const user = {
      email: email.value,
      password: password.value,
      role: 'user'
    }

    localStorage.setItem('registeredUser', JSON.stringify(user))

    successMessage.value = 'Registration successful!'

  }

}
</script>

<template>
  <main class="container py-5">
    <h1>My Account</h1>
    <p>Create an account to join GreenUp Melbourne activities.</p>

    <div class="row">
      <div class="col-12 col-md-8 col-lg-6">
        <form class="mt-4" @submit.prevent="validateForm" novalidate>
          <div class="mb-3">
            <label for="email" class="form-label">Email Address</label>

            <!-- v-model creates a two-way binding between the input and email. -->
            <input
              id="email"
              v-model="email"
              type="email"
              class="form-control"
              @blur="validateEmail"
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
              @blur="validatePassword"
            />

            <p v-if="passwordError" class="text-danger mt-1">
              {{ passwordError }}
            </p>
          </div>

          <button type="submit" class="btn btn-success">
            Register
          </button>

          <p v-if="successMessage" class="text-success mt-3">
            {{ successMessage }}
          </p>
        </form>
      </div>
    </div>
  </main>
</template>