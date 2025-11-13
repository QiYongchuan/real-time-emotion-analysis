"use client"

import { useEffect, useRef } from "react"

interface AdvancedEffectCanvasProps {
  emotion: {
    type: "happy" | "neutral" | "sad" | "angry" | "surprised" | "fear" | null
    confidence: number
    text: string
    emoji: string
  }
  isActive: boolean
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  type: "petal" | "raindrop" | "star" | "fire" | "sparkle" | "wave" | "glow"
  color?: string
  rotation?: number
}

export default function AdvancedEffectCanvas({ emotion, isActive }: AdvancedEffectCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()
  const lastEmotionRef = useRef(emotion.type)
  const effectStartTimeRef = useRef(0)
  const emojiRef = useRef<{ x: number; y: number; scale: number; opacity: number }>()

  useEffect(() => {
    if (emotion.type !== lastEmotionRef.current) {
      lastEmotionRef.current = emotion.type
      if (emotion.type) {
        effectStartTimeRef.current = Date.now()
        particlesRef.current = []
        generateParticles()
        initializeEmoji()
      }
    }
  }, [emotion.type])

  const generateParticles = () => {
    let particleCount = 60

    if (emotion.type === "happy") {
      particleCount = 120
      for (let i = 0; i < particleCount; i++) {
        const randomSize = Math.random()
        const shape = Math.random()
        particlesRef.current.push({
          x: Math.random() * (canvasRef.current?.width || 800),
          y: -20,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 3 + 2,
          life: 180,
          maxLife: 180,
          size: Math.random() * 12 + 4,
          type: "petal",
          color: shape < 0.33 ? "hsl(45, 100%, 60%)" : shape < 0.66 ? "hsl(0, 100%, 60%)" : "hsl(200, 100%, 60%)",
          rotation: Math.random() * Math.PI * 2,
        })
      }
    } else if (emotion.type === "sad") {
      particleCount = 80
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * (canvasRef.current?.width || 800),
          y: -50,
          vx: (Math.random() - 0.5) * 0.5,
          vy: Math.random() * 2 + 3,
          life: 200,
          maxLife: 200,
          size: Math.random() * 3 + 2,
          type: "raindrop",
          color: "rgba(59, 130, 246, 0.7)",
        })
      }
    } else if (emotion.type === "angry") {
      particleCount = 90
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * (canvasRef.current?.width || 800),
          y: -30,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 2 + 2,
          life: 120,
          maxLife: 120,
          size: Math.random() * 6 + 2,
          type: "fire",
          color: `hsl(${Math.random() * 20 + 0}, 100%, ${Math.random() * 40 + 50}%)`,
          rotation: Math.random() * Math.PI * 2,
        })
      }
    } else if (emotion.type === "surprised") {
      particleCount = 100
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 2 + 1
        particlesRef.current.push({
          x: (canvasRef.current?.width || 800) / 2 + Math.cos(angle) * 50,
          y: -50,
          vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 1,
          vy: Math.sin(angle) * speed + (Math.random() + 1),
          life: 150,
          maxLife: 150,
          size: Math.random() * 5 + 2,
          type: "sparkle",
          color: `hsl(${Math.random() * 360}, 100%, 60%)`,
        })
      }
    } else if (emotion.type === "fear") {
      particleCount = 80
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * (canvasRef.current?.width || 800),
          y: -40,
          vx: (Math.random() - 0.5) * 1.5,
          vy: Math.random() * 2 + 1.5,
          life: 200,
          maxLife: 200,
          size: Math.random() * 20 + 8,
          type: "wave",
          color: "rgba(147, 51, 234, 0.3)",
        })
      }
    } else if (emotion.type === "neutral") {
      particleCount = 60
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * (canvasRef.current?.width || 800),
          y: -40,
          vx: (Math.random() - 0.5) * 0.8,
          vy: Math.random() * 1.5 + 1,
          life: 180,
          maxLife: 180,
          size: Math.random() * 4 + 2,
          type: "star",
          color: "rgba(148, 163, 184, 0.6)",
          rotation: Math.random() * Math.PI * 2,
        })
      }
    }
  }

  const initializeEmoji = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    emojiRef.current = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      scale: 0.5,
      opacity: 0,
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.02)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (!emotion.type) {
        animationRef.current = requestAnimationFrame(animate)
        return
      }

      const elapsedTime = Date.now() - effectStartTimeRef.current
      const effectDuration = 3000 // 3 seconds
      const isEffectActive = elapsedTime < effectDuration

      particlesRef.current = particlesRef.current.filter((p) => p.life > 0)

      particlesRef.current.forEach((particle) => {
        if (!isEffectActive) particle.life = 0

        particle.life--
        const progress = 1 - particle.life / particle.maxLife

        if (particle.type === "petal") {
          particle.y += particle.vy
          particle.x += particle.vx + Math.sin(progress * Math.PI * 2) * 0.3
          particle.rotation = (particle.rotation || 0) + 0.1
          const opacity = progress < 0.9 ? 0.8 : Math.sin((1 - progress) * Math.PI) * 0.8
          ctx.fillStyle = particle.color || "rgba(255, 215, 0, 1)"
          ctx.globalAlpha = opacity
          ctx.save()
          ctx.translate(particle.x, particle.y)
          ctx.rotate(particle.rotation)
          ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
          ctx.restore()
        } else if (particle.type === "raindrop") {
          particle.y += particle.vy
          particle.x += particle.vx
          const opacity = progress < 0.8 ? 0.7 : Math.sin(((1 - progress) / 0.2) * Math.PI) * 0.7
          ctx.strokeStyle = particle.color || "rgba(59, 130, 246, 0.7)"
          ctx.globalAlpha = opacity
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y - particle.size)
          ctx.lineTo(particle.x, particle.y + particle.size)
          ctx.stroke()
        } else if (particle.type === "fire") {
          particle.y += particle.vy
          particle.x += particle.vx
          particle.rotation = (particle.rotation || 0) + 0.1
          const opacity = progress < 0.8 ? 0.8 : Math.sin(((1 - progress) / 0.2) * Math.PI) * 0.8
          ctx.fillStyle = particle.color || "rgba(255, 0, 0, 0.8)"
          ctx.globalAlpha = opacity
          ctx.save()
          ctx.translate(particle.x, particle.y)
          ctx.rotate(particle.rotation)
          ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
          ctx.restore()
        } else if (particle.type === "sparkle") {
          particle.y += particle.vy
          particle.x += particle.vx
          const opacity = progress < 0.85 ? 0.9 : Math.sin(((1 - progress) / 0.15) * Math.PI) * 0.9
          ctx.fillStyle = particle.color || "rgba(255, 255, 0, 0.8)"
          ctx.globalAlpha = opacity
          drawStar(ctx, particle.x, particle.y, particle.size)
        } else if (particle.type === "wave") {
          particle.y += particle.vy
          particle.x += particle.vx
          const waveOffset = Math.sin(progress * Math.PI * 3) * 10
          const opacity = progress < 0.8 ? 0.4 : Math.sin(((1 - progress) / 0.2) * Math.PI) * 0.4
          ctx.fillStyle = particle.color || "rgba(147, 51, 234, 0.3)"
          ctx.globalAlpha = opacity
          ctx.beginPath()
          ctx.arc(particle.x + waveOffset, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()
        } else if (particle.type === "star") {
          particle.y += particle.vy
          particle.x += particle.vx
          particle.rotation = (particle.rotation || 0) + 0.02
          const opacity = progress < 0.85 ? 0.6 : Math.sin(((1 - progress) / 0.15) * Math.PI) * 0.6
          ctx.fillStyle = particle.color || "rgba(148, 163, 184, 0.6)"
          ctx.globalAlpha = opacity
          ctx.save()
          ctx.translate(particle.x, particle.y)
          ctx.rotate(particle.rotation)
          drawStar(ctx, 0, 0, particle.size)
          ctx.restore()
        }
      })

      ctx.globalAlpha = 1

      if (emojiRef.current) {
        const emojiProgress = Math.min(elapsedTime / 500, 1)
        emojiRef.current.scale = 0.5 + emojiProgress * 0.5
        emojiRef.current.opacity = Math.sin(emojiProgress * Math.PI) * 0.9

        if (emojiRef.current.opacity > 0) {
          ctx.save()
          ctx.globalAlpha = emojiRef.current.opacity
          ctx.font = `${Math.round(100 * emojiRef.current.scale)}px Arial`
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(emotion.emoji, emojiRef.current.x, emojiRef.current.y)
          ctx.restore()
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [emotion.type, emotion.emoji])

  const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const sx = size / 2
    const sy = size / 2
    ctx.beginPath()
    ctx.moveTo(x, y + sy)
    ctx.bezierCurveTo(x - sx, y, x - sx, y - sy / 2, x - sx / 2, y - sy / 2)
    ctx.bezierCurveTo(x, y - sy, x, y - sy, x, y - sy)
    ctx.bezierCurveTo(x, y - sy, x, y - sy, x + sx / 2, y - sy / 2)
    ctx.bezierCurveTo(x + sx, y - sy / 2, x + sx, y, x, y + sy)
    ctx.fill()
  }

  const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    ctx.beginPath()
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2
      const px = x + Math.cos(angle) * size
      const py = y + Math.sin(angle) * size
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.fill()
  }

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />
}
