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

// Get book count data from the Cloud Function
const getBookCountAPI = async () => {
  try {
    const response = await axios.get(
      'https://us-central1-fit5032-34a0d.cloudfunctions.net/countBooks'
    )

    // Convert the returned data to formatted JSON
    jsondata.value = JSON.stringify(response.data, null, 2)
    error.value = null
  } catch (err) {
    error.value = 'Error fetching book count'
    jsondata.value = null
  }
}

// Automatically get the API data when the page loads
onMounted(() => {
  getBookCountAPI()
})
</script>