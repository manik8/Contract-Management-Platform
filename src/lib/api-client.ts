import axios from 'axios'

// Ensure baseURL always ends with /api
const getBaseURL = () => {
  const envURL = process.env.NEXT_PUBLIC_API_URL
  if (!envURL) {
    return '/api'
  }
  // If env URL is provided, ensure it ends with /api
  return envURL.endsWith('/api') ? envURL : `${envURL}/api`
}

const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
})

export default apiClient
