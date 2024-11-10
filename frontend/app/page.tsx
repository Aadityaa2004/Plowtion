"use client"
import { signIn } from "next-auth/react"
import Image from 'next/image';

export default function Home() {
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
            <button onClick={() => signIn("google")}>Sign In With Google</button>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Get personalized crop recommendations based on your location
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-xl backdrop-blur-sm p-6">
          <form className="space-y-6">
            {/* Crop Selection */}
            <div className="space-y-2">
              <label htmlFor="crop" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Select Crop
              </label>
              <select
                id="crop"
                className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 dark:border-gray-600 rounded-lg 
                  focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                  dark:bg-gray-700 dark:text-white transition-colors duration-200
                  hover:border-green-400"
              >
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
              <div className="relative">
                <input
                  type="text"
                  id="zipcode"
                  placeholder="Enter your ZIP code"
                  className="block w-full pl-10 pr-3 py-3 text-base border-gray-300 dark:border-gray-600 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500
                    dark:bg-gray-700 dark:text-white transition-colors duration-200
                    hover:border-green-400"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="group w-full bg-green-600 text-white rounded-lg py-3 px-4 
                hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <span>Get Recommendations</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
