"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CompanionProfile } from '@/types/companion';

// Pre-generated characters
const initialCharacters: CompanionProfile[] = [
  {
    id: 'char_1',
    name: 'Orion',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c31508f8-b7eb-41fb-9762-184b90e9d6b2.png',
    background: 'A stoic starfarer who has seen the wonders and horrors of the galaxy. He is wise, protective, and slow to trust, but fiercely loyal to those he calls friend.',
    interests: ['Astronomy', 'Philosophy', 'Ancient History'],
    relationshipType: 'mentor',
    personality: { extroversion: 30, dominance: 70, playfulness: 20, emotionality: 40, adventurousness: 80, romanticism: 10, supportiveness: 60, formality: 60 },
    responseStyle: { length: 'medium', detail: 'detailed', intimacy: 30 },
    createdAt: new Date(),
    lastActive: new Date(),
  },
  {
    id: 'char_2',
    name: 'Seraphina',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/4890a5f8-9588-4665-b1ac-257a091005b8.png',
    background: 'A mischievous and playful elemental spirit bound to a forgotten forest. She is curious about the human world, loves to play games, and speaks in riddles.',
    interests: ['Nature', 'Puzzles', 'Storytelling'],
    relationshipType: 'friend',
    personality: { extroversion: 80, dominance: 30, playfulness: 90, emotionality: 60, adventurousness: 70, romanticism: 40, supportiveness: 70, formality: 20 },
    responseStyle: { length: 'medium', detail: 'moderate', intimacy: 50 },
    createdAt: new Date(),
    lastActive: new Date(),
  },
  // Add more characters...
];

export default function CharactersPage() {
  const handleSelectCharacter = (character: CompanionProfile) => {
    // In a real app, you would store which character is active
    // For now, we'll set it in localStorage and redirect to chat
    localStorage.setItem('companion-profile', JSON.stringify(character));
    localStorage.removeItem('chat-messages'); // Start a fresh conversation
    window.location.href = '/chat';
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Choose a Companion
          </h1>
          <p className="text-xl text-muted-foreground mt-4">
            Select a pre-generated character to interact with, or create your own.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {initialCharacters.map((character) => (
            <Card key={character.id} className="overflow-hidden hover:shadow-lg hover:shadow-purple-500/20 transition-shadow duration-300">
              <div className="h-64 w-full overflow-hidden">
                <img src={character.avatar} alt={character.name} className="w-full h-full object-cover" />
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">{character.name}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">{character.relationshipType}</Badge>
                  {character.interests.slice(0, 2).map(interest => (
                    <Badge key={interest} variant="outline">{interest}</Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground h-20 overflow-hidden">
                  {character.background}
                </p>
                <Button onClick={() => handleSelectCharacter(character)} className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Chat with {character.name}
                </Button>
              </CardContent>
            </Card>
          ))}

          {/* "Create Your Own" card */}
          <Card className="flex flex-col items-center justify-center text-center p-8 border-dashed border-2 hover:border-purple-500 hover:bg-muted/50 transition-all">
            <div className="text-6xl mb-4">✨</div>
            <CardTitle className="text-2xl">Create Your Own</CardTitle>
            <p className="text-muted-foreground mt-2 mb-6">
              Design a companion from scratch with your desired personality and appearance.
            </p>
            <Button onClick={() => window.location.href = '/create'} className="w-full">
              Start Creating
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
