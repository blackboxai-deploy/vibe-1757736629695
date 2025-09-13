"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { PersonalitySliders } from '@/components/PersonalitySliders';
import { AvatarGenerator } from '@/components/AvatarGenerator';
import { CompanionProfile, CompanionPersonality } from '@/types/companion';

interface CharacterCreatorProps {
  onComplete: (companion: CompanionProfile) => void;
  onCancel: () => void;
  existing?: CompanionProfile;
}

const defaultPersonality: CompanionPersonality = {
  extroversion: 60,
  dominance: 40,
  playfulness: 70,
  emotionality: 60,
  adventurousness: 50,
  romanticism: 30,
  supportiveness: 80,
  formality: 30
};

const relationshipTypes = [
  { value: 'friend' as const, label: 'Friend', description: 'A supportive, understanding friend', emoji: '👥' },
  { value: 'romantic' as const, label: 'Romantic', description: 'An intimate, caring romantic partner', emoji: '💝' },
  { value: 'mentor' as const, label: 'Mentor', description: 'A wise guide to help you grow', emoji: '🎓' },
  { value: 'creative' as const, label: 'Creative', description: 'An inspiring creative collaborator', emoji: '🎨' }
];

const interestsSuggestions = [
  'Art & Creativity', 'Music', 'Movies & TV', 'Books & Literature', 'Technology', 'Gaming',
  'Travel', 'Food & Cooking', 'Fitness & Health', 'Nature & Outdoors', 'Science', 'Philosophy',
  'Psychology', 'History', 'Fashion', 'Photography', 'Dance', 'Spirituality'
];

export function CharacterCreator({ onComplete, onCancel, existing }: CharacterCreatorProps) {
  const [currentTab, setCurrentTab] = useState('basics');
  const [name, setName] = useState(existing?.name || '');
  const [background, setBackground] = useState(existing?.background || '');
  const [relationshipType, setRelationshipType] = useState<'friend' | 'romantic' | 'mentor' | 'creative'>(
    existing?.relationshipType || 'friend'
  );
  const [interests, setInterests] = useState<string[]>(existing?.interests || []);
  const [personality, setPersonality] = useState<CompanionPersonality>(
    existing?.personality || defaultPersonality
  );
  const [avatar, setAvatar] = useState(existing?.avatar || '');
  const [responseLength, setResponseLength] = useState<'short' | 'medium' | 'long'>(
    existing?.responseStyle.length || 'medium'
  );
  const [responseDetail, setResponseDetail] = useState<'simple' | 'moderate' | 'detailed'>(
    existing?.responseStyle.detail || 'moderate'
  );
  const [intimacyLevel, setIntimacyLevel] = useState(existing?.responseStyle.intimacy || 50);

  const handleInterestToggle = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleComplete = async () => {
    if (!name.trim()) {
      alert('Please give your companion a name');
      return;
    }

    const companion: CompanionProfile = {
      id: existing?.id || `companion_${Date.now()}`,
      name: name.trim(),
      avatar,
      personality,
      background: background.trim() || `A ${relationshipType} who loves ${interests.slice(0, 3).join(', ')}`,
      interests,
      relationshipType,
      responseStyle: {
        length: responseLength,
        detail: responseDetail,
        intimacy: intimacyLevel
      },
      createdAt: existing?.createdAt || new Date(),
      lastActive: new Date()
    };

    onComplete(companion);
  };

  const canProceed = {
    basics: name.trim() && relationshipType,
    personality: true,
    appearance: true,
    preferences: true
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
          {existing ? 'Edit Your Companion' : 'Create Your Companion'}
        </h1>
        <p className="text-muted-foreground">
          Design a unique AI personality that perfectly matches your preferences
        </p>
      </div>

      {/* Creation Tabs */}
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basics" className="flex items-center space-x-2">
            <span>📝</span>
            <span className="hidden sm:inline">Basics</span>
          </TabsTrigger>
          <TabsTrigger value="personality" className="flex items-center space-x-2">
            <span>🎭</span>
            <span className="hidden sm:inline">Personality</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center space-x-2">
            <span>🎨</span>
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center space-x-2">
            <span>⚙️</span>
            <span className="hidden sm:inline">Preferences</span>
          </TabsTrigger>
        </TabsList>

        {/* Basics Tab */}
        <TabsContent value="basics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Start with the fundamentals of your companion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="What would you like to call your companion?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label>Relationship Type</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relationshipTypes.map((type) => (
                    <Card 
                      key={type.value}
                      className={`cursor-pointer transition-all ${
                        relationshipType === type.value 
                          ? 'ring-2 ring-purple-500 bg-purple-50/10' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setRelationshipType(type.value)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="text-2xl">{type.emoji}</div>
                          <div>
                            <div className="font-semibold">{type.label}</div>
                            <div className="text-sm text-muted-foreground">{type.description}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Interests & Hobbies</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {interestsSuggestions.map((interest) => (
                    <Badge
                      key={interest}
                      variant={interests.includes(interest) ? "default" : "outline"}
                      className="cursor-pointer justify-center p-2 hover:bg-primary hover:text-primary-foreground"
                      onClick={() => handleInterestToggle(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Selected: {interests.length} interests (select 3-5 for best results)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="background">Background (Optional)</Label>
                <Textarea
                  id="background"
                  placeholder="Tell us about your companion's background, story, or special characteristics..."
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personality Tab */}
        <TabsContent value="personality" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personality Traits</CardTitle>
              <CardDescription>
                Fine-tune your companion's personality with 8 core traits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PersonalitySliders
                personality={personality}
                onChange={setPersonality}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Companion Appearance</CardTitle>
              <CardDescription>
                Generate a unique avatar for your companion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AvatarGenerator
                companionName={name}
                personality={personality}
                relationshipType={relationshipType}
                onAvatarGenerated={setAvatar}
                currentAvatar={avatar}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Communication Preferences</CardTitle>
              <CardDescription>
                Customize how your companion communicates with you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Response Length</Label>
                  <Select value={responseLength} onValueChange={(value: 'short' | 'medium' | 'long') => setResponseLength(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short - Concise responses</SelectItem>
                      <SelectItem value="medium">Medium - Balanced responses</SelectItem>
                      <SelectItem value="long">Long - Detailed responses</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Response Detail</Label>
                  <Select value={responseDetail} onValueChange={(value: 'simple' | 'moderate' | 'detailed') => setResponseDetail(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Simple - Straightforward</SelectItem>
                      <SelectItem value="moderate">Moderate - Some detail</SelectItem>
                      <SelectItem value="detailed">Detailed - Rich descriptions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Intimacy Level: {intimacyLevel}%</Label>
                  <Slider
                    value={[intimacyLevel]}
                    onValueChange={(value) => setIntimacyLevel(value[0])}
                    max={100}
                    step={5}
                    className="py-4"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Professional</span>
                    <span>Personal</span>
                    <span>Intimate</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        
        <div className="flex space-x-2">
          {currentTab !== 'basics' && (
            <Button 
              variant="outline"
              onClick={() => {
                const tabs = ['basics', 'personality', 'appearance', 'preferences'];
                const currentIndex = tabs.indexOf(currentTab);
                if (currentIndex > 0) {
                  setCurrentTab(tabs[currentIndex - 1]);
                }
              }}
            >
              Previous
            </Button>
          )}
          
          {currentTab !== 'preferences' ? (
            <Button
              onClick={() => {
                const tabs = ['basics', 'personality', 'appearance', 'preferences'];
                const currentIndex = tabs.indexOf(currentTab);
                if (currentIndex < tabs.length - 1) {
                  setCurrentTab(tabs[currentIndex + 1]);
                }
              }}
              disabled={!canProceed[currentTab as keyof typeof canProceed]}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {existing ? 'Save Changes' : 'Create Companion'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}