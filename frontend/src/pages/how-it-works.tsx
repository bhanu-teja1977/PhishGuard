import { ArrowDown } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      id: "01",
      title: "URL Input",
      desc: "The system accepts a raw URL string without executing HTTP requests to the destination."
    },
    {
      id: "02",
      title: "Feature Extraction",
      desc: "Lexical and structural characteristics are extracted deterministically using regex and string matching."
    },
    {
      id: "03",
      title: "Machine Learning",
      desc: "The ordered feature vector is passed to the compiled LightGBM tree-based classifier."
    },
    {
      id: "04",
      title: "Probability Estimation",
      desc: "The model outputs a raw float representing the mathematical probability of the URL being phishing."
    },
    {
      id: "05",
      title: "Risk Scoring",
      desc: "Probability is scaled to a 0–100 Risk Score and assigned a human-readable Risk Level (e.g., Critical)."
    },
    {
      id: "06",
      title: "SHAP Explainability",
      desc: "The TreeExplainer calculates the exact marginal contribution of each feature to the final prediction."
    }
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-white mb-6 text-center">System Architecture</h1>
      <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
        PhishGuard operates entirely on the structural data of the URL itself. Here is the step-by-step pipeline.
      </p>

      <div className="flex flex-col items-center">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex flex-col items-center w-full">
            <div className="w-full max-w-lg bg-navy-900 border border-gray-800 rounded-2xl p-6 shadow-lg relative">
              <div className="absolute -left-4 -top-4 w-10 h-10 bg-cyber-blue text-white font-bold rounded-xl flex items-center justify-center shadow-lg">
                {step.id}
              </div>
              <h3 className="text-xl font-bold text-white mb-2 ml-4">{step.title}</h3>
              <p className="text-gray-400 ml-4">{step.desc}</p>
            </div>
            {idx < steps.length - 1 && (
              <div className="py-4">
                <ArrowDown className="w-6 h-6 text-gray-600" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
