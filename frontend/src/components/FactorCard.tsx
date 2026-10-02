import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { TopFactor } from '@/services/api'

export default function FactorCard({ factor }: { factor: TopFactor }) {
  const isIncreased = factor.direction === 'increased';
  
  return (
    <div className="bg-navy-800 p-4 rounded-xl border border-gray-800 flex items-start gap-4">
      <div className={`p-2 rounded-lg ${isIncreased ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
        {isIncreased ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
      </div>
      <div>
        <h4 className="font-semibold text-gray-200">{factor.feature}</h4>
        <p className="text-sm text-gray-400 mt-1">{factor.explanation}</p>
        <div className="text-xs text-gray-500 mt-2 font-mono">
          SHAP Magnitude: {factor.magnitude.toFixed(4)}
        </div>
      </div>
    </div>
  )
}
