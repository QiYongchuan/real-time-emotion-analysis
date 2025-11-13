"use client"

import { useEffect, useRef } from "react"

interface EffectCanvasProps {
  emotion: {
    type: "happy" | "neutral" | "sad" | null
    confidence: number
    text: string
    emoji: string
  }
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
}

export default function EffectCanvas({ emotion }: EffectCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()
  const lastEmotionRef = useRef(emotion.type)

  useEffect(() => {
    if (emotion.type !== lastEmotionRef.current) {
      lastEmotionRef.current = emotion.type
      // Add particles on emotion change
      addParticles()
    }
  }, [emotion.type])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particlesRef.current = particlesRef.current.filter((p) => p.life > 0)

      particlesRef.current.forEach((particle, index) => {
        particle.life--
        const progress = 1 - particle.life / particle.maxLife

        if (emotion.type === "happy") {
          // Golden hearts rising
          particle.y -= 2
          particle.x += particle.vx * 0.5
          ctx.fillStyle = `rgba(255, 215, 0, ${0.8 * (particle.life / particle.maxLife)})`
          drawHeart(ctx, particle.x, particle.y, particle.size)
        } else if (emotion.type === "sad") {
          // Blue raindrops falling
          particle.y += 3
          particle.x += particle.vx * 0.3
          ctx.fillStyle = `rgba(59, 130, 246, ${0.7 * (particle.life / particle.maxLife)})`
          drawRaindrop(ctx, particle.x, particle.y, particle.size)
        } else if (emotion.type === "neutral") {
          // Ambient light aura
          particle.x += particle.vx
          particle.y += particle.vy
          ctx.fillStyle = `rgba(148, 163, 184, ${0.3 * (particle.life / particle.maxLife)})`
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [emotion.type])

  const addParticles = () => {
    const particleCount = 20
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = Math.random() * 3 + 1

      particlesRef.current.push({
        x: Math.random() * (canvasRef.current?.width || 400),
        y: canvasRef.current?.height || 300,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 100,
        maxLife: 100,
        size: Math.random() * 5 + 3,
      })
    }
  }

  const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath()
    ctx.moveTo(x, y + size / 2)
    ctx.bezierCurveTo(x - size / 2, y, x - size / 2, y - size / 2, x, y - size / 2)
    ctx.bezierCurveTo(x + size / 2, y - size / 2, x + size / 2, y, x, y + size / 2)
    ctx.fill()
  }

  const drawRaindrop = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillRect(x - size / 4, y, size / 2, size * 1.5)
  }

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}
