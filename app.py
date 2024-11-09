from flask import Flask, request, jsonify
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# MongoDB configuration
MONGO_URI = os.getenv('MONGO_URI')
client = MongoClient(MONGO_URI)
db = client["mydatabase"]
collection = db["users"]

@app.route('/test', methods=['GET'])
def test():
    return jsonify({"status": "API is running"}), 200

@app.route('/push-user', methods=['POST'])
def push_user():
    try:
        data = request.json
        result = collection.insert_one(data)
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

@app.route('/delete-user/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        result = collection.delete_one({"_id": user_id})
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)