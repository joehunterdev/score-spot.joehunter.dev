export function Footer() {
  return (
    <footer className="h-12 px-8 bg-black/80 flex items-center justify-center shadow-[0_2px_5px_-2px_rgba(0,0,0,0.35)]">
      <p className="text-xs text-gray-500">
        © {new Date().getFullYear()} Score Spot by{' '}
        <a 
          href="https://joehunter.dev" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#03f8bd] hover:text-[#8869b4] transition-colors"
        >
          Joe Hunter
        </a>
      </p>
    </footer>
  )
}
