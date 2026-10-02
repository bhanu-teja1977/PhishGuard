# PHISHGUARD DEMO GUIDE

This guide provides a step-by-step walkthrough for demonstrating the PhishGuard URL risk scoring system.

## A. Startup

Open two terminal windows from the project root (`PHISHGUARD/`).

1. **Start Backend (FastAPI):**
   ```bash
   .\venv\Scripts\uvicorn.exe backend.main:app --port 8000 --reload
   ```

2. **Start Frontend (Next.js):**
   ```bash
   cd frontend
   npm run dev
   ```

## B. Opening the Website

- Navigate to `http://localhost:3000` in your web browser.
- You will see the dark-themed **PhishGuard Landing Page**.
- Briefly explain the core concept: *URL structure analysis via Machine Learning without HTML scraping.*

## C. Recommended Demo URLs

For a clean demonstration, use:

1. **Legitimate Example:** `https://www.google.com`
2. **Phishing Example:** `http://192.168.1.1/secure-update-verify-account.php?id=9928374928374`

## D. Running an Analysis

1. Click **"Analyze a URL"** from the home page.
2. Paste the phishing example into the search bar and click **Analyze**.
3. Observe the loading state (the API is extracting 26 features, running inference, and calculating SHAP values).

## E. Explaining the Risk Score

- Point out the **Risk Gauge**. It maps the raw ML probability (e.g., 55.3%) to a `0-100` scale.
- Point out the **Classification Badge** (Phishing vs Legitimate).

## F. Explaining SHAP Factors

- Scroll to the **"Why did PhishGuard reach this result?"** section.
- This is the **Explainable AI (XAI)** component. 
- Emphasize that these are not hardcoded rules. The SHAP `TreeExplainer` actively calculated that the presence of `IpAddress` and high `NumSensitiveWords` pushed the probability toward phishing for this *specific* URL.

## G. Showing Model Comparison

- Navigate to the **Model Performance** page.
- Show the Recharts comparison chart. 
- Point out that **LightGBM** was selected programmatically because it achieved the highest combined F1-Score and ROC-AUC during training.

## H. Showing Research / Limitations

- Navigate to the **Research** page.
- Explain the key limitation: We intentionally dropped 22 HTML-based features from the original Kaggle dataset to ensure the tool is safe, fast, and does not require visiting potentially malicious sites during live analysis.

## I. Common Errors and Fixes

- **API Network Error / "Unable to analyze"**: Ensure the FastAPI backend is running on port 8000.
- **Port Conflicts**: If port 3000 or 8000 is in use, you can change them, but you must update `API_BASE_URL` in `frontend/src/services/api.ts`.
