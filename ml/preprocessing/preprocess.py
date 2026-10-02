import pandas as pd
import json
import os
from sklearn.model_selection import train_test_split
import sys

# Ensure project root is in path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from ml.features.feature_schema import URL_FEATURES, TARGET_COLUMN

def load_and_preprocess_data(data_path: str):
    df = pd.read_csv(data_path)
    
    # Validation
    required_cols = URL_FEATURES + [TARGET_COLUMN]
    for col in required_cols:
        if col not in df.columns:
            raise ValueError(f"Missing required column: {col}")
            
    # Select only required columns
    df = df[required_cols]
    
    # Missing values
    missing = df.isnull().sum().sum()
    if missing > 0:
        df = df.dropna()
        
    # Duplicates report
    duplicates = df.duplicated().sum()
    
    # Type validation - enforce numeric
    for col in URL_FEATURES:
        df[col] = pd.to_numeric(df[col], errors='coerce')
        
    df = df.dropna() # Drop any that couldn't be converted
    
    X = df[URL_FEATURES]
    y = df[TARGET_COLUMN]
    
    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    report = {
        "original_rows": len(pd.read_csv(data_path)),
        "final_rows": len(df),
        "missing_values_dropped": int(missing),
        "duplicates_in_features": int(duplicates),
        "train_size": len(X_train),
        "test_size": len(X_test),
        "features_used": URL_FEATURES
    }
    
    return X_train, X_test, y_train, y_test, report

if __name__ == "__main__":
    raw_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../data/raw/Phishing_Legitimate_full.csv"))
    X_train, X_test, y_train, y_test, report = load_and_preprocess_data(raw_path)
    
    # Save processed data
    out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../data/processed"))
    os.makedirs(out_dir, exist_ok=True)
    X_train.to_csv(os.path.join(out_dir, "X_train.csv"), index=False)
    X_test.to_csv(os.path.join(out_dir, "X_test.csv"), index=False)
    y_train.to_csv(os.path.join(out_dir, "y_train.csv"), index=False)
    y_test.to_csv(os.path.join(out_dir, "y_test.csv"), index=False)
    
    # Save report
    report_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../artifacts/reports"))
    os.makedirs(report_dir, exist_ok=True)
    with open(os.path.join(report_dir, "preprocessing_report.json"), "w") as f:
        json.dump(report, f, indent=4)
        
    print("Preprocessing complete.")
