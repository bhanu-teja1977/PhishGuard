# 🛡️ PhishGuard

### Explainable Machine Learning-Based Phishing URL Risk Scoring System

PhishGuard is an **explainable machine learning system for detecting potentially phishing URLs and converting model predictions into an interpretable 0–100 risk score**.

Instead of providing only a binary **Phishing / Legitimate** prediction, PhishGuard provides:

- 🎯 Phishing probability
- 📊 0–100 risk score
- 🚦 Risk level
- 🔍 Important factors influencing the prediction
- 🧠 SHAP-based model explanations
- 📋 Extracted URL characteristics
- 💡 Security recommendations

The system analyzes the **URL itself using lexical and structural characteristics**. It does **not visit or scrape the destination website**.

---

## ✨ Features

### 🔎 URL Risk Analysis

Analyze a URL and receive a machine-learning-based risk assessment.

### 📊 0–100 Risk Score

The model's phishing probability is converted into an intuitive risk score from **0 to 100**.

| Risk Score | Risk Level |
|------------|------------|
| 0–29 | 🟢 Low |
| 30–59 | 🟡 Moderate |
| 60–79 | 🟠 High |
| 80–100 | 🔴 Critical |

> These ranges are application visualization thresholds and are not independently validated security standards.

### 🧠 Explainable AI

PhishGuard uses **SHAP (SHapley Additive exPlanations)** to identify which URL characteristics contributed toward or away from the phishing prediction.

### 🤖 Multiple Machine Learning Models

The URL-based pipeline evaluates:

- Logistic Regression
- Random Forest
- XGBoost
- LightGBM

LightGBM is used as the deployed model based on the project's documented combined **F1-score and ROC-AUC selection criterion**.

### 📈 Model Performance

Evaluation was performed on a stratified held-out test set.

| Model | Accuracy | F1 Score | ROC-AUC |
|---|---:|---:|---:|
| Logistic Regression | 84.8% | 0.851 | 0.923 |
| Random Forest | 91.0% | 0.912 | 0.968 |
| XGBoost | 91.8% | 0.920 | 0.973 |
| LightGBM | 92.0% | 0.921 | 0.973 |

**Test split:** 20% of the dataset  
**Random state:** 42  
**Dataset size:** 10,000 samples

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      User URL        │
                    └──────────┬───────────┘
                               │
                               ▼
                 ┌─────────────────────────┐
                 │ URL Feature Extraction  │
                 └────────────┬────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │ 26 URL-Derived Features│
                 └────────────┬────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │   LightGBM Classifier   │
                 └────────────┬────────────┘
                              │
                  ┌───────────┴───────────┐
                  ▼                       ▼
        ┌──────────────────┐   ┌──────────────────┐
        │ Phishing         │   │ SHAP Explanation │
        │ Probability      │   │                  │
        └────────┬─────────┘   └────────┬─────────┘
                 │                      │
                 └──────────┬───────────┘
                            ▼
                 ┌─────────────────────────┐
                 │   Risk Scoring Engine   │
                 │       0 – 100           │
                 └────────────┬────────────┘
                              │
                              ▼
                 ┌─────────────────────────┐
                 │ Interactive Web Dashboard│
                 └─────────────────────────┘

🔬 How PhishGuard Works
1. URL Input
The user enters a URL through the web interface.
Example:
https://example.com/login

2. Feature Extraction
The system extracts structural and lexical characteristics directly from the URL.
The deployed URL-only pipeline uses 26 features, including:
- Number of dots
- Subdomain level
- Path level
- URL length
- Number of dashes
- Dashes in hostname
- @ symbol
- Tilde symbol
- Underscores
- Percent characters
- Query components
- Ampersands
- Hash characters
- Numeric characters
- HTTPS usage
- Random-string characteristics
- IP-address usage
- Domain in subdomains
- Domain in paths
- HTTPS in hostname
- Hostname length
- Path length
- Query length
- Double slash in path
- Sensitive words
- Embedded brand name
3. Machine Learning Prediction
The extracted feature vector is passed to the trained LightGBM model.
The model produces a probability associated with the phishing class.
4. Risk Scoring
The phishing probability is converted into an integer risk score between 0 and 100.
Phishing Probability
        ↓
Risk Scoring Engine
        ↓
0 ─────────────── 100
Low             Critical

5. Explainability
SHAP is used to explain the individual prediction.
The interface shows which features contributed toward phishing and which contributed toward a legitimate classification.
📚 Dataset
PhishGuard was developed using the Phishing_Legitimate_full.csv dataset.
Dataset Characteristics
- Total samples: 10,000
- Phishing: 5,000
- Legitimate: 5,000
- Original columns: 50
- Target: CLASS_LABEL
The original dataset contains URL-related as well as webpage/HTML-dependent characteristics.
For the deployed PhishGuard system, the pipeline uses only features that can be derived directly from the submitted URL.
Why URL-Only?
The live system intentionally avoids visiting the destination website.
This provides:
- Faster analysis
- No webpage scraping requirement
- Reduced interaction with potentially malicious websites
- A simpler analysis workflow
However, restricting the system to URL-derived characteristics means that information available from webpage content, HTML, JavaScript, traffic, or external reputation systems is not available to the live model.
🤖 Machine Learning Pipeline
```text
Dataset
   │
   ▼
Feature Selection
   │
   ▼
26 URL-Derived Features
   │
   ▼
Stratified 80/20 Split
   │
   ├───────────────┐
   ▼               ▼
Training Set     Test Set
   │
   ▼
Model Training
   │
   ├── Logistic Regression
   ├── Random Forest
   ├── XGBoost
   └── LightGBM
   │
   ▼
Model Evaluation
   │
   ▼
LightGBM Deployment
   │
   ▼
SHAP Explainability
```
🧠 Explainable AI
A key objective of PhishGuard is to make predictions easier to understand.
Instead of displaying only:
Phishing

the system can provide information such as:
Risk Score: 78

Important Factors:
+ Sensitive words
+ Suspicious hostname structure
+ URL characteristics
- Legitimate-looking path characteristics

The factors shown by the application are generated from the model's actual SHAP contributions rather than manually hardcoded explanations.
💻 Technology Stack
Frontend
- React
- TypeScript
- Next.js
- CSS
- Responsive UI
Backend
- Python
- FastAPI
- Uvicorn
Machine Learning
- LightGBM
- XGBoost
- Random Forest
- Logistic Regression
- Scikit-learn
- SHAP
Data Processing
- Pandas
- NumPy
Testing
- Pytest
- Frontend build verification
- End-to-end API testing
- Responsive UI testing
📁 Project Structure
PHISHGUARD/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   └── types/
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── utils/
│   ├── main.py
│   └── requirements.txt
│
├── ml/
│   ├── data/
│   ├── preprocessing/
│   ├── features/
│   ├── models/
│   ├── evaluation/
│   └── training/
│
├── models/
│   ├── phishguard_model.joblib
│   ├── feature_schema.json
│   └── model_metadata.json
│
├── tests/
│   ├── frontend/
│   ├── backend/
│   └── ml/
│
├── artifacts/
│   ├── metrics/
│   ├── reports/
│   └── visualizations/
│
├── docs/
├── data/
├── README.md
├── PROJECT_STATUS.md
└── .gitignore

🚀 Getting Started
Prerequisites
Make sure you have installed:
- Python 3.10+
- Node.js
- npm
- Git
1. Clone the Repository
git clone https://github.com/bhannu-teja1977/PhishGuard.git
cd PhishGuard

⚙️ Backend Setup
Create and activate a virtual environment.
Windows
python -m venv venv
venv\Scripts\activate

Linux / macOS
python3 -m venv venv
source venv/bin/activate

Install backend dependencies:
pip install -r backend/requirements.txt

Start the FastAPI server:
uvicorn backend.main:app --port 8000 --reload

Backend:
http://localhost:8000

Swagger API documentation:
http://localhost:8000/docs

🌐 Frontend Setup
Open another terminal:
cd frontend
npm install
npm run dev

Open:
http://localhost:3000

🔌 API Endpoints
Method	Endpoint	Description
GET	/api/health	Backend health check
POST	/api/analyze	Analyze a URL
GET	/api/models	Model information
GET	/api/metrics	Model evaluation metrics
GET	/api/dataset	Dataset information


Analyze URL
POST /api/analyze

Example request:
{
  "url": "https://example.com"
}

The response contains information including:
- Classification
- Phishing probability
- Risk score
- Risk level
- Extracted URL characteristics
- Explainability factors
🧪 Testing
Run backend tests:
pytest tests/backend

Run ML tests:
pytest tests/ml

Build the frontend:
cd frontend
npm run build

The project includes tests covering:
- Feature extraction
- ML prediction
- Risk scoring
- SHAP explanations
- API behavior
- Input validation
- Frontend/backend integration
📊 Model Evaluation
The models were evaluated using a stratified 80/20 train-test split.
Results
Model	Accuracy	F1	ROC-AUC
Logistic Regression	84.8%	0.851	0.923
Random Forest	91.0%	0.912	0.968
XGBoost	91.8%	0.920	0.973
LightGBM	92.0%	0.921	0.973


LightGBM was selected for deployment using the project's documented combined F1 and ROC-AUC criterion.
🔐 Security & Scope
PhishGuard is designed as a URL analysis system.
It does not:
- Visit the submitted website
- Execute webpage JavaScript
- Scrape webpage HTML
- Download website content
- Perform live external reputation lookups
The system therefore evaluates the URL based on characteristics available directly from the submitted string.
⚠️ Limitations
PhishGuard should be treated as a machine-learning-based risk assessment tool, not an absolute security authority.
Important limitations include:
1. URL-only analysis
   Website content, JavaScript, page structure, certificates, traffic information, and external reputation signals are not analyzed.
2. False positives and false negatives
   Machine-learning predictions can be incorrect.
3. Dataset dependence
   Model performance depends on the characteristics and distribution of the training dataset.
4. Feature approximation
   Some URL-derived features are approximations of characteristics originally represented in the source dataset.
5. No live threat intelligence
   The system does not query external threat-intelligence databases during analysis.
6. Risk thresholds
   The application's Low/Moderate/High/Critical ranges are visualization thresholds and should not be interpreted as universally validated security standards.
🛣️ Future Improvements
Potential extensions include:
- 🌐 Webpage-content analysis
- 🧩 HTML and JavaScript feature extraction
- 🔐 SSL/TLS certificate analysis
- 🌍 Domain and DNS intelligence
- 📡 Real-time threat-intelligence integration
- 🔄 Continuous model retraining
- 📱 Mobile-friendly security analysis
- 🧠 Advanced ensemble and calibration techniques
- 📈 Continuous monitoring and historical risk tracking
These capabilities are outside the current URL-only implementation.
🎯 Project Objective
The primary objective of PhishGuard is to demonstrate how machine learning and explainable AI can be combined to create a phishing URL analysis system that goes beyond a simple binary prediction.
The system focuses on three core principles:
Detection
    +
Risk Quantification
    +
Explainability

📸 Application
The application provides dedicated interfaces for:
- 🏠 Home
- 🔎 URL Analyzer
- 📊 Prediction Results
- 📈 Model Performance
- ⚙️ How It Works
- 📚 Research & Dataset
- 👨‍💻 About
👨‍💻 Authors
PhishGuard Project Team
Developed as a machine learning and explainable AI project.
📄 License
This project is intended for educational and research purposes.
Please review the licensing and dataset terms applicable to the individual components and source dataset before redistribution or commercial use.
