# PHISHGUARD

Explainable Machine Learning-Based Phishing URL Risk Scoring System

## Project Structure
- `/frontend` - Next.js React frontend
- `/backend` - FastAPI Python backend
- `/ml` - Machine learning pipelines and training
- `/data` - Raw and processed datasets
- `/docs` - Project documentation and resources
- `/models` - Trained model artifacts
- `/artifacts` - Generated metrics and reports
- `/tests` - Unit and integration tests

## Technology Stack
- **Frontend**: React (Next.js), TypeScript, Tailwind CSS, Recharts, Lucide
- **Backend**: Python, FastAPI, Pydantic
- **Machine Learning**: LightGBM, Random Forest, XGBoost, Logistic Regression, SHAP, scikit-learn, pandas

## Architecture & Workflow
1. **URL-only scope:** The system extracts exactly 26 structural features from the raw URL string (e.g., length, dashes, sensitive words) without ever scraping the destination website.
2. **ML Prediction:** The feature vector is passed to a dynamically selected **LightGBM** model (chosen for highest F1 & ROC-AUC).
3. **Risk Scoring:** The model predicts a 0-100 risk score and classification.
4. **Explainable AI:** SHAP (SHapley Additive exPlanations) unpacks the decision, displaying exactly which features increased or decreased the phishing probability.

## Installation & Setup

**1. Backend (FastAPI)**
```bash
python -m venv venv
.\venv\Scripts\activate  # (Windows) or source venv/bin/activate (Mac/Linux)
pip install -r backend/requirements.txt
uvicorn backend.main:app --port 8000 --reload
```

**2. Frontend (Next.js)**
```bash
cd frontend
npm install
npm run dev
```

## Testing
Run the comprehensive test suite:
```bash
pytest tests/ml/ -v
pytest tests/backend/ -v
```

## Project Limitations
To ensure live inference is safe and fast, 22 HTML-dependent features from the original dataset were deliberately excluded. The system relies entirely on the remaining 26 URL-derived features, making it immune to live payload execution at the cost of a slight theoretical accuracy drop.
