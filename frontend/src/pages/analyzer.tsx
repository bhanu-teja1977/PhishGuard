import { useState } from 'react'
import { Search, ShieldAlert, ChevronRight, Activity, Code } from 'lucide-react'
import { analyzeUrl, AnalyzeResponse } from '@/services/api'
import RiskGauge from '@/components/RiskGauge'
import ClassificationBadge from '@/components/ClassificationBadge'
import FactorCard from '@/components/FactorCard'

export default function Analyzer() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalyzeResponse | null>(null)
  const [expandedFeatures, setExpandedFeatures] = useState(false)

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const data = await analyzeUrl(url);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Unable to analyze this URL right now.');
    } finally {
      setLoading(false);
    }
  }

  const handleExample = () => {
    setUrl('http://192.168.1.1/secure-update-verify-account.php?id=9928374928374')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Analyze a URL</h1>
        <p className="text-gray-400">Enter a URL to evaluate its phishing risk using our trained ML model.</p>
        
        <form onSubmit={handleAnalyze} className="mt-8 relative max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-navy-800 border border-gray-700 text-white rounded-xl pl-12 pr-32 py-4 focus:outline-none focus:ring-2 focus:ring-cyber-blue transition-all"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="absolute right-2 bg-cyber-blue hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-cyber-blue text-white font-medium rounded-lg px-6 py-2 transition-colors"
            >
              Analyze
            </button>
          </div>
          <div className="mt-4 flex justify-between items-center text-sm">
            <button type="button" onClick={handleExample} className="text-cyber-cyan hover:underline">
              Use Example URL
            </button>
            <span className="text-gray-500">Only structural features are analyzed.</span>
          </div>
        </form>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Activity className="w-12 h-12 text-cyber-blue animate-pulse mb-4" />
          <p className="text-gray-400 animate-pulse">Analyzing URL characteristics...</p>
        </div>
      )}

      {error && (
        <div className="max-w-2xl mx-auto bg-red-900/20 border border-red-900/50 rounded-xl p-6 text-center">
          <ShieldAlert className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      )}

      {result && !loading && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <ClassificationBadge classification={result.classification} probability={result.phishing_probability} />
            <RiskGauge score={result.risk_score} level={result.risk_level} />
          </div>

          <div className="bg-navy-900 border border-gray-800 rounded-2xl p-8 mb-8">
            <h3 className="text-xl font-bold text-white mb-6">Why did PhishGuard reach this result?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.top_factors.map((factor, idx) => (
                <FactorCard key={idx} factor={factor} />
              ))}
            </div>
          </div>

          <div className="bg-navy-900 border border-gray-800 rounded-2xl overflow-hidden mb-8">
            <button 
              onClick={() => setExpandedFeatures(!expandedFeatures)}
              className="w-full flex items-center justify-between p-6 bg-navy-800 hover:bg-navy-800/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Code className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-bold text-white">Extracted URL Characteristics</h3>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform ${expandedFeatures ? 'rotate-90' : ''}`} />
            </button>
            
            {expandedFeatures && (
              <div className="p-6 border-t border-gray-800">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(result.features).map(([key, value]) => (
                    <div key={key} className="bg-navy-800/50 p-3 rounded-lg border border-gray-800/50">
                      <div className="text-xs text-gray-500 mb-1">{key}</div>
                      <div className="font-mono text-sm text-gray-200">{String(value)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <p className="text-center text-sm text-gray-500 mt-12">
            PhishGuard evaluates URL structure and lexical characteristics only. It does not visit or scrape the destination website.
          </p>
        </div>
      )}
    </div>
  )
}
