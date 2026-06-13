export interface CurrentWeather {
  temp: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  windGust?: number;
  dewPoint: number;
  cloudCover: number;
  symbolCode: string;
  uvIndex?: number;
  time: string;
}

export interface HourlyForecastItem {
  time: string;
  temp: number;
  symbolCode: string;
  precipitation: number;
}

export interface DailyForecastItem {
  date: string; // YYYY-MM-DD
  tempMin: number;
  tempMax: number;
  symbolCode: string;
  precipitation: number;
  windSpeedMax: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
}

export async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData> {
  // met.no requires coordinates rounded to 4 decimal places
  const roundedLat = parseFloat(lat.toFixed(4));
  const roundedLon = parseFloat(lon.toFixed(4));

  const url = `https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${roundedLat}&lon=${roundedLon}`;

  // IMPORTANT: met.no requires a custom, identifying User-Agent to avoid throttling
  const headers = {
    'User-Agent': 'PremiumWeatherApp/1.0 (contact: github.com/khanpc/weather)',
  };

  const response = await fetch(url, { headers, next: { revalidate: 1200 } }); // Cache for 20 mins
  if (!response.ok) {
    throw new Error(`met.no API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const timeseries = data.properties.timeseries;

  if (!timeseries || timeseries.length === 0) {
    throw new Error('No weather data returned from met.no');
  }

  // 1. Current Weather
  const currentSlot = timeseries[0];
  const currentDetails = currentSlot.data.instant.details;
  const currentSymbolCode =
    currentSlot.data.next_1_hours?.summary?.symbol_code ||
    currentSlot.data.next_6_hours?.summary?.symbol_code ||
    'clearsky_day';

  const current: CurrentWeather = {
    temp: currentDetails.air_temperature,
    humidity: currentDetails.relative_humidity,
    pressure: currentDetails.air_pressure_at_sea_level,
    windSpeed: currentDetails.wind_speed,
    windDirection: currentDetails.wind_from_direction,
    windGust: currentDetails.wind_speed_of_gust,
    dewPoint: currentDetails.dew_point_temperature,
    cloudCover: currentDetails.cloud_area_fraction,
    symbolCode: currentSymbolCode,
    uvIndex: currentDetails.ultraviolet_index_clear_sky,
    time: currentSlot.time,
  };

  // 2. Hourly Forecast (next 24 hours)
  const hourly: HourlyForecastItem[] = [];
  const limit = Math.min(24, timeseries.length);
  for (let i = 0; i < limit; i++) {
    const slot = timeseries[i];
    const details = slot.data.instant.details;
    const symbolCode =
      slot.data.next_1_hours?.summary?.symbol_code ||
      slot.data.next_6_hours?.summary?.symbol_code ||
      'clearsky_day';
    const precipitation =
      slot.data.next_1_hours?.details?.precipitation_amount ??
      slot.data.next_6_hours?.details?.precipitation_amount ??
      0;

    hourly.push({
      time: slot.time,
      temp: details.air_temperature,
      symbolCode,
      precipitation,
    });
  }

  // 3. Daily Forecast (10 days)
  // Group timeseries items by local or UTC date (YYYY-MM-DD)
  const groupedByDay: { [key: string]: typeof timeseries } = {};
  timeseries.forEach((slot: any) => {
    // Get YYYY-MM-DD from the ISO string
    const dateStr = slot.time.substring(0, 10);
    if (!groupedByDay[dateStr]) {
      groupedByDay[dateStr] = [];
    }
    groupedByDay[dateStr].push(slot);
  });

  const daily: DailyForecastItem[] = [];
  const sortedDates = Object.keys(groupedByDay).sort().slice(0, 10); // Limit to 10 days

  sortedDates.forEach((dateStr) => {
    const slots = groupedByDay[dateStr];
    let tempMin = Infinity;
    let tempMax = -Infinity;
    let windSpeedMax = 0;
    let totalPrecipitation = 0;

    // To prevent double counting precipitation:
    // If we have hourly slots, we sum the next_1_hours precipitation.
    // If we only have 6-hourly slots, we sum next_6_hours precipitation.
    // Let's analyze spacing in this day's slots.
    let hourlyCount = 0;
    slots.forEach((s: any) => {
      if (s.data.next_1_hours?.details?.precipitation_amount !== undefined) {
        hourlyCount++;
      }
    });

    slots.forEach((slot: any) => {
      const details = slot.data.instant.details;
      if (details.air_temperature < tempMin) tempMin = details.air_temperature;
      if (details.air_temperature > tempMax) tempMax = details.air_temperature;
      if (details.wind_speed > windSpeedMax) windSpeedMax = details.wind_speed;

      if (hourlyCount > 0) {
        // If there are hourly reports, sum hourly precipitation
        totalPrecipitation += slot.data.next_1_hours?.details?.precipitation_amount ?? 0;
      } else {
        // If there are no hourly reports, it's 6-hourly. Sum next_6_hours.
        // But wait, the 6-hour reports are at 00, 06, 12, 18.
        // We sum next_6_hours precipitation for these.
        totalPrecipitation += slot.data.next_6_hours?.details?.precipitation_amount ?? 0;
      }
    });

    // Determine representative weather icon
    // Look for slot closest to midday (12:00 UTC)
    let representativeSlot = slots[0];
    let minDiff = Infinity;
    slots.forEach((slot: any) => {
      const hour = new Date(slot.time).getUTCHours();
      const diff = Math.abs(hour - 12);
      if (diff < minDiff) {
        minDiff = diff;
        representativeSlot = slot;
      }
    });

    const symbolCode =
      representativeSlot.data.next_1_hours?.summary?.symbol_code ||
      representativeSlot.data.next_6_hours?.summary?.symbol_code ||
      representativeSlot.data.next_12_hours?.summary?.symbol_code ||
      'clearsky_day';

    daily.push({
      date: dateStr,
      tempMin: Math.round(tempMin * 10) / 10,
      tempMax: Math.round(tempMax * 10) / 10,
      symbolCode,
      precipitation: Math.round(totalPrecipitation * 10) / 10,
      windSpeedMax: Math.round(windSpeedMax * 10) / 10,
    });
  });

  return {
    current,
    hourly,
    daily,
  };
}
