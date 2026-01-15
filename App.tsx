import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import { Idiom } from './src/types';

LogBox.ignoreLogs(['Non-serializable values']);

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'Home' | 'Chat'>('Home');
  const [selectedIdiom, setSelectedIdiom] = useState<Idiom | null>(null);

  const navigateToChat = (idiom: Idiom) => {
    setSelectedIdiom(idiom);
    setCurrentScreen('Chat');
  };

  const navigateToHome = () => {
    setCurrentScreen('Home');
    setSelectedIdiom(null);
  };

  return (
    <>
      <StatusBar style="light" />
      {currentScreen === 'Home' ? (
        <HomeScreen onNavigateToChat={navigateToChat} />
      ) : (
        selectedIdiom && (
          <ChatScreen 
            idiom={selectedIdiom} 
            onNavigateBack={navigateToHome} 
          />
        )
      )}
    </>
  );
}
