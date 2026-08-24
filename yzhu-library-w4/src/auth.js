import { ref } from 'vue'

// Global authentication state
export const isAuthenticated = ref(false)

// Hardcoded credentials for this eFolio task
const validUsername = 'admin'
const validPassword = 'password123'

export const login = (username, password) => {
  if (username === validUsername && password === validPassword) {
    isAuthenticated.value = true
    return true
  }

  return false
}

export const logout = () => {
  isAuthenticated.value = false
}