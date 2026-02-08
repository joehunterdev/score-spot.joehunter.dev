import { RotateCcw } from 'lucide-react'

export function Header({ onResetClick }) {
  return (
    <header className="h-16 px-8 bg-black/80 flex items-center justify-between z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.35)]">
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
        className="p-2.5 hover:bg-red-900/50 rounded-md transition-colors text-red-400 hover:text-red-300"
        onClick={onResetClick}
        title="Reset All Data"
      >
        <RotateCcw className="w-5 h-5" />
      </button>
    </header>
  )
}
