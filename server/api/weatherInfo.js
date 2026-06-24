const express = require('express')
const openWeatherService = require('../services/openWeather')

const router = express.Router()

router.get('/weatherInfo', async (req, res) => {
  try {
    const ids = (req.query.ids || '')
      .split(',')
      .map(id => id.trim())
      .filter(Boolean)

    if (ids.length === 0) {
      return res.json([])
    }

    const weatherInfo = await openWeatherService.getWeatherInfo(ids)
    res.json(weatherInfo)
  } catch (error) {
    console.error('[api/weatherInfo] error', error)
    res.status(error.status || 500).json({ error: error.message || 'Weather info lookup failed' })
  }
})

module.exports = router
