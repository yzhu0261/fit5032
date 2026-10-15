<!-- This page introduces GreenUp Melbourne and its goals. -->
<script setup>
import { Trees, BookOpen, Users } from 'lucide-vue-next'
</script>

<template>
  <main class="about-page">
    <div class="container py-5">

      <section class="about-intro">
        <h1>About Us</h1>

        <p>GreenUp Melbourne is a website that helps people to discover local greening and biodiversity activities in Melbourne.</p>

        <p>The website aims to make it easier for users to find local environmental activities, and learn more about local biodiversity.</p>
      </section>

      <section class="goals-section mt-5">
        <h2 class="h4 mt-4">Our Goals</h2>

        <div class="row g-4 mt-2">
          <div class="col-md-4">
            <div class="goal-card">
              <div class="goal-icon">
                <Trees :size="30" :stroke-width="1.8" />
              </div>

              <p>Help users discover local greening activities.</p>
            </div>
          </div>

          <div class="col-md-4">
            <div class="goal-card">
              <div class="goal-icon">
                <BookOpen :size="30" :stroke-width="1.8" />
              </div>

              <p>Provide simple biodiversity information and resources.</p>
            </div>
          </div>

          <div class="col-md-4">
            <div class="goal-card">
              <div class="goal-icon">
                <Users :size="30" :stroke-width="1.8" />
              </div>

              <p>Encourage community participation in environmental projects.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  </main>
</template>

<style scoped>
.about-page {
  background: #f7faf8;
}

.about-intro {
  background: #eaf5ed;
  border-radius: 20px;
  padding: 48px;
}

.about-intro h1 {
  color: #174b32;
  font-weight: 700;
  margin-bottom: 24px;
}

.about-intro p {
  max-width: 850px;
  color: #52665b;
  line-height: 1.8;
  margin-bottom: 16px;
}

.about-intro p:last-child {
  margin-bottom: 0;
}

.goals-section h2 {
  color: #174b32;
  font-weight: 700;
}

.goal-card {
  height: 100%;
  min-height: 180px;
  padding: 30px;
  background: #ffffff;
  border: 1px solid #e1ebe3;
  border-radius: 18px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s;
}

.goal-card:hover {
  transform: translateY(-4px);
}

.goal-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  margin-bottom: 20px;
  background: #eaf5ed;
  color: #287a4a;
  border-radius: 15px;
}

.goal-card p {
  color: #52665b;
  line-height: 1.6;
  margin-bottom: 0;
}

@media (max-width: 767.98px) {
  .about-intro {
    padding: 28px;
  }

  .goal-card {
    min-height: auto;
  }
}
</style>