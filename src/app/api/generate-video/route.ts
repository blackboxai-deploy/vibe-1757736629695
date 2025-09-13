import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    }

    const response = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'customerId': 'cus_SvISPbHt7RaYRV',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx'
      },
      body: JSON.stringify({
        model: 'replicate/google/veo-3', 
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Video generation API failed: ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    const videoUrlMatch = content?.match(/https?:\/\/[^\s]+\.(mp4|mov|webm)/i);
    const videoUrl = videoUrlMatch ? videoUrlMatch[0] : null;

    if (!videoUrl) {
      throw new Error('No video URL found in API response');
    }

    return NextResponse.json({ success: true, videoUrl });

  } catch (error) {
    console.error('Video generation error:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
