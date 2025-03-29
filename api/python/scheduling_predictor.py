import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
import joblib
import os

# Model file path
MODEL_PATH = 'models/meeting_predictor.joblib'

# Features used for prediction
FEATURES = ['dayOfWeek', 'hourOfDay', 'duration', 'participantCount', 'meetingType']

def train_model(data_path):
    """Train the meeting preference prediction model"""
    # Load training data
    df = pd.read_csv(data_path)
    
    # Prepare features and target
    X = df[FEATURES]
    y = df['rating']
    
    # Create preprocessing pipeline
    categorical_features = ['meetingType']
    categorical_transformer = OneHotEncoder(handle_unknown='ignore')
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', categorical_transformer, categorical_features)
        ],
        remainder='passthrough'
    )
    
    # Create and train the model
    model = Pipeline([
        ('preprocessor', preprocessor),
        ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
    ])
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train the model
    model.fit(X_train, y_train)
    
    # Save the model
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    
    # Evaluate the model
    score = model.score(X_test, y_test)
    print(f"Model R² score: {score:.4f}")
    
    return model

def predict_slots(user_id, possible_slots):
    """Predict the optimal meeting slots for a user"""
    # Load the model
    if not os.path.exists(MODEL_PATH):
        print("Model not found. Training a new model...")
        model = train_model('data/meeting_preferences.csv')
    else:
        model = joblib.load(MODEL_PATH)
    
    # Convert possible slots to DataFrame
    slots_df = pd.DataFrame(possible_slots)
    
    # Make predictions
    predictions = model.predict(slots_df[FEATURES])
    
    # Rank slots by predicted rating
    ranked_slots = []
    for i, slot in enumerate(possible_slots):
        ranked_slots.append({
            'slot': slot,
            'score': float(predictions[i])
        })
    
    # Sort by score in descending order
    ranked_slots.sort(key=lambda x: x['score'], reverse=True)
    
    return ranked_slots

def record_preference(preference):
    """Record a user's meeting preference for model training"""
    # Load existing data or create new file
    data_path = 'data/meeting_preferences.csv'
    if os.path.exists(data_path):
        df = pd.read_csv(data_path)
    else:
        df = pd.DataFrame(columns=['userId', 'dayOfWeek', 'hourOfDay', 'duration', 
                                   'participantCount', 'meetingType', 'rating'])
    
    # Add new preference
    new_row = pd.DataFrame([preference])
    df = pd.concat([df, new_row], ignore_index=True)
    
    # Save updated data
    os.makedirs(os.path.dirname(data_path), exist_ok=True)
    df.to_csv(data_path, index=False)
    
    # Retrain model if we have enough data
    if len(df) % 10 == 0:  # Retrain every 10 new preferences
        train_model(data_path)
    
    return True

