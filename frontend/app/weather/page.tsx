export default function Weather() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto pt-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Weather Forecast</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Weather Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Current Weather</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold">24°C</p>
                <p className="text-gray-600 dark:text-gray-300">Partly Cloudy</p>
              </div>
              <div className="text-right">
                <p>Humidity: 65%</p>
                <p>Wind: 12 km/h</p>
              </div>
            </div>
          </div>

          {/* Weather Advisory Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Farming Advisory</h2>
            <ul className="space-y-2">
              <li className="flex items-center text-green-600 dark:text-green-400">
                <span className="mr-2">✓</span>
                Good conditions for wheat harvesting
              </li>
              <li className="flex items-center text-yellow-600 dark:text-yellow-400">
                <span className="mr-2">⚠</span>
                Light rain expected tomorrow - plan accordingly
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
