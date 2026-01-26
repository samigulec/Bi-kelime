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

// Proficiency Level data
interface LevelInfo {
  code: ProficiencyLevel;
  name: string;
  description: string;
  emoji: string;
}

const LEVELS: LevelInfo[] = [
  { code: 'A1', name: 'Beginner', description: 'Just starting out', emoji: '🌱' },
  { code: 'A2', name: 'Elementary', description: 'Basic phrases', emoji: '🌿' },
  { code: 'B1', name: 'Intermediate', description: 'Everyday topics', emoji: '🌳' },
  { code: 'B2', name: 'Upper Intermediate', description: 'Complex discussions', emoji: '🌲' },
  { code: 'C1', name: 'Advanced', description: 'Fluent expression', emoji: '🏔️' },
  { code: 'C2', name: 'Mastery', description: 'Native-like proficiency', emoji: '⭐' },
];

// Animated Cloud Component
const Cloud: React.FC<{ delay: number; top: number; size: number; duration: number }> = ({ 
  delay, top, size, duration 
}) => {
  const translateX = useRef(new Animated.Value(-200)).current;

  useEffect(() => {
    const animate = () => {
      translateX.setValue(-200);
      Animated.timing(translateX, {
        toValue: width + 200,
        duration: duration,
        delay: delay,
        useNativeDriver: true,
      }).start(() => animate());
    };
    animate();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.cloud, 
        { top, width: size, height: size * 0.5, transform: [{ translateX }] }
      ]}
    >
      <View style={[styles.cloudPuff, { width: size * 0.5, height: size * 0.5, left: 0, bottom: 0 }]} />
      <View style={[styles.cloudPuff, { width: size * 0.6, height: size * 0.6, left: size * 0.25, bottom: size * 0.15 }]} />
      <View style={[styles.cloudPuff, { width: size * 0.45, height: size * 0.45, right: 0, bottom: 0 }]} />
    </Animated.View>
  );
};

// Language Item Component
const LanguageItem: React.FC<{
  item: Language;
  isSelected: boolean;
  onSelect: (lang: Language) => void;
}> = ({ item, isSelected, onSelect }) => {
  const itemScale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(itemScale, { toValue: 0.9, useNativeDriver: true }),
      Animated.spring(itemScale, { toValue: 1.05, useNativeDriver: true }),
      Animated.spring(itemScale, { toValue: 1, useNativeDriver: true }),
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
        {isSelected && <Text style={styles.checkEmoji}>✓</Text>}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Level Item Component
const LevelItem: React.FC<{
  item: LevelInfo;
  isSelected: boolean;
  onSelect: (level: LevelInfo) => void;
}> = ({ item, isSelected, onSelect }) => {
  const itemScale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.spring(itemScale, { toValue: 0.95, useNativeDriver: true }),
      Animated.spring(itemScale, { toValue: 1.02, useNativeDriver: true }),
      Animated.spring(itemScale, { toValue: 1, useNativeDriver: true }),
    ]).start();
    onSelect(item);
  };

  return (
    <Animated.View style={{ transform: [{ scale: itemScale }] }}>
      <TouchableOpacity
        style={[
          styles.levelItem,
          isSelected && styles.levelItemSelected,
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={styles.levelLeft}>
          <Text style={styles.levelEmoji}>{item.emoji}</Text>
          <View style={styles.levelTextContainer}>
            <View style={styles.levelHeader}>
              <Text style={[styles.levelCode, isSelected && styles.levelCodeSelected]}>{item.code}</Text>
              <Text style={[styles.levelName, isSelected && styles.levelNameSelected]}>{item.name}</Text>
            </View>
            <Text style={[styles.levelDescription, isSelected && styles.levelDescriptionSelected]}>
              {item.description}
            </Text>
          </View>
        </View>
        {isSelected && <Text style={styles.checkEmojiLevel}>✓</Text>}
      </TouchableOpacity>
    </Animated.View>
  );
};

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [nativeLanguage, setNativeLanguage] = useState<LanguageCode | null>(null);
  const [targetLanguage, setTargetLanguage] = useState<LanguageCode | null>(null);
  const [proficiencyLevel, setProficiencyLevel] = useState<ProficiencyLevel | null>(null);
  
  // Animations
  const titleWiggle = useRef(new Animated.Value(0)).current;
  const continueButtonScale = useRef(new Animated.Value(0)).current;
  const continueButtonOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Title wiggle animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(titleWiggle, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(titleWiggle, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    // Show/hide continue button
    const shouldShow = 
      (step === 1 && nativeLanguage) || 
      (step === 2 && targetLanguage) ||
      (step === 3 && proficiencyLevel);
    
    Animated.parallel([
      Animated.spring(continueButtonScale, {
        toValue: shouldShow ? 1 : 0,
        useNativeDriver: true,
      }),
      Animated.timing(continueButtonOpacity, {
        toValue: shouldShow ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [step, nativeLanguage, targetLanguage, proficiencyLevel]);

  const handleLanguageSelect = (lang: Language) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
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

  const handleLevelSelect = (level: LevelInfo) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setProficiencyLevel(level.code);
  };

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    if (step === 1 && nativeLanguage) {
      setStep(2);
    } else if (step === 2 && targetLanguage) {
      setStep(3);
    } else if (step === 3 && proficiencyLevel && nativeLanguage && targetLanguage) {
      onComplete(nativeLanguage, targetLanguage, proficiencyLevel);
    }
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step === 2) {
      setStep(1);
      setTargetLanguage(null);
    } else if (step === 3) {
      setStep(2);
      setProficiencyLevel(null);
    }
  };

  const titleRotate = titleWiggle.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['-1deg', '1deg', '-1deg'],
  });

  const getTitle = () => {
    switch (step) {
      case 1: return 'I speak...';
      case 2: return 'I want to learn...';
      case 3: return 'My level is...';
    }
  };

  const getSubtitle = () => {
    switch (step) {
      case 1: return '¿Qué idioma hablas? • Welche Sprache sprichst du?';
      case 2: return '¿Qué quieres aprender? • Was möchtest du lernen?';
      case 3: return 'Select your current proficiency level';
    }
  };

  const getEmoji = () => {
    switch (step) {
      case 1: return '🌍';
      case 2: return '📚';
      case 3: return '📊';
    }
  };

  const getContinueText = () => {
    if (step === 3) return "Let's Go! 🚀";
    return 'Continue →';
  };

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

  const renderLevelItem = ({ item }: { item: LevelInfo }) => (
    <LevelItem
      item={item}
      isSelected={proficiencyLevel === item.code}
      onSelect={handleLevelSelect}
    />
  );

  return (
    <LinearGradient colors={['#E0F4FF', '#C5EBFF', '#B8E4FF']} style={styles.container}>
      {/* Animated Clouds */}
      <Cloud delay={0} top={60} size={100} duration={25000} />
      <Cloud delay={5000} top={120} size={80} duration={30000} />
      <Cloud delay={10000} top={40} size={90} duration={28000} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          {step > 1 && (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
          )}
          <View style={styles.headerContent}>
            <Text style={styles.stepIndicator}>Step {step} of 3</Text>
            <Text style={styles.logoEmoji}>{getEmoji()}</Text>
            <Animated.View style={{ transform: [{ rotate: titleRotate }] }}>
              <Text style={styles.title}>{getTitle()}</Text>
              <Text style={styles.titleAlt}>{getSubtitle()}</Text>
            </Animated.View>
          </View>
        </View>

        {/* Step Info */}
        {step === 2 && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              🎯 Select a language different from your native language
            </Text>
          </View>
        )}

        {step === 3 && (
          <View style={styles.infoContainerLevel}>
            <Text style={styles.infoTextLevel}>
              💡 We'll show you words matching your level
            </Text>
          </View>
        )}

        {/* Content - Using key prop to force fresh render when step changes */}
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
          <FlatList
            key="level-list"
            data={LEVELS}
            renderItem={renderLevelItem}
            keyExtractor={(item) => item.code}
            contentContainerStyle={styles.levelGrid}
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Continue Button */}
        <Animated.View 
          style={[
            styles.continueButtonWrapper,
            { 
              opacity: continueButtonOpacity,
              transform: [{ scale: continueButtonScale }] 
            }
          ]}
        >
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.9}
          >
            <Text style={styles.continueButtonText}>
              {getContinueText()}
            </Text>
          </TouchableOpacity>
        </Animated.View>
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
  cloud: {
    position: 'absolute',
    zIndex: 1,
  },
  cloudPuff: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 100,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 15,
    zIndex: 10,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 25,
    backgroundColor: '#FFFFFF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#5B8FB9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 20,
  },
  backArrow: {
    fontSize: 24,
    color: '#4A90B8',
    fontWeight: '700',
  },
  headerContent: {
    alignItems: 'center',
  },
  stepIndicator: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7EC8E3',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  logoEmoji: {
    fontSize: 45,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#3D5A80',
    textAlign: 'center',
    lineHeight: 34,
  },
  titleAlt: {
    fontSize: 13,
    fontWeight: '500',
    color: '#7EC8E3',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  infoContainer: {
    marginHorizontal: 24,
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#81C784',
  },
  infoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    textAlign: 'center',
  },
  infoContainerLevel: {
    marginHorizontal: 24,
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFB74D',
  },
  infoTextLevel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E65100',
    textAlign: 'center',
  },
  languageGrid: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  languageItem: {
    width: (width - 48) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#5B8FB9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  languageItemSelected: {
    backgroundColor: '#F0FFF4',
    borderColor: '#7DDBA3',
    shadowColor: '#38A169',
    shadowOpacity: 0.3,
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
    color: '#276749',
  },
  checkEmoji: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 16,
    color: '#38A169',
    fontWeight: '800',
  },
  // Level styles
  levelGrid: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  levelItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#5B8FB9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  levelItemSelected: {
    backgroundColor: '#FFF8E1',
    borderColor: '#FFB74D',
    shadowColor: '#FF9800',
    shadowOpacity: 0.25,
  },
  levelLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  levelEmoji: {
    fontSize: 32,
    marginRight: 14,
  },
  levelTextContainer: {
    flex: 1,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  levelCode: {
    fontSize: 18,
    fontWeight: '800',
    color: '#5B8FB9',
    marginRight: 10,
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  levelCodeSelected: {
    color: '#E65100',
    backgroundColor: '#FFE0B2',
  },
  levelName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#3D5A80',
  },
  levelNameSelected: {
    color: '#E65100',
  },
  levelDescription: {
    fontSize: 13,
    color: '#78909C',
    fontWeight: '500',
  },
  levelDescriptionSelected: {
    color: '#FF9800',
  },
  checkEmojiLevel: {
    fontSize: 20,
    color: '#FF9800',
    fontWeight: '800',
    marginLeft: 10,
  },
  continueButtonWrapper: {
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
    zIndex: 20,
  },
  continueButton: {
    backgroundColor: '#7DDBA3',
    borderRadius: 28,
    paddingVertical: 20,
    alignItems: 'center',
    shadowColor: '#38A169',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  continueButtonText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});

export default OnboardingScreen;
