import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProgress, LanguagePreferences } from '../types';

const STORAGE_KEYS = {
  USER_PROGRESS: '@daily_idiom_progress',
  LANGUAGE_PREFERENCES: '@language_preferences',
  LAST_NOTIFICATION_DATE: '@last_notification_date',
};

/**
 * Default user progress state
 */
const defaultProgress: UserProgress = {
  lastViewedDate: '',
  viewedIdiomIds: [],
  streak: 0,
  totalIdiomsLearned: 0,
};

/**
 * Get user progress from storage
 */
export const getUserProgress = async (): Promise<UserProgress> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    if (data) {
      return JSON.parse(data);
    }
    return defaultProgress;
  } catch (error) {
    console.error('Error getting user progress:', error);
    return defaultProgress;
  }
};

/**
 * Save user progress to storage
 */
export const saveUserProgress = async (progress: UserProgress): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving user progress:', error);
  }
};

/**
 * Update streak based on daily view
 */
export const updateDailyStreak = async (idiomId: number): Promise<UserProgress> => {
  const progress = await getUserProgress();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let newStreak = progress.streak;

  if (progress.lastViewedDate === today) {
    // Already viewed today, no change
    return progress;
  } else if (progress.lastViewedDate === yesterday) {
    // Consecutive day, increase streak
    newStreak += 1;
  } else {
    // Streak broken, start fresh
    newStreak = 1;
  }

  const updatedProgress: UserProgress = {
    lastViewedDate: today,
    viewedIdiomIds: [...new Set([...progress.viewedIdiomIds, idiomId])],
    streak: newStreak,
    totalIdiomsLearned: new Set([...progress.viewedIdiomIds, idiomId]).size,
  };

  await saveUserProgress(updatedProgress);
  return updatedProgress;
};

/**
 * Get user's language preferences
 */
export const getLanguagePreferences = async (): Promise<LanguagePreferences | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE_PREFERENCES);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting language preferences:', error);
    return null;
  }
};

/**
 * Save user's language preferences
 */
export const saveLanguagePreferences = async (preferences: LanguagePreferences): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE_PREFERENCES, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving language preferences:', error);
  }
};

/**
 * Clear all stored data (for development/testing)
 */
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};
