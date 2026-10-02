import { Github, Code2, Cpu } from 'lucide-react'

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-white mb-6">About PhishGuard</h1>
      
      <p className="text-xl text-cyber-cyan mb-12">
        Explainable Machine Learning-Based Phishing URL Risk Scoring System
      </p>

      <div className="bg-navy-900 border border-gray-800 rounded-2xl p-8 mb-12 text-left">
        <h2 className="text-xl font-bold text-white mb-4">Project Objective</h2>
        <p className="text-gray-400 leading-relaxed">
          PhishGuard is a cybersecurity prototype built to demonstrate the integration of Explainable Artificial Intelligence (XAI) into threat detection. 
          While many systems simply provide a binary "Safe" or "Malicious" result, PhishGuard unpacks the decision-making process using SHAP, 
          providing analysts with transparent, quantifiable reasons for the classification.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        <div className="bg-navy-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Cpu className="text-purple-400 w-6 h-6" />
            <h3 className="font-bold text-white">Machine Learning Stack</h3>
          </div>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>Python</li>
            <li>LightGBM & XGBoost</li>
            <li>Random Forest & Logistic Regression</li>
            <li>SHAP (SHapley Additive exPlanations)</li>
            <li>Scikit-Learn & Pandas</li>
          </ul>
        </div>

        <div className="bg-navy-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Code2 className="text-cyber-blue w-6 h-6" />
            <h3 className="font-bold text-white">Application Stack</h3>
          </div>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>FastAPI (Backend)</li>
            <li>Next.js / React (Frontend)</li>
            <li>TypeScript</li>
            <li>Tailwind CSS</li>
            <li>Recharts & Lucide Icons</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
