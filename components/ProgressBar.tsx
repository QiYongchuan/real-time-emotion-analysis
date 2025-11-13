"use client"

interface ProgressBarProps {
  progress: number
  isAnalyzing: boolean
}

export default function ProgressBar({ progress, isAnalyzing }: ProgressBarProps) {
  if (!isAnalyzing) return null

  return (
    <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
      <div
        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
