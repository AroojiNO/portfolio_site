import React from 'react'
import GlassCard from '../components/GlassCard'

const ResumePage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-start justify-center pt-24 bg-[#0a0a0d]">
      <GlassCard className="w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 p-4">
        <iframe
          src="/resume.pdf"
          title="Resume PDF"
          className="w-full h-[90vh] border-none"
        />
      </GlassCard>
    </div>
  )
}

export default ResumePage