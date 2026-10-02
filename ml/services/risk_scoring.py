def calculate_risk_score(probability: float) -> int:
    """
    Converts a raw ML probability (0.0 to 1.0) into a 0-100 risk score.
    """
    # Simply scaling the probability to 100 for interpretability
    return int(round(probability * 100))

def get_risk_level(risk_score: int) -> str:
    """
    Maps a 0-100 risk score to an application visualization threshold.
    IMPORTANT: These are application visualization thresholds, not scientifically validated clinical/security thresholds.
    0-29   = Low
    30-59  = Moderate
    60-79  = High
    80-100 = Critical
    """
    if risk_score < 30:
        return "Low"
    elif risk_score < 60:
        return "Moderate"
    elif risk_score < 80:
        return "High"
    else:
        return "Critical"
