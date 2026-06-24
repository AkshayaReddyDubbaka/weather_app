const express = require('express')
const openWeatherService = require('../services/openWeather')

const router = express.Router()

router.get('/search', async (req, res) => {
  try {
    const { input, country } = req.query
    if (!input || !country) {
      return res.json([])
    }

    const locations = await openWeatherService.searchLocations(input, country)
    res.json(locations)
  } catch (error) {
    console.error('[api/locations] error', error)
    res.status(error.status || 500).json({ error: error.message || 'Location search failed' })
  }
})

module.exports = router
