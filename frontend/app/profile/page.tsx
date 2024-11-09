export default function Profile() {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Farmer Profile</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-2xl text-green-600">👨‍🌾</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">John Farmer</h2>
              <p className="text-gray-500 dark:text-gray-400">Member since 2024</p>
            </div>
          </div>
  
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Farm Details</h3>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Area</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">50 acres</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Active Crops</p>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">3</p>
                </div>
              </div>
            </div>
  
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
              <div className="mt-2 space-y-2">
                {/* Activity items */}
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <p className="text-sm text-gray-900 dark:text-white">Soil analysis requested for Wheat field</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }