import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { ContentItem, ChatMessage } from '../types';
import { getTranslation, LanguageCode } from '../utils/translations';
import { getTranslation as getContentTranslation } from '../utils/contentLoader';
import { 
  getAIResponse, 
  createUserMessage, 
  getInitialGreeting,
  getQuickReplyOptions,
} from '../services/aiChat';

type ChatScreenProps = {
  word: ContentItem;
  onNavigateBack: () => void;
  nativeLanguage: LanguageCode;
  targetLanguage: LanguageCode;
};

const ChatScreen: React.FC<ChatScreenProps> = ({ word, onNavigateBack, nativeLanguage, targetLanguage }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Get translations
  const t = (key: Parameters<typeof getTranslation>[0]) => getTranslation(key, nativeLanguage);

  // Animations
  const teacherBounce = useRef(new Animated.Value(0)).current;
  const backButtonScale = useRef(new Animated.Value(1)).current;
  const sendButtonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const wordTranslation = getContentTranslation(word, nativeLanguage);
    const greeting = getInitialGreeting(word, nativeLanguage, targetLanguage, wordTranslation);
    setMessages([greeting]);
    startAnimations();
  }, [word, nativeLanguage, targetLanguage]);

  const startAnimations = () => {
    // Teacher bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(teacherBounce, {
          toValue: -4,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(teacherBounce, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const handleSend = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText || isLoading) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Bounce animation
    Animated.sequence([
      Animated.spring(sendButtonScale, {
        toValue: 0.85,
        useNativeDriver: true,
      }),
      Animated.spring(sendButtonScale, {
        toValue: 1.1,
        useNativeDriver: true,
      }),
      Animated.spring(sendButtonScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();

    const userMessage = createUserMessage(messageText);
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      const wordTranslation = getContentTranslation(word, nativeLanguage);
      const aiResponse = await getAIResponse(messageText, word, updatedMessages, nativeLanguage, targetLanguage, wordTranslation);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        role: 'assistant',
        content: t('errorMessage'),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleQuickReply = (replyText: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    handleSend(replyText);
  };

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.spring(backButtonScale, {
        toValue: 0.9,
        useNativeDriver: true,
      }),
      Animated.spring(backButtonScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(() => onNavigateBack(), 100);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';
    
    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.aiMessageContainer,
        ]}
      >
        {!isUser && (
          <Animated.View 
            style={[
              styles.avatarContainer, 
              { transform: [{ translateY: teacherBounce }] }
            ]}
          >
            <Text style={styles.teacherEmoji}>👩‍🏫</Text>
          </Animated.View>
        )}
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.aiBubble,
          ]}
        >
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.aiMessageText,
          ]}>
            {item.content}
          </Text>
        </View>
        {isUser && (
          <View style={[styles.avatarContainer, styles.userAvatar]}>
            <Text style={styles.userEmoji}>🧑‍🎓</Text>
          </View>
        )}
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isLoading) return null;
    
    return (
      <View style={[styles.messageContainer, styles.aiMessageContainer]}>
        <Animated.View 
          style={[
            styles.avatarContainer, 
            { transform: [{ translateY: teacherBounce }] }
          ]}
        >
          <Text style={styles.teacherEmoji}>👩‍🏫</Text>
        </Animated.View>
        <View style={[styles.messageBubble, styles.aiBubble, styles.typingBubble]}>
          <ActivityIndicator size="small" color="#7EC8E3" />
          <Text style={styles.typingText}>{t('typing')}</Text>
        </View>
      </View>
    );
  };

  const quickReplies = getQuickReplyOptions(nativeLanguage);

  return (
    <LinearGradient colors={['#E0F4FF', '#F0F9FF', '#FFFFFF']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Animated.View style={{ transform: [{ scale: backButtonScale }] }}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
          </Animated.View>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{t('practiceTime')}</Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              "{word.target_word}"
            </Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderTypingIndicator}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
        />

        {/* Quick Reply Chips */}
        <View style={styles.quickReplyContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickReplyScroll}
          >
            {quickReplies.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.quickReplyChip}
                onPress={() => handleQuickReply(option.text)}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Text style={styles.quickReplyText}>{option.text}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder={t('writeYourSentence')}
                placeholderTextColor="#A0C4D8"
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
                editable={!isLoading}
              />
              <Animated.View style={{ transform: [{ scale: sendButtonScale }] }}>
                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
                  ]}
                  onPress={() => handleSend()}
                  disabled={!inputText.trim() || isLoading}
                  activeOpacity={0.8}
                >
                  <Text style={styles.sendEmoji}>🚀</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </View>
        </KeyboardAvoidingView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 2,
    borderBottomColor: '#E0F4FF',
  },
  backButton: {
    backgroundColor: '#FFE5EC',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF8FAB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  backArrow: {
    fontSize: 24,
    color: '#E75480',
    fontWeight: '700',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#4A90B8',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#7EC8E3',
    marginTop: 2,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 44,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E0F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    shadowColor: '#7EC8E3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  teacherEmoji: {
    fontSize: 24,
  },
  userEmoji: {
    fontSize: 24,
  },
  userAvatar: {
    backgroundColor: '#D4F5E9',
    marginRight: 0,
    marginLeft: 10,
  },
  messageBubble: {
    maxWidth: '72%',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 24,
  },
  userBubble: {
    backgroundColor: '#7DDBA3',
    borderBottomRightRadius: 8,
    shadowColor: '#38A169',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 8,
    borderWidth: 2,
    borderColor: '#E0F4FF',
    shadowColor: '#7EC8E3',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: '#3D5A80',
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  typingText: {
    fontSize: 14,
    color: '#7EC8E3',
    marginLeft: 10,
    fontWeight: '600',
  },
  quickReplyContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 12,
    borderTopWidth: 2,
    borderTopColor: '#E0F4FF',
  },
  quickReplyScroll: {
    paddingHorizontal: 16,
  },
  quickReplyChip: {
    backgroundColor: '#FFE5EC',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    marginRight: 10,
    shadowColor: '#FF8FAB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  quickReplyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E75480',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 2,
    borderTopColor: '#E0F4FF',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F0F9FF',
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#C5EBFF',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#3D5A80',
    maxHeight: 100,
    paddingVertical: 8,
    paddingRight: 10,
    fontWeight: '500',
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#7DDBA3',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#38A169',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  sendButtonDisabled: {
    backgroundColor: '#C5EBFF',
    shadowOpacity: 0.1,
  },
  sendEmoji: {
    fontSize: 24,
  },
});

export default ChatScreen;
