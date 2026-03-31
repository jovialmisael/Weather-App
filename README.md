# Weather Experience React Application

A stunning, physics-aware, glassmorphic React weather application built for a flawless user experience. Indistinguishable from native, featuring buttery smooth interactions via Framer Motion.

## Features
- **Dynamic Glassmorphic UI**: High fidelity background morphing, immersive blurring, and precise physics based hover interactions. Designed completely with TailwindCSS and Framer Motion.
- **5-Day Forecast & Live Metrics**: Integrates with OpenWeatherMap APIs to deliver live, updated data tracking. 
- **Location Awareness**: Auto-track and populate weather for your precise geospatial coordinates with a single button press.
- **Framer Motion Micro-interactions**: Easing curves, spring expansions, and meticulously crafted SVG animated weather conditions built by hand.

## Setup Instructions

1. Install Dependencies
```bash
npm install
```

2. Configuration
You will need your own OpenWeatherMap API Key (`https://home.openweathermap.org/api_keys`). 
Once obtained, fill out the `.env` file at the root of the project:

```env
VITE_WEATHER_API_KEY="your_api_key_here"
```

3. Run the Development Server
```bash
npm run dev
```

App runs on Vite and natively supports HMR for insanely fast development. Enjoy the liquid-smooth weather application experience!
