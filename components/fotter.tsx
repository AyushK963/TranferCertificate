"use client"

import { Mail, Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white py-6 shadow-inner border-t border-gray-700">
      <div className="max-w-5xl mx-auto px-4 flex flex-col items-center text-center space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span>Designed</span>
          <span>by</span>
          <span className="text-yellow-400 font-semibold">Ayush Kankane</span>
        </div>

        <div className="text-sm font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-text-shimmer">
          Kankane Tech
        </div>

        <div className="flex items-center gap-2 text-sm text-blue-200">
          <Mail size={16} />
          <a
            href="mailto:kankanetech@gmail.com"
            className="hover:text-yellow-300 transition duration-300 underline underline-offset-4"
          >
            kankanetech@gmail.com
          </a>
        </div>

        <p className="text-xs text-gray-400 pt-1">
          © {new Date().getFullYear()} Kankane Tech. All rights reserved.
        </p>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        .animate-text-shimmer {
          background-size: 200% 200%;
          animation: shimmer 4s linear infinite;
        }

        @keyframes shimmer {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </footer>
  )
}
