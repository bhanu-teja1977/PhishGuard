import { useEffect, useState } from 'react'
import { getMetrics, getModels, getDataset } from '@/services/api'
import { Activity, Database, CheckCircle, BrainCircuit } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

export default function Performance() {
  const [metrics, setMetrics] = useState<any>(null)
  const [metadata, setMetadata] = useState<any>(null)
  const [dataset, setDataset] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([getMetrics(), getModels(), getDataset()])
      .then(([m, meta, ds]) => {
        setMetrics(m)
        setMetadata(meta)
        setDataset(ds)
        setLoading(false)
      })
      .catch(err => {
        setError("Failed to load model metrics from the API.")
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="text-center py-20 text-gray-400">Loading performance data...</div>
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>

  // Format data for Recharts
  const chartData = Object.keys(metrics).map(modelName => ({
    name: modelName,
    F1: Number((metrics[modelName].F1_Score * 100).toFixed(1)),
    ROC: Number((metrics[modelName].ROC_AUC * 100).toFixed(1)),
    Accuracy: Number((metrics[modelName].Accuracy * 100).toFixed(1))
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Model Performance</h1>
      <p className="text-gray-400 mb-12">Evaluation metrics for the four classifiers trained on URL-only features.</p>
      
      {/* Selected Model Highlight */}
      <div className="bg-gradient-to-r from-navy-800 to-navy-900 border border-cyber-blue/30 rounded-2xl p-8 mb-12 shadow-[0_0_15px_rgba(59,130,246,0.1)] flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-cyber-cyan mb-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold uppercase tracking-wider text-sm">Deployed Model</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">{metadata?.model_name || 'LightGBM'}</h2>
          <p className="text-gray-400 max-w-xl">{metadata?.reasoning || 'Selected dynamically based on the highest combined F1 and ROC-AUC score.'}</p>
        </div>
        <div className="hidden md:flex items-center justify-center bg-navy-900 w-24 h-24 rounded-full border border-gray-700">
          <BrainCircuit className="w-10 h-10 text-cyber-blue" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Chart */}
        <div className="bg-navy-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Performance Comparison (%)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" tick={{fill: '#9ca3af'}} />
                <YAxis domain={[80, 100]} stroke="#6b7280" tick={{fill: '#9ca3af'}} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#f3f4f6' }}
                  itemStyle={{ color: '#f3f4f6' }}
                />
                <Legend />
                <Bar dataKey="F1" fill="#3b82f6" name="F1 Score" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ROC" fill="#06b6d4" name="ROC-AUC" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dataset Info */}
        <div className="bg-navy-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Database className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">Dataset Intelligence</h3>
          </div>
          <div className="space-y-4">
            <InfoRow label="Original Records" value={dataset?.total_records.toLocaleString() || '10,000'} />
            <InfoRow label="Class Balance" value="50% Phishing / 50% Legitimate" />
            <InfoRow label="Original Features" value={dataset?.feature_count || '50'} />
            <InfoRow label="Retained URL-Only Features" value={dataset?.url_only_feature_count || '26'} highlight />
            <InfoRow label="Train Split" value={dataset?.train_size.toLocaleString() || '8,000'} />
            <InfoRow label="Test Split" value={dataset?.test_size.toLocaleString() || '2,000'} />
          </div>
          <div className="mt-6 p-4 bg-navy-800 rounded-lg border border-gray-700 text-sm text-gray-400">
            <strong>Limitation:</strong> Removing 22 HTML-dependent features naturally reduces maximum possible accuracy but ensures live inference is safe and fast.
          </div>
        </div>
      </div>

      {/* Metrics Table */}
      <div className="bg-navy-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h3 className="text-lg font-bold text-white">Detailed Evaluation Metrics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-navy-800 text-gray-300">
              <tr>
                <th className="px-6 py-3 font-medium">Model</th>
                <th className="px-6 py-3 font-medium">Accuracy</th>
                <th className="px-6 py-3 font-medium">Precision</th>
                <th className="px-6 py-3 font-medium">Recall</th>
                <th className="px-6 py-3 font-medium">F1 Score</th>
                <th className="px-6 py-3 font-medium">ROC-AUC</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(metrics).map(([name, m]: [string, any], i) => (
                <tr key={name} className={i % 2 === 0 ? 'bg-navy-900' : 'bg-navy-800/30'}>
                  <td className="px-6 py-4 font-medium text-white">{name}</td>
                  <td className="px-6 py-4">{(m.Accuracy * 100).toFixed(2)}%</td>
                  <td className="px-6 py-4">{(m.Precision * 100).toFixed(2)}%</td>
                  <td className="px-6 py-4">{(m.Recall * 100).toFixed(2)}%</td>
                  <td className="px-6 py-4 font-semibold text-cyber-blue">{(m.F1_Score * 100).toFixed(2)}%</td>
                  <td className="px-6 py-4 font-semibold text-cyber-cyan">{(m.ROC_AUC * 100).toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value, highlight = false }: { label: string, value: string | number, highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
      <span className="text-gray-400">{label}</span>
      <span className={`font-mono font-medium ${highlight ? 'text-cyber-accent bg-cyber-blue/10 px-2 py-0.5 rounded' : 'text-gray-200'}`}>
        {value}
      </span>
    </div>
  )
}
