"use client";

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { CompanionPersonality } from '@/types/companion';

interface PersonalitySlidersProps {
  personality: CompanionPersonality;
  onChange: (personality: CompanionPersonality) => void;
}

const personalityTraits = [
  {
    key: 'extroversion' as keyof CompanionPersonality,
    name: 'Extroversion',
    description: 'How social and outgoing they are',
    lowLabel: 'Introverted',
    highLabel: 'Extroverted',
    emoji: '🤝',
    color: 'purple'
  },
  {
    key: 'dominance' as keyof CompanionPersonality,
    name: 'Dominance',
    description: 'How assertive or submissive they are',
    lowLabel: 'Submissive',
    highLabel: 'Dominant',
    emoji: '⚡',
    color: 'red'
  },
  {
    key: 'playfulness' as keyof CompanionPersonality,
    name: 'Playfulness',
    description: 'How serious or fun-loving they are',
    lowLabel: 'Serious',
    highLabel: 'Playful',
    emoji: '🎭',
    color: 'yellow'
  },
  {
    key: 'emotionality' as keyof CompanionPersonality,
    name: 'Emotionality',
    description: 'How logical or emotionally driven they are',
    lowLabel: 'Logical',
    highLabel: 'Emotional',
    emoji: '💭',
    color: 'pink'
  },
  {
    key: 'adventurousness' as keyof CompanionPersonality,
    name: 'Adventurousness',
    description: 'How cautious or risk-taking they are',
    lowLabel: 'Cautious',
    highLabel: 'Adventurous',
    emoji: '🌟',
    color: 'orange'
  },
  {
    key: 'romanticism' as keyof CompanionPersonality,
    name: 'Romanticism',
    description: 'How platonic or romantic they can be',
    lowLabel: 'Platonic',
    highLabel: 'Romantic',
    emoji: '💕',
    color: 'rose'
  },
  {
    key: 'supportiveness' as keyof CompanionPersonality,
    name: 'Supportiveness',
    description: 'How challenging or supportive they are',
    lowLabel: 'Challenging',
    highLabel: 'Supportive',
    emoji: '🤗',
    color: 'green'
  },
  {
    key: 'formality' as keyof CompanionPersonality,
    name: 'Formality',
    description: 'How casual or formal they communicate',
    lowLabel: 'Casual',
    highLabel: 'Formal',
    emoji: '💼',
    color: 'blue'
  }
];

export function PersonalitySliders({ personality, onChange }: PersonalitySlidersProps) {
  const handleSliderChange = (key: keyof CompanionPersonality, value: number[]) => {
    onChange({
      ...personality,
      [key]: value[0]
    });
  };

  const getPersonalityDescription = () => {
    const traits = [];
    
    if (personality.extroversion > 60) traits.push("outgoing");
    else if (personality.extroversion < 40) traits.push("reserved");
    
    if (personality.playfulness > 70) traits.push("playful");
    else if (personality.playfulness < 30) traits.push("serious");
    
    if (personality.supportiveness > 70) traits.push("supportive");
    else if (personality.supportiveness < 30) traits.push("challenging");
    
    if (personality.emotionality > 60) traits.push("emotionally expressive");
    else if (personality.emotionality < 40) traits.push("analytical");
    
    return traits.length > 0 
      ? `Your companion will be ${traits.slice(0, 3).join(', ')} ${traits.length > 3 ? 'and more' : ''}.`
      : "A well-balanced personality.";
  };

  return (
    <div className="space-y-6">
      {/* Personality Preview */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <div className="text-lg font-semibold">Personality Preview</div>
            <p className="text-muted-foreground">{getPersonalityDescription()}</p>
          </div>
        </CardContent>
      </Card>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {personalityTraits.map((trait) => (
          <div key={trait.key} className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{trait.emoji}</span>
              <div className="flex-1">
                <Label className="font-semibold">{trait.name}</Label>
                <p className="text-sm text-muted-foreground">{trait.description}</p>
              </div>
              <div className="text-sm font-mono bg-muted px-2 py-1 rounded">
                {personality[trait.key]}%
              </div>
            </div>
            
            <div className="space-y-2">
              <Slider
                value={[personality[trait.key]]}
                onValueChange={(value) => handleSliderChange(trait.key, value)}
                max={100}
                step={5}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{trait.lowLabel}</span>
                <span>{trait.highLabel}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Presets */}
      <Card className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 border-purple-500/20">
        <CardContent className="p-4">
          <div className="text-sm font-semibold mb-3">Quick Presets</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              className="text-xs p-2 rounded bg-purple-500/20 hover:bg-purple-500/30 transition-colors"
              onClick={() => onChange({
                extroversion: 80, dominance: 30, playfulness: 85, emotionality: 75,
                adventurousness: 70, romanticism: 40, supportiveness: 90, formality: 20
              })}
            >
              🌟 Bubbly Friend
            </button>
            <button
              className="text-xs p-2 rounded bg-pink-500/20 hover:bg-pink-500/30 transition-colors"
              onClick={() => onChange({
                extroversion: 60, dominance: 45, playfulness: 60, emotionality: 80,
                adventurousness: 55, romanticism: 85, supportiveness: 85, formality: 35
              })}
            >
              💕 Romantic Partner
            </button>
            <button
              className="text-xs p-2 rounded bg-blue-500/20 hover:bg-blue-500/30 transition-colors"
              onClick={() => onChange({
                extroversion: 45, dominance: 70, playfulness: 30, emotionality: 40,
                adventurousness: 60, romanticism: 20, supportiveness: 60, formality: 80
              })}
            >
              🎓 Wise Mentor
            </button>
            <button
              className="text-xs p-2 rounded bg-green-500/20 hover:bg-green-500/30 transition-colors"
              onClick={() => onChange({
                extroversion: 70, dominance: 50, playfulness: 90, emotionality: 70,
                adventurousness: 85, romanticism: 30, supportiveness: 75, formality: 25
              })}
            >
              🎨 Creative Muse
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}