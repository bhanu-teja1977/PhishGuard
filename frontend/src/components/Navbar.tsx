import Link from 'next/link'
import { ShieldAlert } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="border-b border-gray-800 bg-navy-900/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <ShieldAlert className="text-cyber-accent w-6 h-6" />
            <span className="font-bold text-xl tracking-tight text-white">PHISH<span className="text-cyber-accent">GUARD</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/analyzer" className="hover:text-white transition-colors">Analyzer</Link>
            <Link href="/performance" className="hover:text-white transition-colors">Model Performance</Link>
            <Link href="/research" className="hover:text-white transition-colors">Research</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            
            <Link 
              href="/analyzer" 
              className="bg-cyber-blue hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Analyze URL
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
