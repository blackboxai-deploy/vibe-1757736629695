"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { TutorialFlow } from '@/components/TutorialFlow';
import { CompanionProfile } from '@/types/companion';

export default function HomePage() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [hasCompanion, setHasCompanion] = useState(false);
  const [companion, setCompanion] = useState<CompanionProfile | null>(null);

  useEffect(() => {
    // Check if user has an existing companion
    const savedCompanion = localStorage.getItem('companion-profile');
    if (savedCompanion) {
      setHasCompanion(true);
      setCompanion(JSON.parse(savedCompanion));
    }
  }, []);

  const handleStartTutorial = () => {
    setShowTutorial(true);
  };

  const handleCompanionCreated = (newCompanion: CompanionProfile) => {
    setCompanion(newCompanion);
    setHasCompanion(true);
    setShowTutorial(false);
    localStorage.setItem('companion-profile', JSON.stringify(newCompanion));
  };

  if (showTutorial) {
    return (
      <TutorialFlow
        onComplete={handleCompanionCreated}
        onSkip={() => setShowTutorial(false)}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Welcome Header */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Your AI Companion
            </h1>
            <p className="text-xl text-muted-foreground max-w-md mx-auto">
              Create a personal AI companion that understands you, learns from you, and grows with you.
            </p>
          </div>
        </div>

        {/* Main Action Card */}
        <Card className="border-2 border-purple-500/20 bg-background/50 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
              <div className="text-4xl">✨</div>
            </div>
            {hasCompanion && companion ? (
              <>
                <CardTitle className="text-2xl">Welcome back!</CardTitle>
                <CardDescription className="text-lg">
                  Ready to continue your conversation with {companion.name}?
                </CardDescription>
              </>
            ) : (
              <>
                <CardTitle className="text-2xl">Create Your Companion</CardTitle>
                <CardDescription className="text-lg">
                  Design a unique AI personality that matches your preferences
                </CardDescription>
              </>
            )}
          </CardHeader>
          
          <CardContent className="space-y-6">
            {hasCompanion && companion ? (
              <div className="space-y-4">
                {/* Companion Preview */}
                <div className="flex items-center space-x-4 p-4 rounded-lg bg-muted/50">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    {companion.avatar ? (
                      <img 
                        src={companion.avatar} 
                        alt={companion.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-2xl">👤</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{companion.name}</h3>
                    <p className="text-sm text-muted-foreground">{companion.background}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        {companion.relationshipType}
                      </Badge>
                      {companion.interests.slice(0, 2).map((interest, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    size="lg" 
                    className="h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    onClick={() => window.location.href = '/chat'}
                  >
                    Continue Chat
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="h-12"
                    onClick={() => window.location.href = '/create'}
                  >
                    Edit Companion
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Features List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-start space-x-3">
                    <div className="text-purple-400 text-xl">🎭</div>
                    <div>
                      <div className="font-semibold">Personality Customization</div>
                      <div className="text-muted-foreground">8 personality traits to craft your perfect companion</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-pink-400 text-xl">🧠</div>
                    <div>
                      <div className="font-semibold">Learning Memory</div>
                      <div className="text-muted-foreground">Remembers your conversations and preferences</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-blue-400 text-xl">🎨</div>
                    <div>
                      <div className="font-semibold">Avatar Generation</div>
                      <div className="text-muted-foreground">AI-generated unique appearance</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-green-400 text-xl">⚙️</div>
                    <div>
                      <div className="font-semibold">Advanced Controls</div>
                      <div className="text-muted-foreground">Fine-tune every aspect of interactions</div>
                    </div>
                  </div>
                </div>

                {/* Start Button */}
                <Button 
                  size="lg" 
                  className="w-full h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white font-semibold"
                  onClick={handleStartTutorial}
                >
                  Start Creating Your Companion
                </Button>
                
                <div className="text-center text-sm text-muted-foreground">
                  Takes about 2-3 minutes to set up
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="text-2xl font-bold text-purple-400">∞</div>
            <div className="text-muted-foreground">Unlimited Conversations</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-pink-400">🔒</div>
            <div className="text-muted-foreground">Private & Secure</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">🚀</div>
            <div className="text-muted-foreground">Advanced AI</div>
          </div>
        </div>
      </div>
    </div>
  );
}