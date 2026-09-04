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

// Store login message.

const loginEmail = ref('')

const loginPassword = ref('')

const loginMessage = ref('')

const accountMode = ref('login')

const currentUser = ref(null)

const savedCurrentUser = localStorage.getItem('currentUser')

if (savedCurrentUser) {

  currentUser.value = JSON.parse(savedCurrentUser)

}

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

const login = () => {

  loginMessage.value = ''

  const savedUser = localStorage.getItem('registeredUser')

  if (!savedUser) {

    loginMessage.value = 'No registered user found.'

    return

  }

  const user = JSON.parse(savedUser)

  if (
    loginEmail.value === user.email &&
    loginPassword.value === user.password
  ) {

    localStorage.setItem('currentUser', JSON.stringify(user))

    currentUser.value = user

    loginMessage.value = 'Login successful!'

  } else {

    loginMessage.value = 'Invalid email or password.'

  }

}

const logout = () => {

  localStorage.removeItem('currentUser')

  currentUser.value = null

  loginEmail.value = ''

  loginPassword.value = ''

  loginMessage.value = ''

}

</script>

<template>

  <main class="container py-5">

    <h1>My Account</h1>

    <p>Login or create an account to join GreenUp Melbourne activities.</p>

    <div class="row">

      <div class="col-12 col-md-8 col-lg-6">

        <div v-if="!currentUser">

          <div class="mb-4">

            <button
              type="button"
              class="btn btn-outline-success me-2"
              @click="accountMode = 'login'"
            >
              Login
            </button>

            <button
              type="button"
              class="btn btn-outline-success"
              @click="accountMode = 'register'"
            >
              Register
            </button>

          </div>

          <form
            v-if="accountMode === 'register'"
            class="mt-4"
            @submit.prevent="validateForm"
            novalidate
          >

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

          <div v-if="accountMode === 'login'">

            <h2>Login</h2>

            <form class="mt-4" @submit.prevent="login">

              <div class="mb-3">

                <label for="loginEmail" class="form-label">Email Address</label>

                <input
                  id="loginEmail"
                  v-model="loginEmail"
                  type="email"
                  class="form-control"
                />

              </div>

              <div class="mb-3">

                <label for="loginPassword" class="form-label">Password</label>

                <input
                  id="loginPassword"
                  v-model="loginPassword"
                  type="password"
                  class="form-control"
                />

              </div>

              <button type="submit" class="btn btn-success">
                Login
              </button>

              <p v-if="loginMessage" class="mt-3">
                {{ loginMessage }}
              </p>

            </form>

          </div>

        </div>

        <div v-else>

          <h2>Welcome</h2>

          <p>{{ currentUser.email }}</p>

          <p>Role: {{ currentUser.role }}</p>

          <button
            type="button"
            class="btn btn-success"
            @click="logout"
          >
            Logout
          </button>

        </div>

      </div>

    </div>

  </main>

</template>