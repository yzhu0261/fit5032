<script setup>
import BHeader from './components/BHeader.vue'
</script>

<template>
  <div class="main-container">
    <header>
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