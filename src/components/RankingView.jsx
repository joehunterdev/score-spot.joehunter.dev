import { BarChart3 } from 'lucide-react'

export function RankingView({ apartments, criteria }) {
  const calculateTotalScore = (apartment) => {
    if (!apartment || !apartment.scores) return 0
    
    let totalScore = 0
    let totalWeight = 0
    
    criteria.forEach(criterion => {
      const score = apartment.scores[criterion.id] || 5
      const weight = criterion.critical ? 2 : 1
      totalScore += score * weight
      totalWeight += 10 * weight
    })
    
    return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0
  }

  const rankedApartments = [...apartments].sort((a, b) => 
    calculateTotalScore(b) - calculateTotalScore(a)
  )

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-[var(--brand-primary)]'
    if (score >= 40) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-900/30 border-green-700'
    if (score >= 60) return 'bg-cyan-900/30 border-cyan-700'
    if (score >= 40) return 'bg-yellow-900/30 border-yellow-700'
    return 'bg-red-900/30 border-red-700'
  }

  if (apartments.length === 0) {
    return (
      <div className="text-center py-16">
        <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">No apartments to rank yet.</p>
        <p className="text-gray-500 text-sm mt-2">Add some apartments to see the ranking!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-[var(--brand-primary)]">
          Apartment Rankings
        </h2>
        <div className="text-sm text-gray-400">
          {apartments.length} {apartments.length === 1 ? 'apartment' : 'apartments'}
        </div>
      </div>

      {rankedApartments.map((apartment, index) => {
        const score = calculateTotalScore(apartment)
        return (
          <div
            key={apartment.id}
            className={`p-5 rounded-lg border-2 ${getScoreBg(score)} transition-all hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className={`text-4xl font-bold ${getScoreColor(score)} min-w-[60px]`}>
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {apartment.name}
                  </h3>
                  {apartment.budget && (
                    <p className="text-sm text-gray-400">{apartment.budget}</p>
                  )}
                  {apartment.exclusions && apartment.exclusions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {apartment.exclusions.map((exclusion, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-0.5 bg-red-900/30 text-red-400 rounded border border-red-700"
                        >
                          ⚠️ {exclusion}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className={`text-5xl font-bold ${getScoreColor(score)}`}>
                  {score}%
                </div>
                <div className="text-xs text-gray-500 mt-1">overall score</div>
              </div>
            </div>

            {/* Score breakdown */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {criteria.slice(0, 8).map(criterion => {
                const criterionScore = apartment.scores[criterion.id] || 5
                return (
                  <div
                    key={criterion.id}
                    className="text-xs bg-[var(--bg-dark)] rounded p-2"
                  >
                    <div className={criterion.critical ? 'text-[var(--brand-primary)]' : 'text-gray-400'}>
                      {criterion.name} {criterion.critical && '⭐'}
                    </div>
                    <div className="text-white font-semibold mt-1">
                      {criterionScore}/10
                    </div>
                  </div>
                )
              })}
            </div>

            {apartment.externalLink && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <a
                  href={apartment.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--brand-primary)] hover:text-[var(--brand-secondary)] transition-colors"
                >
                  View Listing →
                </a>
              </div>
            )}
          </div>
        )
      })}

      {/* Legend */}
      <div className="mt-8 p-4 bg-[var(--bg-form)] rounded-lg border border-gray-700">
        <h4 className="text-sm font-semibold text-gray-400 mb-2">Score Guide</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-300">80-100% Excellent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-cyan-500 rounded"></div>
            <span className="text-gray-300">60-79% Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded"></div>
            <span className="text-gray-300">40-59% Fair</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-300">0-39% Poor</span>
          </div>
        </div>
      </div>
    </div>
  )
}
