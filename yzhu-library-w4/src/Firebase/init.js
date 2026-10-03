import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBAhuOdV_wP5b4SkkCWab9GKlxzxDy0Ubg",
  authDomain: "fit5032-34a0d.firebaseapp.com",
  projectId: "fit5032-34a0d",
  storageBucket: "fit5032-34a0d.firebasestorage.app",
  messagingSenderId: "651311287738",
  appId: "1:651311287738:web:5764f6f83446730fbda183"
}

// Initialize Firebase
initializeApp(firebaseConfig)

// Initialize Firestore
const db = getFirestore()

export default db