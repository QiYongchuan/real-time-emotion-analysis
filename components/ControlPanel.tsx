"use client"

interface ControlPanelProps {
  isRecording: boolean
  onStart: () => void
  onStop: () => void
  disabled?: boolean
}

export default function ControlPanel({ isRecording, onStart, onStop, disabled }: ControlPanelProps) {
  return (
    <div className="flex gap-4">
      <button
        onClick={onStart}
        disabled={isRecording || disabled}
        className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
      >
        {isRecording ? "摄像头活跃中" : "开始体验"}
      </button>
      {isRecording && (
        <button
          onClick={onStop}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          停止
        </button>
      )}
    </div>
  )
}
