import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { LogBox, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import HomeScreen from './src/screens/HomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import JourneyScreen from './src/screens/JourneyScreen';
import { ContentItem, ProficiencyLevel, UserProgress } from './src/types';
import { LanguageCode } from './src/utils/translations';
import { getLanguagePreferences, saveLanguagePreferences, getUserProgress } from './src/utils/storage';

LogBox.ignoreLogs(['Non-serializable values']);

type Screen = 'Loading' | 'Onboarding' | 'Home' | 'Chat' | 'Journey';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('Loading');
  const [selectedWord, setSelectedWord] = useState<ContentItem | null>(null);
  const [nativeLanguage, setNativeLanguage] = useState<LanguageCode>('en');
  const [targetLanguage, setTargetLanguage] = useState<LanguageCode>('es');
  const [proficiencyLevel, setProficiencyLevel] = useState<ProficiencyLevel>('A1');
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    checkLanguagePreferences();
    loadUserProgress();
  }, []);

  const loadUserProgress = async () => {
    const progress = await getUserProgress();
    setUserProgress(progress);
  };

  const checkLanguagePreferences = async () => {
    const savedPreferences = await getLanguagePreferences();
    if (savedPreferences && savedPreferences.proficiencyLevel) {
      setNativeLanguage(savedPreferences.nativeLanguage as LanguageCode);
      setTargetLanguage(savedPreferences.targetLanguage as LanguageCode);
      setProficiencyLevel(savedPreferences.proficiencyLevel as ProficiencyLevel);
      setCurrentScreen('Home');
    } else {
      setCurrentScreen('Onboarding');
    }
  };

  const handleOnboardingComplete = async (native: LanguageCode, target: LanguageCode, level: ProficiencyLevel) => {
    await saveLanguagePreferences({
      nativeLanguage: native,
      targetLanguage: target,
      proficiencyLevel: level,
    });
    setNativeLanguage(native);
    setTargetLanguage(target);
    setProficiencyLevel(level);
    setCurrentScreen('Home');
  };

  const navigateToChat = (word: ContentItem) => {
    setSelectedWord(word);
    setCurrentScreen('Chat');
  };

  const navigateToHome = () => {
    setCurrentScreen('Home');
    setSelectedWord(null);
    loadUserProgress(); // Refresh progress when returning home
  };

  const navigateToJourney = () => {
    setCurrentScreen('Journey');
  };

  // Loading screen
  if (currentScreen === 'Loading') {
    return (
      <LinearGradient colors={['#E0F4FF', '#C5EBFF', '#B8E4FF']} style={styles.loadingContainer}>
        <StatusBar style="dark" />
        <ActivityIndicator size="large" color="#7EC8E3" />
      </LinearGradient>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      {currentScreen === 'Onboarding' && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}
      {currentScreen === 'Home' && (
        <HomeScreen 
          onNavigateToChat={navigateToChat}
          onNavigateToJourney={navigateToJourney}
          nativeLanguage={nativeLanguage}
          targetLanguage={targetLanguage}
          proficiencyLevel={proficiencyLevel}
        />
      )}
      {currentScreen === 'Journey' && (
        <JourneyScreen
          currentStreak={userProgress?.streak || 0}
          totalWordsLearned={userProgress?.totalIdiomsLearned || 0}
          onClose={navigateToHome}
        />
      )}
      {currentScreen === 'Chat' && selectedWord && (
        <ChatScreen 
          word={selectedWord} 
          onNavigateBack={navigateToHome}
          nativeLanguage={nativeLanguage}
          targetLanguage={targetLanguage}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
