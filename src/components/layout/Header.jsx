import { Settings } from 'lucide-react'

export function Header({ onSettingsClick }) {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-700 px-4 py-4 bg-[rgba(0,0,0,0.95)] backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/logo_75.png" 
            alt="Joe Hunter" 
            className="h-10 w-auto"
          />
          <h1 className="text-2xl font-bold text-[#03f8bd] leading-none">
            Score Spot
          </h1>
        </div>
        <button
          className="p-2 hover:bg-gray-800 rounded-md transition-colors"
          onClick={onSettingsClick}
          title="Settings"
        >
          <Settings className="w-6 h-6 text-gray-300" />
        </button>
      </div>
    </header>
  )
}
