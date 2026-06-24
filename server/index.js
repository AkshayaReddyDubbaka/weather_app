require('dotenv').config()
const path = require('path')
const express = require('express')
const locationsApi = require('./api/locations')
const weatherInfoApi = require('./api/weatherInfo')

const PORT = process.env.PORT || 3001
const app = express()

app.use(express.json())
app.use('/api', locationsApi)
app.use('/api', weatherInfoApi)

app.get('/health', (req, res) => res.json({ status: 'ok' }))

if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '..', 'build')
  app.use(express.static(buildPath))
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
