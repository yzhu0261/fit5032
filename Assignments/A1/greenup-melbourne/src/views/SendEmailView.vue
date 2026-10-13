
<script setup>
import { ref } from 'vue'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { getAuth } from 'firebase/auth'
import app from '../firebase.js'

// Store the email form details.
const recipient = ref('')
const subject = ref('')
const message = ref('')
const attachment = ref(null)
const fileError = ref('')

// Connect to the deployed Firebase Function.
const functions = getFunctions(app, 'us-central1')
const sendEmailFunction = httpsCallable(functions, 'sendEmail')

const sending = ref(false)
const sendMessage = ref('')

// Check the selected attachment.
const handleFileChange = (event) => {
  fileError.value = ''
  attachment.value = null

  const file = event.target.files[0]

  if (!file) {
    return
  }

  // Allow PDF, TXT and CSV files up to 1 MB.
  const allowedTypes = [
    'application/pdf',
    'text/plain',
    'text/csv'
  ]

  const allowedExtensions = ['pdf', 'txt', 'csv']
  const extension = file.name.split('.').pop()?.toLowerCase()

  if (
    !allowedTypes.includes(file.type) &&
    !allowedExtensions.includes(extension)
  ) {
    fileError.value = 'Please select a PDF, TXT or CSV file.'
    event.target.value = ''
    return
  }

  if (file.size > 1024 * 1024) {
    fileError.value = 'The attachment must be 1 MB or smaller.'
    event.target.value = ''
    return
  }

  attachment.value = file
}

// Convert a file to Base64 for the Cloud Function.
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }

    reader.onerror = () => {
      reject(new Error('Unable to read the attachment.'))
    }

    reader.readAsDataURL(file)
  })
}

// Send the email using Firebase Cloud Functions.
const sendEmail = async () => {
  if (sending.value || !attachment.value) {
    return
  }

  sending.value = true
  sendMessage.value = ''

  try {
    // Check the Firebase user before sending.
    const auth = getAuth(app)

    // Wait for Firebase to restore the login state.
    await auth.authStateReady()

    if (!auth.currentUser) {
      sendMessage.value = 'Please log in before sending an email.'
      return
    }

    // Convert the selected file into Base64.
    const base64 = await convertToBase64(attachment.value)

    // Send the email details to the Cloud Function.
    const result = await sendEmailFunction({
      to: recipient.value,
      subject: subject.value,
      message: message.value,
      attachment: {
        filename: attachment.value.name,
        content: base64,
        type: attachment.value.type
      }
    })

    if (result.data.success) {
      sendMessage.value = 'Email sent successfully.'
    } else {
      sendMessage.value = 'Unable to send email. Please try again.'
    }

  } catch (error) {
    console.error('Email sending failed:', error)

    if (error.code === 'functions/unauthenticated') {
      sendMessage.value = 'Please log in before sending an email.'
    } else {
      sendMessage.value = 'Unable to send email. Please try again.'
    }

  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div class="container py-5">
    <h1 class="mb-2">Send Email</h1>

    <p class="text-muted mb-4">
      Send an email with an attachment.
    </p>

    <div class="card shadow-sm">
      <div class="card-body p-4">

        <form @submit.prevent="sendEmail">

          <!-- Recipient email -->
          <div class="mb-3">
            <label for="recipient" class="form-label">
              Recipient Email
            </label>

            <input
              id="recipient"
              v-model="recipient"
              type="email"
              class="form-control"
              placeholder="example@gmail.com"
              required
            />
          </div>

          <!-- Email subject -->
          <div class="mb-3">
            <label for="subject" class="form-label">
              Subject
            </label>

            <input
              id="subject"
              v-model="subject"
              type="text"
              class="form-control"
              placeholder="Enter email subject"
              maxlength="150"
              required
            />
          </div>

          <!-- Email message -->
          <div class="mb-3">
            <label for="message" class="form-label">
              Message
            </label>

            <textarea
              id="message"
              v-model="message"
              class="form-control"
              rows="5"
              maxlength="5000"
              placeholder="Write your message..."
              required
            ></textarea>
          </div>

          <!-- Email attachment -->
          <div class="mb-4">
            <label for="attachment" class="form-label">
              Attachment
            </label>

            <input
              id="attachment"
              type="file"
              class="form-control"
              accept=".pdf,.txt,.csv"
              required
              @change="handleFileChange"
            />

            <div class="form-text">
              Supported formats: PDF, TXT and CSV. Maximum size: 1 MB.
            </div>

            <p
              v-if="fileError"
              class="text-danger mt-2"
              role="alert"
            >
              {{ fileError }}
            </p>
          </div>

          <!-- Send email button -->
          <button
            type="submit"
            class="btn btn-success"
            :disabled="sending"
          >
            {{ sending ? 'Sending...' : 'Send Email' }}
          </button>

          <!-- Display the email result -->
          <p
            v-if="sendMessage"
            class="mt-3"
            role="status"
          >
            {{ sendMessage }}
          </p>

        </form>
      </div>
    </div>
  </div>
</template>
