import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { LogBox, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import HomeScreen from './src/screens/HomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import { ContentItem } from './src/types';
import { LanguageCode } from './src/utils/translations';
import { getLanguagePreferences, saveLanguagePreferences } from './src/utils/storage';

LogBox.ignoreLogs(['Non-serializable values']);

type Screen = 'Loading' | 'Onboarding' | 'Home' | 'Chat';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('Loading');
  const [selectedWord, setSelectedWord] = useState<ContentItem | null>(null);
  const [nativeLanguage, setNativeLanguage] = useState<LanguageCode>('en');
  const [targetLanguage, setTargetLanguage] = useState<LanguageCode>('es');

  useEffect(() => {
    checkLanguagePreferences();
  }, []);

  const checkLanguagePreferences = async () => {
    const savedPreferences = await getLanguagePreferences();
    if (savedPreferences) {
      setNativeLanguage(savedPreferences.nativeLanguage as LanguageCode);
      setTargetLanguage(savedPreferences.targetLanguage as LanguageCode);
      setCurrentScreen('Home');
    } else {
      setCurrentScreen('Onboarding');
    }
  };

  const handleOnboardingComplete = async (native: LanguageCode, target: LanguageCode) => {
    await saveLanguagePreferences({
      nativeLanguage: native,
      targetLanguage: target,
    });
    setNativeLanguage(native);
    setTargetLanguage(target);
    setCurrentScreen('Home');
  };

  const navigateToChat = (word: ContentItem) => {
    setSelectedWord(word);
    setCurrentScreen('Chat');
  };

  const navigateToHome = () => {
    setCurrentScreen('Home');
    setSelectedWord(null);
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
          nativeLanguage={nativeLanguage}
          targetLanguage={targetLanguage}
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
