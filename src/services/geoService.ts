export interface CityResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code?: string;
  admin1?: string; // e.g. State or region
  timezone: string;
}

export async function searchCities(query: string): Promise<CityResult[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const encodedQuery = encodeURIComponent(query.trim());
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodedQuery}&count=8&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding API failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country || '',
      country_code: item.country_code,
      admin1: item.admin1,
      timezone: item.timezone || 'UTC',
    }));
  } catch (error) {
    console.error('Error in searchCities:', error);
    return [];
  }
}
