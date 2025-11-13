"use client"

import { useEffect, useState } from "react"

interface EmotionCount {
  happy: number
  sad: number
  neutral: number
  angry: number
  surprised: number
  fear: number
}

interface EmotionStatsProps {
  emotion: {
    type: "happy" | "neutral" | "sad" | "angry" | "surprised" | "fear" | null
    confidence: number
    text: string
    emoji: string
  }
}

export default function EmotionStats({ emotion }: EmotionStatsProps) {
  const [stats, setStats] = useState<EmotionCount>({
    happy: 0,
    sad: 0,
    neutral: 0,
    angry: 0,
    surprised: 0,
    fear: 0,
  })

  useEffect(() => {
    if (emotion.type && emotion.confidence > 60) {
      setStats((prev) => ({
        ...prev,
        [emotion.type]: prev[emotion.type] + 1,
      }))
    }
  }, [emotion])

  const emotionEmojis: Record<string, string> = {
    happy: "😊",
    sad: "😢",
    neutral: "😐",
    angry: "😠",
    surprised: "😲",
    fear: "😨",
  }

  const emotionLabels: Record<string, string> = {
    happy: "Happy",
    sad: "Sad",
    neutral: "Neutral",
    angry: "Angry",
    surprised: "Surprised",
    fear: "Fear",
  }

  const maxCount = Math.max(...Object.values(stats), 1)

  return (
    <div className="bg-slate-700 rounded-lg p-4 space-y-3">
      <h3 className="text-slate-200 font-semibold text-sm mb-3">情感统计</h3>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(stats).map(([emotion_type, count]) => (
          <div key={emotion_type} className="flex items-center gap-2">
            <span className="text-lg">{emotionEmojis[emotion_type]}</span>
            <div className="flex-1">
              <div className="text-xs text-slate-300">{emotionLabels[emotion_type]}</div>
              <div className="flex items-center gap-1 mt-1">
                <div className="flex-1 h-1.5 bg-slate-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400 font-semibold">{Array(count).fill("⭐").join("")}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
