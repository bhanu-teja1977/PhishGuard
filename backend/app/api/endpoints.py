from fastapi import APIRouter, HTTPException, status
from pydantic import ValidationError
import os
import json

from backend.app.schemas.analysis import AnalyzeRequest, AnalyzeResponse, HealthResponse
from backend.app.services.analyzer import analyze_url
from backend.app.services.model_service import model_service

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(
        status="healthy",
        model_loaded=model_service.is_loaded
    )

@router.post("/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest):
    try:
        url_str = str(request.url)
        result = analyze_url(url_str)
        return AnalyzeResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred during analysis.")

@router.get("/models")
def get_models_info():
    if not model_service.is_loaded:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Model metadata not loaded.")
    return model_service.get_metadata()

@router.get("/metrics")
def get_metrics():
    metrics_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../artifacts/metrics/model_metrics.json"))
    if not os.path.exists(metrics_path):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Metrics not found.")
    with open(metrics_path, "r") as f:
        return json.load(f)

@router.get("/dataset")
def get_dataset_info():
    dataset_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../artifacts/dataset_profile.json"))
    report_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../artifacts/reports/preprocessing_report.json"))
    
    if not os.path.exists(dataset_path) or not os.path.exists(report_path):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dataset info not found.")
        
    with open(dataset_path, "r") as f:
        ds = json.load(f)
    with open(report_path, "r") as f:
        rp = json.load(f)
        
    return {
        "total_records": ds.get("number_of_rows"),
        "feature_count": ds.get("number_of_columns"),
        "url_only_feature_count": len(rp.get("features_used", [])),
        "class_distribution": ds.get("class_distribution"),
        "target_column": ds.get("target_column"),
        "train_size": rp.get("train_size"),
        "test_size": rp.get("test_size")
    }
