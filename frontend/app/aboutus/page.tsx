export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">About FarmNest</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Vision Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🌱</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Our Vision</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Empowering farmers with technology and data-driven insights for sustainable agriculture and improved crop yields.
            </p>
          </div>

          {/* Mission Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300">
              To revolutionize farming practices through innovative solutions and comprehensive agricultural support.
            </p>
          </div>

          {/* Values Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">⭐</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Our Values</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Commitment to sustainability, innovation, and the success of every farmer in our community.
            </p>
          </div>

          {/* Features Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🌿</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Features</h2>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
              <li>Crop recommendations</li>
              <li>Weather forecasting</li>
              <li>Soil analysis</li>
              <li>Expert guidance</li>
            </ul>
          </div>

          {/* Technology Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">💻</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Technology</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Leveraging AI and machine learning to provide accurate predictions and personalized recommendations.
            </p>
          </div>

          {/* Community Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">👥</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Community</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Building a network of farmers, experts, and agricultural enthusiasts for knowledge sharing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
