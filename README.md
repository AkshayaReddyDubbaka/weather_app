# Simple Weather App

This repository contains a React frontend application for displaying weather information.

## Features

* React UI with routing and preferences
* Selectable locations and current weather display
* Direct OpenWeather API integration from the browser

## Running locally

1. Create a `.env` file in the project root.
2. Add your OpenWeather API key:

```
OPEN_WEATHER_API_KEY=your_api_key_here
```

3. Install dependencies:

```
npm install
```

4. Start the backend proxy:

```
npm run start-server
```

5. In a second terminal, start the React frontend:

```
npm start
```

## Build

```
npm run build
```

## Notes

This app uses a Node.js + Express.js backend proxy to keep the OpenWeatherMap API key secure.

The backend reads `OPEN_WEATHER_API_KEY` from `.env`, while the frontend proxies requests through `/api` to the backend.
