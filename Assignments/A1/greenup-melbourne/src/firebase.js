// Import Firebase initialization function.
import { initializeApp } from 'firebase/app'

// Firebase configuration for GreenUp Melbourne A3.
const firebaseConfig = {
  apiKey: 'AIzaSyCK2ppt5sTuxZv2cyPTpAEyNI4fFuv214Y',
  authDomain: 'greenup-melbourne-a3.firebaseapp.com',
  projectId: 'greenup-melbourne-a3',
  storageBucket: 'greenup-melbourne-a3.firebasestorage.app',
  messagingSenderId: '700825320051',
  appId: '1:700825320051:web:4ee0ad0fd3bbafae970806'
}

// Connect the Vue application to Firebase.
const app = initializeApp(firebaseConfig)

export default app