<template>
  <pre>
{{ jsondata }}
  </pre>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

const jsondata = ref(null)
const error = ref(null)

// Get all books from the Cloud Function
const getAllBookAPI = async () => {
  try {
    const response = await axios.get(
      'https://us-central1-fit5032-34a0d.cloudfunctions.net/getAllBooks'
    )

    // Convert the returned book data to formatted JSON
    jsondata.value = JSON.stringify(response.data, null, 2)
    error.value = null
  } catch (err) {
    error.value = 'Error fetching books'
    jsondata.value = null
  }
}

// Automatically load all books when the page opens
onMounted(() => {
  getAllBookAPI()
})
</script>