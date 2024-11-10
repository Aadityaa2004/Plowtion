"use client"
import { useState } from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { Cloud, Droplets, Thermometer } from 'lucide-react';

interface SoilData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
}

interface PredictionResult {
  data: {
    username: string;
    userID: string;
    gmail: string;
    soil_conditions: {
      nitrogen: number;
      phosphorus: number;
      potassium: number;
      ph: number;
    };
    predicted_conditions: {
      temperature: number;
      humidity: number;
      rainfall: number;
    };
    schedule: string | null;
  };
  message: string;
  status: string;
}

export default function Home() {
  const [zipcode, setZipcode] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [soilData, setSoilData] = useState<SoilData | null>(null);

  const handleZipCodeSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5001/get-soil-by-zip/${zipcode}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch soil data');
      }

      const soil = {
        nitrogen: data.data.nitrogen,
        phosphorus: data.data.phosphorus,
        potassium: data.data.potassium,
        ph: data.data.ph
      };
      setSoilData(soil);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch soil data');
    }
  };

  const handlePredict = async () => {
    if (!soilData) {
      setError('Please get soil data first');
      return;
    }

    try {
      const predictionData = {
        username: "user1",
        userID: "123",
        gmail: "user@example.com",
        zipcode: zipcode,
        crop_name: selectedCrop,
        n: soilData.nitrogen,
        p: soilData.phosphorus,
        k: soilData.potassium,
        ph: soilData.ph
      };

      const response = await fetch('http://localhost:5001/predict-conditions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(predictionData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Prediction failed');
      }

      setPredictionResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prediction failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await handleZipCodeSubmit();
      if (soilData) {
        await handlePredict();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const WeatherCard = ({ icon: Icon, title, value, unit, bgColor }: {
    icon: any;
    title: string;
    value: number;
    unit: string;
    bgColor: string;
  }) => (
    <div className={`${bgColor} rounded-lg p-6 flex flex-col items-center space-y-2`}>
      <Icon className="w-8 h-8 text-gray-700 dark:text-gray-200" />
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 dark:text-white">
        {value.toFixed(1)}{unit}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="space-y-8 max-w-4xl mx-auto pt-12">
        <div className="flex justify-center">
          <Image 
            src="/leaf.png"
            alt="Leaf"
            width={64}
            height={64}
            className="animate-bounce"
          />
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
                <select
                  id="crop"
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 dark:border-gray-600 rounded-lg 
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                    dark:bg-gray-700 dark:text-white transition-colors duration-200
                    hover:border-green-400"
                  required
                >
                  <option value="">Select a crop</option>
                  <optgroup label="Grains">
                    <option value="rice">Rice</option>
                    <option value="maize">Maize</option>
                  </optgroup>
                  <optgroup label="Pulses">
                    <option value="chickpea">Chickpea</option>
                    <option value="kidneybeans">Kidney Beans</option>
                    <option value="pigeonpeas">Pigeon Peas</option>
                    <option value="mothbeans">Moth Beans</option>
                    <option value="mungbean">Mung Bean</option>
                    <option value="blackgram">Black Gram</option>
                    <option value="lentil">Lentil</option>
                  </optgroup>
                  <optgroup label="Fruits">
                    <option value="pomegranate">Pomegranate</option>
                    <option value="banana">Banana</option>
                    <option value="mango">Mango</option>
                    <option value="grapes">Grapes</option>
                    <option value="watermelon">Watermelon</option>
                    <option value="muskmelon">Muskmelon</option>
                    <option value="apple">Apple</option>
                    <option value="orange">Orange</option>
                    <option value="papaya">Papaya</option>
                    <option value="coconut">Coconut</option>
                  </optgroup>
                  <optgroup label="Commercial Crops">
                    <option value="cotton">Cotton</option>
                    <option value="jute">Jute</option>
                    <option value="coffee">Coffee</option>
                  </optgroup>
                </select>
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
              <div className="p-4 bg-amber-50 dark:bg-amber-900/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Nitrogen</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {soilData.nitrogen.toFixed(1)}
                </p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Phosphorus</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {soilData.phosphorus.toFixed(1)}
                </p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Potassium</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {soilData.potassium.toFixed(1)}
                </p>
              </div>
              <div className="p-4 bg-amber-50 dark:bg-amber-900/50 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">pH Level</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {soilData.ph.toFixed(1)}
                </p>
              </div>
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
                icon={Thermometer}
                title="Temperature"
                value={predictionResult.data.predicted_conditions.temperature}
                unit="°C"
                bgColor="bg-orange-50 dark:bg-orange-900/50"
              />
              <WeatherCard
                icon={Droplets}
                title="Humidity"
                value={predictionResult.data.predicted_conditions.humidity}
                unit="%"
                bgColor="bg-blue-50 dark:bg-blue-900/50"
              />
              <WeatherCard
                icon={Cloud}
                title="Rainfall"
                value={predictionResult.data.predicted_conditions.rainfall}
                unit="mm"
                bgColor="bg-purple-50 dark:bg-purple-900/50"
              />
            </div>

            {predictionResult.data.schedule && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
                  Growing Schedule
                </h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {predictionResult.data.schedule}
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