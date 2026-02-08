import { Settings } from 'lucide-react'

export function Header({ onSettingsClick }) {
  return (
    <header className="border-b border-gray-700 px-4 py-3 bg-[rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/logo_75.png" 
            alt="Joe Hunter" 
            className="h-8 w-auto"
          />
          <h1 className="text-lg font-semibold text-[#03f8bd] leading-8">
            Score Spot
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-2 hover:bg-gray-800 rounded-md transition-colors"
            onClick={onSettingsClick}
            title="Settings"
          >
            <Settings className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </div>
    </header>
  )
}
