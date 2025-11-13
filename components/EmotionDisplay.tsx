"use client"

interface EmotionDisplayProps {
  emotion: {
    type: "happy" | "neutral" | "sad" | "angry" | "surprised" | "fear" | null
    confidence: number
    text: string
    emoji: string
  }
}

export default function EmotionDisplay({ emotion }: EmotionDisplayProps) {
  const getEmotionColor = () => {
    switch (emotion.type) {
      case "happy":
        return "from-yellow-500 to-orange-500"
      case "sad":
        return "from-blue-500 to-indigo-500"
      case "angry":
        return "from-red-500 to-orange-600"
      case "surprised":
        return "from-pink-500 to-purple-500"
      case "fear":
        return "from-purple-600 to-indigo-700"
      case "neutral":
        return "from-slate-500 to-slate-600"
      default:
        return "from-slate-600 to-slate-700"
    }
  }

  const getEmotionBgColor = () => {
    switch (emotion.type) {
      case "happy":
        return "bg-yellow-500/10 border-yellow-500/30"
      case "sad":
        return "bg-blue-500/10 border-blue-500/30"
      case "angry":
        return "bg-red-500/10 border-red-500/30"
      case "surprised":
        return "bg-pink-500/10 border-pink-500/30"
      case "fear":
        return "bg-purple-500/10 border-purple-500/30"
      case "neutral":
        return "bg-slate-500/10 border-slate-500/30"
      default:
        return "bg-slate-600/10 border-slate-600/30"
    }
  }

  const getEmotionMessage = () => {
    switch (emotion.type) {
      case "happy":
        return "你在笑哎！你笑起来是最可爱的啦，一定要多笑呀"
      case "sad":
        return "别难过，一切都会过去的。让我们找些快乐的事情想想吧"
      case "angry":
        return "深呼吸吧，让我们平复一下心情，一切都会好起来的"
      case "surprised":
        return "哇！你看起来惊喜满满，是发生了什么好事呢？"
      case "fear":
        return "别害怕，你已经很勇敢了。我们一起面对它吧"
      case "neutral":
        return "你似乎在思考什么东西，你在想什么呢？笑一笑吧！"
      default:
        return emotion.text
    }
  }

  return (
    <div className={`rounded-lg border p-6 transition-all duration-300 ${getEmotionBgColor()}`}>
      <div className="flex items-center gap-4">
        <div className={`text-5xl font-bold bg-gradient-to-r ${getEmotionColor()} bg-clip-text text-transparent`}>
          {emotion.emoji}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-2">{getEmotionMessage()}</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">置信度：</span>
            <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getEmotionColor()} transition-all duration-300`}
                style={{ width: `${emotion.confidence}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-slate-300 ml-2">{Math.round(emotion.confidence)}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
