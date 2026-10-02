import Link from 'next/link'
import { Shield, Brain, Activity, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-5xl mx-auto px-4 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-800 border border-gray-700 text-xs font-semibold text-cyber-cyan mb-8 tracking-widest">
          <Shield className="w-3 h-3" />
          EXPLAINABLE AI • URL SECURITY
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
          Detect Phishing.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-blue to-cyber-cyan">Understand the Risk.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          PhishGuard uses machine learning and explainable AI to analyze URL structure and estimate phishing risk on a 0–100 scale.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/analyzer" className="px-8 py-3 bg-cyber-blue hover:bg-blue-600 text-white font-medium rounded-lg transition-all w-full sm:w-auto shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            Analyze a URL
          </Link>
          <Link href="/performance" className="px-8 py-3 bg-navy-800 hover:bg-gray-800 border border-gray-700 text-gray-300 font-medium rounded-lg transition-all w-full sm:w-auto">
            Explore the Model
          </Link>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="w-full max-w-7xl mx-auto px-4 py-20 border-t border-gray-800/50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon={<Activity className="w-6 h-6 text-cyber-cyan" />}
            title="URL Risk Scoring"
            desc="Convert URL characteristics into a clear 0–100 phishing risk score."
          />
          <FeatureCard 
            icon={<Brain className="w-6 h-6 text-purple-400" />}
            title="Explainable AI"
            desc="Understand which URL characteristics influence the prediction."
          />
          <FeatureCard 
            icon={<Shield className="w-6 h-6 text-green-400" />}
            title="Machine Learning"
            desc="Compare multiple classification models trained on URL-derived features."
          />
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-yellow-400" />}
            title="Real-Time Analysis"
            desc="Analyze a URL instantly without scraping or visiting the destination website."
          />
        </div>
      </section>

      {/* Trust / Transparency Section */}
      <section className="w-full max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-navy-800/50 border border-gray-800 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-bold text-white mb-4">URL-Only Analysis</h2>
          <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto">
            PhishGuard analyzes URL structure and lexical characteristics exclusively. 
            It does <strong className="text-gray-200">not</strong> visit or scrape the submitted website. 
            This intentional limitation protects you from inadvertently triggering malicious payloads or exposing your IP address to attackers during analysis.
          </p>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-navy-900 border border-gray-800 p-6 rounded-xl hover:border-gray-600 transition-colors">
      <div className="bg-navy-800 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
    </div>
  )
}
