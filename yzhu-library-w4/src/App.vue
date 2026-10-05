<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BHeader from './components/BHeader.vue'

const route = useRoute()

// Hide the header when displaying the Count Book API page
const showHeader = computed(() => {
  return route.name !== 'CountBookAPI' &&
         route.name !== 'GetAllBookAPI'
})
</script>

<template>
  <div class="main-container">
    <header v-if="showHeader">
      <BHeader />
    </header>

    <main class="main-box container mt-5">
      <div class="row">
        <div class="col-12 col-md-8 offset-md-2">
          <router-view></router-view>
        </div>
      </div>
    </main>
  </div>
</template>