"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { CompanionPersonality } from '@/types/companion';

interface AvatarGeneratorProps {
  companionName: string;
  personality: CompanionPersonality;
  relationshipType: 'friend' | 'romantic' | 'mentor' | 'creative';
  onAvatarGenerated: (avatarUrl: string) => void;
  currentAvatar?: string;
}

export function AvatarGenerator({
  companionName,
  personality,
  relationshipType,
  onAvatarGenerated,
  currentAvatar
}: AvatarGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');

  const getPersonalityDescription = () => {
    const traits = [];
    
    // Analyze personality traits for avatar generation
    if (personality.extroversion > 60) traits.push("confident");
    if (personality.playfulness > 70) traits.push("cheerful");
    if (personality.emotionality > 60) traits.push("expressive");
    if (personality.supportiveness > 70) traits.push("kind");
    if (personality.formality > 60) traits.push("professional");
    else if (personality.formality < 40) traits.push("casual");
    
    return traits;
  };

  const generateAvatarPrompt = () => {
    if (customPrompt.trim()) {
      return customPrompt.trim();
    }
    const traits = getPersonalityDescription();
    const basePrompt = `Professional portrait of a ${relationshipType === 'romantic' ? 'attractive' : 'friendly'} AI companion`;
    
    const personalityDesc = traits.length > 0 ? `, ${traits.join(' and ')} appearance` : '';
    const styleDesc = relationshipType === 'mentor' ? ', wise and thoughtful' : 
                     relationshipType === 'creative' ? ', artistic and inspiring' :
                     relationshipType === 'romantic' ? ', warm and inviting' : ', approachable and friendly';
    
    return `${basePrompt}${personalityDesc}${styleDesc}, soft lighting, warm colors, digital art style, high quality portrait`;
  };

  const handleGenerateAvatar = async () => {
    if (!companionName.trim()) {
      setError('Please enter a name for your companion first');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const prompt = generateAvatarPrompt();
      
      const response = await fetch('/api/generate-avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          companionName,
          personality,
          relationshipType
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate avatar');
      }

      const data = await response.json();
      
      if (data.success && data.avatarUrl) {
        onAvatarGenerated(data.avatarUrl);
      } else {
        throw new Error(data.error || 'Failed to generate avatar');
      }
    } catch (err) {
      console.error('Avatar generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate avatar');
    } finally {
      setIsGenerating(false);
    }
  };

  const presetAvatars = [
    'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/6f637669-1c69-4249-8f8a-696fc65127e6.png',
    'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/6c9b7fdc-536f-4ab9-9590-58d67acefcf7.png',
    'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/646daa36-8cae-44dd-a726-963f786ba198.png',
    'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e215194d-c36a-481e-ab22-f197940a9ef9.png'
  ];

  return (
    <div className="space-y-6">
      {/* Current Avatar Display */}
      <div className="text-center space-y-4">
        <div className="mx-auto w-48 h-48 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 flex items-center justify-center">
          {currentAvatar ? (
            <img 
              src={currentAvatar} 
              alt={`${companionName}'s avatar`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            <div className="text-6xl text-white">👤</div>
          )}
        </div>
        
        {currentAvatar && (
          <Badge variant="secondary" className="text-xs">
            Current Avatar
          </Badge>
        )}
      </div>

      {/* Generation Controls */}
      <Card className="bg-muted/20">
        <CardContent className="p-6 space-y-4">
          <div className="text-center space-y-2">
            <h3 className="font-semibold">AI Avatar Generation</h3>
            <p className="text-sm text-muted-foreground">
              Generate a unique avatar based on {companionName || 'your companion'}'s personality
            </p>
          </div>

          {/* Personality Preview for Avatar */}
          <div className="space-y-2">
            <div className="text-sm font-medium">Avatar will reflect these traits:</div>
            <div className="flex flex-wrap gap-2">
              {getPersonalityDescription().map((trait, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {trait}
                </Badge>
              ))}
              <Badge variant="outline" className="text-xs">
                {relationshipType} style
              </Badge>
            </div>
          </div>

          {/* Generate Button */}
          <div className="space-y-2">
            <Label htmlFor="custom-prompt">Custom Appearance Prompt (Optional)</Label>
            <Textarea
              id="custom-prompt"
              placeholder="Describe the exact appearance you want, e.g., 'a young woman with long silver hair and blue eyes, wearing a black leather jacket...'"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={3}
            />
          </div>

          <Button
            onClick={handleGenerateAvatar}
            disabled={isGenerating || !companionName.trim()}
            className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating Avatar...
              </>
            ) : (
              <>
                ✨ Generate AI Avatar
              </>
            )}
          </Button>

          {error && (
            <div className="text-sm text-red-500 text-center bg-red-500/10 p-3 rounded-lg">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preset Options */}
      <Card className="bg-muted/10">
        <CardContent className="p-4 space-y-3">
          <div className="text-sm font-medium">Or choose a preset style:</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {presetAvatars.map((preset, index) => (
              <div
                key={index}
                className="relative cursor-pointer group"
                onClick={() => onAvatarGenerated(preset)}
              >
                <div className="w-full aspect-square rounded-lg overflow-hidden bg-muted">
                  <img
                    src={preset}
                    alt={`Preset ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOUNBM0FGIiBmb250LXNpemU9IjE0Ij7wn5GEPC90ZXh0Pgo8L3N2Zz4K';
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Click any preset to use it as your companion's avatar
          </p>
        </CardContent>
      </Card>
    </div>
  );
}