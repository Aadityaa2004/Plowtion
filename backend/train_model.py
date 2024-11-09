import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
import os

def train_and_save_model():
    # Create model directory if it doesn't exist
    if not os.path.exists('./model'):
        os.makedirs('./model')
    
    # Load the Kaggle dataset
    data = pd.read_csv('/Users/aaditya/dev/Main/seed/backend/Crop_recommendation.csv')
    
    # Prepare features and target
    X = data[['month', 'day', 'latitude', 'longitude', 'elevation']]
    y = data[['temperature', 'humidity', 'rainfall']]
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale the features
    feature_scaler = StandardScaler()
    X_train_scaled = feature_scaler.fit_transform(X_train)
    X_test_scaled = feature_scaler.transform(X_test)
    
    # Scale the targets
    target_scaler = StandardScaler()
    y_train_scaled = target_scaler.fit_transform(y_train)
    y_test_scaled = target_scaler.transform(y_test)
    
    # Train the model
    model = RandomForestRegressor(
        n_estimators=200,
        max_depth=20,
        min_samples_split=5,
        random_state=42
    )
    model.fit(X_train_scaled, y_train_scaled)
    
    # Save the model and scalers
    model_data = {
        'model': model,
        'feature_scaler': feature_scaler,
        'target_scaler': target_scaler
    }
    joblib.dump(model_data, 'model/crop_model.joblib')
    
    # Print model performance
    train_score = model.score(X_train_scaled, y_train_scaled)
    test_score = model.score(X_test_scaled, y_test_scaled)
    print(f"Training Score: {train_score:.4f}")
    print(f"Testing Score: {test_score:.4f}")
    print(f"Model saved at: {os.path.abspath('./model/crop_model.joblib')}")

if __name__ == "__main__":
    train_and_save_model()