import axios from 'axios'
import { formatAxiosError } from '../utils'

const axiosInstance = axios.create({
  baseURL: '/api'
})

export const getWeatherInfo = async ids => {
  try {
    if (!ids || ids.length === 0) return []

    const response = await axiosInstance.get('/weatherInfo', {
      params: {
        ids: ids.join(',')
      }
    })

    const results = response.data || []
    return results.map(openWeatherResultToViewModelResult)
  } catch (error) {
    const baseMessage = 'An error occurred retrieving weather information'
    const errorMessage = formatAxiosError(error, baseMessage)
    throw new Error(errorMessage)
  }
}

const openWeatherResultToViewModelResult = openWeatherResult => ({
  id: openWeatherResult.id,
  city: openWeatherResult.name,
  country: openWeatherResult.sys.country,
  displayName: `${openWeatherResult.name}, ${openWeatherResult.sys.country}`,
  description: openWeatherResult.weather[0].description,
  imageUrl: makeImageUrl(openWeatherResult.weather[0].icon),
  currentTemp: openWeatherResult.main.temp,
  minTemp: openWeatherResult.main.temp_min,
  maxTemp: openWeatherResult.main.temp_max,
  humidity: openWeatherResult.main.humidity,
  pressure: openWeatherResult.main.pressure,
  windSpeed: openWeatherResult.wind.speed
})

const makeImageUrl = icon =>
  `https://openweathermap.org/img/w/${icon}.png`
