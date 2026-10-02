# PHISHGUARD ML PIPELINE

## Dataset
- **Source:** Kaggle `Phishing_Legitimate_full.csv`
- **Total Records:** 10,000 (5,000 Phishing, 5,000 Legitimate)

## Feature Selection & Architectural Decision
- **Original Features:** 48 usable features.
- **Removed Features:** ~22 HTML/webpage-dependent features (e.g., `PctExtHyperlinks`, `MissingTitle`, `InsecureForms`).
- **Reasoning:** PhishGuard intentionally trains on URL-derived features only because live webpage/HTML feature extraction is outside the project's defined scope. Scraping live websites introduces unacceptable latency, bot-blocking risks, and complexity for a demonstration project.
- **Final Feature Count:** 26 strictly URL-derivable lexical and structural features.

## Exact URL-Only Feature List
1. `NumDots`
2. `SubdomainLevel`
3. `PathLevel`
4. `UrlLength`
5. `NumDash`
6. `NumDashInHostname`
7. `AtSymbol`
8. `TildeSymbol`
9. `NumUnderscore`
10. `NumPercent`
11. `NumQueryComponents`
12. `NumAmpersand`
13. `NumHash`
14. `NumNumericChars`
15. `NoHttps`
16. `RandomString`
17. `IpAddress`
18. `DomainInSubdomains`
19. `DomainInPaths`
20. `HttpsInHostname`
21. `HostnameLength`
22. `PathLength`
23. `QueryLength`
24. `DoubleSlashInPath`
25. `NumSensitiveWords`
26. `EmbeddedBrandName`

## Train/Test Methodology
- **Validation Strategy:** 80/20 train/test split.
- **Stratification:** Maintained the 50/50 class balance in both sets.
- **Random State:** 42 for complete reproducibility.

## Models Trained
1. Logistic Regression (with StandardScaler)
2. Random Forest Classifier
3. XGBoost Classifier
4. LightGBM Classifier

## Final Model Selection
- **Criteria:** Highest combined sum of F1-Score and ROC-AUC on the held-out test set.
- **Selected Model:** Detailed metrics are saved in `artifacts/metrics/model_metrics.json`.

## Risk Scoring
- The selected model's positive class probability (`.predict_proba()`) is scaled deterministically by 100 to yield a `0-100` Risk Score.
- Visualization bands:
  - 0–29: Low
  - 30–59: Moderate
  - 60–79: High
  - 80–100: Critical
*(Note: These are UI thresholds, not clinical/security absolutes).*

## Explainability
- **Methodology:** We utilize SHAP (SHapley Additive exPlanations) for tree models (or coefficient weights for Logistic Regression).
- **Process:** It calculates the precise mathematical contribution of each of the 26 features to the final probability, ensuring explanations are never fabricated.

## Limitations
- **Reduced Accuracy:** By dropping 22 HTML features, overall accuracy naturally decreases compared to using the entire Kaggle dataset.
- **Heuristic Approximations:** Certain features (like `RandomString` or `SubdomainLevel`) are extracted using heuristic approximations during live inference, which might slightly deviate from how the original dataset authors scraped them.
