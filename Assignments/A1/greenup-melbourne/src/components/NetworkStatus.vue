<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isOnline = ref(navigator.onLine)

const updateNetworkStatus = () => {
  isOnline.value = navigator.onLine
}

onMounted(() => {
  window.addEventListener('online', updateNetworkStatus)
  window.addEventListener('offline', updateNetworkStatus)
})

onUnmounted(() => {
  window.removeEventListener('online', updateNetworkStatus)
  window.removeEventListener('offline', updateNetworkStatus)
})
</script>

<template>
  <div
    v-if="!isOnline"
    class="alert alert-warning text-center mb-0"
    role="status"
    aria-live="polite"
  >
    You are currently offline. Some features may be unavailable.
  </div>
</template>