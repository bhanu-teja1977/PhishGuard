import pytest
from fastapi.testclient import TestClient
import sys
import os

# Ensure project root is in path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))
from backend.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True

def test_analyze_valid_url():
    response = client.post("/api/analyze", json={"url": "https://example.com"})
    assert response.status_code == 200
    data = response.json()
    
    assert data["url"] == "https://example.com/"
    assert data["prediction"] in [0, 1]
    assert data["classification"] in ["Phishing", "Legitimate"]
    assert 0.0 <= data["phishing_probability"] <= 1.0
    assert 0 <= data["risk_score"] <= 100
    assert data["risk_level"] in ["Low", "Moderate", "High", "Critical"]
    assert isinstance(data["top_factors"], list)
    assert isinstance(data["features"], dict)

def test_analyze_invalid_url():
    # pydantic HttpUrl validation will catch this
    response = client.post("/api/analyze", json={"url": "not_a_url"})
    assert response.status_code == 422 # FastAPI validation error

def test_get_models():
    response = client.get("/api/models")
    assert response.status_code == 200
    data = response.json()
    assert "model_name" in data
    assert "metrics" in data

def test_get_metrics():
    response = client.get("/api/metrics")
    assert response.status_code == 200
    data = response.json()
    assert "LightGBM" in data
    assert "ROC_AUC" in data["LightGBM"]

def test_get_dataset():
    response = client.get("/api/dataset")
    assert response.status_code == 200
    data = response.json()
    assert data["total_records"] > 0
    assert data["url_only_feature_count"] == 26
