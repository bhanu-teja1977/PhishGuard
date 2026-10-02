# PHISHGUARD BACKEND

This provides the FastAPI REST backend for the PhishGuard URL risk scoring system.

## API Structure

- `GET /api/health`: Check if the API is running and if the ML model is successfully loaded.
- `POST /api/analyze`: Takes a JSON payload `{"url": "https://..."}` and returns the complete ML risk analysis (prediction, probability, score, and SHAP factors).
- `GET /api/models`: Returns metadata about the selected model.
- `GET /api/metrics`: Returns evaluation metrics for all trained models.
- `GET /api/dataset`: Returns dataset statistics (class distribution, train/test sizes).

## Running the API

To start the backend server locally for development:

```bash
uvicorn backend.main:app --reload
```

Or from the project root:
```bash
python -m uvicorn backend.main:app --reload
```

## Documentation
FastAPI provides automatic interactive documentation. After starting the server, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Features
- **URL-Only Analysis:** Follows the project scope by only performing lexical and structural analysis, without web scraping.
- **Model Efficiency:** Loads the ML model `phishguard_model.joblib` only once during application startup.
- **Explainability:** Returns actionable, human-readable SHAP-derived explanations.
- **Validation:** Utilizes Pydantic to ensure all submitted URLs are strictly valid.
