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
import json
import asyncio
import openai  # Import openai for Perplexity API interaction

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS

# MongoDB configuration
MONGO_URI = os.getenv('MONGO_URI', 'mongodb+srv://vidhupv:hackUmass12@cluster0.xwni6.mongodb.net')
client = MongoClient(MONGO_URI)
db = client["farmnest"]
users_collection = db["users"]
user_conditions_collection = db["user_conditions"]  # Collection for user data

try:
    zip_data_path = os.path.join(os.path.dirname(__file__), 'dataset', 'zip-code.csv')
    zip_df = pd.read_csv(zip_data_path)
except Exception as e:
    print(f"Error loading ZIP code data: {str(e)}")
    zip_df = None

# MODEL_PATH = '/Users/aaditya/Desktop/seed/backend/models/Trained_Model.pkl'

# Global variable for the model
loaded_model = None

def load_model():
    """Load the trained model from the specified path"""
    global loaded_model
    try:
        MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'Trained_Model.pkl')
        if os.path.exists(MODEL_PATH):
            loaded_model = joblib.load(MODEL_PATH)
            print("Model loaded successfully")
            return True
        else:
            print(f"Model file not found at {MODEL_PATH}")
            return False
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        return False

# Load the model when the application starts
if not load_model():
    print("Warning: Model failed to load. Predictions will not be available.")

@app.route('/predict-conditions', methods=['POST'])
def predict_conditions():
    try:
        if loaded_model is None:
            return jsonify({"error": "Model not loaded", "status": "error"}), 500

        # Get input data
        data = request.json
        username = data.get("username")
        userID = data.get("userID")
        gmail = data.get("gmail")
        zipcode = data.get('zipcode')
        crop_name = data.get('crop_name').lower() if data.get('crop_name') else None

        if not crop_name:
            return jsonify({
                "error": "Crop name is required",
                "status": "error"
            }), 400

        # Convert soil parameters to float
        try:
            n = float(data.get('n'))
            p = float(data.get('p'))
            k = float(data.get('k'))
            ph = float(data.get('ph'))
        except (TypeError, ValueError) as e:
            return jsonify({
                "error": f"Invalid input values for soil parameters: {str(e)}",
                "status": "error"
            }), 400

        # Create initial dataframe with soil parameters
        input_data = {
            'N': [n],
            'P': [p],
            'K': [k],
            'ph': [ph]
        }

        # Define expected columns in the correct order
        expected_columns = [
            'N', 'P', 'K', 'ph', 
            'label_apple', 'label_banana', 'label_blackgram',
            'label_chickpea', 'label_coconut', 'label_coffee', 'label_cotton',
            'label_grapes', 'label_jute', 'label_kidneybeans', 'label_lentil',
            'label_maize', 'label_mango', 'label_mothbeans', 'label_mungbean',
            'label_muskmelon', 'label_orange', 'label_papaya', 'label_pigeonpeas',
            'label_pomegranate', 'label_rice', 'label_watermelon'
        ]

        # Add crop label columns with 0s
        for col in expected_columns:
            if col not in input_data:  # Skip N, P, K, ph which are already added
                if col == f'label_{crop_name}':
                    input_data[col] = [1]  # Set selected crop to 1
                else:
                    input_data[col] = [0]  # Set all other crops to 0

        # Create DataFrame with all features and ensure correct column order
        input_df = pd.DataFrame(input_data)
        input_df = input_df[expected_columns]  # Reorder columns to match expected order

        # Get predictions from the model
        try:
            predictions = loaded_model.predict(input_df)[0]
            # Assuming the model returns [temperature, humidity, rainfall]
            temperature, humidity, rainfall = predictions
        except Exception as e:
            return jsonify({
                "error": f"Prediction error: {str(e)}",
                "status": "error",
                "input_shape": input_df.shape,
                "features_used": list(input_df.columns)
            }), 500

        # Get the farming schedule from Perplexity API using predicted values
        schedule = get_farming_schedule(zipcode, temperature, humidity, rainfall, crop_name)

        # Collect all data to store in MongoDB
        user_condition_record = {
            "username": username,
            "userID": userID,
            "gmail": gmail,
            "zipcode": zipcode,
            "crop_name": crop_name,
            "soil_conditions": {
                "nitrogen": n,
                "phosphorus": p,
                "potassium": k,
                "ph": ph
            },
            "predicted_conditions": {
                "temperature": float(temperature),
                "humidity": float(humidity),
                "rainfall": float(rainfall)
            },
            "schedule": schedule,
            "timestamp": datetime.now()
        }

        # Insert into MongoDB
        user_conditions_collection.insert_one(user_condition_record)

        # Prepare response
        result = {
            "username": username,
            "userID": userID,
            "gmail": gmail,
            "soil_conditions": {
                "nitrogen": n,
                "phosphorus": p,
                "potassium": k,
                "ph": ph
            },
            "predicted_conditions": {
                "temperature": float(temperature),
                "humidity": float(humidity),
                "rainfall": float(rainfall)
            },
            "schedule": schedule
        }

        return jsonify({
            "data": result,
            "message": "Successfully predicted growing conditions",
            "status": "success"
        }), 200

    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

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
        users = list(users_collection.find())
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

@app.route('/delete-user/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
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
    try:
        if zip_df is None:
            return jsonify({
                "error": "ZIP code data not loaded",
                "status": "error"
            }), 500
        zip_int = int(zipcode)
        soil_data = zip_df[zip_df['ZipCode'] == zip_int]
        if soil_data.empty:
            return jsonify({
                "message": f"No data found for ZIP code {zipcode}",
                "status": "not_found"
            }), 404
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

def get_farming_schedule(zipcode, temperature, humidity, rainfall, crop):
    try:
        PERPLEXITY_API_KEY = os.getenv('PERPLEXITY_API_KEY')
        if not PERPLEXITY_API_KEY:
            print("Perplexity API key not set")
            return None

        url = "https://api.perplexity.ai/chat/completions"
        headers = {
            "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
            "Content-Type": "application/json"
        }

        # Create the prompt
        prompt = (
            f"I live in zipcode {zipcode}. I am waiting for a {temperature}°C temperature, "
            f"{humidity}% relative humidity, and {rainfall} mm rainfall. When can I expect conditions "
            f"closest to this and create a step-by-step schedule for growing {crop} to be followed from that point on."
        )

        payload = {
            "model": "llama-3.1-sonar-small-128k-online",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.2,
            "max_tokens": 500
        }

        # Make the API request
        response = requests.post(url, json=payload, headers=headers)

        # Debug: Print the status code and response
        print(f"API Response Status Code: {response.status_code}")
        print("API Response JSON:", response.json())

        response.raise_for_status()

        # Extract the generated text from the response
        response_data = response.json()
        schedule = response_data.get('choices', [{}])[0].get('message', {}).get('content', '')

        if not schedule:
            print("No schedule found in the response.")

        return schedule

    except Exception as e:
        print(f"Error getting farming schedule: {str(e)}")
        return None


@app.route('/get-user-conditions', methods=['GET'])
def get_user_conditions():
    """Get all stored user conditions"""
    try:
        records = list(user_conditions_collection.find().sort("timestamp", -1))
        for record in records:
            record['_id'] = str(record['_id'])
            record['timestamp'] = record['timestamp'].isoformat()
        return jsonify({
            "user_conditions": records,
            "count": len(records),
            "status": "success"
        }), 200
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500
    
@app.route('/api.perplexity.ai/chat/completions', methods=['POST'])
def perp_api():
    try:
        PERPLEXITY_API_KEY = os.getenv('PERPLEXITY_API_KEY')
        if not PERPLEXITY_API_KEY:
            return jsonify({"error": "Perplexity API key not set", "status": "error"}), 500

        headers = {
            "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
            "Content-Type": "application/json"
        }

        response = openai.ChatCompletion.create(
            model="llama-3.1-sonar-small-128k-online",
            messages=[
                {
                    "role": "system",
                    "content": "Be precise and concise."
                },
                {
                    "role": "user",
                    "content": "How many stars are there in our galaxy?"
                }
            ],
            max_tokens=100,
            temperature=0.2,
            top_p=0.9,
            search_domain_filter=["perplexity.ai"],
            return_images=False,
            return_related_questions=False,
            search_recency_filter="month",
            top_k=0,
            stream=False,
            presence_penalty=0,
            frequency_penalty=1,
            headers=headers
        )

        return jsonify({
            "response": response,
            "status": "success"
        }), 200

    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

@app.route('/get-user-condition/<condition_id>', methods=['GET'])
def get_user_condition(condition_id):
    """Get a specific user condition by ID"""
    try:
        record = user_conditions_collection.find_one({"_id": ObjectId(condition_id)})
        if not record:
            return jsonify({
                "message": f"Record {condition_id} not found",
                "status": "not_found"
            }), 404
        record['_id'] = str(record['_id'])
        record['timestamp'] = record['timestamp'].isoformat()
        return jsonify({
            "user_condition": record,
            "status": "success"
        }), 200
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

@app.route('/api_print', methods=['GET'])
def api_print():
    try:
        PERPLEXITY_API_KEY = os.getenv('PERPLEXITY_API_KEY')
        if not PERPLEXITY_API_KEY:
            return jsonify({"error": "Perplexity API key not set", "status": "error"}), 500
        return jsonify({"message": "API is running", "PERPLEXITY_API_KEY": PERPLEXITY_API_KEY}), 200
    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

@app.route('/check-perplexity', methods=['POST'])
def check_perplexity():
    """Endpoint to check if Perplexity API is working"""
    try:
        # Retrieve the Perplexity API key from environment variables
        PERPLEXITY_API_KEY = os.getenv('PERPLEXITY_API_KEY')
        if not PERPLEXITY_API_KEY:
            return jsonify({"error": "Perplexity API key not set", "status": "error"}), 500

        # Set up the headers for the request
        headers = {
            "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
            "Content-Type": "application/json"
        }

        # Get the JSON payload from the incoming POST request
        incoming_data = request.get_json()

        # Define the JSON payload for the request to Perplexity API
        data = {
            "model": incoming_data.get("model", "llama-3.1-sonar-small-128k-online"),
            "messages": incoming_data.get("messages", [
                {
                    "role": "system",
                    "content": "Be precise and concise."
                },
                {
                    "role": "user",
                    "content": "How many stars are there in our galaxy?"
                }
            ]),
            "max_tokens": incoming_data.get("max_tokens", 100),
            "temperature": incoming_data.get("temperature", 0.2),
        }

        # Make the request to the Perplexity API
        response = requests.post("https://api.perplexity.ai/chat/completions", headers=headers, json=data)

        # Check for a successful response
        if response.status_code == 200:
            response_data = response.json()
            content = response_data.get("choices", [{}])[0].get("message", {}).get("content", "")
            citations = response_data.get("citations", [])

            return jsonify({
                "message": "Perplexity API is working",
                "response": content,
                "citations": citations,
                "status": "success"
            }), 200
        else:
            # Return the error message if the API call was not successful
            return jsonify({
                "message": "Perplexity API is not working",
                "status": "error",
                "error_details": response.json()  # Include any error details from Perplexity
            }), response.status_code

    except Exception as e:
        # Catch any other exceptions and return an error message
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

@app.route('/test-perplexity', methods=['POST'])
def test_perplexity():
    try:
        PERPLEXITY_API_KEY = os.getenv('PERPLEXITY_API_KEY')
        if not PERPLEXITY_API_KEY:
            return jsonify({"error": "Perplexity API key not set", "status": "error"}), 500

        url = "https://api.perplexity.ai/chat/completions"
        headers = {
            "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "llama-3.1-sonar-small-128k-online",
            "messages": [
                {"role": "system", "content": "Be precise and concise."},
                {"role": "user", "content": "How many stars are there in our galaxy?"}
            ],
            "max_tokens": 100,
            "temperature": 0.2,
            "top_p": 0.9,
            "search_domain_filter": ["perplexity.ai"],
            "return_images": False,
            "return_related_questions": False,
            "search_recency_filter": "month",
            "top_k": 0,
            "stream": False,
            "presence_penalty": 0,
            "frequency_penalty": 1
        }

        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()

        return jsonify({
            "response": response.json(),
            "status": "success"
        }), 200

    except Exception as e:
        return jsonify({
            "error": str(e),
            "status": "error"
        }), 500

def get_farming_schedule(zipcode, temperature, humidity, rainfall, crop_name):
    try:
        PERPLEXITY_API_KEY = os.getenv('PERPLEXITY_API_KEY')
        if not PERPLEXITY_API_KEY:
            return None

        prompt = f"I live in zipcode {zipcode}. I am waiting for a {temperature}°C temperature, {humidity}% relative humidity, and {rainfall} mm rainfall. When can I expect conditions closest to this and create a step-by-step schedule for growing {crop_name} to be followed from that point on."

        headers = {
            "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": "llama-3.1-sonar-small-128k-online",
            "messages": [
                {"role": "system", "content": "You are a farming expert. Provide concise and practical advice."},
                {"role": "user", "content": prompt}
            ],
            "max_tokens": 500,
            "temperature": 0.2
        }

        response = requests.post(
            "https://api.perplexity.ai/chat/completions",
            headers=headers,
            json=payload
        )

        if response.status_code == 200:
            content = response.json()['choices'][0]['message']['content']
            return content
        else:
            print(f"Perplexity API error: {response.text}")
            return None

    except Exception as e:
        print(f"Error getting farming schedule: {str(e)}")
        return None
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)