"use client"
import { useState, useCallback, memo } from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';

// Types
type SoilData = {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
};

type PredictedConditions = {
  temperature: number;
  humidity: number;
  rainfall: number;
};

type PredictionResult = {
  data: {
    username: string;
    userID: string;
    gmail: string;
    soil_conditions: SoilData;
    predicted_conditions: PredictedConditions;
    schedule: string | null;
  };
  message: string;
  status: string;
};

// Constants
const API_BASE_URL = 'http://localhost:5001';
const MOCK_USER = {
  username: "user1",
  userID: "123",
  gmail: "user@example.com"
};

const CROP_OPTIONS = {
  Grains: ['rice', 'maize'],
  Pulses: ['chickpea', 'kidneybeans', 'pigeonpeas', 'mothbeans', 'mungbean', 'blackgram', 'lentil'],
  Fruits: ['pomegranate', 'banana', 'mango', 'grapes', 'watermelon', 'muskmelon', 'apple', 'orange', 'papaya', 'coconut'],
  'Commercial Crops': ['cotton', 'jute', 'coffee']
} as const;

// Memoized SVG Components
const ThermometerIcon = memo(() => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
    className="w-8 h-8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
    <path d="M12 9v3" />
  </svg>
));

const HumidityIcon = memo(() => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
    className="w-8 h-8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
));

const RainfallIcon = memo(() => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
    className="w-8 h-8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M8 19v1M8 14v1M16 19v1M16 14v1M12 21v1M12 16v1" />
  </svg>
));

// Memoized Card Components
const WeatherCard = memo(({ icon: Icon, title, value, unit, bgColor }: {
  icon: React.FC;
  title: string;
  value: number;
  unit: string;
  bgColor: string;
}) => (
  <div className={`${bgColor} rounded-lg p-6 flex flex-col items-center space-y-2`}>
    <Icon />
    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</h3>
    <p className="text-3xl font-bold text-gray-800 dark:text-white">
      {value.toFixed(1)}{unit}
    </p>
  </div>
));

const SoilConditionCard = memo(({ label, value }: { label: string; value: number }) => (
  <div className="p-4 bg-amber-50 dark:bg-amber-900/50 rounded-lg">
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
      {value.toFixed(1)}
    </p>
  </div>
));

const CropSelect = memo(({ value, onChange }: { 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void 
}) => (
  <select
    id="crop"
    value={value}
    onChange={onChange}
    className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 dark:border-gray-600 rounded-lg 
      focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
      dark:bg-gray-700 dark:text-white transition-colors duration-200
      hover:border-green-400"
    required
  >
    <option value="">Select a crop</option>
    {Object.entries(CROP_OPTIONS).map(([group, crops]) => (
      <optgroup key={group} label={group}>
        {crops.map(crop => (
          <option key={crop} value={crop}>
            {crop.charAt(0).toUpperCase() + crop.slice(1)}
          </option>
        ))}
      </optgroup>
    ))}
  </select>
));

// Function to save schedule to the database
async function saveScheduleToDatabase(userID: string, schedule: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/save-schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userID, schedule }),
    });

    if (!response.ok) throw new Error('Failed to save schedule');
  } catch (err) {
    console.error('Error saving schedule:', err);
  }
}

export default function Home() {
  const [zipcode, setZipcode] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [schedule, setSchedule] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [soilData, setSoilData] = useState<SoilData | null>(null);

  const handleZipCodeSubmit = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get-soil-by-zip/${zipcode}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to fetch soil data');

      setSoilData({
        nitrogen: data.data.nitrogen,
        phosphorus: data.data.phosphorus,
        potassium: data.data.potassium,
        ph: data.data.ph
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch soil data');
      throw err;
    }
  }, [zipcode]);

  const handlePredict = useCallback(async () => {
    if (!soilData) {
      setError('Please get soil data first');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/predict-conditions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...MOCK_USER,
          zipcode,
          crop_name: selectedCrop,
          n: soilData.nitrogen,
          p: soilData.phosphorus,
          k: soilData.potassium,
          ph: soilData.ph
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Prediction failed');
      setPredictionResult(result);

      // Use the prediction data to get the schedule from Perplexity API
      const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer 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',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-small-128k-online",
          messages: [{
            role: "user",
            content: `I live in zipcode ${zipcode}. I am waiting for a ${result.data.predicted_conditions.temperature}°C temperature, ${result.data.predicted_conditions.humidity}% relative humidity, and ${result.data.predicted_conditions.rainfall} mm rainfall. When can I expect conditions closest to this and create a step-by-step schedule for growing ${selectedCrop} to be followed from that point on.`
          }],
          max_tokens: 500,
          temperature: 0.2
        })
      });

      const perplexityResult = await perplexityResponse.json();
      const scheduleContent = perplexityResult.choices[0].message.content;
      setSchedule(scheduleContent);

      // Save the schedule to the database
      await saveScheduleToDatabase(MOCK_USER.userID, scheduleContent);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prediction failed');
      throw err;
    }
  }, [soilData, zipcode, selectedCrop]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await handleZipCodeSubmit();
      await handlePredict();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [handleZipCodeSubmit, handlePredict]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="space-y-8 max-w-4xl mx-auto pt-12">
        <div className="flex justify-center">
          <Image src="/leaf.png" alt="Leaf" width={64} height={64} className="animate-bounce" />
        </div>

        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
            Smart Farming Assistant
          </h1>
          <button 
            onClick={() => signIn("google")}
            className="px-6 py-2 bg-white text-gray-800 rounded-lg shadow-md hover:bg-gray-50 transition-colors"
          >
            Sign In With Google
          </button>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Get personalized crop recommendations based on your location
          </p>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-xl backdrop-blur-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zipcode"
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}
                  placeholder="Enter your ZIP code"
                  className="block w-full pl-3 pr-3 py-3 text-base border-gray-300 dark:border-gray-600 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                    dark:bg-gray-700 dark:text-white transition-colors duration-200
                    hover:border-green-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="crop" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Select Crop
                </label>
                <CropSelect value={selectedCrop} onChange={(e) => setSelectedCrop(e.target.value)} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white rounded-lg py-3 px-4 
                hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                transition-all duration-200 flex items-center justify-center space-x-2
                disabled:bg-green-400 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'Getting Recommendations...' : 'Get Recommendations'}</span>
            </button>
          </form>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-lg">
            {error}
          </div>
        )}

        {soilData && (
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-xl backdrop-blur-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Soil Conditions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <SoilConditionCard label="Nitrogen" value={soilData.nitrogen} />
              <SoilConditionCard label="Phosphorus" value={soilData.phosphorus} />
              <SoilConditionCard label="Potassium" value={soilData.potassium} />
              <SoilConditionCard label="pH Level" value={soilData.ph} />
            </div>
          </div>
        )}

        {predictionResult && (
          <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-xl backdrop-blur-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Predicted Growing Conditions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <WeatherCard
                icon={ThermometerIcon}
                title="Temperature"
                value={predictionResult.data.predicted_conditions.temperature}
                unit="°C"
                bgColor="bg-orange-50 dark:bg-orange-900/50"
              />
              <WeatherCard
                icon={HumidityIcon}
                title="Humidity"
                value={predictionResult.data.predicted_conditions.humidity}
                unit="%"
                bgColor="bg-blue-50 dark:bg-blue-900/50"
              />
              <WeatherCard
                icon={RainfallIcon}
                title="Rainfall"
                value={predictionResult.data.predicted_conditions.rainfall}
                unit="mm"
                bgColor="bg-purple-50 dark:bg-purple-900/50"
              />
            </div>

            {schedule && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
                  Growing Schedule
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {schedule}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}