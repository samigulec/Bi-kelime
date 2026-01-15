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

const { width } = Dimensions.get('window');

type LanguageSelectScreenProps = {
  onLanguageSelected: (languageCode: LanguageCode) => void;
};

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

const LanguageSelectScreen: React.FC<LanguageSelectScreenProps> = ({ onLanguageSelected }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode | null>(null);
  
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

  const handleLanguageSelect = (lang: Language) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedLanguage(lang.code);
    
    // Show continue button
    Animated.parallel([
      Animated.spring(continueButtonScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(continueButtonOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleContinue = () => {
    if (selectedLanguage) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      onLanguageSelected(selectedLanguage);
    }
  };

  const titleRotate = titleWiggle.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['-1deg', '1deg', '-1deg'],
  });

  const renderLanguageItem = ({ item, index }: { item: Language; index: number }) => {
    const isSelected = selectedLanguage === item.code;
    const itemScale = useRef(new Animated.Value(1)).current;

    const handlePress = () => {
      Animated.sequence([
        Animated.spring(itemScale, { toValue: 0.9, useNativeDriver: true }),
        Animated.spring(itemScale, { toValue: 1.05, useNativeDriver: true }),
        Animated.spring(itemScale, { toValue: 1, useNativeDriver: true }),
      ]).start();
      handleLanguageSelect(item);
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

  return (
    <LinearGradient colors={['#E0F4FF', '#C5EBFF', '#B8E4FF']} style={styles.container}>
      {/* Animated Clouds */}
      <Cloud delay={0} top={60} size={100} duration={25000} />
      <Cloud delay={5000} top={120} size={80} duration={30000} />
      <Cloud delay={10000} top={40} size={90} duration={28000} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logoEmoji}>🌍</Text>
          <Animated.View style={{ transform: [{ rotate: titleRotate }] }}>
            <Text style={styles.title}>Which language{'\n'}do you speak?</Text>
            <Text style={styles.titleAlt}>Hangi dili konuşuyorsun?</Text>
          </Animated.View>
        </View>

        {/* Language Grid */}
        <FlatList
          data={LANGUAGES}
          renderItem={renderLanguageItem}
          keyExtractor={(item) => item.code}
          numColumns={2}
          contentContainerStyle={styles.languageGrid}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.columnWrapper}
        />

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
            disabled={!selectedLanguage}
          >
            <Text style={styles.continueButtonText}>
              {selectedLanguage === 'tr' ? 'Devam Et' : 
               selectedLanguage === 'es' ? 'Continuar' :
               selectedLanguage === 'de' ? 'Weiter' :
               selectedLanguage === 'fr' ? 'Continuer' :
               'Continue'} →
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
    paddingTop: 30,
    paddingBottom: 20,
    zIndex: 10,
  },
  logoEmoji: {
    fontSize: 50,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#3D5A80',
    textAlign: 'center',
    lineHeight: 36,
  },
  titleAlt: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7EC8E3',
    textAlign: 'center',
    marginTop: 8,
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
    fontSize: 40,
    marginBottom: 8,
  },
  languageName: {
    fontSize: 16,
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
    fontSize: 18,
    color: '#38A169',
    fontWeight: '800',
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

export default LanguageSelectScreen;

