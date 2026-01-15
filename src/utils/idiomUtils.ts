import { Idiom } from '../types';
import idiomsData from '../data/idioms.json';

/**
 * Gets the idiom of the day based on the current date.
 * All users will see the same idiom on the same day.
 */
export const getIdiomOfTheDay = (): Idiom => {
  const idioms: Idiom[] = idiomsData as Idiom[];
  const today = new Date();
  
  // Create a date seed based on year, month, and day
  // This ensures all users get the same idiom on the same day
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();
  
  // Create a unique number for each day
  const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
  
  // Use modulo to cycle through idioms
  const idiomIndex = daysSinceEpoch % idioms.length;
  
  return idioms[idiomIndex];
};

/**
 * Gets a specific idiom by ID
 */
export const getIdiomById = (id: number): Idiom | undefined => {
  const idioms: Idiom[] = idiomsData as Idiom[];
  return idioms.find(idiom => idiom.id === id);
};

/**
 * Gets all available idioms
 */
export const getAllIdioms = (): Idiom[] => {
  return idiomsData as Idiom[];
};

/**
 * Gets the total number of idioms
 */
export const getTotalIdiomsCount = (): number => {
  return idiomsData.length;
};

/**
 * Gets a random idiom (for future features)
 */
export const getRandomIdiom = (): Idiom => {
  const idioms: Idiom[] = idiomsData as Idiom[];
  const randomIndex = Math.floor(Math.random() * idioms.length);
  return idioms[randomIndex];
};

