"use client"

import { useState } from "react"
import CameraView from "@/components/CameraView"
import EmotionDisplay from "@/components/EmotionDisplay"
import AdvancedEffectCanvas from "@/components/AdvancedEffectCanvas"
import ControlPanel from "@/components/ControlPanel"
import ProgressBar from "@/components/ProgressBar"
import EmotionStats from "@/components/EmotionStats"

export default function Home() {
  const [isRecording, setIsRecording] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [emotion, setEmotion] = useState<{
    type: "happy" | "neutral" | "sad" | "angry" | "surprised" | "fear" | null
    confidence: number
    text: string
    emoji: string
  }>({
    type: null,
    confidence: 0,
    text: "Ready to analyze your emotion",
    emoji: "😊",
  })
  const [cameraError, setCameraError] = useState<string | null>(null)

  const handleStartRecording = async () => {
    setIsRecording(true)
    setCameraError(null)
    setAnalysisProgress(0)
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    setAnalysisProgress(0)
  }

  const handleEmotionUpdate = (newEmotion: typeof emotion) => {
    setEmotion(newEmotion)
  }

  const handleCameraError = (error: string) => {
    setCameraError(error)
    setIsRecording(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">表情识别器</h1>
          <p className="text-slate-400 text-lg">由AI驱动的实时情绪检测</p>
        </div>

        {/* Main Content Container */}
        <div className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
          {/* Camera Section */}
          <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden">
            {isRecording ? (
              <>
                <CameraView
                  onEmotionDetected={handleEmotionUpdate}
                  onError={handleCameraError}
                  onAnalysisProgress={setAnalysisProgress}
                />
                <AdvancedEffectCanvas emotion={emotion} isActive={isRecording} />
              </>
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-4">📷</div>
                <p className="text-slate-400 mb-4">{cameraError ? cameraError : '点击"开始体验"来开始'}</p>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {isRecording && <ProgressBar progress={analysisProgress} isAnalyzing={isRecording} />}

          {/* Info Section */}
          <div className="p-6 space-y-6">
            {/* Emotion Display */}
            <EmotionDisplay emotion={emotion} />

            {/* Control Panel */}
            <ControlPanel
              isRecording={isRecording}
              onStart={handleStartRecording}
              onStop={handleStopRecording}
              disabled={!!cameraError}
            />

            <EmotionStats emotion={emotion} />

            {/* Info Box */}
            <div className="bg-slate-700 rounded-lg p-4 text-sm text-slate-300 space-y-2">
              <p>
                <span className="font-semibold text-slate-200">注意：</span> 本应用使用您的摄像头实时分析面部表情。
              </p>
              <p>
                <span className="font-semibold text-slate-200">提示：</span>{" "}
                您的照片不会被存储或上传——所有处理都在您的浏览器中进行。
              </p>
               <p>
                <span className="font-semibold text-slate-200">说明：</span>{" "}
               具体模型ERNIE 4.5-VL-28B-A3B-Thinking
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
