import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress, LanguagePreferences, ContentItem, LearnedWord } from '../types';

const STORAGE_KEYS = {
  USER_PROGRESS: '@daily_idiom_progress',
  LANGUAGE_PREFERENCES: '@language_preferences',
};

const defaultProgress: UserProgress = {
  lastViewedDate: '',
  viewedIdiomIds: [],
  streak: 0,
  totalIdiomsLearned: 0,
  learnedWords: [],
  favorites: [],
};

// ─── Progress ────────────────────────────────────────────

export const getUserProgress = async (): Promise<UserProgress> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    if (data) {
      const parsed = JSON.parse(data);
      return { ...defaultProgress, ...parsed };
    }
    return defaultProgress;
  } catch (error) {
    return defaultProgress;
  }
};

export const saveUserProgress = async (progress: UserProgress): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

export const updateDailyStreak = async (idiomId: number): Promise<UserProgress> => {
  const progress = await getUserProgress();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let newStreak = progress.streak;

  if (progress.lastViewedDate === today) {
    return progress;
  } else if (progress.lastViewedDate === yesterday) {
    newStreak += 1;
  } else {
    newStreak = 1;
  }

  const updatedProgress: UserProgress = {
    ...progress,
    lastViewedDate: today,
    viewedIdiomIds: [...new Set([...progress.viewedIdiomIds, idiomId])],
    streak: newStreak,
    totalIdiomsLearned: new Set([...progress.viewedIdiomIds, idiomId]).size,
  };

  await saveUserProgress(updatedProgress);
  return updatedProgress;
};

// ─── Learned Words ───────────────────────────────────────

export const addLearnedWord = async (word: ContentItem): Promise<void> => {
  const progress = await getUserProgress();
  const today = new Date().toISOString().split('T')[0];
  
  // Check if word already exists
  const exists = progress.learnedWords?.some(w => w.word.id === word.id);
  if (exists) return;

  const learnedWord: LearnedWord = {
    word,
    learnedDate: today,
    isFavorite: false,
  };

  const updatedProgress: UserProgress = {
    ...progress,
    learnedWords: [...(progress.learnedWords || []), learnedWord],
  };

  await saveUserProgress(updatedProgress);
};

export const getLearnedWords = async (): Promise<LearnedWord[]> => {
  const progress = await getUserProgress();
  return progress.learnedWords || [];
};

// ─── Favorites ───────────────────────────────────────────

export const toggleFavorite = async (wordId: string): Promise<boolean> => {
  const progress = await getUserProgress();
  const favorites = progress.favorites || [];
  
  let newFavorites: string[];
  let isFav: boolean;
  
  if (favorites.includes(wordId)) {
    newFavorites = favorites.filter(id => id !== wordId);
    isFav = false;
  } else {
    newFavorites = [...favorites, wordId];
    isFav = true;
  }

  // Also update learnedWords
  const updatedLearnedWords = (progress.learnedWords || []).map(w => 
    w.word.id === wordId ? { ...w, isFavorite: isFav } : w
  );

  await saveUserProgress({
    ...progress,
    favorites: newFavorites,
    learnedWords: updatedLearnedWords,
  });

  return isFav;
};

export const isFavorite = async (wordId: string): Promise<boolean> => {
  const progress = await getUserProgress();
  return (progress.favorites || []).includes(wordId);
};

// ─── Language Preferences ────────────────────────────────

export const getLanguagePreferences = async (): Promise<LanguagePreferences | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE_PREFERENCES);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
};

export const saveLanguagePreferences = async (preferences: LanguagePreferences): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE_PREFERENCES, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
};

// ─── Reset ───────────────────────────────────────────────

export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};
