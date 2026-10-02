# Model Evaluation Report

## Logistic Regression
- **Accuracy:** 0.8485
- **Precision:** 0.8341
- **Recall:** 0.8700
- **F1 Score:** 0.8517
- **ROC-AUC:** 0.9232

## Random Forest
- **Accuracy:** 0.9105
- **Precision:** 0.8951
- **Recall:** 0.9300
- **F1 Score:** 0.9122
- **ROC-AUC:** 0.9686

## XGBoost
- **Accuracy:** 0.9185
- **Precision:** 0.9028
- **Recall:** 0.9380
- **F1 Score:** 0.9201
- **ROC-AUC:** 0.9739

## LightGBM
- **Accuracy:** 0.9200
- **Precision:** 0.9062
- **Recall:** 0.9370
- **F1 Score:** 0.9213
- **ROC-AUC:** 0.9739

## Model Selection
The selected model is **LightGBM** because it achieved the highest combined ROC-AUC and F1 score on the held-out test set.