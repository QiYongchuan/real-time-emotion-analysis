import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    const apiKey = process.env.AI_STUDIO_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 })
    }

    const base64Image = image.replace(/^data:image\/jpeg;base64,/, "")

    const response = await fetch("https://aistudio.baidu.com/llm/lmapi/v3/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "ernie-4.5-vl-28b-a3b",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: 'Analyze the facial emotion in this image. Respond in JSON format: { "emotion": "happy"|"sad"|"angry"|"surprised"|"fear"|"neutral", "confidence": number (0-100), "description": string }. Only respond with the JSON, no other text.',
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                  detail: "high",
                },
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("ERNIE API error:", error)
      return NextResponse.json({ error: "Failed to analyze emotion" }, { status: 500 })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      throw new Error("No response from API")
    }

    // Parse the JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : null

    if (!result) {
      throw new Error("Could not parse emotion result")
    }

    const emotionMap: { [key: string]: "happy" | "neutral" | "sad" | "angry" | "surprised" | "fear" } = {
      happy: "happy",
      sad: "sad",
      neutral: "neutral",
      angry: "angry",
      surprised: "surprised",
      fear: "fear",
    }

    const emotionType = emotionMap[result.emotion.toLowerCase()] || "neutral"
    const emojiMap = {
      happy: "😊",
      neutral: "😐",
      sad: "😢",
      angry: "😠",
      surprised: "😲",
      fear: "😨",
    }

    return NextResponse.json({
      type: emotionType,
      confidence: Math.min(100, Math.max(0, result.confidence || 0)),
      text: result.description || `Detected: ${emotionType}`,
      emoji: emojiMap[emotionType],
    })
  } catch (error) {
    console.error("API route error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
