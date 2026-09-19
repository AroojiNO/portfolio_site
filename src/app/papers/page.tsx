import React from 'react'
import { notFound } from 'next/navigation'
import GlassCard from '../components/GlassCard'

// Hidden until the papers are ready: /papers shows the 404 page. Set to true to publish it.
const PAPERS_PUBLISHED = false

const PapersPage: React.FC = () => {
  if (!PAPERS_PUBLISHED) notFound()

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