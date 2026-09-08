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

// Store login validation error messages.
const loginEmailError = ref('')
const loginPasswordError = ref('')

const loginMessage = ref('')

const accountMode = ref('login')

const currentUser = ref(null)

// Create a admin account for role-based authentication.
const adminUser = {
  email: 'admin@greenup.com',
  password: 'admin123',
  role: 'admin'
}

// Restore the current user from local storage after refreshing the page.
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

// Validate the login input.
const validateLogin = () => {
  loginEmailError.value = ''
  loginPasswordError.value = ''

  if (loginEmail.value === '') {
    loginEmailError.value = 'Email is required.'
  } else if (!emailPattern.test(loginEmail.value)) {
    loginEmailError.value = 'Invalid email address.'
  }

  if (loginPassword.value === '') {
    loginPasswordError.value = 'Password is required.'
  }

  return (
    loginEmailError.value === '' &&
    loginPasswordError.value === ''
  )
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

  if (!validateLogin()) {
    return
  }

  const savedUser = localStorage.getItem('registeredUser')

  let registeredUser = null

  if (savedUser) {
    registeredUser = JSON.parse(savedUser)
  }

  // Check whether the login details match admin account.
  if (
    loginEmail.value === adminUser.email &&
    loginPassword.value === adminUser.password
  ) {

    localStorage.setItem('currentUser', JSON.stringify(adminUser))

    currentUser.value = adminUser

    window.dispatchEvent(new Event('auth-changed'))

    loginMessage.value = 'Login successful!'


  // Check whether the login details match the registered user.
  } else if (
    registeredUser &&
    loginEmail.value === registeredUser.email &&
    loginPassword.value === registeredUser.password
  ) {

    localStorage.setItem('currentUser', JSON.stringify(registeredUser))

    currentUser.value = registeredUser

    // Notify other components that the authentication state has changed.
    window.dispatchEvent(new Event('auth-changed'))

    loginMessage.value = 'Login successful!'

  } else {

    loginMessage.value = 'Invalid email or password.'

  }

}

const logout = () => {

  localStorage.removeItem('currentUser')

  currentUser.value = null

  window.dispatchEvent(new Event('auth-changed'))

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

            <form class="mt-4" @submit.prevent="login" novalidate>
              <div class="mb-3">
                <label for="loginEmail" class="form-label">Email Address</label>
                <input
                  id="loginEmail"
                  v-model="loginEmail"
                  type="email"
                  class="form-control"
                />

                <p v-if="loginEmailError" class="text-danger mt-1">
                  {{ loginEmailError }}
                </p>
              </div>

              <div class="mb-3">
                <label for="loginPassword" class="form-label">Password</label>
                <input
                  id="loginPassword"
                  v-model="loginPassword"
                  type="password"
                  class="form-control"
                />

                <p v-if="loginPasswordError" class="text-danger mt-1">
                  {{ loginPasswordError }}
                </p>
              </div>

              <button type="submit" class="btn btn-success">
                Login
              </button>

              <p v-if="loginMessage" class="text-danger mt-2">
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