"use client";

import { useState, useEffect } from 'react';
import { CharacterCreator } from '@/components/CharacterCreator';
import { CompanionProfile } from '@/types/companion';

export default function CreatePage() {
  const [existingCompanion, setExistingCompanion] = useState<CompanionProfile | null>(null);

  useEffect(() => {
    const savedCompanion = localStorage.getItem('companion-profile');
    if (savedCompanion) {
      setExistingCompanion(JSON.parse(savedCompanion));
    }
  }, []);

  const handleCompanionCreated = (companion: CompanionProfile) => {
    localStorage.setItem('companion-profile', JSON.stringify(companion));
    
    // Clear existing chat if editing an existing companion
    if (existingCompanion) {
      localStorage.removeItem('chat-messages');
    }
    
    // Redirect to chat
    window.location.href = '/chat';
  };

  const handleCancel = () => {
    window.location.href = existingCompanion ? '/chat' : '/';
  };

  return (
    <div className="min-h-screen p-4">
      <CharacterCreator
        onComplete={handleCompanionCreated}
        onCancel={handleCancel}
        existing={existingCompanion || undefined}
      />
    </div>
  );
}