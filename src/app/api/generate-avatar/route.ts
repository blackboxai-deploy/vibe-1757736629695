import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, companionName } = body;

    if (!prompt || !companionName) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Call the AI image generation service
    const response = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'customerId': 'cus_SvISPbHt7RaYRV',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx'
      },
      body: JSON.stringify({
        model: 'replicate/black-forest-labs/flux-1.1-pro',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Avatar generation API error:', errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    // The AI service should return an image URL
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const imageUrl = data.choices[0].message.content;
      
      return NextResponse.json({
        success: true,
        avatarUrl: imageUrl,
        prompt: prompt
      });
    } else {
      throw new Error('Invalid response format from AI service');
    }

  } catch (error) {
    console.error('Avatar generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate avatar' 
      },
      { status: 500 }
    );
  }
}