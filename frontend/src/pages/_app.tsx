import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '@/components/Navbar'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-cyber-blue selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
      <footer className="py-6 border-t border-gray-800 text-center text-sm text-gray-500 mt-12">
        <p>PhishGuard &copy; {new Date().getFullYear()} — URL-Only Machine Learning Prototype</p>
      </footer>
    </div>
  )
}
