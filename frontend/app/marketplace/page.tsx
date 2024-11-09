"use client"

export default function Marketplace() {
    return (
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Marketplace</h1>
          <div className="flex space-x-2">
            <select className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600">
              <option>All Categories</option>
              <option>Seeds</option>
              <option>Equipment</option>
              <option>Fertilizers</option>
            </select>
          </div>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Example marketplace items */}
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Product Name</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Product description goes here</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-green-600 font-medium">$99.99</span>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }