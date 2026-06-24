import axios from 'axios'
import { formatAxiosError } from '../utils'

const axiosInstance = axios.create({
  baseURL: '/api'
})

export const search = async (input, country) => {
  try {
    if (!input) return []

    const response = await axiosInstance.get('/search', {
      params: {
        input,
        country
      }
    })

    return response.data || []
  } catch (error) {
    const baseMessage = 'An error occurred searching for locations'
    const errorMessage = formatAxiosError(error, baseMessage)
    throw new Error(errorMessage)
  }
}
