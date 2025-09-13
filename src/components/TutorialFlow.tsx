"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CharacterCreator } from '@/components/CharacterCreator';
import { CompanionProfile } from '@/types/companion';

interface TutorialFlowProps {
  onComplete: (companion: CompanionProfile) => void;
  onSkip: () => void;
}

const tutorialSteps = [
  {
    id: 'welcome',
    title: 'Welcome to Your AI Companion',
    description: 'Let\'s create a personalized AI companion that understands you.',
    content: (
      <div className="space-y-6 text-center">
        <div className="text-6xl mx-auto">🤝</div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold">What makes this special?</h3>
          <div className="grid grid-cols-1 gap-4 text-left max-w-md mx-auto">
            <div className="flex items-start space-x-3">
              <div className="text-purple-400">🎭</div>
              <div className="text-sm">
                <span className="font-semibold">Deep Personality:</span> Not just a chatbot - a unique individual with traits, memories, and growth
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-pink-400">💭</div>
              <div className="text-sm">
                <span className="font-semibold">True Memory:</span> Remembers your conversations, preferences, and shared experiences
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="text-blue-400">⚙️</div>
              <div className="text-sm">
                <span className="font-semibold">Your Control:</span> Adjust personality, boundaries, and interaction style anytime
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'personality',
    title: 'Understanding Personality',
    description: 'Your companion will have 8 core personality traits you can adjust.',
    content: (
      <div className="space-y-6">
        <div className="text-4xl text-center">🧠</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <Badge variant="secondary">Extroversion</Badge>
            <p className="text-muted-foreground">How outgoing and social they are</p>
          </div>
          <div className="space-y-2">
            <Badge variant="secondary">Dominance</Badge>
            <p className="text-muted-foreground">How assertive or submissive they are</p>
          </div>
          <div className="space-y-2">
            <Badge variant="secondary">Playfulness</Badge>
            <p className="text-muted-foreground">How serious or fun-loving they are</p>
          </div>
          <div className="space-y-2">
            <Badge variant="secondary">Emotionality</Badge>
            <p className="text-muted-foreground">How logical or emotionally driven they are</p>
          </div>
          <div className="space-y-2">
            <Badge variant="secondary">Adventurousness</Badge>
            <p className="text-muted-foreground">How cautious or risk-taking they are</p>
          </div>
          <div className="space-y-2">
            <Badge variant="secondary">Romanticism</Badge>
            <p className="text-muted-foreground">How platonic or romantic they can be</p>
          </div>
          <div className="space-y-2">
            <Badge variant="secondary">Supportiveness</Badge>
            <p className="text-muted-foreground">How challenging or supportive they are</p>
          </div>
          <div className="space-y-2">
            <Badge variant="secondary">Formality</Badge>
            <p className="text-muted-foreground">How casual or formal they communicate</p>
          </div>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg text-sm text-center">
          <span className="font-semibold">💡 Tip:</span> You can adjust these anytime to fine-tune your companion's personality
        </div>
      </div>
    )
  },
  {
    id: 'relationships',
    title: 'Types of Relationships',
    description: 'Choose what kind of relationship you want with your companion.',
    content: (
      <div className="space-y-6">
        <div className="text-4xl text-center">💕</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border-2 border-purple-200/20 bg-purple-50/5">
            <div className="text-2xl mb-2">👥</div>
            <h4 className="font-semibold">Friend</h4>
            <p className="text-sm text-muted-foreground">A supportive, understanding friend to talk with</p>
          </div>
          <div className="p-4 rounded-lg border-2 border-pink-200/20 bg-pink-50/5">
            <div className="text-2xl mb-2">💝</div>
            <h4 className="font-semibold">Romantic</h4>
            <p className="text-sm text-muted-foreground">An intimate, caring romantic partner</p>
          </div>
          <div className="p-4 rounded-lg border-2 border-blue-200/20 bg-blue-50/5">
            <div className="text-2xl mb-2">🎓</div>
            <h4 className="font-semibold">Mentor</h4>
            <p className="text-sm text-muted-foreground">A wise guide to help you grow and learn</p>
          </div>
          <div className="p-4 rounded-lg border-2 border-green-200/20 bg-green-50/5">
            <div className="text-2xl mb-2">🎨</div>
            <h4 className="font-semibold">Creative</h4>
            <p className="text-sm text-muted-foreground">An inspiring creative collaborator</p>
          </div>
        </div>
        <div className="bg-muted/50 p-4 rounded-lg text-sm text-center">
          <span className="font-semibold">🔄 Note:</span> You can change relationship types anytime in settings
        </div>
      </div>
    )
  },
  {
    id: 'privacy',
    title: 'Privacy & Control',
    description: 'You have complete control over your experience.',
    content: (
      <div className="space-y-6">
        <div className="text-4xl text-center">🔒</div>
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="text-green-400 text-xl">✅</div>
            <div>
              <div className="font-semibold">Local Storage</div>
              <div className="text-sm text-muted-foreground">All conversations stored locally on your device</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="text-green-400 text-xl">✅</div>
            <div>
              <div className="font-semibold">Content Boundaries</div>
              <div className="text-sm text-muted-foreground">Set comfort levels and conversation limits</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="text-green-400 text-xl">✅</div>
            <div>
              <div className="font-semibold">Memory Control</div>
              <div className="text-sm text-muted-foreground">Choose what your companion remembers or forgets</div>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="text-green-400 text-xl">✅</div>
            <div>
              <div className="font-semibold">Export/Delete</div>
              <div className="text-sm text-muted-foreground">Export conversations or delete everything anytime</div>
            </div>
          </div>
        </div>
        <div className="bg-blue-50/10 border border-blue-200/20 p-4 rounded-lg text-sm">
          <span className="font-semibold text-blue-400">🛡️ Your Data:</span> Never shared, never stored on external servers
        </div>
      </div>
    )
  }
];

export function TutorialFlow({ onComplete, onSkip }: TutorialFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showCreator, setShowCreator] = useState(false);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowCreator(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkipTutorial = () => {
    setShowCreator(true);
  };

  if (showCreator) {
    return (
      <div className="min-h-screen p-4">
        <CharacterCreator
          onComplete={onComplete}
          onCancel={() => setShowCreator(false)}
        />
      </div>
    );
  }

  const step = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <span>Step {currentStep + 1} of {tutorialSteps.length}</span>
            <Badge variant="outline" className="text-xs">Tutorial</Badge>
          </div>
          <Progress value={progress} className="h-2 max-w-xs mx-auto" />
        </div>

        {/* Tutorial Card */}
        <Card className="border-2 border-purple-500/20 bg-background/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl">{step.title}</CardTitle>
            <CardDescription className="text-base">{step.description}</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {step.content}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              onClick={onSkip}
              className="text-muted-foreground"
            >
              Skip Tutorial
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              onClick={handleSkipTutorial}
              className="text-muted-foreground"
            >
              Skip to Creation
            </Button>
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {currentStep === tutorialSteps.length - 1 ? 'Create Companion' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}