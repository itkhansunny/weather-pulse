import WeatherDashboard from '@/components/WeatherDashboard';

export const metadata = {
  title: 'Weather Pulse - Premium Live Weather Forecast',
  description: 'A gorgeous, interactive weather application providing live hourly and 10-day forecasts globally using high-accuracy met.no meteorological data.',
};

export default function Home() {
  return <WeatherDashboard />;
}
