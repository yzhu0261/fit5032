
import { getFunctions, httpsCallable } from 'firebase/functions'
import app from './firebase.js'
import { activities } from './data/activities.js'

// Upload activities through Firebase Cloud Functions.
export const uploadActivities = async () => {
  const functions = getFunctions(app, 'us-central1')
  const upload = httpsCallable(functions, 'uploadActivities')

  const result = await upload({ activities })

  return result.data
}
