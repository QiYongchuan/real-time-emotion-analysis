"use client"

import { useEffect, useRef, useState } from "react"

interface CameraViewProps {
  onEmotionDetected: (emotion: {
    type: "happy" | "neutral" | "sad" | "angry" | "surprised" | "fear" | null
    confidence: number
    text: string
    emoji: string
  }) => void
  onError: (error: string) => void
  onAnalysisProgress?: (progress: number) => void
}

export default function CameraView({ onEmotionDetected, onError, onAnalysisProgress }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const analysisIntervalRef = useRef<NodeJS.Timeout>()
  const analysisCounterRef = useRef(0)

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user",
          },
          audio: false,
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play()
          }
          setIsInitialized(true)

          // Start emotion analysis every 5 seconds
          analysisIntervalRef.current = setInterval(() => {
            analysisCounterRef.current = (analysisCounterRef.current + 1) % 6
            onAnalysisProgress?.((analysisCounterRef.current / 6) * 100)
            analyzeEmotion()
          }, 5000)
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to access camera"
        onError(errorMessage)
        console.error("Camera error:", err)
      }
    }

    initCamera()

    return () => {
      if (analysisIntervalRef.current) {
        clearInterval(analysisIntervalRef.current)
      }
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [onError, onAnalysisProgress])

  const captureFrame = async (): Promise<string | null> => {
    if (!videoRef.current || !canvasRef.current) return null

    const context = canvasRef.current.getContext("2d")
    if (!context) return null

    canvasRef.current.width = videoRef.current.videoWidth
    canvasRef.current.height = videoRef.current.videoHeight

    context.scale(-1, 1)
    context.drawImage(videoRef.current, -canvasRef.current.width, 0)

    return canvasRef.current.toDataURL("image/jpeg", 0.8)
  }

  const analyzeEmotion = async () => {
    try {
      const imageData = await captureFrame()
      if (!imageData) return

      const response = await fetch("/api/analyze-emotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze emotion")
      }

      const result = await response.json()
      onEmotionDetected(result)
    } catch (err) {
      console.error("Analysis error:", err)
    }
  }

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
        style={{
          filter: "brightness(1.5) contrast(1.3) saturate(1.1)",
          WebkitFilter: "brightness(1.5) contrast(1.3) saturate(1.1)",
        }}
      />
      <canvas ref={canvasRef} className="hidden" crossOrigin="anonymous" />
    </>
  )
}
