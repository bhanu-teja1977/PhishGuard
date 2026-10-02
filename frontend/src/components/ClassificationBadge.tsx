import { ShieldCheck, ShieldAlert } from 'lucide-react'

export default function ClassificationBadge({ classification, probability }: { classification: string, probability: number }) {
  const isPhishing = classification === 'Phishing';
  
  return (
    <div className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center ${
      isPhishing ? 'bg-red-900/10 border-red-900/50' : 'bg-green-900/10 border-green-900/50'
    }`}>
      {isPhishing ? (
        <ShieldAlert className="w-12 h-12 text-red-500 mb-3" />
      ) : (
        <ShieldCheck className="w-12 h-12 text-green-500 mb-3" />
      )}
      
      <h3 className={`text-2xl font-bold tracking-tight ${isPhishing ? 'text-red-400' : 'text-green-400'}`}>
        {classification.toUpperCase()}
      </h3>
      
      <p className="mt-2 text-gray-400 text-sm">
        Phishing Probability: <span className="text-white font-medium">{(probability * 100).toFixed(1)}%</span>
      </p>
    </div>
  )
}
