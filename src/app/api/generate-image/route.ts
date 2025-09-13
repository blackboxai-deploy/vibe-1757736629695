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
        model: 'replicate/black-forest-labs/flux-1.1-pro',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Image generation API failed: ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    const imageUrlMatch = content?.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/i);
    const imageUrl = imageUrlMatch ? imageUrlMatch[0] : null;

    if (!imageUrl) {
      throw new Error('No image URL found in API response');
    }

    return NextResponse.json({ success: true, imageUrl });

  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
