<!-- This page allows users to register, log in, and manage their account. -->
<script setup>
import { ref } from 'vue'
import { UserRound } from 'lucide-vue-next'

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'

import '../firebase.js'

// Get the firebase authentication.
const auth = getAuth()

// Store the user's input (The initial values are empty).
const email = ref('')
const password = ref('')

// Store validation error messages.
const emailError = ref('')
const passwordError = ref('')

// Store success message when successfully register.
const successMessage = ref('')

// Store the login input.
const loginEmail = ref('')
const loginPassword = ref('')

// Store login validation error messages.
const loginEmailError = ref('')
const loginPasswordError = ref('')

// Store the login result message.
const loginMessage = ref('')

// Control whether the login or register page is displayed.
const accountMode = ref('login')

// Store the currently login user.
const currentUser = ref(null)

// Check whether Firebase has finished loading the user.
const authLoading = ref(true)

// Update the current user when the Firebase login state changes.
onAuthStateChanged(auth, (firebaseUser) => {
  if (firebaseUser) {
    const role =
      firebaseUser.email === 'admin@greenup.com'
        ? 'admin'
        : 'user'

    const user = {
      email: firebaseUser.email,
      uid: firebaseUser.uid,
      role: role
    }

    currentUser.value = user
    localStorage.setItem('currentUser', JSON.stringify(user))
  } else {
    currentUser.value = null
    localStorage.removeItem('currentUser')
  }

  authLoading.value = false

  window.dispatchEvent(new Event('auth-changed'))
})

// email must be string@string.string.
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

// Validate the registration form and create a user account with Firebase.
const validateForm = async () => {
  successMessage.value = ''

  validateEmail()
  validatePassword()

  if (emailError.value === '' && passwordError.value === '') {
    try {
      // Create the user account using Firebase Authentication.
      await createUserWithEmailAndPassword(
        auth,
        email.value,
        password.value
      )

      successMessage.value = 'Registration successful!'

      // Clear the registration form after successful registration.
      email.value = ''
      password.value = ''
    } catch (error) {
      // Display error message if Firebase cannot create an account.
      successMessage.value = 'Registration failed: ' + error.message
    }
  }
}

// Log in with Firebase Authentication.
const login = async () => {
  loginMessage.value = ''

  if (!validateLogin()) {
    return
  }

  try {
    // Ask Firebase to authenticate the user's email & password.
    const userCredential = await signInWithEmailAndPassword(
      auth,
      loginEmail.value,
      loginPassword.value
    )

    // Set the user role after login.
    const role =
      userCredential.user.email === 'admin@greenup.com'
        ? 'admin'
        : 'user'

    // Store the current user details.
    const user = {
      email: userCredential.user.email,
      uid: userCredential.user.uid,
      role: role
    }

    currentUser.value = user

    // Save the user for the existing navigation and admin access.
    localStorage.setItem('currentUser', JSON.stringify(user))

    // Update the authentication state.
    window.dispatchEvent(new Event('auth-changed'))

    loginMessage.value = 'Login successful!'
  } catch (error) {
    loginMessage.value = 'Invalid email or password.'
  }
}

// Log out with Firebase.
const logout = async () => {
  try {
    // Log out the current user.
    await signOut(auth)

    // Remove the saved user.
    localStorage.removeItem('currentUser')

    currentUser.value = null

    // Update the authentication state.
    window.dispatchEvent(new Event('auth-changed'))

    loginEmail.value = ''
    loginPassword.value = ''
    loginMessage.value = ''
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

</script>

<template>
  <main class="container py-5">
    <div class="text-center mb-4">
      <h1 class="fw-bold">My Account</h1>

      <p class="text-muted">
        Login or create an account to join GreenUp Melbourne activities.
      </p>
    </div>

    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">

        <div class="card border-0 shadow-sm rounded-4">
          <div class="card-body p-4 p-md-5">

            <!-- Show a message while Firebase checks the login state. -->
            <div v-if="authLoading" class="text-center py-4">
              <div
                class="spinner-border text-success mb-3"
                role="status"
              >
                <span class="visually-hidden">Loading...</span>
              </div>

              <p class="text-muted mb-0">Loading account...</p>
            </div>

            <!-- Show Login and Register forms when no user is logged in. -->
            <div v-else-if="!currentUser">
              <div class="d-flex justify-content-center mb-4">
                <button
                  type="button"
                  class="btn me-2"
                  :class="accountMode === 'login'
                    ? 'btn-success'
                    : 'btn-outline-success'"
                  @click="accountMode = 'login'"
                >
                  Login
                </button>

                <button
                  type="button"
                  class="btn"
                  :class="accountMode === 'register'
                    ? 'btn-success'
                    : 'btn-outline-success'"
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
                <div class="text-center mb-4">
                  <h2 class="h4 fw-bold">Create Account</h2>
                  <p class="text-muted mb-0">
                    Create your GreenUp Melbourne account.
                  </p>
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">Email Address</label>
                  <input
                    id="email"
                    v-model="email"
                    type="email"
                    class="form-control"
                    placeholder="Enter your email"
                    @blur="validateEmail"
                  />

                  <p v-if="emailError" class="text-danger mt-1">
                    {{ emailError }}
                  </p>

                </div>

                <div class="mb-4">
                  <label for="password" class="form-label">Password</label>
                  <input
                    id="password"
                    v-model="password"
                    type="password"
                    class="form-control"
                    placeholder="Enter your password"
                    @blur="validatePassword"
                  />

                  <p v-if="passwordError" class="text-danger mt-1">
                    {{ passwordError }}
                  </p>

                </div>

                <button
                  type="submit"
                  class="btn btn-success w-100"
                >
                  Register
                </button>

                <p v-if="successMessage" class="text-success text-center mt-3">
                  {{ successMessage }}
                </p>

              </form>

              <div v-if="accountMode === 'login'">
                <div class="text-center mb-4">
                  <h2 class="h4 fw-bold">Welcome Back</h2>
                  <p class="text-muted mb-0">
                    Login to continue to your account.
                  </p>
                </div>

                <form class="mt-4" @submit.prevent="login" novalidate>
                  <div class="mb-3">
                    <label for="loginEmail" class="form-label">
                      Email Address
                    </label>

                    <input
                      id="loginEmail"
                      v-model="loginEmail"
                      type="email"
                      class="form-control"
                      placeholder="Enter your email"
                    />

                    <p v-if="loginEmailError" class="text-danger mt-1">
                      {{ loginEmailError }}
                    </p>
                  </div>

                  <div class="mb-4">
                    <label for="loginPassword" class="form-label">
                      Password
                    </label>

                    <input
                      id="loginPassword"
                      v-model="loginPassword"
                      type="password"
                      class="form-control"
                      placeholder="Enter your password"
                    />

                    <p v-if="loginPasswordError" class="text-danger mt-1">
                      {{ loginPasswordError }}
                    </p>
                  </div>

                  <button
                    type="submit"
                    class="btn btn-success w-100"
                  >
                    Login
                  </button>

                  <p v-if="loginMessage" class="text-danger text-center mt-3">
                    {{ loginMessage }}
                  </p>

                </form>
              </div>
            </div>

            <!-- Show the current user's account details after login. -->
            <div v-else class="text-center">
              <div class="mb-4">
                <div
                  class="bg-success-subtle rounded-circle d-inline-flex
                         align-items-center justify-content-center mb-3"
                  style="width: 72px; height: 72px;"
                >
                  <UserRound :size="34" :stroke-width="1.8" class="text-success" />
                </div>

                <h2 class="h3 fw-bold mb-2">Welcome</h2>

                <p class="text-muted mb-3">
                  You are signed in to GreenUp Melbourne.
                </p>
              </div>

              <div class="bg-light rounded-3 p-3 mb-4 text-start">
                <div class="mb-3">
                  <small class="text-muted d-block">Email Address</small>
                  <span class="fw-semibold">
                    {{ currentUser.email }}
                  </span>
                </div>

                <div>
                  <small class="text-muted d-block mb-1">Account Role</small>

                  <span
                    v-if="currentUser.role === 'admin'"
                    class="badge text-bg-success"
                  >
                    Admin
                  </span>

                  <span
                    v-else
                    class="badge text-bg-secondary"
                  >
                    User
                  </span>
                </div>
              </div>

              <button
                type="button"
                class="btn btn-outline-success w-100"
                @click="logout"
              >
                Logout
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  </main>
</template>