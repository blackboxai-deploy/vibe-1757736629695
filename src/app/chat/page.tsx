"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { CompanionChat } from '@/components/CompanionChat';
import { CompanionProfile, Message } from '@/types/companion';

export default function ChatPage() {
  const [companion, setCompanion] = useState<CompanionProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    // Load companion and conversation history
    const savedCompanion = localStorage.getItem('companion-profile');
    const savedMessages = localStorage.getItem('chat-messages');
    
    if (savedCompanion) {
      setCompanion(JSON.parse(savedCompanion));
    } else {
      // Redirect to home if no companion
      window.location.href = '/';
      return;
    }
    
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Add welcome message
      const welcomeMessage: Message = {
        id: 'welcome',
        content: `Hi there! I'm excited to get to know you better. What would you like to talk about?`,
        sender: 'companion',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
    
    setIsLoading(false);
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chat-messages', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSending || !companion) return;

    const messageContent = inputMessage.trim();
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      content: messageContent,
      sender: 'user',
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsSending(true);

    // Command parsing
    if (messageContent.startsWith('/image ') || messageContent.startsWith('/video ')) {
      const isImage = messageContent.startsWith('/image ');
      const prompt = messageContent.substring(isImage ? 7 : 7);
      const endpoint = isImage ? '/api/generate-image' : '/api/generate-video';
      const type = isImage ? 'image' : 'video';
      
      const loadingMessage: Message = {
        id: `loading_${Date.now()}`,
        content: `Generating ${type}: ${prompt}`,
        sender: 'companion',
        timestamp: new Date(),
        type: 'loading',
      };
      setMessages(prev => [...prev, loadingMessage]);

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });

        const data = await response.json();
        
        if (!response.ok || !data.success) {
          throw new Error(data.error || `Failed to generate ${type}`);
        }

        const mediaMessage: Message = {
          id: `media_${Date.now()}`,
          content: `${type} generation complete.`, // Fallback content
          sender: 'companion',
          timestamp: new Date(),
          type: type,
          mediaUrl: isImage ? data.imageUrl : data.videoUrl,
        };
        setMessages(prev => prev.filter(m => m.id !== loadingMessage.id).concat(mediaMessage));
      } catch (error) {
        const errorMessage: Message = {
          id: `err_${Date.now()}`,
          content: error instanceof Error ? error.message : 'An unknown error occurred.',
          sender: 'companion',
          timestamp: new Date(),
          type: 'text',
        };
        setMessages(prev => prev.filter(m => m.id !== loadingMessage.id).concat(errorMessage));
      }

    } else {
      // Standard chat logic
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: messageContent, companion, conversationHistory: messages }),
        });

        if (!response.ok) throw new Error('Failed to get response');

        const data = await response.json();
        if (data.success) {
          const companionMessage: Message = {
            id: `msg_${Date.now()}_companion`,
            content: data.message,
            sender: 'companion',
            timestamp: new Date(),
            type: 'text',
          };
          setMessages(prev => [...prev, companionMessage]);
        } else {
          throw new Error(data.error || 'Failed to get response');
        }
      } catch (error) {
        const errorMessage: Message = {
          id: `err_${Date.now()}`,
          content: "I'm having trouble responding right now. Please try again in a moment.",
          sender: 'companion',
          timestamp: new Date(),
          type: 'text',
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    }

    setIsSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    if (confirm('Are you sure you want to clear the conversation history?')) {
      const welcomeMessage: Message = {
        id: 'welcome_new',
        content: `Hello again! I'm ready for a fresh conversation. What's on your mind?`,
        sender: 'companion',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your companion...</p>
        </div>
      </div>
    );
  }

  if (!companion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center space-y-4">
            <div className="text-4xl">🤖</div>
            <div className="space-y-2">
              <h3 className="font-semibold">No Companion Found</h3>
              <p className="text-sm text-muted-foreground">
                You need to create a companion first before you can start chatting.
              </p>
            </div>
            <Button
              onClick={() => window.location.href = '/'}
              className="w-full"
            >
              Create Companion
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                {companion.avatar ? (
                  <img 
                    src={companion.avatar} 
                    alt={companion.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-xl text-white">👤</div>
                )}
              </div>
              <div>
                <h1 className="font-semibold text-lg">{companion.name}</h1>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    {companion.relationshipType}
                  </Badge>
                  <span>•</span>
                  <span>Online</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearChat}
              >
                Clear Chat
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = '/create'}
              >
                Edit
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col">
        <CompanionChat 
          messages={messages}
          companion={companion}
          isLoading={isSending}
        />
        
        {/* Input Area */}
        <div className="border-t bg-background/80 backdrop-blur-sm p-4">
          <div className="flex space-x-3">
            <div className="flex-1">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={`Message ${companion.name}...`}
                className="min-h-12 max-h-32 resize-none"
                disabled={isSending}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isSending}
              className="h-12 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isSending ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Send'
              )}
            </Button>
          </div>
          
          <div className="mt-2 text-xs text-muted-foreground text-center">
            <p>Press Enter to send, Shift+Enter for new line.</p>
            <p>Use <code>/image [prompt]</code> or <code>/video [prompt]</code> to generate media.</p>
          </div>
        </div>
      </div>
    </div>
  );
}