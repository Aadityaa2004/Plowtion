export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="space-y-8 max-w-2xl mx-auto pt-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
            Smart Farming Assistant
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
                <option>Wheat</option>
                <option>Rice</option>
                <option>Corn</option>
                <option>Cotton</option>
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

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {['Smart Analysis', 'Location Based', 'Real-time Data'].map((feature) => (
            <div 
              key={feature}
              className="bg-white/60 dark:bg-gray-800/60 p-6 rounded-lg text-center backdrop-blur-sm
                hover:shadow-lg transition-shadow duration-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature === 'Smart Analysis' && 'AI-powered crop recommendations'}
                {feature === 'Location Based' && 'Tailored to your specific region'}
                {feature === 'Real-time Data' && 'Up-to-date farming insights'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



