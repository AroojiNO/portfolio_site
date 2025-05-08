'use client'

import { useEffect, useRef } from 'react'
const OIL_MASK_SRC = '/oil-spill.png'

export default function OilCutoutMask() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const maskImgRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!

    // load the mask image
    const maskImg = new Image()
    maskImg.src = OIL_MASK_SRC
    maskImg.crossOrigin = 'anonymous'
    maskImg.onload = () => { maskImgRef.current = maskImg }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', resize)
    resize()

    // per‐stripe config
    const lineConfigs = Array.from({ length: 20 }, () => ({
      speed:     0.0002 + Math.random()*0.0002,
      phase:     Math.random()*Math.PI*2,
      vOff:      30 + Math.random()*50,
      angle:     (Math.random()*60-30)*(Math.PI/180),
      lengthFac: 0.5 + Math.random()*1.5,
      freq:      0.005 + Math.random()*0.05,
      amp:       0.3 + Math.random()*0.7,
    }))

    let frame = 0
    function draw() {
      const w = canvas.width, h = canvas.height

      // 1) paint solid black
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, w, h)

      // 2) erase stripes
      ctx.globalCompositeOperation = 'destination-out'
      lineConfigs.forEach((cfg, i) => {
        const { speed, phase, vOff, angle, lengthFac, freq, amp } = cfg
        const thickness = 2 + Math.sin(frame*0.0005 + phase)*3
        const baseY     = (h/lineConfigs.length)*i
        const yCenter   = baseY + Math.sin(frame*speed + phase)*vOff
        const L         = w*lengthFac + thickness*8
        const startX    = -thickness*4

        ctx.save()
        ctx.translate(w/2, h/2)
        ctx.rotate(angle)
        ctx.translate(-w/2, -h/2)

        ctx.beginPath()
        ctx.lineWidth   = thickness
        ctx.lineJoin    = 'round'
        ctx.lineCap     = 'round'
        ctx.strokeStyle = 'rgba(0,0,0,1)'

        const segs = 150
        for (let j=0; j<=segs; j++) {
          const x = startX + (L*j/segs)
          const y = yCenter + Math.sin(x*freq + frame*speed + phase)*vOff*amp
          j===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y)
        }
        ctx.stroke()
        ctx.restore()
      })

      // 3) now only keep that result where the oil‐spill shape is opaque
      const img = maskImgRef.current
      if (img) {
        // fit the image to cover
        const scale = Math.max(w/img.width, h/img.height)
        const iw = img.width * scale
        const ih = img.height * scale
        const dx = (w - iw)/2
        const dy = (h - ih)/2

        ctx.globalCompositeOperation = 'destination-in'
        ctx.drawImage(img, dx, dy, iw, ih)
      }

      frame++
      requestAnimationFrame(draw)
    }

    draw()
    return () => {
      window.removeEventListener('resize', resize)
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