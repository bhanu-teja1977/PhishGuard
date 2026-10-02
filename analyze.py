import pandas as pd
import json
import os
from pptx import Presentation

# 1. Read PPTX
pptx_path = r"C:\Users\Bhanu Teja\.gemini\antigravity\scratch\PHISHGUARD\docs\PhishGuard.pptx"
pptx_text = []
if os.path.exists(pptx_path):
    prs = Presentation(pptx_path)
    for slide in prs.slides:
        for shape in slide.shapes:
            if hasattr(shape, "text"):
                pptx_text.append(shape.text)
else:
    pptx_text.append("PPTX not found.")

with open("pptx_extracted.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(pptx_text))

# 2. Dataset Analysis
csv_path = r"C:\Users\Bhanu Teja\.gemini\antigravity\scratch\PHISHGUARD\data\raw\Phishing_Legitimate_full.csv"
if os.path.exists(csv_path):
    df = pd.read_csv(csv_path)
    
    # Identify target column (usually 'CLASS_LABEL', 'Result', 'Label', 'target', 'Phishing')
    target_col = None
    possible_targets = ['CLASS_LABEL', 'Result', 'Label', 'target', 'Phishing', 'status', 'class']
    for col in df.columns:
        if col.lower() in [pt.lower() for pt in possible_targets]:
            target_col = col
            break
    
    if target_col is None:
        # assume last column if binary
        target_col = df.columns[-1]

    dataset_profile = {
        "filename": "Phishing_Legitimate_full.csv",
        "number_of_rows": len(df),
        "number_of_columns": len(df.columns),
        "columns": list(df.columns),
        "target_column": target_col,
        "target_values": df[target_col].unique().tolist() if target_col else [],
        "class_distribution": df[target_col].value_counts().to_dict() if target_col else {},
        "missing_values": df.isnull().sum().to_dict(),
        "duplicate_rows": int(df.duplicated().sum()),
        "data_types": {col: str(dtype) for col, dtype in df.dtypes.items()},
        "numerical_features": list(df.select_dtypes(include=['int64', 'float64']).columns),
        "categorical_features": list(df.select_dtypes(include=['object', 'category']).columns),
    }

    with open("dataset_profile.json", "w", encoding="utf-8") as f:
        json.dump(dataset_profile, f, indent=4)
else:
    print("CSV not found.")
