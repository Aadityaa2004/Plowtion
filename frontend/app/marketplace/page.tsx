import Image from 'next/image'

const products = [
  {
    id: 1,
    name: "Organic Seeds Pack",
    description: "Premium quality organic vegetable seeds collection",
    price: 29.99,
    category: "Seeds",
    image: "/api/placeholder/400/300"
  },
  {
    id: 2,
    name: "Garden Tool Set",
    description: "Professional grade gardening tools kit",
    price: 89.99,
    category: "Equipment",
    image: "/api/placeholder/400/300"
  },
  {
    id: 3,
    name: "Organic Fertilizer",
    description: "Natural and eco-friendly plant nutrients",
    price: 19.99,
    category: "Fertilizers",
    image: "/api/placeholder/400/300"
  },
  {
    id: 4,
    name: "Herb Seeds Bundle",
    description: "Collection of essential culinary herbs",
    price: 24.99,
    category: "Seeds",
    image: "/api/placeholder/400/300"
  },
  {
    id: 5,
    name: "Watering System",
    description: "Automated drip irrigation kit",
    price: 149.99,
    category: "Equipment",
    image: "/api/placeholder/400/300"
  },
  {
    id: 6,
    name: "Compost Booster",
    description: "Accelerated composting formula",
    price: 34.99,
    category: "Fertilizers",
    image: "/api/placeholder/400/300"
  }
]

export default function Marketplace() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
              Marketplace
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Discover premium gardening supplies
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <select 
              className="px-4 py-2 rounded-full border-2 border-green-500 bg-white dark:bg-gray-800 
                         text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 
                         focus:ring-green-400 transition-all cursor-pointer"
              defaultValue="All Categories"
            >
              <option>All Categories</option>
              <option>Seeds</option>
              <option>Equipment</option>
              <option>Fertilizers</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden 
                         transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 
                              group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {product.name}
                  </h3>
                  <span className="text-green-600 dark:text-green-400 font-bold">
                    ${product.price}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {product.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900 text-green-800 
                                 dark:text-green-200 rounded-full">
                    {product.category}
                  </span>
                  <button 
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full 
                               transform transition-all duration-300 hover:scale-105 focus:outline-none 
                               focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}