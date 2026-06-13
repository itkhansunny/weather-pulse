# 🌦️ Weather Pulse (আবহাওয়া পালস)

[![Next.js Version](https://img.shields.io/badge/Next.js-16.2.9-blue?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![CSS3](https://img.shields.io/badge/CSS3-Vanilla-orange?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Weather Pulse** is a state-of-the-art, premium live weather forecasting dashboard. It combines keyless geocoding search APIs and high-accuracy meteorological forecasts into a single, beautiful, and fluid glassmorphism user interface. Designed for optimal viewing on desktop, tablet, and mobile devices, the application features dynamic weather-themed backgrounds and localized English and Bangla languages.

---

## 🌟 Key Features

*   **⚡ Live Met.no Data**: Seamless integration with the Norwegian Meteorological Institute's LocationForecast API for high-resolution hourly and daily forecasts.
*   **🌍 Smart Geocoding Search**: Fully integrated with the Open-Meteo Geocoding API. Features city autocomplete search with country flag icons and administrative division details.
*   **🎨 Dynamic Weather Themes**: The interface background dynamically shifts colors (Clear Sunny Gold, Cloudy Grey, Rainy Indigo, Snowy Lavender, Purple Storm) matching the current conditions of the searched city.
*   **📸 Clean PNG Image Export**: A dedicated header action button captures the entire dashboard—including the active weather background gradient—and saves it as a clean PNG image, hiding browser scrollbars and control switchers during render.
*   **🧭 Advanced Wind Compass**: A custom-built SVG vector wind dial featuring cardinal labels, a dashed scale ring, and a rotating easement needle indicating the exact wind direction.
*   **📊 Apple-style Temperature Bars**: Daily items include relative color-gradient range bars scaled against the 10-day global min and max temperatures to visualize temperature fluctuations.
*   **🌡️ Comfort & Status Badges**: Added visual indicators for secondary weather metrics:
    *   *Humidity*: Dry / Ideal / Sticky / Humid alerts.
    *   *UV Index*: Low / Moderate / High / Very High / Extreme threat levels.
    *   *Pressure*: Low / Normal / High atmospheric pressure indicators.
    *   *Cloud Cover*: Clear / Fair / Partly Cloudy / Cloudy / Overcast status labels.
    *   *Dew Point*: Dry / Pleasant / Sticky / Oppressive comfort warnings with dynamic translated explanations.
*   **🇧🇩 Fully Localized Language (EN/BN)**: Clean toggling between English and Bangla. Automatically translates weekdays, condition descriptors, alerts, and numbers (e.g. converting `23` to `২৩`), including `AM`/`PM` time markers to **এএম** and **পিএম**.

---

## 🛠️ Technology Stack

| Component | Technology | Description | Link |
| :--- | :--- | :--- | :--- |
| **Core Framework** | Next.js (16.2.9) | App Router architecture with client-side hydration. | [nextjs.org](https://nextjs.org) |
| **Language** | TypeScript | Strong typing for API responses and component props. | [typescriptlang.org](https://www.typescriptlang.org) |
| **Styling** | Vanilla CSS3 | Custom design system using variables, media queries, and GPU-accelerated keyframe animations. | [w3.org](https://www.w3.org/Style/CSS/) |
| **Weather API** | met.no LocationForecast | High-resolution spatial weather models and forecasts. | [api.met.no](https://api.met.no/weatherapi/locationforecast/2.0/documentation) |
| **Geocoding API** | Open-Meteo Geocoding | Autocomplete city search databases. | [open-meteo.com](https://open-meteo.com/en/docs/geocoding-api) |
| **Animated Icons** | met.no SVGs | Official animated weather condition icons (served via jsDelivr CDN). | [github.com/metno](https://github.com/metno/weathericons) |
| **UI Icons** | Lucide React | Clean, scalable stroke icons for gauges, compasses, and indicators. | [lucide.dev](https://lucide.dev) |
| **Image Exporter** | html-to-image | Converts DOM tree structures to PNG data URLs. | [github.com/bubkoo](https://github.com/bubkoo/html-to-image) |

---

## 📂 Project Structure

```bash
weather/
├── public/                  # Public assets
├── src/
│   ├── app/
│   │   ├── globals.css      # Core styles, glassmorphism templates, animations, variables
│   │   ├── layout.tsx       # Root Next.js wrapper
│   │   └── page.tsx         # Page entry mounting the WeatherDashboard
│   ├── components/
│   │   ├── WeatherDashboard.tsx     # Central state, geocode bindings, theme manager
│   │   ├── WeatherDashboard.module.css
│   │   ├── SearchAutocomplete.tsx   # Debounced input & dropdown navigation
│   │   ├── SearchAutocomplete.module.css
│   │   ├── WeatherCard.tsx          # Local time clock, current temperature and weather summary
│   │   ├── WeatherCard.module.css
│   │   ├── HourlyForecast.tsx       # Horizontal time slider
│   │   ├── HourlyForecast.module.css
│   │   ├── TenDayForecast.tsx       # Vertical 10-day cards with Apple-style temp bars
│   │   ├── TenDayForecast.module.css
│   │   ├── WeatherDetails.tsx       # Wind compass & 2x3 comfort parameters grid
│   │   ├── WeatherDetails.module.css
│   │   └── WeatherIcon.tsx          # CDN met.no animated SVG parser
│   ├── services/
│   │   ├── geoService.ts            # Open-Meteo API caller
│   │   └── weatherService.ts        # met.no API parser and timezone formatter
│   └── utils/
│       └── translate.ts             # English/Bangla digit mapping helper
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

Follow these instructions to run the application locally:

### 1. Prerequisite
Ensure you have Node.js (v18 or higher) installed on your system.

### 2. Install Dependencies
Clone the repository and run the installation command in the project root:
```bash
npm install
```

### 3. Run Development Server
Start the Next.js local server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) on your web browser.

### 4. Build for Production
Generate an optimized production package:
```bash
npm run build
```

---

## ✍️ Credits & Authorship

*   **Lead Architect & Developer**: **Khan Sunny**
    *   🔗 [Connect on Facebook](https://facebook.com/itkhansunny)
    *   🔗 [Connect on LinkedIn](https://linkedin.com/in/itkhansunny)
*   **Co-Developed By**: Developed and pair-programmed autonomously by the **Antigravity AI Agent** (created by the **Google DeepMind** team).
