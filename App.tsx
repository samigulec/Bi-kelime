import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { LogBox, View, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import HomeScreen from './src/screens/HomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import LanguageSelectScreen from './src/screens/LanguageSelectScreen';
import { Idiom } from './src/types';
import { LanguageCode } from './src/utils/translations';
import { getUserLanguage, saveUserLanguage } from './src/utils/storage';

LogBox.ignoreLogs(['Non-serializable values']);

type Screen = 'Loading' | 'LanguageSelect' | 'Home' | 'Chat';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('Loading');
  const [selectedIdiom, setSelectedIdiom] = useState<Idiom | null>(null);
  const [userLanguage, setUserLanguage] = useState<LanguageCode>('en');

  useEffect(() => {
    checkUserLanguage();
  }, []);

  const checkUserLanguage = async () => {
    const savedLanguage = await getUserLanguage();
    if (savedLanguage) {
      setUserLanguage(savedLanguage);
      setCurrentScreen('Home');
    } else {
      setCurrentScreen('LanguageSelect');
    }
  };

  const handleLanguageSelected = async (languageCode: LanguageCode) => {
    await saveUserLanguage(languageCode);
    setUserLanguage(languageCode);
    setCurrentScreen('Home');
  };

  const navigateToChat = (idiom: Idiom) => {
    setSelectedIdiom(idiom);
    setCurrentScreen('Chat');
  };

  const navigateToHome = () => {
    setCurrentScreen('Home');
    setSelectedIdiom(null);
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
      {currentScreen === 'LanguageSelect' && (
        <LanguageSelectScreen onLanguageSelected={handleLanguageSelected} />
      )}
      {currentScreen === 'Home' && (
        <HomeScreen 
          onNavigateToChat={navigateToChat} 
          language={userLanguage}
        />
      )}
      {currentScreen === 'Chat' && selectedIdiom && (
        <ChatScreen 
          idiom={selectedIdiom} 
          onNavigateBack={navigateToHome}
          language={userLanguage}
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
