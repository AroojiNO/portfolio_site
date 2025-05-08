'use client'

import { useEffect, useRef } from 'react'

export default function OilCutoutMask() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)
    resize()

    const lineConfigs = Array.from({ length: 12 }, (_, i) => ({
      speed: 0.02 + Math.random() * 0.015,
      phaseOffset: Math.random() * 2000,
      amplitude: 40 + Math.random() * 60,
      frequency: 0.0015 + Math.random() * 0.001,
      verticalOffset: Math.random() * 60
    }))

    function draw(t: number) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Full black background
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineCap = 'round'

      for (let i = 0; i < lineConfigs.length; i++) {
        const { speed, phaseOffset, amplitude, frequency, verticalOffset } = lineConfigs[i]
        const baseY = (canvas.height / (lineConfigs.length + 2)) * (i + 1)
        const y = baseY + Math.sin(t * 0.002 + phaseOffset) * verticalOffset

        ctx.beginPath()
        let first = true

        for (let x = 0; x <= canvas.width; x += 30) {
          const dx = Math.sin((x + t * speed + phaseOffset) * frequency) * amplitude
          const nextX = x + 30
          const nextDx = Math.sin((nextX + t * speed + phaseOffset) * frequency) * amplitude
          const cpX = x + 15
          const cpY = y + dx

          if (first) {
            ctx.moveTo(x, y + dx)
            first = false
          } else {
            ctx.quadraticCurveTo(cpX, cpY, nextX, y + nextDx)
          }
        }

        ctx.strokeStyle = 'rgba(0, 0, 0, 1)'
        ctx.lineWidth = 12 + Math.sin(t * 0.005 + i) * 4
        ctx.stroke()
      }

      ctx.globalCompositeOperation = 'source-over'
      animationFrameId = requestAnimationFrame(draw)
    }

    animationFrameId = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-screen h-screen z-10"
      style={{ pointerEvents: 'none' }}
    />
  )
}