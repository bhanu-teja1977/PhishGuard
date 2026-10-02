import os
import sys
import joblib
import json

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from ml.features.url_feature_extractor import extract_url_features
from ml.features.feature_schema import URL_FEATURES
from ml.services.risk_scoring import calculate_risk_score, get_risk_level
from ml.services.explainer import generate_explanation

def test_pipeline():
    model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../models/phishguard_model.joblib'))
    
    if not os.path.exists(model_path):
        print("Model not found. Run training first.")
        return

    model = joblib.load(model_path)
    
    test_urls = [
        "https://example.com",
        "https://www.google.com",
        "http://example.com/login",
        "http://192.168.1.1/secure-update-verify-account.php?id=9928374928374",
        "https://amazon-support-update.com/signin?session=abc&token=xyz"
    ]
    
    for url in test_urls:
        print(f"Testing URL: {url}")
        
        # 1. Extract features
        features_dict = extract_url_features(url)
        
        # Verify schema match
        assert list(features_dict.keys()) == URL_FEATURES, "Extracted features do not match schema order."
        
        feature_vector = [features_dict[f] for f in URL_FEATURES]
        
        # 2. Prediction
        prediction = int(model.predict([feature_vector])[0])
        probability = float(model.predict_proba([feature_vector])[0][1])
        
        # 3. Risk Score
        risk_score = calculate_risk_score(probability)
        risk_level = get_risk_level(risk_score)
        
        # 4. Explanation
        top_factors = generate_explanation(model, feature_vector, URL_FEATURES)
        
        output = {
            "url": url,
            "prediction": prediction,
            "phishing_probability": round(probability, 4),
            "risk_score": risk_score,
            "risk_level": risk_level,
            "top_factors": top_factors
        }
        
        print(json.dumps(output, indent=2))
        print("-" * 50)
        
    print("End-to-End Pipeline test passed.")

if __name__ == "__main__":
    test_pipeline()
