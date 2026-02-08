import { Settings } from 'lucide-react'

export function Header({ onSettingsClick }) {
  return (
    <header className="h-16 border-b border-gray-700 px-6 bg-[var(--bg-form)] flex items-center justify-between z-10">
      <div className="flex items-center gap-3">
        <img 
          src="/logo_75.png" 
          alt="Score Spot" 
          className="h-10 w-10"
        />
        <div>
          <h1 className="text-xl font-bold text-[#03f8bd] leading-none">
            Score Spot
          </h1>
          <p className="text-xs text-gray-500">Apartment Comparison Tool</p>
        </div>
      </div>
      <button
        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        onClick={onSettingsClick}
        title="Settings"
      >
        <Settings className="w-5 h-5 text-gray-400" />
      </button>
    </header>
  )
}
