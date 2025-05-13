import React from 'react'
import GlassCard from '../components/GlassCard'

const ResumePage: React.FC = () => {
  return (
    <div className="flex h-screen items-start justify-center pt-24 bg-[#0a0a0d]"
      style={{}}>
      <div className="glass w-[80vh] h-[80vh] max-w-4xl p-4">
        <iframe
          src="/resume.pdf#zoom=86"
          width="100%"
          height="100%"
          title="Resume PDF"
          allow="scrolling, fullscreen"
        />
        </div>
    </div>
  )
}

export default ResumePage