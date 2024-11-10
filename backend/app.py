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
from urllib.parse import urlparse

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

try:
    zip_data_path = os.path.join(os.path.dirname(__file__), 'dataset', 'zip-code.csv')
    zip_df = pd.read_csv(zip_data_path)
except Exception as e:
    print(f"Error loading ZIP code data: {str(e)}")
    zip_df = None

MODEL_URL = "https://drive.google.com/file/d/16sNqWf_wZHrtrfFnMaIHSROOUOvUqOPj/view"
MODEL_DIR = os.path.join(os.path.dirname(__file__), 'model')
MODEL_PATH = os.path.join(MODEL_DIR, 'model.pkl')

def ensure_model_directory():
    """Ensure the model directory exists with proper permissions"""
    try:
        if not os.path.exists(MODEL_DIR):
            os.makedirs(MODEL_DIR, mode=0o755, exist_ok=True)
        return True
    except Exception as e:
        print(f"Error creating model directory: {str(e)}")
        return False

def download_from_drive(url):
    """Download the model file from Google Drive"""
    try:
        # Ensure model directory exists
        if not ensure_model_directory():
            return False

        # Extract file ID from Drive URL
        parsed_url = urlparse(url)
        file_id = parsed_url.path.split('/')[-2]
        
        # Use the direct download URL
        download_url = f"https://drive.google.com/uc?id={file_id}&export=download"
        
        print("Downloading model file...")
        response = requests.get(download_url)
        
        if response.status_code == 200:
            with open(MODEL_PATH, 'wb') as f:
                f.write(response.content)
            # Set proper file permissions
            os.chmod(MODEL_PATH, 0o644)
            print("Model downloaded successfully!")
            return True
        else:
            print(f"Failed to download model: Status code {response.status_code}")
            return False
    except Exception as e:
        print(f"Error downloading model: {str(e)}")
        return False

# Update the model loading logic
loaded_model = None

# Ensure model directory exists
ensure_model_directory()

# Try to load existing model first
if os.path.exists(MODEL_PATH):
    try:
        loaded_model = joblib.load(MODEL_PATH)
        print("Model loaded from existing file!")
    except Exception as e:
        print(f"Error loading existing model: {str(e)}")
        # If loading fails, try to re-download
        if download_from_drive(MODEL_URL):
            try:
                loaded_model = joblib.load(MODEL_PATH)
                print("Model re-downloaded and loaded successfully!")
            except Exception as e:
                print(f"Error loading re-downloaded model: {str(e)}")
else:
    # Download and load model if it doesn't exist
    if download_from_drive(MODEL_URL):
        try:
            loaded_model = joblib.load(MODEL_PATH)
            print("Model downloaded and loaded successfully!")
        except Exception as e:
            print(f"Error loading downloaded model: {str(e)}")

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

@app.route('/get-first-ten', methods=['GET'])
def get_first_ten():
    """Return the first 10 rows of the ZIP code soil data"""
    try:
        if zip_df is None:
            return jsonify({
                "error": "ZIP code data not loaded",
                "status": "error"
            }), 500
            
        first_ten = zip_df.head(10).to_dict('records')
        return jsonify({
            "data": first_ten,
            "count": len(first_ten),
            "status": "success"
        }), 200
        
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500
    
@app.route('/get-soil-by-zip/<zipcode>', methods=['GET'])
def get_soil_by_zip(zipcode):
    """Return soil data for a specific ZIP code"""
    try:
        if zip_df is None:
            return jsonify({
                "error": "ZIP code data not loaded",
                "status": "error"
            }), 500
            
        # Convert zipcode to integer for matching
        zip_int = int(zipcode)
        
        # Find the matching row
        soil_data = zip_df[zip_df['ZipCode'] == zip_int]
        
        if soil_data.empty:
            return jsonify({
                "message": f"No data found for ZIP code {zipcode}",
                "status": "not_found"
            }), 404
            
        # Extract the soil data
        result = {
            "zipcode": int(soil_data['ZipCode'].iloc[0]),
            "nitrogen": float(soil_data['Nitrogen (N)'].iloc[0]),
            "phosphorus": float(soil_data['Phosphorus (P)'].iloc[0]),
            "potassium": float(soil_data['Potassium (K)'].iloc[0]),
            "ph": float(soil_data['pH Level'].iloc[0])
        }
        
        return jsonify({
            "data": result,
            "status": "success"
        }), 200
        
    except ValueError:
        return jsonify({
            "error": "Invalid ZIP code format",
            "status": "error"
        }), 400
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

@app.route('/predict-conditions', methods=['POST'])
def predict_conditions():
    """
    Predict temperature, humidity, and rainfall based on soil conditions
    Expected input format:
    {
        "N": float,
        "P": float,
        "K": float,
        "ph": float,
        "label_coffee": int (0 or 1)
        // other crop labels are optional and will default to 0
    }
    """
    try:
        if loaded_model is None:
            return jsonify({
                "error": "Model not loaded",
                "status": "error"
            }), 500

        data = request.json
        
        # Define all columns in the exact order used during training
        model_columns = [
            "N", "P", "K", "ph",
            "label_apple", "label_banana", "label_blackgram", "label_chickpea", 
            "label_coconut", "label_coffee", "label_cotton", "label_grapes", 
            "label_jute", "label_kidneybeans", "label_lentil", "label_maize", 
            "label_mango", "label_mothbeans", "label_mungbean", "label_muskmelon", 
            "label_orange", "label_papaya", "label_pigeonpeas", "label_pomegranate", 
            "label_rice", "label_watermelon"
        ]
        
        # Required core columns
        required_columns = ["N", "P", "K", "ph"]
        
        # Create initial dictionary with required fields
        input_dict = {}
        
        # Process required columns
        for col in required_columns:
            value = data.get(col)
            if value is None:
                raise ValueError(f"Missing required field: {col}")
            input_dict[col] = float(value)
        
        # Process all label columns - default to 0 if not provided
        for col in model_columns:
            if col not in required_columns:  # Skip the columns we already processed
                input_dict[col] = int(data.get(col, 0))
        
        # Create DataFrame with single row and correct column order
        input_data = pd.DataFrame([input_dict])[model_columns]
        
        # Make prediction
        prediction = loaded_model.predict(input_data)
        
        # Extract predictions (assuming model returns [temperature, humidity, rainfall])
        temperature, humidity, rainfall = prediction[0]
        
        # Create response
        result = {
            "temperature": float(temperature),
            "humidity": float(humidity),
            "rainfall": float(rainfall),
            "input_conditions": data
        }
        
        # Store prediction in database
        prediction_record = {
            "timestamp": datetime.utcnow(),
            "input_conditions": data,
            "predictions": {
                "temperature": float(temperature),
                "humidity": float(humidity),
                "rainfall": float(rainfall)
            }
        }
        predictions_collection.insert_one(prediction_record)
        
        return jsonify({
            "data": result,
            "status": "success"
        }), 200
        
    except ValueError as ve:
        return jsonify({
            "error": "Invalid input format. Please check your input values.",
            "details": str(ve),
            "status": "error"
        }), 400
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500
    
@app.route('/get-predictions', methods=['GET'])
def get_predictions():
    """Get all stored predictions"""
    try:
        # Fetch all predictions from collection
        predictions = list(predictions_collection.find().sort("timestamp", -1))
        
        # Convert ObjectId and datetime to string for JSON serialization
        for pred in predictions:
            pred['_id'] = str(pred['_id'])
            pred['timestamp'] = pred['timestamp'].isoformat()
            
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
    
@app.route('/get-prediction/<prediction_id>', methods=['GET'])
def get_prediction(prediction_id):
    """Get a specific prediction by ID"""
    try:
        prediction = predictions_collection.find_one({"_id": ObjectId(prediction_id)})
        
        if not prediction:
            return jsonify({
                "message": f"Prediction {prediction_id} not found",
                "status": "not_found"
            }), 404
            
        # Convert ObjectId and datetime to string for JSON serialization
        prediction['_id'] = str(prediction['_id'])
        prediction['timestamp'] = prediction['timestamp'].isoformat()
        
        return jsonify({
            "prediction": prediction,
            "status": "success"
        }), 200
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)