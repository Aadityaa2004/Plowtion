from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv
import joblib
import numpy as np
from datetime import datetime
import requests
import pandas as pd
from bson.objectid import ObjectId

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS

# MongoDB configuration
MONGO_URI = os.getenv('MONGO_URI', 'mongodb+srv://vidhupv:hackUmass12@cluster0.xwni6.mongodb.net')
client = MongoClient(MONGO_URI)
db = client["farmnest"]
users_collection = db["users"]
predictions_collection = db["predictions"]

# Load model
try:
    model_data = joblib.load('./model/crop_model.joblib')
    feature_scaler = model_data['feature_scaler']
    target_scaler = model_data['target_scaler']
    model = model_data['model']
except Exception as e:
    print(f"Error loading model: {str(e)}")
    model_data = None
    feature_scaler = None
    target_scaler = None
    model = None

# Define crop conditions (you can expand this)
CROP_CONDITIONS = {
    'rice': {
        'temp_range': (20, 35),
        'humidity_range': (60, 80),
        'rainfall_range': (100, 200)
    },
    'wheat': {
        'temp_range': (15, 25),
        'humidity_range': (50, 70),
        'rainfall_range': (75, 150)
    }
}

@app.route('/test', methods=['GET'])
def test():
    return jsonify({"status": "API is running"}), 200

@app.route('/push-user', methods=['POST'])
def push_user():
    try:
        data = request.json
        result = users_collection.insert_one(data)
        return jsonify({
            "message": "User added successfully",
            "user_id": str(result.inserted_id),
            "status": "success"
        }), 200
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

@app.route('/get-users', methods=['GET'])
def get_users():
    try:
        # Fetch all users from collection
        users = list(users_collection.find())
        
        # Convert ObjectId to string for JSON serialization
        for user in users:
            user['_id'] = str(user['_id'])
            
        return jsonify({
            "users": users,
            "count": len(users),
            "status": "success"
        }), 200
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

# Fix for delete-user endpoint
@app.route('/delete-user/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        # Convert string ID to ObjectId
        object_id = ObjectId(user_id)
        
        result = users_collection.delete_one({"_id": object_id})
        if result.deleted_count == 1:
            return jsonify({
                "message": f"User {user_id} deleted successfully",
                "status": "success"
            }), 200
        else:
            return jsonify({
                "message": f"User {user_id} not found", 
                "status": "not_found"
            }), 404
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

@app.route('/predict-crop', methods=['POST'])
def predict_crop():
    """Predict crop conditions and generate schedule"""
    try:
        if not model_data:
            return jsonify({
                "error": "Model not loaded",
                "status": "error"
            }), 500
            
        data = request.json
        crop = data.get('crop', '').lower()
        zipcode = data.get('zipcode')
        soil_data = data.get('soil_data', {
            'N': 90,
            'P': 40,
            'K': 35,
            'ph': 6.5
        })
        
        # Get weather data
        weather_data = get_weather_data(zipcode)
        
        # Prepare input for model
        input_features = np.array([[
            soil_data['N'],
            soil_data['P'],
            soil_data['K'],
            soil_data['ph'],
            weather_data['temperature'],
            weather_data['humidity'],
            weather_data['rainfall']
        ]])
        
        # Scale features
        input_scaled = feature_scaler.transform(input_features)
        
        # Make prediction
        prediction = model_data.predict(input_scaled)
        
        # Inverse transform prediction if needed
        if target_scaler:
            prediction = target_scaler.inverse_transform(prediction)
        
        # Generate schedule
        schedule = generate_schedule(crop, weather_data)
        
        # Store prediction in MongoDB
        prediction_doc = {
            "crop": crop,
            "zipcode": zipcode,
            "soil_data": soil_data,
            "weather_data": weather_data,
            "prediction": prediction.tolist()[0],
            "schedule": schedule,
            "timestamp": datetime.utcnow()
        }
        predictions_collection.insert_one(prediction_doc)
        
        return jsonify({
            "status": "success",
            "crop": crop,
            "location": zipcode,
            "weather": weather_data,
            "soil_data": soil_data,
            "prediction": prediction.tolist()[0],
            "schedule": schedule,
            "timestamp": datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500


def get_weather_data(zipcode):
    """Get weather data from external API or use dummy data"""
    WEATHER_API_KEY = os.getenv('WEATHER_API_KEY')
    
    try:
        if WEATHER_API_KEY:
            weather_url = f"https://api.weatherapi.com/v1/current.json?key={WEATHER_API_KEY}&q={zipcode}"
            response = requests.get(weather_url)
            data = response.json()
            
            return {
                "temperature": data['current']['temp_c'],
                "humidity": data['current']['humidity'],
                "rainfall": data['current']['precip_mm']
            }
        else:
            # Return dummy data if no API key
            return {
                "temperature": 25,
                "humidity": 65,
                "rainfall": 150
            }
    except Exception as e:
        print(f"Weather API error: {str(e)}")
        return {
            "temperature": 25,
            "humidity": 65,
            "rainfall": 150
        }

def generate_schedule(crop, conditions):
    """Generate farming schedule based on conditions"""
    current_date = datetime.now()
    crop_info = CROP_CONDITIONS.get(crop.lower(), CROP_CONDITIONS['rice'])
    
    temp_suitable = crop_info['temp_range'][0] <= conditions['temperature'] <= crop_info['temp_range'][1]
    humidity_suitable = crop_info['humidity_range'][0] <= conditions['humidity'] <= crop_info['humidity_range'][1]
    rainfall_suitable = crop_info['rainfall_range'][0] <= conditions['rainfall'] <= crop_info['rainfall_range'][1]
    
    schedule = []
    
    if all([temp_suitable, humidity_suitable, rainfall_suitable]):
        schedule = [
            {
                "phase": "Soil Preparation",
                "start_date": current_date.strftime('%Y-%m-%d'),
                "duration": "7 days",
                "tasks": [
                    "Soil testing",
                    "Field preparation",
                    "Fertilizer application"
                ]
            },
            {
                "phase": "Sowing",
                "start_date": (current_date + pd.Timedelta(days=7)).strftime('%Y-%m-%d'),
                "duration": "3-5 days",
                "tasks": [
                    "Seed preparation",
                    "Sowing process",
                    "Initial irrigation"
                ]
            },
            {
                "phase": "Growth Monitoring",
                "start_date": (current_date + pd.Timedelta(days=12)).strftime('%Y-%m-%d'),
                "duration": "Ongoing",
                "tasks": [
                    "Regular irrigation",
                    "Pest monitoring",
                    "Fertilizer management"
                ]
            }
        ]
    else:
        schedule = [{
            "phase": "Warning",
            "message": "Current conditions not optimal for sowing",
            "recommended_ranges": {
                "temperature": f"{crop_info['temp_range'][0]}-{crop_info['temp_range'][1]}°C",
                "humidity": f"{crop_info['humidity_range'][0]}-{crop_info['humidity_range'][1]}%",
                "rainfall": f"{crop_info['rainfall_range'][0]}-{crop_info['rainfall_range'][1]}mm"
            }
        }]
    
    return schedule

@app.route('/update-soil-data', methods=['POST'])
def update_soil_data():
    """Update soil data for a user"""
    try:
        data = request.json
        user_id = data.get('user_id')
        soil_data = {
            'nitrogen': data.get('nitrogen'),
            'phosphorus': data.get('phosphorus'),
            'potassium': data.get('potassium'),
            'ph': data.get('ph'),
            'updated_at': datetime.utcnow()
        }
        
        result = users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"soil_data": soil_data}}
        )
        
        if result.modified_count == 1:
            return jsonify({
                "message": "Soil data updated successfully",
                "status": "success"
            }), 200
        else:
            return jsonify({
                "message": "User not found",
                "status": "error"
            }), 404
            
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

@app.route('/get-predictions', methods=['GET'])
def get_predictions():
    """Get historical predictions"""
    try:
        predictions = list(predictions_collection.find({}, {'_id': 0}).sort('timestamp', -1).limit(10))
        return jsonify({
            "predictions": predictions,
            "count": len(predictions),
            "status": "success"
        }), 200
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)