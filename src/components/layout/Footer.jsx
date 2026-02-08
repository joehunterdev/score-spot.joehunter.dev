export function Footer() {
  return (
    <footer className="h-12 border-t border-gray-700 px-6 bg-[var(--bg-form)] flex items-center justify-center">
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
