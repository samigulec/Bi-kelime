import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Animated,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { LANGUAGES, Language, LanguageCode } from '../utils/translations';
import { ProficiencyLevel } from '../types';

const { width } = Dimensions.get('window');

type OnboardingScreenProps = {
  onComplete: (nativeLanguage: LanguageCode, targetLanguage: LanguageCode, level: ProficiencyLevel) => void;
};

// Simplified level data - maps to actual CEFR levels internally
interface SimplifiedLevel {
  id: 'beginner' | 'intermediate' | 'advanced';
  emoji: string;
  title: string;
  subtitle: string;
  description: string;
  cerfLevel: ProficiencyLevel; // Internal mapping
  color: string;
  bgColor: string;
}

const SIMPLIFIED_LEVELS: SimplifiedLevel[] = [
  { 
    id: 'beginner',
    emoji: '🌱', 
    title: 'Beginner',
    subtitle: 'Just starting out',
    description: 'Basic words like "Hello", "Thank you"',
    cerfLevel: 'A1',
    color: '#4CAF50',
    bgColor: '#E8F5E9'
  },
  { 
    id: 'intermediate',
    emoji: '📚', 
    title: 'Intermediate',
    subtitle: 'I know the basics',
    description: 'Everyday conversations',
    cerfLevel: 'B1',
    color: '#FF9800',
    bgColor: '#FFF3E0'
  },
  { 
    id: 'advanced',
    emoji: '🚀', 
    title: 'Advanced',
    subtitle: 'I\'m quite confident',
    description: 'Complex topics & expressions',
    cerfLevel: 'C1',
    color: '#9C27B0',
    bgColor: '#F3E5F5'
  },
];

// Language Item Component
const LanguageItem: React.FC<{
  item: Language;
  isSelected: boolean;
  onSelect: (lang: Language) => void;
}> = ({ item, isSelected, onSelect }) => {
  const itemScale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(itemScale, { toValue: 0.92, useNativeDriver: true }),
      Animated.spring(itemScale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    onSelect(item);
  };

  return (
    <Animated.View style={{ transform: [{ scale: itemScale }] }}>
      <TouchableOpacity
        style={[
          styles.languageItem,
          isSelected && styles.languageItemSelected,
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Text style={styles.flagEmoji}>{item.flag}</Text>
        <Text style={[styles.languageName, isSelected && styles.languageNameSelected]}>
          {item.nativeName}
        </Text>
        {isSelected && (
          <View style={styles.checkBadge}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Level Card Component
const LevelCard: React.FC<{
  item: SimplifiedLevel;
  isSelected: boolean;
  onSelect: (level: SimplifiedLevel) => void;
}> = ({ item, isSelected, onSelect }) => {
  const cardScale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(cardScale, { toValue: 0.95, useNativeDriver: true }),
      Animated.spring(cardScale, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    onSelect(item);
  };

  return (
    <Animated.View style={{ transform: [{ scale: cardScale }] }}>
      <TouchableOpacity
        style={[
          styles.levelCard,
          { backgroundColor: isSelected ? item.bgColor : '#FFFFFF', borderColor: isSelected ? item.color : 'transparent' },
        ]}
        onPress={handlePress}
        activeOpacity={0.85}
      >
        <View style={styles.levelCardContent}>
          <Text style={styles.levelEmoji}>{item.emoji}</Text>
          <View style={styles.levelTextContent}>
            <Text style={[styles.levelTitle, { color: isSelected ? item.color : '#3D5A80' }]}>
              {item.title}
            </Text>
            <Text style={[styles.levelSubtitle, { color: isSelected ? item.color : '#78909C' }]}>
              {item.subtitle}
            </Text>
            <Text style={styles.levelDescription}>{item.description}</Text>
          </View>
          {isSelected && (
            <View style={[styles.levelCheckBadge, { backgroundColor: item.color }]}>
              <Text style={styles.levelCheckMark}>✓</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [nativeLanguage, setNativeLanguage] = useState<LanguageCode | null>(null);
  const [targetLanguage, setTargetLanguage] = useState<LanguageCode | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<SimplifiedLevel | null>(null);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const animateTransition = (callback: () => void) => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: -30, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      callback();
      slideAnim.setValue(30);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    });
  };

  const handleLanguageSelect = (lang: Language) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (step === 1) {
      setNativeLanguage(lang.code);
    } else if (step === 2) {
      if (lang.code === nativeLanguage) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }
      setTargetLanguage(lang.code);
    }
  };

  const handleLevelSelect = (level: SimplifiedLevel) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedLevel(level);
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    if (step === 1 && nativeLanguage) {
      animateTransition(() => setStep(2));
    } else if (step === 2 && targetLanguage) {
      animateTransition(() => setStep(3));
    } else if (step === 3 && selectedLevel && nativeLanguage && targetLanguage) {
      onComplete(nativeLanguage, targetLanguage, selectedLevel.cerfLevel);
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step === 2) {
      animateTransition(() => {
        setStep(1);
        setTargetLanguage(null);
      });
    } else if (step === 3) {
      animateTransition(() => {
        setStep(2);
        setSelectedLevel(null);
      });
    }
  };

  const canContinue = 
    (step === 1 && nativeLanguage) || 
    (step === 2 && targetLanguage) ||
    (step === 3 && selectedLevel);

  const getStepContent = () => {
    switch (step) {
      case 1:
        return {
          emoji: '👋',
          title: 'Welcome!',
          subtitle: 'What language do you speak?',
        };
      case 2:
        return {
          emoji: '🎯',
          title: 'Great choice!',
          subtitle: 'What do you want to learn?',
        };
      case 3:
        return {
          emoji: '📊',
          title: 'Almost done!',
          subtitle: 'What\'s your current level?',
        };
    }
  };

  const content = getStepContent();
  const availableLanguages = step === 2 
    ? LANGUAGES.filter(lang => lang.code !== nativeLanguage)
    : LANGUAGES;

  const renderLanguageItem = ({ item }: { item: Language }) => (
    <LanguageItem
      item={item}
      isSelected={(step === 1 ? nativeLanguage : targetLanguage) === item.code}
      onSelect={handleLanguageSelect}
    />
  );

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>{step}/3</Text>
        </View>

        {/* Back Button */}
        {step > 1 && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        )}

        {/* Header */}
        <Animated.View 
          style={[
            styles.header, 
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <Text style={styles.headerEmoji}>{content.emoji}</Text>
          <Text style={styles.headerTitle}>{content.title}</Text>
          <Text style={styles.headerSubtitle}>{content.subtitle}</Text>
        </Animated.View>

        {/* Content */}
        <Animated.View 
          style={[
            styles.contentContainer, 
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          {step < 3 ? (
            <FlatList
              key={`language-list-step-${step}`}
              data={availableLanguages}
              renderItem={renderLanguageItem}
              keyExtractor={(item) => item.code}
              numColumns={2}
              contentContainerStyle={styles.languageGrid}
              showsVerticalScrollIndicator={false}
              columnWrapperStyle={styles.columnWrapper}
            />
          ) : (
            <View style={styles.levelContainer}>
              {SIMPLIFIED_LEVELS.map((level) => (
                <LevelCard
                  key={level.id}
                  item={level}
                  isSelected={selectedLevel?.id === level.id}
                  onSelect={handleLevelSelect}
                />
              ))}
            </View>
          )}
        </Animated.View>

        {/* Continue Button */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !canContinue && styles.continueButtonDisabled
            ]}
            onPress={handleContinue}
            disabled={!canContinue}
            activeOpacity={0.9}
          >
            <Text style={styles.continueButtonText}>
              {step === 3 ? "Let's Start! 🚀" : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  
  // Progress
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  progressText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
  },

  // Back Button
  backButton: {
    position: 'absolute',
    left: 20,
    top: 70,
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backArrow: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Header
  header: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerEmoji: {
    fontSize: 50,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },

  // Content
  contentContainer: {
    flex: 1,
  },
  languageGrid: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  
  // Language Item
  languageItem: {
    width: (width - 48) / 2,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  languageItemSelected: {
    borderColor: '#4CAF50',
    backgroundColor: '#FFFFFF',
  },
  flagEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  languageName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3D5A80',
  },
  languageNameSelected: {
    color: '#2E7D32',
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#4CAF50',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  // Level Cards
  levelContainer: {
    paddingHorizontal: 20,
  },
  levelCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  levelCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  levelTextContent: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  levelSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2,
  },
  levelDescription: {
    fontSize: 13,
    color: '#90A4AE',
    marginTop: 4,
  },
  levelCheckBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelCheckMark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  // Bottom / Continue
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 30,
    paddingTop: 16,
  },
  continueButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#667eea',
  },
});

export default OnboardingScreen;
