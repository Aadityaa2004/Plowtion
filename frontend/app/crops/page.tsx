'use client';
import { useState } from 'react';

export default function CropGuide() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [selectedWaterNeed, setSelectedWaterNeed] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const crops = [
    {
      name: "Rice",
      season: "Summer",
      waterNeeds: "Very High",
      soilType: "Clay",
      growthPeriod: "90-150 days",
      image: "/rice.jpg",
      description: "Staple food crop requiring standing water. Best grown in lowland areas."
    },
    {
      name: "Maize",
      season: "Spring/Summer",
      waterNeeds: "Moderate",
      soilType: "Well-drained loamy",
      growthPeriod: "70-100 days",
      image: "/maize.jpg",
      description: "Versatile crop suitable for both food and feed. Requires good drainage."
    },
    {
      name: "Chickpea",
      season: "Fall/Winter",
      waterNeeds: "Low to Moderate",
      soilType: "Sandy loam",
      growthPeriod: "95-120 days",
      image: "/chickpea.jpg",
      description: "Drought-tolerant pulse crop, excellent nitrogen fixer."
    },
    {
      name: "Kidney Beans",
      season: "Spring/Summer",
      waterNeeds: "Moderate",
      soilType: "Well-drained loamy",
      growthPeriod: "85-95 days",
      image: "/kidneybeans.jpg",
      description: "Rich in protein, prefers mild temperatures and good drainage."
    },
    {
      name: "Pigeon Peas",
      season: "Kharif",
      waterNeeds: "Low to Moderate",
      soilType: "Well-drained",
      growthPeriod: "120-180 days",
      image: "/pigeonpeas.jpg",
      description: "Drought-resistant pulse crop with deep root system."
    },
    {
      name: "Moth Beans",
      season: "Kharif",
      waterNeeds: "Low",
      soilType: "Sandy loam",
      growthPeriod: "75-90 days",
      image: "/mothbeans.jpg",
      description: "Highly drought-resistant, suitable for arid regions."
    },
    {
      name: "Mung Bean",
      season: "Kharif/Summer",
      waterNeeds: "Moderate",
      soilType: "Well-drained loamy",
      growthPeriod: "60-75 days",
      image: "/mungbean.jpeg",
      description: "Short-duration crop, good for crop rotation."
    },
    {
      name: "Black Gram",
      season: "Kharif",
      waterNeeds: "Moderate",
      soilType: "Well-drained loamy",
      growthPeriod: "90-120 days",
      image: "/blackgram.jpg",
      description: "Important pulse crop, tolerant to various soil conditions."
    },
    {
      name: "Lentil",
      season: "Rabi",
      waterNeeds: "Low to Moderate",
      soilType: "Well-drained loamy",
      growthPeriod: "120-150 days",
      image: "/lentil.jpg",
      description: "Cold-tolerant pulse crop, rich in protein."
    },
    // Fruit Crops
    {
      name: "Pomegranate",
      season: "Perennial",
      waterNeeds: "Moderate",
      soilType: "Well-drained loamy",
      growthPeriod: "6-7 months for fruit",
      image: "/pomegranate.jpeg",
      description: "Drought-resistant fruit tree, suitable for arid regions."
    },
    {
      name: "Banana",
      season: "Perennial",
      waterNeeds: "High",
      soilType: "Rich loamy",
      growthPeriod: "10-12 months",
      image: "/banana.jpg",
      description: "Fast-growing herb, requires good irrigation and nutrition."
    },
    {
      name: "Mango",
      season: "Perennial",
      waterNeeds: "Moderate",
      soilType: "Well-drained loamy",
      growthPeriod: "4-5 months for fruit",
      image: "/mango.jpg",
      description: "King of fruits, requires hot and dry weather for flowering."
    },
    {
      name: "Grapes",
      season: "Perennial",
      waterNeeds: "Moderate",
      soilType: "Well-drained sandy loam",
      growthPeriod: "3-4 months for fruit",
      image: "/grapes.jpg",
      description: "Requires proper training and pruning, good for commercial farming."
    },
    {
      name: "Watermelon",
      season: "Summer",
      waterNeeds: "Moderate to High",
      soilType: "Sandy loam",
      growthPeriod: "70-100 days",
      image: "/watermelon.jpg",
      description: "Heat-loving crop, requires good pollination."
    },
    {
      name: "Muskmelon",
      season: "Summer",
      waterNeeds: "Moderate",
      soilType: "Sandy loam",
      growthPeriod: "65-90 days",
      image: "/muskmelon.jpeg",
      description: "Warm-season crop, sensitive to frost."
    },
    {
      name: "Apple",
      season: "Perennial",
      waterNeeds: "Moderate",
      soilType: "Well-drained loamy",
      growthPeriod: "130-150 days for fruit",
      image: "/apple.jpg",
      description: "Requires cold climate, good for highland areas."
    },
    {
      name: "Orange",
      season: "Perennial",
      waterNeeds: "Moderate",
      soilType: "Well-drained loamy",
      growthPeriod: "7-8 months for fruit",
      image: "/orange.jpg",
      description: "Citrus fruit, sensitive to frost and waterlogging."
    },
    {
      name: "Papaya",
      season: "Perennial",
      waterNeeds: "Moderate to High",
      soilType: "Well-drained sandy loam",
      growthPeriod: "8-10 months",
      image: "/papaya.jpeg",
      description: "Fast-growing fruit tree, requires frost-free climate."
    },
    {
      name: "Coconut",
      season: "Perennial",
      waterNeeds: "High",
      soilType: "Sandy loam",
      growthPeriod: "12 months for fruit",
      image: "/coconut.jpeg",
      description: "Tropical palm, requires humid climate and good rainfall."
    },
    // Commercial Crops
    {
      name: "Cotton",
      season: "Kharif",
      waterNeeds: "Moderate",
      soilType: "Black cotton soil/loamy",
      growthPeriod: "150-180 days",
      image: "/cotton.jpg",
      description: "Important fiber crop, requires warm climate."
    },
    {
      name: "Jute",
      season: "Kharif",
      waterNeeds: "High",
      soilType: "Well-drained loamy",
      growthPeriod: "120-150 days",
      image: "/jute.jpeg",
      description: "Natural fiber crop, requires high rainfall."
    },
    {
      name: "Coffee",
      season: "Perennial",
      waterNeeds: "Moderate to High",
      soilType: "Well-drained loamy",
      growthPeriod: "6-8 months for beans",
      image: "/coffee.jpeg",
      description: "Shade-loving crop, best grown at higher altitudes."
    }
  ];

  // Filter crops based on search query and filters
  const filteredCrops = crops.filter(crop => {
    const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         crop.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeason = !selectedSeason || crop.season.toLowerCase().includes(selectedSeason.toLowerCase());
    
    const matchesWaterNeed = !selectedWaterNeed || crop.waterNeeds.toLowerCase().includes(selectedWaterNeed.toLowerCase());
    
    const matchesType = !selectedType || (
      (selectedType === 'grain' && ['Rice', 'Maize'].includes(crop.name)) ||
      (selectedType === 'pulse' && ['Chickpea', 'Kidney Beans', 'Pigeon Peas', 'Moth Beans', 'Mung Bean', 'Black Gram', 'Lentil'].includes(crop.name)) ||
      (selectedType === 'fruit' && ['Pomegranate', 'Banana', 'Mango', 'Grapes', 'Watermelon', 'Muskmelon', 'Apple', 'Orange', 'Papaya', 'Coconut'].includes(crop.name)) ||
      (selectedType === 'commercial' && ['Cotton', 'Jute', 'Coffee'].includes(crop.name))
    );

    return matchesSearch && matchesSeason && matchesWaterNeed && matchesType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto pt-16">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Crop Guide</h1>
        
        {/* Search and Filter Section */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Crops
              </label>
              <input
                type="text"
                placeholder="Search crops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Season Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Season
              </label>
              <select 
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">All Seasons</option>
                <option value="spring">Spring</option>
                <option value="summer">Summer</option>
                <option value="fall">Fall</option>
                <option value="winter">Winter</option>
                <option value="perennial">Year-round</option>
              </select>
            </div>

            {/* Water Needs Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Water Needs
              </label>
              <select 
                value={selectedWaterNeed}
                onChange={(e) => setSelectedWaterNeed(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">All Water Needs</option>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Crop Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Crop Type
              </label>
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">All Types</option>
                <option value="grain">Grains</option>
                <option value="pulse">Pulses</option>
                <option value="fruit">Fruits</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Results Count */}
        <div className="mb-4 text-gray-600 dark:text-gray-400">
          Showing {filteredCrops.length} of {crops.length} crops
        </div>

        {/* Crops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img 
                  src={crop.image} 
                  alt={crop.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{crop.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{crop.description}</p>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <p><span className="font-medium">Best Season:</span> {crop.season}</p>
                  <p><span className="font-medium">Water Needs:</span> {crop.waterNeeds}</p>
                  <p><span className="font-medium">Soil Type:</span> {crop.soilType}</p>
                  <p><span className="font-medium">Growth Period:</span> {crop.growthPeriod}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
