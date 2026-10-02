from pydantic import BaseModel, HttpUrl, Field
from typing import List, Dict, Any, Optional

class AnalyzeRequest(BaseModel):
    url: HttpUrl = Field(..., description="The URL to analyze")

class TopFactor(BaseModel):
    feature: str
    magnitude: float
    direction: str
    explanation: str

class AnalyzeResponse(BaseModel):
    url: str
    prediction: int
    classification: str
    phishing_probability: float
    risk_score: int
    risk_level: str
    top_factors: List[TopFactor]
    features: Dict[str, Any]

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
