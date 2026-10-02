export default function Research() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-white mb-12">Research & Methodology</h1>
      
      <div className="space-y-12 text-gray-300 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">Dataset</h2>
          <p>
            PhishGuard uses a modified version of a standard 10,000-record Kaggle dataset (5,000 phishing, 5,000 legitimate). 
            The original dataset contained 50 features, but many required scraping the HTML content of the target website (e.g., checking for IFRAMEs or pop-up windows).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">System Scope & Feature Engineering</h2>
          <p className="mb-4">
            A critical architectural decision was made to restrict inference exclusively to <strong>URL-only structural features</strong>. 
            We dropped approximately 22 HTML-dependent features and retained exactly 26 lexical characteristics (like URL length, counts of specific symbols, and domain hierarchies).
          </p>
          <p>
            This ensures that analyzing a URL is instant, privacy-preserving, and immune to IP blocking or malicious payload execution that would occur if we actually fetched the webpage.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">Model Comparison</h2>
          <p>
            Four models were evaluated using an 80/20 train/test split with a fixed random seed:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li><strong>Logistic Regression:</strong> Provided a strong baseline but struggled with non-linear feature combinations.</li>
            <li><strong>Random Forest:</strong> Solved non-linearity and performed excellently out-of-the-box.</li>
            <li><strong>XGBoost & LightGBM:</strong> Both gradient boosting frameworks pushed ROC-AUC above 0.97. LightGBM was selected for deployment due to fractional advantages in the F1 score and exceptional inference speed.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">Explainability via SHAP</h2>
          <p>
            Security tools are often "black boxes". PhishGuard uses SHAP (SHapley Additive exPlanations) to demystify its predictions. 
            By calculating the marginal contribution of each feature across all possible feature combinations, the system can definitively point out exactly <em>why</em> a URL was flagged.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-800 pb-2">Limitations</h2>
          <p>
            Because we do not scrape HTML, our theoretical maximum accuracy drops from ~98% (using the full 50 features) to ~92% (using the 26 URL features). 
            This is a deliberate trade-off prioritizing safety, speed, and API reliability over marginal accuracy gains.
          </p>
        </section>
      </div>
    </div>
  )
}
