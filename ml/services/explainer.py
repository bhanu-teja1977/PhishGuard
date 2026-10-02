import shap
import numpy as np

def generate_explanation(model, feature_vector: list, feature_names: list) -> list:
    """
    Generates human-readable explanations based on model feature contributions.
    """
    explanations = []
    
    # Try tree explainer
    try:
        explainer = shap.TreeExplainer(model)
        shap_values = explainer.shap_values(np.array([feature_vector]))
        
        # Depending on the shap version and model type (binary vs multiclass)
        # shap_values could be a list of arrays or a single array.
        if isinstance(shap_values, list):
            # typically [0] is negative class, [1] is positive
            contributions = shap_values[1][0]
        else:
            contributions = shap_values[0]
            
    except Exception as e:
        # Fallback for Logistic Regression or if SHAP fails
        # A simple linear approximation if model has coef_
        if hasattr(model, 'coef_') or (hasattr(model, 'named_steps') and hasattr(model.named_steps.get('lr'), 'coef_')):
            if hasattr(model, 'named_steps'):
                lr = model.named_steps['lr']
                scaler = model.named_steps['scaler']
                # scale features to get scaled contribution
                scaled_fv = scaler.transform([feature_vector])[0]
                contributions = lr.coef_[0] * scaled_fv
            else:
                contributions = model.coef_[0] * np.array(feature_vector)
        else:
            # Absolute fallback
            return [{"feature": "Unknown", "explanation": "Explanation not supported for this model type.", "magnitude": 0}]

    # Match contributions to features
    feature_contributions = list(zip(feature_names, contributions, feature_vector))
    
    # Sort by absolute magnitude of contribution
    feature_contributions.sort(key=lambda x: abs(x[1]), reverse=True)
    
    # Generate human readable text for the top 3 contributing to phishing (positive contribution)
    for feature, contrib, val in feature_contributions:
        if contrib > 0: # Increased risk
            if "Length" in feature:
                text = f"High {feature} increased the predicted phishing risk."
            elif "Num" in feature:
                text = f"A high count of {feature.replace('Num', '')} increased the predicted phishing risk."
            elif val == 1:
                text = f"Presence of {feature} increased the predicted phishing risk."
            else:
                text = f"The value of {feature} increased the predicted phishing risk."
                
            explanations.append({
                "feature": feature,
                "direction": "increased",
                "magnitude": float(contrib),
                "explanation": text
            })
            
            if len(explanations) == 3:
                break
                
    return explanations
