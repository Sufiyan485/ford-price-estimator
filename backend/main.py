import pandas as pd
import joblib
from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import Literal
from fastapi.middleware.cors import CORSMiddleware

model = joblib.load("ford_price_model_100.pkl")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ford-price-estimator-1.onrender.com"
    ],
    allow_methods=["*"],
    allow_headers=["*"]
)

class CarFeatures(BaseModel):
    model        : Literal['Fiesta', 'Focus', 'Kuga', 'Ecosport', 'C-Max', 'Ka+', 'Mondeo', 'S-Max', 'B-MAX', 'Grand C-Max', 'Galaxy', 'Edge', 'KA', 'Puma', 'Tourneo Custom', 'Grand Tourneo Connect', 'Mustang', 'Torneo Connect', 'Fusion', 'Streetka', 'Ranger', 'Escort', 'Transit Tourneo']
    year         : int = Field(..., ge=1990, le=2026)
    transmission : Literal["Manual", "Automatic", "Semi-Auto"]
    mileage      : int = Field(..., ge=0)
    fuelType     : Literal["Petrol", "Diesel", "Hybrid", "Electric", "Other"]
    tax          : int = Field(..., ge=0)
    mpg          : float = Field(..., gt=0)
    engineSize   : float = Field(..., gt=0)

class PredictionResponse(BaseModel):
    predicted_price: float

@app.get("/")
def greeting():
    return {"message": "Welcome to the Ford Car Price Prediction API!"}

@app.post("/predict")
def predict_price(data : CarFeatures):
    input_data = pd.DataFrame({
        "model"        : [data.model],
        "year"         : [data.year],
        "transmission" : [data.transmission],
        "mileage"      : [data.mileage],
        "fuelType"     : [data.fuelType],
        "tax"          : [data.tax],
        "mpg"          : [data.mpg],
        "engineSize"   : [data.engineSize]
    })

    prediction = model.predict(input_data)[0]
    return PredictionResponse(predicted_price=round(prediction, 2))