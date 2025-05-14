import React from 'react'
import GlassCard from '../components/GlassCard'

const PapersPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0d] pointer-events-none">
      <GlassCard>
        <h1 className="text-4xl font-bold mb-4 text-white">Not Ready Yet :)</h1>
        <p className="text-lg mb-2 text-yellow-300">Under Construction</p>
        <p className="text-gray-400 animate-pulse">Coming Soon...</p>
      </GlassCard>
    </div>
  )
}

export default PapersPage