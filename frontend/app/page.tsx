export default function Home() {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Smart Farming Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Get personalized crop recommendations based on your location
          </p>
        </div>
  
        <div className="max-w-xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <form className="space-y-4">
            <div>
              <label htmlFor="crop" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Select Crop
              </label>
              <select
                id="crop"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600"
              >
                <option>Wheat</option>
                <option>Rice</option>
                <option>Corn</option>
                <option>Cotton</option>
              </select>
            </div>
  
            <div>
              <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                ZIP Code
              </label>
              <input
                type="text"
                id="zipcode"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600"
                placeholder="Enter your ZIP code"
              />
            </div>
  
            <button
              type="submit"
              className="w-full bg-green-600 text-white rounded-md py-2 px-4 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Get Recommendations
            </button>
          </form>
        </div>
      </div>
    )
  }