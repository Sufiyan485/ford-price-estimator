# 🚗 Ford Car Price Estimator

An end-to-end Machine Learning project that predicts the price of a Ford car based on its features.

The project covers the complete workflow from **EDA and model training to FastAPI integration and deployment**.

## 🌐 Live Demo

**Frontend:**  
https://ford-price-estimator-1.onrender.com/

**API:**  
https://ford-price-estimator.onrender.com/

**API Documentation:**  
https://ford-price-estimator.onrender.com/docs

---

## 📌 Features

- Predicts Ford car prices using Machine Learning
- Data preprocessing and feature engineering
- Multiple regression models evaluated
- Random Forest hyperparameter tuning
- Feature importance analysis
- FastAPI REST API
- Pydantic input validation
- Interactive frontend
- Deployed using Render

---

## 🧠 Machine Learning

The final model is a **Random Forest Regressor**.

### Input Features

- Model
- Year
- Transmission
- Mileage
- Fuel Type
- Tax
- MPG
- Engine Size

### Model Selection

Several regression models were compared using cross-validation.

Random Forest achieved the best overall cross-validation performance, so it was selected for hyperparameter tuning and used as the final model.

The number of trees was later reduced from **300 to 100**, significantly reducing the model size while maintaining good predictive performance.

### Final Model Performance

| Metric | Result |
|---|---:|
| Test R² | **0.9391** |
| MAE | **$843.90** |
| RMSE | **$1,183.33** |

The model explains approximately **93.9% of the variance** in car prices on the test set.

---

## 🏗️ Architecture

```text
User
  ↓
Frontend (HTML / CSS / JavaScript)
  ↓
FastAPI Backend
  ↓
Preprocessing + Random Forest Model
  ↓
Predicted Car Price
  ↓
Frontend
```

---

## 🛠️ Tech Stack

### Machine Learning

- Python
- Pandas
- NumPy
- Scikit-learn
- Joblib
- Matplotlib
- Seaborn

### Backend

- FastAPI
- Pydantic
- Uvicorn

### Frontend

- HTML
- CSS
- JavaScript

### Deployment

- GitHub
- Render

---

## 🤖 AI-Assisted Development

AI tools were used to assist with frontend design and implementation.

---

## 📁 Project Structure

```text
Car_price/
│
├── backend/
│   ├── ford_price_model_100.pkl
│   ├── main.py
│   └── requirements.txt
│
├── data/
│   └── ford.csv
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── api.js
│
├── notebooks/
│   └── car_price.ipynb
│
└── .gitignore
```

---

## 🔌 API Example

### `POST /predict`

Example request:

```json
{
    "model": "Fiesta",
    "year": 2018,
    "transmission": "Manual",
    "mileage": 30000,
    "fuelType": "Petrol",
    "tax": 150,
    "mpg": 55.4,
    "engineSize": 1.0
}
```

Example response:

```json
{
    "predicted_price": 10944.05
}
```

---

## 💻 Run Locally

```bash
git clone https://github.com/Sufiyan485/ford-price-estimator.git
cd ford-price-estimator

python -m venv .venv
.venv\Scripts\activate

cd backend
pip install -r requirements.txt

uvicorn main:app --reload
```

Then open the frontend from the `frontend` folder.

---

## 📚 Key Learnings

- Exploratory Data Analysis
- Data preprocessing
- Feature engineering
- Regression models
- Cross-validation
- Hyperparameter tuning
- Model evaluation
- Feature importance
- FastAPI
- Pydantic validation
- REST APIs
- CORS
- Git & GitHub
- ML model deployment

---

## 👨‍💻 Author

**Mohammed Sufiyan**  
