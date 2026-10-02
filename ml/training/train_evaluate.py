import os
import json
import joblib
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix, roc_curve

import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from ml.features.feature_schema import URL_FEATURES

def train_and_evaluate():
    data_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../data/processed"))
    X_train = pd.read_csv(os.path.join(data_dir, "X_train.csv"))
    X_test = pd.read_csv(os.path.join(data_dir, "X_test.csv"))
    y_train = pd.read_csv(os.path.join(data_dir, "y_train.csv")).values.ravel()
    y_test = pd.read_csv(os.path.join(data_dir, "y_test.csv")).values.ravel()

    models = {
        "Logistic Regression": Pipeline([('scaler', StandardScaler()), ('lr', LogisticRegression(random_state=42, max_iter=1000))]),
        "Random Forest": RandomForestClassifier(random_state=42, n_estimators=100),
        "XGBoost": XGBClassifier(random_state=42, use_label_encoder=False, eval_metric='logloss'),
        "LightGBM": LGBMClassifier(random_state=42)
    }

    results = {}
    best_model_name = None
    best_score = -1

    for name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        y_prob = model.predict_proba(X_test)[:, 1]

        acc = accuracy_score(y_test, y_pred)
        prec = precision_score(y_test, y_pred)
        rec = recall_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        roc_auc = roc_auc_score(y_test, y_prob)
        cm = confusion_matrix(y_test, y_pred)

        results[name] = {
            "Accuracy": acc,
            "Precision": prec,
            "Recall": rec,
            "F1_Score": f1,
            "ROC_AUC": roc_auc,
            "Confusion_Matrix": cm.tolist()
        }

        # Objective rule: highest ROC_AUC + F1 sum
        score = roc_auc + f1
        if score > best_score:
            best_score = score
            best_model_name = name

    # Generate Metrics JSON
    metrics_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../artifacts/metrics"))
    os.makedirs(metrics_dir, exist_ok=True)
    with open(os.path.join(metrics_dir, "model_metrics.json"), "w") as f:
        json.dump(results, f, indent=4)

    # Generate Markdown Report
    reports_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../artifacts/reports"))
    os.makedirs(reports_dir, exist_ok=True)
    report_md = "# Model Evaluation Report\n\n"
    for name, mets in results.items():
        report_md += f"## {name}\n"
        report_md += f"- **Accuracy:** {mets['Accuracy']:.4f}\n"
        report_md += f"- **Precision:** {mets['Precision']:.4f}\n"
        report_md += f"- **Recall:** {mets['Recall']:.4f}\n"
        report_md += f"- **F1 Score:** {mets['F1_Score']:.4f}\n"
        report_md += f"- **ROC-AUC:** {mets['ROC_AUC']:.4f}\n\n"
    
    report_md += f"## Model Selection\n"
    report_md += f"The selected model is **{best_model_name}** because it achieved the highest combined ROC-AUC and F1 score on the held-out test set."
    with open(os.path.join(reports_dir, "model_evaluation.md"), "w") as f:
        f.write(report_md)

    # Visualizations
    viz_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../artifacts/visualizations"))
    os.makedirs(viz_dir, exist_ok=True)

    # ROC Curves
    plt.figure(figsize=(8, 6))
    for name, model in models.items():
        y_prob = model.predict_proba(X_test)[:, 1]
        fpr, tpr, _ = roc_curve(y_test, y_prob)
        plt.plot(fpr, tpr, label=f"{name} (AUC = {results[name]['ROC_AUC']:.3f})")
    plt.plot([0, 1], [0, 1], 'k--')
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('ROC Curve Comparison')
    plt.legend()
    plt.savefig(os.path.join(viz_dir, "roc_comparison.png"))
    plt.close()

    # Confusion Matrices
    for name, mets in results.items():
        plt.figure(figsize=(5, 4))
        sns.heatmap(mets['Confusion_Matrix'], annot=True, fmt='d', cmap='Blues')
        plt.title(f'{name} Confusion Matrix')
        plt.ylabel('True Label')
        plt.xlabel('Predicted Label')
        plt.savefig(os.path.join(viz_dir, f"{name.replace(' ', '_')}_cm.png"))
        plt.close()

    # Save Best Model
    models_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../models"))
    os.makedirs(models_dir, exist_ok=True)
    best_model = models[best_model_name]
    joblib.dump(best_model, os.path.join(models_dir, "phishguard_model.joblib"))

    with open(os.path.join(models_dir, "feature_schema.json"), "w") as f:
        json.dump({"URL_FEATURES": URL_FEATURES}, f, indent=4)

    with open(os.path.join(models_dir, "model_metadata.json"), "w") as f:
        json.dump({
            "model_name": best_model_name,
            "training_features": URL_FEATURES,
            "metrics": results[best_model_name]
        }, f, indent=4)
    
    print(f"Training complete. Best model: {best_model_name}")

if __name__ == "__main__":
    train_and_evaluate()
