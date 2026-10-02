export default function RiskGauge({ score, level }: { score: number, level: string }) {
  const getColors = () => {
    switch(level) {
      case 'Low': return 'text-green-500 border-green-500/30 bg-green-500/10';
      case 'Moderate': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      case 'High': return 'text-orange-500 border-orange-500/30 bg-orange-500/10';
      case 'Critical': return 'text-red-500 border-red-500/30 bg-red-500/10';
      default: return 'text-gray-500 border-gray-500/30 bg-gray-500/10';
    }
  };

  const getRingColor = () => {
    switch(level) {
      case 'Low': return 'stroke-green-500';
      case 'Moderate': return 'stroke-yellow-400';
      case 'High': return 'stroke-orange-500';
      case 'Critical': return 'stroke-red-500';
      default: return 'stroke-gray-500';
    }
  };

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`flex flex-col items-center justify-center p-6 rounded-2xl border ${getColors()}`}>
      <div className="relative flex items-center justify-center">
        {/* Background circle */}
        <svg className="w-40 h-40 transform -rotate-90">
          <circle 
            className="stroke-gray-800" 
            strokeWidth="12" 
            fill="transparent" 
            r={radius} 
            cx="80" 
            cy="80" 
          />
          {/* Progress circle */}
          <circle 
            className={`${getRingColor()} transition-all duration-1000 ease-out`} 
            strokeWidth="12" 
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent" 
            r={radius} 
            cx="80" 
            cy="80" 
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-bold">{score}</span>
          <span className="text-xs uppercase tracking-widest opacity-80 font-semibold">{level}</span>
        </div>
      </div>
      <p className="mt-4 text-sm opacity-80 text-center">Calculated Phishing Risk Score</p>
    </div>
  );
}
