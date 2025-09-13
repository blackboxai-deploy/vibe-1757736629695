export interface PersonalityTrait {
  name: string;
  value: number; // 0-100 scale
  description: string;
  opposites: [string, string]; // [low value, high value]
}

export interface CompanionPersonality {
  extroversion: number; // 0-100: Introverted to Extroverted
  dominance: number; // 0-100: Submissive to Dominant
  playfulness: number; // 0-100: Serious to Playful
  emotionality: number; // 0-100: Logical to Emotional
  adventurousness: number; // 0-100: Cautious to Adventurous
  romanticism: number; // 0-100: Platonic to Romantic
  supportiveness: number; // 0-100: Challenging to Supportive
  formality: number; // 0-100: Casual to Formal
}

export interface CompanionProfile {
  id: string;
  name: string;
  avatar: string; // Generated image URL
  personality: CompanionPersonality;
  background: string;
  interests: string[];
  relationshipType: 'friend' | 'romantic' | 'mentor' | 'creative';
  responseStyle: {
    length: 'short' | 'medium' | 'long';
    detail: 'simple' | 'moderate' | 'detailed';
    intimacy: number; // 0-100
  };
  createdAt: Date;
  lastActive: Date;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'companion';
  timestamp: Date;
  type?: 'text' | 'image' | 'video' | 'loading'; // Add type for different content
  mediaUrl?: string; // URL for image/video
  emotion?: string;
  context?: string;
}

export interface ConversationMemory {
  id: string;
  companionId: string;
  memories: {
    factual: string[]; // Facts about the user
    emotional: string[]; // Emotional moments
    preferences: string[]; // User likes/dislikes
    experiences: string[]; // Shared experiences
  };
  lastUpdated: Date;
}

export interface UserPreferences {
  contentBoundaries: {
    allowIntimateConversation: boolean;
    allowRoleplay: boolean;
    comfortLevel: number; // 0-100
  };
  conversationStyle: {
    preferredLength: 'short' | 'medium' | 'long';
    formalityPreference: number; // 0-100
    emotionalDepth: number; // 0-100
  };
  privacySettings: {
    saveConversations: boolean;
    shareAnalytics: boolean;
  };
}

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  component: string;
  completed: boolean;
}

export interface ChatState {
  messages: Message[];
  companion: CompanionProfile | null;
  isTyping: boolean;
  memory: ConversationMemory | null;
  userMood: string | null;
}