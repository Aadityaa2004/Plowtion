"use client"
import { useState } from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { apiService } from '@/services/api';



interface PredictionResult {
  temperature: number;
  humidity: number;
  rainfall: number;
  input_conditions: {
    N: number;
    P: number;
    K: number;
    ph: number;
  };
}

export default function Home() {
  const [zipcode, setZipcode] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First get soil data from ZIP code
      const soilResponse = await fetch(`http://localhost:5001/get-soil-by-zip/${zipcode}`);
      const soilData = await soilResponse.json();

      if (!soilResponse.ok) {
        throw new Error(soilData.error || 'Failed to fetch soil data');
      }

      // Prepare prediction request data
      const predictionData = {
        N: soilData.data.nitrogen,
        P: soilData.data.phosphorus,
        K: soilData.data.potassium,
        ph: soilData.data.ph,
        [`label_${selectedCrop.toLowerCase()}`]: 1
      };

      // Make prediction request
      const predictionResponse = await fetch('http://localhost:5001/predict-conditions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(predictionData),
      });

      const predictionResult = await predictionResponse.json();

      if (!predictionResponse.ok) {
        throw new Error(predictionResult.error || 'Failed to get prediction');
      }

      setPredictionResult(predictionResult.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="space-y-8 max-w-2xl mx-auto pt-12">
        {/* Hero Section */}
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
          <button onClick={() => signIn("google")}>Sign In With Google</button>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Get personalized crop recommendations based on your location
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-xl backdrop-blur-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Crop Selection */}
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

            {/* ZIP Code Input */}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group w-full bg-green-600 text-white rounded-lg py-3 px-4 
                hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                transition-all duration-200 flex items-center justify-center space-x-2
                disabled:bg-green-400 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'Getting Recommendations...' : 'Get Recommendations'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/50 text-red-700 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Results Section */}
      {predictionResult && (
        <div className="mt-8 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-xl backdrop-blur-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Predicted Conditions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Temperature</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {predictionResult.temperature.toFixed(1)}°C
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/50 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Humidity</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {predictionResult.humidity.toFixed(1)}%
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/50 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Rainfall</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {predictionResult.rainfall.toFixed(1)} mm
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
