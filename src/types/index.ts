// Type definitions for Daily English Idiom App

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
