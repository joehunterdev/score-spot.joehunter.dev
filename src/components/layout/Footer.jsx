export function Footer() {
  return (
    <footer className="border-t border-gray-700 px-4 py-6 bg-[rgba(0,0,0,0.8)] mt-auto">
      <div className="max-w-7xl mx-auto text-center text-sm text-gray-400">
        <p>
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
      </div>
    </footer>
  )
}
