const axios = require('axios')

const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY
if (!OPEN_WEATHER_API_KEY) {
  console.warn('OPEN_WEATHER_API_KEY is not set; OpenWeather requests will fail')
}

const axiosInstance = axios.create({
  baseURL: 'https://api.openweathermap.org'
})

const CACHE_TTL_MS = 5 * 60 * 1000
const cache = new Map()

const getCache = key => {
  const cached = cache.get(key)
  if (!cached) return null
  if (cached.expires < Date.now()) {
    cache.delete(key)
    return null
  }
  return cached.value
}

const setCache = (key, value) => {
  cache.set(key, { value, expires: Date.now() + CACHE_TTL_MS })
}

const formatDisplayName = (city, country) => `${city}, ${country}`
const makeImageUrl = icon => `https://openweathermap.org/img/w/${icon}.png`

const formatAxiosError = error => {
  if (error.response && error.response.data && error.response.data.message) {
    return `${error.response.status} ${error.response.data.message}`
  }
  if (error.response && error.response.statusText) {
    return `${error.response.status} ${error.response.statusText}`
  }
  return error.message || 'Unknown API error'
}

const normalizeCountry = country => (country || '').toUpperCase()

const searchLocations = async (input, country) => {
  if (!OPEN_WEATHER_API_KEY) {
    const error = new Error('OPEN_WEATHER_API_KEY is required')
    error.status = 500
    throw error
  }

  const normalizedCountry = normalizeCountry(country)
  const cacheKey = `search:${input}:${normalizedCountry}`
  const cached = getCache(cacheKey)
  if (cached) return cached

  const params = {
    q: `${input},${normalizedCountry}`,
    type: 'like',
    sort: 'population',
    cnt: 20,
    appid: OPEN_WEATHER_API_KEY
  }

  try {
    const response = await axiosInstance.get('/data/2.5/find', { params })
    const list = response.data && response.data.list ? response.data.list : []
    const results = list.map(entry => ({
      id: entry.id,
      city: entry.name,
      country: entry.sys && entry.sys.country ? entry.sys.country : normalizedCountry,
      displayName: formatDisplayName(entry.name, entry.sys && entry.sys.country ? entry.sys.country : normalizedCountry)
    }))
    setCache(cacheKey, results)
    return results
  } catch (error) {
    const message = `OpenWeather search failed: ${formatAxiosError(error)}`
    const err = new Error(message)
    err.status = error.response ? error.response.status : 502
    throw err
  }
}

const getWeatherInfo = async ids => {
  if (!OPEN_WEATHER_API_KEY) {
    const error = new Error('OPEN_WEATHER_API_KEY is required')
    error.status = 500
    throw error
  }

  const cacheKey = `weather:${ids.join(',')}`
  const cached = getCache(cacheKey)
  if (cached) return cached

  const params = {
    id: ids.join(','),
    units: 'metric',
    appid: OPEN_WEATHER_API_KEY
  }

  try {
    const response = await axiosInstance.get('/data/2.5/group', { params })
    const list = response.data && response.data.list ? response.data.list : []
    const results = list.map(entry => ({
      id: entry.id,
      city: entry.name,
      country: entry.sys && entry.sys.country,
      displayName: formatDisplayName(entry.name, entry.sys && entry.sys.country),
      description: (entry.weather && entry.weather[0] && entry.weather[0].description) || 'No weather description',
      imageUrl: makeImageUrl(entry.weather && entry.weather[0] && entry.weather[0].icon),
      currentTemp: entry.main && entry.main.temp,
      minTemp: entry.main && entry.main.temp_min,
      maxTemp: entry.main && entry.main.temp_max,
      humidity: entry.main && entry.main.humidity,
      pressure: entry.main && entry.main.pressure,
      windSpeed: entry.wind && entry.wind.speed
    }))
    setCache(cacheKey, results)
    return results
  } catch (error) {
    const message = `OpenWeather weather lookup failed: ${formatAxiosError(error)}`
    const err = new Error(message)
    err.status = error.response ? error.response.status : 502
    throw err
  }
}

module.exports = {
  searchLocations,
  getWeatherInfo
}
