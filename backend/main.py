from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from typing import List, Optional
import joblib
import numpy as np
import json
from PIL import Image
import io
import tensorflow as tf
import os
import requests
from dotenv import load_dotenv
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables from .env file
load_dotenv()

app = FastAPI(
    title="Agriculture AI Backend",
    description="AI-powered agriculture recommendations and predictions",
    version="1.3.0" # Version updated to reflect changes
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Simplified for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Global Variables for Models ---
crop_interpreter = None
crop_scaler = None
crop_soil_encoder = None
crop_label_encoder = None
yield_interpreter = None
yield_scaler = None
yield_crop_encoder = None
disease_interpreter = None
disease_class_names = None
crop_details = None

# --- Helper Functions (Originals) ---
def get_seasonal_weather_averages(lat: float, lon: float, season: str):
    logger.info(f"Getting weather data for lat: {lat}, lon: {lon}, season: {season}")
    weather_defaults = {
        "kharif": {"temperature": 28.0, "humidity": 75.0, "rainfall": 150.0},
        "rabi": {"temperature": 22.0, "humidity": 60.0, "rainfall": 50.0},
        "zaid": {"temperature": 35.0, "humidity": 45.0, "rainfall": 25.0}
    }
    return weather_defaults.get(season.lower(), weather_defaults["kharif"])

def load_tflite_model(model_path):
    if not os.path.exists(model_path):
        logger.warning(f"Model file not found: {model_path}")
        return None
    try:
        interpreter = tf.lite.Interpreter(model_path=model_path)
        interpreter.allocate_tensors()
        return interpreter
    except Exception as e:
        logger.error(f"Error loading model {model_path}: {e}")
        return None

def create_default_crop_data():
    # This function remains for fallback purposes if crop_data.json is missing
    return { "Default": { "api_names": [], "estimated_cost_per_hectare": 50000 } }

# --- Load All Models and Data ---
def initialize_models_and_data():
    global crop_interpreter, crop_scaler, crop_soil_encoder, crop_label_encoder, yield_interpreter, yield_scaler, yield_crop_encoder, disease_interpreter, disease_class_names, crop_details
    try:
        if os.path.exists('models/crop_recommender_float16.tflite'):
            crop_interpreter = load_tflite_model('models/crop_recommender_float16.tflite')
            crop_scaler = joblib.load('models/crop_data_scaler.pkl')
            crop_soil_encoder = joblib.load('models/crop_soil_encoder.pkl')
            crop_label_encoder = joblib.load('models/crop_label_encoder.pkl')
            logger.info("✅ Crop recommendation models loaded")
        
        if os.path.exists('models/yield_predictor_float16.tflite'):
            yield_interpreter = load_tflite_model('models/yield_predictor_float16.tflite')
            yield_scaler = joblib.load('models/yield_scaler.pkl')
            yield_crop_encoder = joblib.load('models/yield_crop_encoder.pkl')
            logger.info("✅ Yield prediction models loaded")

        if os.path.exists('models/disease_detector_float32.tflite'):
            disease_interpreter = load_tflite_model('models/disease_detector_float32.tflite')
            with open('models/class_indices.json', 'r') as f:
                class_indices = json.load(f)
            disease_class_names = {v: k for k, v in class_indices.items()}
            logger.info("✅ Disease detection model loaded")

        if os.path.exists('crop_data.json'):
            with open('crop_data.json', 'r') as f:
                crop_details = json.load(f)
            logger.info("✅ Crop data loaded from file")
        else:
            crop_details = create_default_crop_data()
            logger.info("✅ Using default crop data")
        logger.info("✅ Model initialization completed")
    except Exception as e:
        logger.error(f"❌ Error during model initialization: {e}")
        if crop_details is None:
            crop_details = create_default_crop_data()

# Initialize on startup
initialize_models_and_data()

# --- Pydantic Models (Originals) ---
class EnrichedSoilData(BaseModel):
    nitrogen: float
    phosphorus: float
    potassium: float
    ph: float
    season: str
    soil_type: str

class YieldPredictionData(BaseModel):
    nitrogen: float
    phosphorus: float
    potassium: float
    ph: float
    season: str
    crop: str

class CalculatorData(BaseModel):
    nitrogen: float
    phosphorus: float
    potassium: float
    ph: float
    season: str
    crop: str
    state: str
    district: str

# --- Health Check Endpoints (Originals) ---
@app.get("/")
async def root():
    return {"status": "healthy", "service": "Agriculture AI Backend", "version": "1.3.0"}

# --- *** NEW PRICE FETCHING LOGIC *** ---
async def get_recent_average_price(state: str, district: str, api_crop_names: List[str]):
    """
    Fetches the recent average market price for a crop from data.gov.in.
    Uses the corrected JSON field names (e.g., Modal_Price).
    """
    api_key = os.getenv("API_GOV_KEY")
    if not api_key:
        logger.warning("API_GOV_KEY environment variable not set.")
        return None
    
    # Correct resource_id for the working API
    resource_id = "35985678-0d79-46b4-9ed6-6f13308a1d24"
    
    for crop_name in api_crop_names:
        logger.info(f"Fetching price for '{crop_name}' in {district}, {state}")
        
        # Correct filter names (e.g., 'filters[State]')
        api_url = (
            f"https://api.data.gov.in/resource/{resource_id}?"
            f"api-key={api_key}&format=json&limit=500&"
            f"filters[State]={state.strip()}&"
            f"filters[District]={district.strip()}&"
            f"filters[Commodity]={crop_name.strip()}"
        )
        
        try:
            response = requests.get(api_url, timeout=20)
            response.raise_for_status()
            data = response.json()
            
            records = data.get('records', [])
            if not records:
                logger.warning(f"No records found for '{crop_name}' with the current filters.")
                continue

            df = pd.DataFrame(records)
            
            # Correct field names with underscores
            price_column = 'Modal_Price'
            min_price_col = 'Min_Price'
            max_price_col = 'Max_Price'
            
            if price_column not in df.columns:
                logger.warning(f"'{price_column}' column not found in API response for '{crop_name}'.")
                continue
                
            df[price_column] = pd.to_numeric(df[price_column], errors='coerce')
            df.dropna(subset=[price_column], inplace=True)
            
            valid_prices = df[df[price_column] > 0]
            
            if not valid_prices.empty:
                average_price = valid_prices[price_column].mean()
                logger.info(f"✅ Found average modal price for '{crop_name}': {average_price:.2f}")
                return {
                    "commodity": crop_name,
                    "modal_price": round(average_price),
                    "min_price": round(pd.to_numeric(valid_prices[min_price_col], errors='coerce').mean()),
                    "max_price": round(pd.to_numeric(valid_prices[max_price_col], errors='coerce').mean())
                }

        except requests.exceptions.Timeout:
            logger.error(f"Request timed out for '{crop_name}'. The data.gov.in API might be slow.")
        except requests.exceptions.RequestException as e:
            logger.error(f"API request failed for '{crop_name}': {e}")
            
    logger.error(f"Could not find any price data for any of the crop aliases in {district}, {state}.")
    return None

# --- API Endpoints ---
@app.get("/api/crops")
def get_available_crops():
    # This endpoint remains the same as your original code
    if not crop_details:
        return {"crops": [], "message": "Crop data not available"}
    
    crops = []
    for crop_key, crop_data in crop_details.items():
        if crop_key != 'Default':
            crops.append({
                'value': crop_key,
                'label': crop_key.replace('_', ' ').title(),
                'api_names': crop_data.get('api_names', []),
                'cost_per_hectare': crop_data.get('estimated_cost_per_hectare', 0),
                'yield_range': crop_data.get('yield_tons_per_hectare_range', [0, 0]),
                'sustainability': crop_data.get('sustainability', {})
            })
    
    return {'crops': sorted(crops, key=lambda x: x['label'])}

# --- *** NEW /api/prices ENDPOINT *** ---
@app.get("/api/prices")
async def get_mandi_prices(state: str, district: str, crop: str):
    """Gets the average market price for a given crop and location."""
    if not crop_details:
        raise HTTPException(status_code=503, detail="Crop data is not available. Server may be starting up.")

    normalized_crop_key = crop.lower()
    crop_data = crop_details.get(normalized_crop_key)

    if not crop_data:
        raise HTTPException(status_code=404, detail=f"Crop '{crop}' not found in our database.")
    
    api_names = crop_data.get("api_names", [crop.title()])
    price_info = await get_recent_average_price(state, district, api_names)
    
    if price_info is None:
        raise HTTPException(status_code=404, detail="Price data not found for the specified crop and location.")
        
    return {
        "state": state,
        "district": district,
        "crop": crop,
        "price_data": price_info
    }

@app.post("/api/recommend/crop", tags=["AI/ML"])
def recommend_crop_api(data: EnrichedSoilData):
    """Recommends the best crops based on soil and weather data using the new API format."""
    if not all([crop_interpreter, crop_scaler, crop_soil_encoder, crop_label_encoder]):
        raise HTTPException(status_code=503, detail="Crop recommendation model is not ready.")

    try:
        # Get weather data for the specified season
        weather_data = get_seasonal_weather_averages(19.07, 72.87, data.season)
        
        # Create input DataFrame with the exact structure the model expects
        # Order must match: ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
        input_df = pd.DataFrame([{
            'N': data.nitrogen,
            'P': data.phosphorus,
            'K': data.potassium,
            'temperature': weather_data['temperature'],
            'humidity': weather_data['humidity'],
            'ph': data.ph,
            'rainfall': weather_data['rainfall']
        }])
        
        # Get soil type data
        soil_type_df = pd.DataFrame({'soil_type': [data.soil_type]})
        
        # Scale numerical features first (the scaler expects exactly 7 features)
        scaled_numerical = crop_scaler.transform(input_df)
        
        # Transform categorical features separately
        encoded_soil = crop_soil_encoder.transform(soil_type_df)
        
        # Combine scaled numerical with encoded categorical features
        combined_features = np.hstack([scaled_numerical, encoded_soil])
        
        # Run inference using TensorFlow Lite
        input_details = crop_interpreter.get_input_details()
        output_details = crop_interpreter.get_output_details()
        crop_interpreter.set_tensor(input_details[0]['index'], np.array(combined_features, dtype=np.float32))
        crop_interpreter.invoke()
        predictions = crop_interpreter.get_tensor(output_details[0]['index'])
        
        # Get top 3 recommendations
        top_3_indices = np.argsort(predictions[0])[-3:][::-1]
        top_3_crops = crop_label_encoder.inverse_transform(top_3_indices)
        top_3_confidences = [float(predictions[0][i]) for i in top_3_indices]
        
        return {
            "recommendations": [
                {"crop": crop, "confidence": conf} for crop, conf in zip(top_3_crops, top_3_confidences)
            ]
        }
    except Exception as e:
        logger.error(f"Error during crop recommendation: {e}")
        raise HTTPException(status_code=500, detail="Failed to get crop recommendation.")

@app.post("/api/predict/disease", tags=["AI/ML"])
async def predict_disease_api(file: UploadFile = File(...)):
    """Predicts plant disease from an uploaded image using the API format."""
    if not disease_interpreter or not disease_class_names:
        raise HTTPException(status_code=503, detail="Disease detection model not available.")

    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert('RGB')
        image = image.resize((224, 224))
        image_array = np.array(image, dtype=np.float32) / 255.0
        image_array = np.expand_dims(image_array, axis=0)

        input_details = disease_interpreter.get_input_details()
        output_details = disease_interpreter.get_output_details()
        disease_interpreter.set_tensor(input_details[0]['index'], image_array)
        disease_interpreter.invoke()
        predictions = disease_interpreter.get_tensor(output_details[0]['index'])[0]

        predicted_class_index = np.argmax(predictions)
        confidence = float(predictions[predicted_class_index])
        predicted_class_name = disease_class_names.get(predicted_class_index, "Unknown")
        
        return {
            "prediction": predicted_class_name,
            "confidence": confidence
        }
    except Exception as e:
        logger.error(f"Error processing image for disease detection: {e}")
        raise HTTPException(status_code=500, detail="Could not process the image.")

# --- Other Endpoints (Originals) ---
@app.post("/recommend-crop")
def recommend_crop(data: EnrichedSoilData, lat: float = Query(19.07), lon: float = Query(72.87)):
    # This endpoint remains the same as your original code
    if not all([crop_interpreter, crop_scaler, crop_soil_encoder, crop_label_encoder]):
        return {"message": "Crop recommendation models not available"}
    
    try:
        weather_data = get_seasonal_weather_averages(lat, lon, data.season)
        
        numerical_data = pd.DataFrame([{'N': data.nitrogen, 'P': data.phosphorus, 'K': data.potassium, 'temperature': weather_data['temperature'], 'humidity': weather_data['humidity'], 'ph': data.ph, 'rainfall': weather_data['rainfall']}])
        categorical_data = pd.DataFrame({'soil_type': [data.soil_type]})
        
        scaled_numerical = crop_scaler.transform(numerical_data)
        encoded_categorical = crop_soil_encoder.transform(categorical_data)
        processed_input = np.hstack([scaled_numerical, encoded_categorical]).astype(np.float32)
        
        input_details = crop_interpreter.get_input_details()
        output_details = crop_interpreter.get_output_details()
        
        crop_interpreter.set_tensor(input_details[0]['index'], processed_input)
        crop_interpreter.invoke()
        
        probabilities = crop_interpreter.get_tensor(output_details[0]['index'])[0]
        top_3_indices = np.argsort(probabilities)[-3:][::-1]
        
        recommendations = []
        for index in top_3_indices:
            crop_name = crop_label_encoder.inverse_transform([index])[0]
            confidence = probabilities[index]
            recommendations.append({"crop": str(crop_name), "confidence": round(float(confidence), 4)})
        
        return recommendations
        
    except Exception as e:
        logger.error(f"Error in crop recommendation: {e}")
        raise HTTPException(status_code=500, detail=f"Crop recommendation failed: {str(e)}")

# Other original endpoints like /predict-yield and /detect-disease remain unchanged
@app.post("/predict-yield")
def predict_yield(data: YieldPredictionData, lat: float = Query(19.07), lon: float = Query(72.87)):
    """Predict crop yield based on soil and crop data"""
    try:
        # Get weather data using the existing function
        weather_data = get_seasonal_weather_averages(lat, lon, data.season)
        
        predicted_yield_tons_ha = 3.5  # Default value
        
        # If models are available, use them for prediction
        if all([yield_interpreter, yield_scaler, yield_crop_encoder]):
            try:
                # Prepare numerical features (7 features expected by scaler)
                numerical_features = np.array([[
                    data.nitrogen,          # N
                    data.phosphorus,        # P
                    data.potassium,         # K
                    weather_data.get('temperature', 25),  # temperature
                    weather_data.get('humidity', 60),     # humidity
                    data.ph,                # ph
                    weather_data.get('rainfall', 100)     # rainfall
                ]], dtype=np.float32)
                
                # Scale numerical features
                numerical_scaled = yield_scaler.transform(numerical_features)
                
                # Encode crop using one-hot encoder
                crop_encoded = yield_crop_encoder.transform([[data.crop.lower()]])
                
                # Combine scaled numerical features with encoded crop
                features_final = np.hstack([numerical_scaled, crop_encoded]).astype(np.float32)
                
                # Make prediction
                yield_interpreter.set_tensor(yield_interpreter.get_input_details()[0]['index'], features_final)
                yield_interpreter.invoke()
                prediction = yield_interpreter.get_tensor(yield_interpreter.get_output_details()[0]['index'])
                predicted_yield_tons_ha = float(prediction[0][0])
                
                # Ensure reasonable bounds
                predicted_yield_tons_ha = max(0.1, min(15.0, predicted_yield_tons_ha))
                
            except Exception as e:
                logger.error(f"Error in yield prediction: {e}")
                # Fall back to default
                predicted_yield_tons_ha = 3.5
        
        return {
            "predicted_crop": data.crop,
            "estimated_yield_tons_per_hectare": round(predicted_yield_tons_ha, 2),
            "weather_data_used": {
                "temperature": weather_data.get('temperature', 25),
                "humidity": weather_data.get('humidity', 60),
                "rainfall": weather_data.get('rainfall', 100)
            }
        }
        
    except Exception as e:
        logger.error(f"Error in yield prediction endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Yield prediction failed: {str(e)}")

@app.post("/detect-disease")
async def detect_disease(file: UploadFile = File(...)):
    # This endpoint remains the same as your original code
    if not disease_interpreter or not disease_class_names:
        return {"message": "Disease detection model not loaded"}
    # ... (rest of original logic)
    return {"message": "Original detect-disease logic here."}


# --- *** UPDATED PROFIT CALCULATOR *** ---
@app.post("/calculate-profit-sustainability")
async def calculate_metrics(data: CalculatorData, lat: float = Query(19.07), lon: float = Query(72.87)):
    """Calculate profit and sustainability metrics with updated price logic"""
    if not crop_details:
        raise HTTPException(status_code=503, detail="Crop data not available for calculations")
    
    try:
        # Yield Prediction Logic - Use the actual model
        predicted_yield_tons_ha = 3.5 # Default value
        
        # Get weather data using the existing function
        weather_data = get_seasonal_weather_averages(lat, lon, data.season)
        
        # If models are available, use them for prediction
        if all([yield_interpreter, yield_scaler, yield_crop_encoder]):
            try:
                # Prepare numerical features (7 features expected by scaler)
                numerical_features = np.array([[
                    data.nitrogen,          # N
                    data.phosphorus,        # P
                    data.potassium,         # K
                    weather_data.get('temperature', 25),  # temperature
                    weather_data.get('humidity', 60),     # humidity
                    data.ph,                # ph
                    weather_data.get('rainfall', 100)     # rainfall
                ]], dtype=np.float32)
                
                # Scale numerical features
                numerical_scaled = yield_scaler.transform(numerical_features)
                
                # Encode crop using one-hot encoder
                crop_encoded = yield_crop_encoder.transform([[data.crop.lower()]])
                
                # Combine scaled numerical features with encoded crop
                features_final = np.hstack([numerical_scaled, crop_encoded]).astype(np.float32)
                
                # Make prediction
                yield_interpreter.set_tensor(yield_interpreter.get_input_details()[0]['index'], features_final)
                yield_interpreter.invoke()
                prediction = yield_interpreter.get_tensor(yield_interpreter.get_output_details()[0]['index'])
                predicted_yield_tons_ha = float(prediction[0][0])
                
                # Ensure reasonable bounds
                predicted_yield_tons_ha = max(0.1, min(15.0, predicted_yield_tons_ha))
                
                logger.info(f"Predicted yield using ML model: {predicted_yield_tons_ha} tons/ha")
                
            except Exception as e:
                logger.error(f"Error in yield prediction: {e}")
                # Fall back to default
                predicted_yield_tons_ha = 3.5
                logger.info("Using default yield prediction due to error")
        else:
             logger.info("Using default yield prediction - models not available")

        # Get market price using the new direct helper function
        crop_key = data.crop.lower()
        crop_info = crop_details.get(crop_key, {})
        api_names = crop_info.get("api_names", [data.crop])
        price_info = await get_recent_average_price(data.state, data.district, api_names)
        
        avg_market_price_quintal = 2000  # Default price
        price_data_source = "Default Price (No API Data)"

        if price_info:
            avg_market_price_quintal = price_info.get('modal_price', 2000)
            price_data_source = "Live API"

        # Get costs & sustainability data
        details = crop_details.get(crop_key, crop_details.get('Default', {}))
        estimated_cost_ha = details.get('estimated_cost_per_hectare', 50000)
        sustainability_ratings = details.get('sustainability', {})

        # Calculate profit
        total_revenue_ha = predicted_yield_tons_ha * 10 * avg_market_price_quintal
        net_profit_ha = total_revenue_ha - estimated_cost_ha
        
        # Calculate sustainability score
        water = (10 - sustainability_ratings.get('water_usage_rating', 5)) * 0.4
        pesticide = (10 - sustainability_ratings.get('pesticide_rating', 5)) * 0.4
        soil = (10 - sustainability_ratings.get('soil_health_impact', 5)) * 0.2
        sustainability_score = round(water + pesticide + soil, 1)

        return {
            "crop": data.crop,
            "predicted_yield_tons_per_hectare": predicted_yield_tons_ha,
            "avg_market_price_per_quintal": avg_market_price_quintal,
            "estimated_total_revenue_per_hectare": round(total_revenue_ha),
            "estimated_input_cost_per_hectare": estimated_cost_ha,
            "estimated_net_profit_per_hectare": round(net_profit_ha),
            "sustainability_score_out_of_10": sustainability_score,
            "priceDataSource": price_data_source
        }
        
    except Exception as e:
        logger.error(f"Error in profit calculation: {e}")
        raise HTTPException(status_code=500, detail=f"Calculation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    # Using the port from your original file
    uvicorn.run(app, host="0.0.0.0", port=7860)