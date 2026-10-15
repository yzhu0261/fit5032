<script setup>
import { RouterLink } from 'vue-router'
import { Trees, Sprout, Earth } from 'lucide-vue-next'
</script>

<template>
  <main>
    <section class="hero-section">
      <div class="container py-5">
        <div class="hero-content">
          <span class="hero-label">WELCOME TO GREENUP MELBOURNE</span>

          <h1 class="display-4 fw-bold mt-3">
            Small actions.<br />
            A greener Melbourne.
          </h1>

          <p class="lead mt-4">
            Discover local environmental activities, connect with
            your community, and make a positive impact on our city.
          </p>

          <RouterLink class="btn btn-success btn-lg mt-3" to="/explore">
            Explore Activities
          </RouterLink>
        </div>
      </div>
    </section>

    <section class="container py-5">
      <div class="text-center mb-5">
        <h2 class="fw-bold">Make a Difference</h2>
        <p class="text-muted">
          Find an activity that inspires you to take action.
        </p>
      </div>

      <div class="row g-4">
        <div class="col-md-4">
          <div class="activity-card">
            <div class="activity-icon">
              <Trees :size="36" :stroke-width="1.8" />
            </div>
            <h3>Tree Planting</h3>
            <p>
              Help create greener neighbourhoods by planting trees
              and supporting local green spaces.
            </p>
          </div>
        </div>

        <div class="col-md-4">
          <div class="activity-card">
            <div class="activity-icon">
              <Sprout :size="36" :stroke-width="1.8" />
            </div>
            <h3>Community Gardening</h3>
            <p>
              Connect with local communities and grow sustainable
              gardens together.
            </p>
          </div>
        </div>

        <div class="col-md-4">
          <div class="activity-card">
            <div class="activity-icon">
              <Earth :size="36" :stroke-width="1.8" />
            </div>
            <h3>Environmental Restoration</h3>
            <p>
              Take part in activities that protect and restore
              Melbourne's natural environment.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section text-center py-5">
      <div class="container">
        <h2 class="fw-bold">Ready to make an impact?</h2>
        <p class="mt-3">
          Explore environmental activities happening across Melbourne.
        </p>

        <RouterLink class="btn btn-success btn-lg mt-3" to="/explore">
          Find Activities
        </RouterLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.hero-section {
  background:
    linear-gradient(
      90deg,
      rgba(10, 45, 28, 0.88) 0%,
      rgba(10, 45, 28, 0.65) 50%,
      rgba(10, 45, 28, 0.15) 100%
    ),
    url('/images/melbourne-park.jpg') center / cover no-repeat;
  padding: 110px 0;
}

.hero-content {
  max-width: 650px;
}

.hero-label {
  color: #b8f5c9;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 2px;
}

.hero-content h1 {
  color: #ffffff;
}

.hero-content p {
  color: #e5f2e9;
}

.activity-card {
  height: 100%;
  padding: 32px;
  background: #ffffff;
  border: 1px solid #e1ebe3;
  border-radius: 18px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s;
}

.activity-card:hover {
  transform: translateY(-5px);
}

.activity-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin-bottom: 20px;
  background: #eaf5ed;
  color: #287a4a;
  border-radius: 16px;
}

.activity-card h3 {
  color: #174b32;
  font-size: 1.3rem;
  font-weight: 700;
}

.activity-card p {
  color: #66756b;
  margin-top: 12px;
}

.cta-section {
  background: #edf6ef;
}

.cta-section h2 {
  color: #174b32;
}
</style>