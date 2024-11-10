const FARMER_DATA = {
  name: "John Farmer",
  since: "2024",
  location: "Iowa, USA",
  totalArea: "50 acres",
  profileImage: "👨‍🌾",
  currentCrop: "Corn",
  schedule: [
    "Apply fertilizer to corn fields - May 20",
    "Irrigation maintenance - May 22",
    "Pest control for soybeans - May 25",
    "Soil testing - June 1"
  ]
};

export default function Profile() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Farmer Profile</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
        {/* Farmer Info */}
        <div className="flex items-center space-x-4">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-2xl text-green-600">{FARMER_DATA.profileImage}</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{FARMER_DATA.name}</h2>
            <p className="text-gray-500 dark:text-gray-400">Member since {FARMER_DATA.since}</p>
            <p className="text-gray-500 dark:text-gray-400">{FARMER_DATA.location}</p>
            <p className="text-gray-500 dark:text-gray-400">Total Area: {FARMER_DATA.totalArea}</p>
          </div>
        </div>

        {/* Current Crop */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Current Crop</h3>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
            <p className="text-gray-600 dark:text-gray-300">{FARMER_DATA.currentCrop}</p>
          </div>
        </div>

        {/* Schedule */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Schedule</h3>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded">
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              {FARMER_DATA.schedule.map((task, index) => (
                <li key={index}>{task}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}