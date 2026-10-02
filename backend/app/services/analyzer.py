import sys
import os

# Ensure the root project directory is in the path to access the ml/ package
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..')))

from ml.features.url_feature_extractor import extract_url_features
from ml.services.risk_scoring import calculate_risk_score, get_risk_level
from ml.services.explainer import generate_explanation
from backend.app.services.model_service import model_service

def analyze_url(url: str) -> dict:
    if not model_service.is_loaded:
        raise RuntimeError("ML Model is not loaded. Cannot perform analysis.")

    # 1. Feature Extraction
    try:
        features_dict = extract_url_features(url)
    except Exception as e:
        raise ValueError(f"Feature extraction failed: {str(e)}")
        
    schema = model_service.get_schema()
    
    # Ensure all required features are present
    for feature in schema:
        if feature not in features_dict:
            raise ValueError(f"Extracted features missing required feature: {feature}")

    import pandas as pd
    
    # Build ordered vector as DataFrame to maintain feature names and avoid LightGBM warnings
    feature_df = pd.DataFrame([features_dict], columns=schema)
    
    model = model_service.get_model()
    
    # 2. Prediction
    try:
        prediction = int(model.predict(feature_df)[0])
        phishing_probability = float(model.predict_proba(feature_df)[0][1])
    except Exception as e:
        raise RuntimeError(f"Model prediction failed: {str(e)}")

    classification = "Phishing" if prediction == 1 else "Legitimate"
    
    # 3. Risk Scoring
    risk_score = calculate_risk_score(phishing_probability)
    risk_level = get_risk_level(risk_score)
    
    # 4. Explainability
    try:
        feature_vector = [features_dict[f] for f in schema]
        top_factors = generate_explanation(model, feature_vector, schema)
    except Exception as e:
        raise RuntimeError(f"Explanation generation failed: {str(e)}")
        
    return {
        "url": url,
        "prediction": prediction,
        "classification": classification,
        "phishing_probability": phishing_probability,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "top_factors": top_factors,
        "features": features_dict
    }
