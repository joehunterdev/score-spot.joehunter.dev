import { useState } from 'react'
import { ExternalLink, DollarSign, FileText, X } from 'lucide-react'

export function ApartmentDetails({ apartment, onUpdate }) {
  const [showDetails, setShowDetails] = useState(false)
  const [newExclusion, setNewExclusion] = useState('')

  const updateField = (field, value) => {
    onUpdate({
      ...apartment,
      [field]: value
    })
  }

  const addExclusion = () => {
    if (!newExclusion.trim()) return
    const exclusions = apartment.exclusions || []
    updateField('exclusions', [...exclusions, newExclusion.trim()])
    setNewExclusion('')
  }

  const removeExclusion = (index) => {
    const exclusions = apartment.exclusions || []
    updateField('exclusions', exclusions.filter((_, i) => i !== index))
  }

  return (
    <div className="mt-4 border-t border-gray-700 pt-4">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-sm text-[var(--brand-secondary)] hover:text-[var(--brand-primary)] transition-colors mb-2"
      >
        {showDetails ? '▼' : '▶'} Additional Details
      </button>

      {showDetails && (
        <div className="space-y-3 mt-3">
          {/* Budget */}
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <DollarSign className="w-4 h-4" />
              Budget / Rent
            </label>
            <input
              type="text"
              value={apartment.budget || ''}
              onChange={(e) => updateField('budget', e.target.value)}
              placeholder="e.g., $1500/month"
              className="w-full px-3 py-2 bg-[var(--bg-form)] border border-gray-700 rounded-md text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[var(--brand-primary)]"
            />
          </div>

          {/* External Link */}
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <ExternalLink className="w-4 h-4" />
              Listing URL
            </label>
            <input
              type="url"
              value={apartment.externalLink || ''}
              onChange={(e) => updateField('externalLink', e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-[var(--bg-form)] border border-gray-700 rounded-md text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[var(--brand-primary)]"
            />
            {apartment.externalLink && (
              <a
                href={apartment.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[var(--brand-primary)] hover:text-[var(--brand-secondary)] mt-1"
              >
                Open listing <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <FileText className="w-4 h-4" />
              Notes
            </label>
            <textarea
              value={apartment.notes || ''}
              onChange={(e) => updateField('notes', e.target.value)}
              placeholder="Any additional notes..."
              rows={3}
              className="w-full px-3 py-2 bg-[var(--bg-form)] border border-gray-700 rounded-md text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[var(--brand-primary)] resize-none"
            />
          </div>

          {/* Exclusions */}
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-400 mb-1">
              <X className="w-4 h-4" />
              Exclusion Criteria (Deal Breakers)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newExclusion}
                onChange={(e) => setNewExclusion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addExclusion()}
                placeholder="e.g., No Pets, Ground Floor"
                className="flex-1 px-3 py-2 bg-[var(--bg-form)] border border-gray-700 rounded-md text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[var(--brand-primary)]"
              />
              <button
                onClick={addExclusion}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
              >
                Add
              </button>
            </div>
            {apartment.exclusions && apartment.exclusions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {apartment.exclusions.map((exclusion, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-red-900/30 text-red-400 text-xs rounded border border-red-700"
                  >
                    {exclusion}
                    <button
                      onClick={() => removeExclusion(index)}
                      className="hover:text-red-300"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
