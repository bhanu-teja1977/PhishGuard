# PHISHGUARD PROJECT AUDIT

## 1. Project Understanding
- **Project Objective:** Detect potentially phishing URLs from structural & lexical features while producing an interpretable 0–100 risk score with a plain-language explanation.
- **Problem Statement:** Binary "phishing/legitimate" outputs are insufficient for human understanding. Blacklist-based systems fail against new threats.
- **Proposed Solution:** A system mapping URL inputs to feature extraction, ML prediction, risk scoring, and an explainability layer.
- **ML Models Mentioned:** Logistic Regression, Random Forest, XGBoost, LightGBM.
- **Scope Limitations:** Only URL-only lexical & structural analysis. Live website scraping and malware analysis are explicitly out of scope.

## 2. Dataset Summary
- **Filename:** `Phishing_Legitimate_full.csv`
- **Total Rows:** 10,000
- **Total Columns:** 50
- **Target Column:** `CLASS_LABEL` (1: Phishing, 0: Legitimate)
- **Class Distribution:** Perfectly balanced (5,000 Phishing / 5,000 Legitimate).

## 3. Feature Analysis
The dataset contains 48 features. However, a significant discrepancy exists between the dataset features and the project scope ("URL-only lexical & structural analysis").

### Category A: Directly derivable from URL string (In Scope)
*Can be calculated locally without any external requests.*
- `NumDots`, `SubdomainLevel`, `PathLevel`, `UrlLength`, `NumDash`, `NumDashInHostname`, `AtSymbol`, `TildeSymbol`, `NumUnderscore`, `NumPercent`, `NumQueryComponents`, `NumAmpersand`, `NumHash`, `NumNumericChars`, `NoHttps`, `RandomString`, `IpAddress`, `DomainInSubdomains`, `DomainInPaths`, `HttpsInHostname`, `HostnameLength`, `PathLength`, `QueryLength`, `DoubleSlashInPath`, `NumSensitiveWords`, `EmbeddedBrandName`.

### Category C: Requires webpage/HTML/JavaScript information (Out of Scope)
*Requires making a live HTTP request, downloading HTML, and parsing DOM elements.*
- `PctExtHyperlinks`, `PctExtResourceUrls`, `ExtFavicon`, `InsecureForms`, `RelativeFormAction`, `ExtFormAction`, `AbnormalFormAction`, `PctNullSelfRedirectHyperlinks`, `FrequentDomainNameMismatch`, `FakeLinkInStatusBar`, `RightClickDisabled`, `PopUpWindow`, `SubmitInfoToEmail`, `IframeOrFrame`, `MissingTitle`, `ImagesOnlyInForm`, `PctExtResourceUrlsRT`, `AbnormalExtFormActionR`, `ExtMetaScriptLinkRT`, `PctExtNullSelfRedirectHyperlinksRT`.

## 4. Dataset Quality
- The dataset is perfectly balanced with exactly 5,000 instances of each class.
- All columns are complete (no missing values, based on standard checks).
- Feature scale varies greatly (some are percentages, some counts, some binary flags).

## 5. Model Analysis
- **PPT Mentions:** Logistic Regression, Random Forest, XGBoost, LightGBM.
- **Compatibility:** All these models are highly appropriate for structured tabular data. Tree-based models (RF, XGBoost, LightGBM) will likely perform best and naturally support SHAP for explainability (which aligns with the project's explainability goals).

## 6. URL-to-Feature Feasibility
**Is a complete live URL pipeline possible with the raw dataset?** 
**NO.** We cannot calculate the 20+ HTML/content-based features for a live URL without violating the project scope ("Out of Scope: Live website scraping") and introducing severe latency/reliability issues (e.g., bot blockers, site timeouts). 

## 7. Live Prediction Architecture
**Technically Honest Architecture:**
To achieve a live URL prediction pipeline that works on any unseen URL instantly:
1. **Feature Reduction:** We must drop all Category C (HTML-based) features from the training dataset.
2. **Model Training:** Train the ML models *only* on the ~26 Category A (URL-based) lexical/structural features.
3. **Live Extraction:** Implement Python functions that parse the live URL string to calculate exactly those 26 features (counting dashes, measuring length, finding IP addresses, etc.).
4. **Inference:** Pass the extracted 26-feature vector to the trained model.

## 8. Explainability Architecture
- **Risk Score:** Map the probability output of the best model (e.g., XGBoost `.predict_proba()`) directly to a 0-100 scale.
- **SHAP Integration:** Use SHAP (SHapley Additive exPlanations) values to identify which of the 26 features pushed the risk score higher.
- **Plain Language Translation:** Map the top SHAP features to human-readable strings (e.g., if `IpAddress` has high positive SHAP, output "IP address used instead of domain name").

## 9. Identified Risks / Limitations
- **Discrepancy:** The provided Kaggle dataset includes HTML content features, but the project scope claims "URL-only" analysis. If we use the full dataset for accuracy metrics, our live predictor will be mathematically incompatible. We must train a "URL-only" model.
- **Accuracy Drop:** Dropping 20+ features will likely reduce the model's overall accuracy compared to using the full dataset. We must be transparent about this tradeoff in the dashboard.

## 10. Recommended Implementation Plan
1. **Data Preprocessing:** Load the dataset, separate URL-only features, and drop HTML features.
2. **Model Training:** Train RF and XGBoost on the reduced feature set. Save models using `joblib`.
3. **Feature Extractor Module:** Write a robust Python class to parse strings into the exact same 26 features.
4. **Backend API:** Create a FastAPI endpoint that takes a URL, extracts features, predicts risk, and calculates SHAP values.
5. **Frontend Dashboard:** Build the React UI to visualize the risk score and the plain-language explanations.
