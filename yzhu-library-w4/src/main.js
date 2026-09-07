//import './assets/main.css'
//import './style.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'

import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'

import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: "AIzaSyBAhuOdV_wP5b4SkkCWab9GKlxzxDy0Ubg",
  authDomain: "fit5032-34a0d.firebaseapp.com",
  projectId: "fit5032-34a0d",
  storageBucket: "fit5032-34a0d.firebasestorage.app",
  messagingSenderId: "651311287738",
  appId: "1:651311287738:web:5764f6f83446730fbda183"
};

// Initialize Firebase
initializeApp(firebaseConfig);

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
})

app.use(router)
app.mount('#app')
