// Type definitions for Daily English Idiom App

export interface ContentItem {
  id: string;
  target_word: string; // The word in the target language
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  translations: Record<string, string>; // Translations in different languages
  example_sentence: string; // Example in target language
  example_translation: Record<string, string>; // Example translations
  pronunciation?: string;
  category?: string;
}

// Keep old Idiom type for backwards compatibility
export interface Idiom {
  id: number;
  idiom: string;
  meaning: string;
  meaningTR: string;
  example: string;
  pronunciation?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface UserProgress {
  lastViewedDate: string;
  viewedIdiomIds: number[];
  streak: number;
  totalIdiomsLearned: number;
}

export interface LanguagePreferences {
  nativeLanguage: string; // User's native language (for UI and translations)
  targetLanguage: string; // Language the user wants to learn (for content)
}
