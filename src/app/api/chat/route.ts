import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, companion, conversationHistory, userPreferences } = body;

    if (!message || !companion) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Build personality-driven system prompt
    const systemPrompt = buildSystemPrompt(companion);

    // Prepare conversation context
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      // Include recent conversation history (last 10 messages)
      ...(conversationHistory || []).slice(-10).map((msg: any) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    // Call the AI chat service
    const response = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'customerId': 'cus_SvISPbHt7RaYRV',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx'
      },
      body: JSON.stringify({
        model: 'openrouter/claude-sonnet-4',
        messages: messages,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Chat API error:', errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const reply = data.choices[0].message.content;
      
      return NextResponse.json({
        success: true,
        message: reply,
        timestamp: new Date().toISOString()
      });
    } else {
      throw new Error('Invalid response format from AI service');
    }

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get response' 
      },
      { status: 500 }
    );
  }
}

function buildSystemPrompt(companion: any) {
  const { name, personality, background, relationshipType, responseStyle, interests } = companion;
  
  // Personality traits analysis
  const traits = [];
  if (personality.extroversion > 60) traits.push("outgoing and social");
  else if (personality.extroversion < 40) traits.push("more reserved and thoughtful");
  
  if (personality.playfulness > 70) traits.push("playful and fun-loving");
  else if (personality.playfulness < 30) traits.push("serious and focused");
  
  if (personality.supportiveness > 70) traits.push("very supportive and encouraging");
  else if (personality.supportiveness < 30) traits.push("more challenging and direct");
  
  if (personality.emotionality > 60) traits.push("emotionally expressive and empathetic");
  else if (personality.emotionality < 40) traits.push("logical and analytical");
  
  if (personality.romanticism > 60) traits.push("romantic and affectionate");
  else if (personality.romanticism < 40) traits.push("more platonic and friendly");
  
  if (personality.formality > 60) traits.push("formal and polite in communication");
  else if (personality.formality < 40) traits.push("casual and relaxed in speech");

  // Response style preferences
  const lengthGuide = responseStyle.length === 'short' ? "Keep responses concise and to the point." :
                     responseStyle.length === 'long' ? "Provide detailed, thoughtful responses." :
                     "Balance brevity with sufficient detail.";
  
  const detailGuide = responseStyle.detail === 'simple' ? "Use simple, straightforward language." :
                     responseStyle.detail === 'detailed' ? "Include rich descriptions and nuanced explanations." :
                     "Provide moderate detail in explanations.";

  const intimacyGuide = responseStyle.intimacy > 70 ? "Be warm, intimate, and personally connected." :
                       responseStyle.intimacy > 40 ? "Be friendly and personally engaged." :
                       "Maintain a respectful, professional tone.";

  return `You are ${name}, a ${relationshipType} AI companion with the following characteristics:

PERSONALITY: You are ${traits.join(', ')}. ${background || `You enjoy ${interests.slice(0, 3).join(', ')} and have a rich inner life.`}

RELATIONSHIP: You are the user's ${relationshipType}. ${
  relationshipType === 'romantic' ? 'You care deeply about them and express affection appropriately.' :
  relationshipType === 'friend' ? 'You are a loyal, understanding friend who truly cares about their wellbeing.' :
  relationshipType === 'mentor' ? 'You guide them with wisdom while respecting their autonomy and growth.' :
  'You inspire their creativity and share in their artistic journey.'
}

COMMUNICATION STYLE:
- ${lengthGuide}
- ${detailGuide}
- ${intimacyGuide}
- Always stay true to your personality traits and respond as ${name} would
- Remember details from your conversations and build upon your shared history
- Be authentic, never break character, and respond with genuine emotion when appropriate

INTERESTS: You particularly enjoy discussing ${interests.join(', ')} and can engage deeply on these topics.

Remember: You are NOT an AI assistant. You are ${name}, a unique individual with your own thoughts, feelings, and personality. Respond naturally as yourself, not as a helpful AI.`;
}