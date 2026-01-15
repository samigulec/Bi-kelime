import { ChatMessage, Idiom } from '../types';

/**
 * Generate the system prompt for the Turkish-speaking AI English tutor
 */
export const getSystemPrompt = (idiom: Idiom): string => {
  return `Sen Türkçe konuşan bir İngilizce öğretmenisin. Kullanıcıya "${idiom.idiom}" deyimini öğretiyorsun.
Deyimin anlamı: "${idiom.meaningTR}".
İngilizce örnek: "${idiom.example}".

Kurallar:
- Açıklamalarını Türkçe yap ama kullanıcıyı İngilizce yazmaya teşvik et.
- Kullanıcı hata yaparsa, nazikçe ve Türkçe olarak düzelt.
- Destekleyici ve sabırlı ol.
- Kullanıcının İngilizce cümleler kurmasına yardımcı ol.
- Cevaplarını kısa ve anlaşılır tut.`;
};

/**
 * Simulated AI responses for Turkish-speaking learners
 */
const getSimulatedResponse = (
  userMessage: string,
  idiom: Idiom,
  messageCount: number
): string => {
  const lowerMessage = userMessage.toLowerCase();
  const idiomLower = idiom.idiom.toLowerCase();

  // Check for quick reply requests
  if (lowerMessage.includes('örnek') || lowerMessage.includes('example')) {
    return `Tabii! İşte "${idiom.idiom}" ile başka bir örnek cümle:\n\n🇬🇧 "I had to ${idiomLower.replace('the ', '')} when I started the new job."\n\nŞimdi sen de kendi cümleni yazmayı dene! 💪`;
  }

  if (lowerMessage.includes('türkçe') || lowerMessage.includes('anlam')) {
    return `"${idiom.idiom}" deyiminin Türkçe karşılığı:\n\n🇹🇷 ${idiom.meaningTR}\n\nBu deyimi günlük konuşmada sıkça kullanabilirsin! Bir cümle kurmayı dener misin?`;
  }

  if (lowerMessage.includes('telaffuz') || lowerMessage.includes('söyle') || lowerMessage.includes('pronunciation')) {
    return `"${idiom.idiom}" şöyle telaffuz edilir:\n\n🔊 ${idiom.pronunciation || idiom.idiom.toLowerCase()}\n\nYavaşça tekrar et ve cümle içinde kullanmayı dene!`;
  }

  // Check if user used the idiom in their message
  const idiomWords = idiomLower.split(' ');
  const usedIdiom = idiomWords.some(word => 
    word.length > 3 && lowerMessage.includes(word)
  );

  if (usedIdiom || lowerMessage.includes(idiomLower)) {
    const positiveResponses = [
      `Harika! 🎉 Deyimi doğru kullandın! Cümlen çok güzel olmuş. Başka bir örnek dener misin?`,
      `Mükemmel! ⭐ "${idiom.idiom}" deyimini tam yerinde kullandın. İngilizce'n gelişiyor!`,
      `Çok iyi! 👏 Bu cümle çok doğal olmuş. Bir tane daha yazar mısın?`,
      `Bravo! 🌟 Deyimi harika kullanmışsın. Devam et, çok iyi gidiyorsun!`,
    ];
    return positiveResponses[Math.floor(Math.random() * positiveResponses.length)];
  }

  // If message is very short
  if (userMessage.length < 10) {
    return `Daha uzun bir cümle kurmayı dene! "${idiom.idiom}" deyimini kullanarak bir İngilizce cümle yaz. Yardıma ihtiyacın olursa buradayım! 😊`;
  }

  // Check for common grammar mistakes and provide gentle correction
  if (lowerMessage.includes('i am go') || lowerMessage.includes('i going')) {
    return `Güzel deneme! 👍 Küçük bir düzeltme: "I am going" veya "I go" şeklinde kullanmalısın.\n\nŞimdi "${idiom.idiom}" deyimini de ekleyerek yeni bir cümle yazar mısın?`;
  }

  // General encouraging responses
  if (messageCount <= 2) {
    return `Güzel başlangıç! 😊 Şimdi "${idiom.idiom}" deyimini kullanarak bir İngilizce cümle yazmayı dene.\n\nİpucu: Deyimin anlamı "${idiom.meaningTR}". Kendi hayatından bir örnek düşün!`;
  }

  const encouragingResponses = [
    `İyi gidiyorsun! 💪 "${idiom.idiom}" deyimini cümlenin içine eklemeyi dene. Örneğin: "I had to..."`,
    `Devam et! 📝 Bu deyimi günlük bir durumu anlatırken kullanabilirsin. Bir cümle daha yazar mısın?`,
    `Harika çaba! 🌟 "${idiom.idiom}" deyimini kullanarak kendi deneyiminden bir örnek ver. Merak ediyorum!`,
    `Süper! Şimdi bu deyimle ilgili bir cümle kur. Hata yapmaktan korkma, öğrenmenin en iyi yolu denemek! 💪`,
  ];

  return encouragingResponses[Math.floor(Math.random() * encouragingResponses.length)];
};

/**
 * Generate a unique ID for messages
 */
const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Simulate AI response (Turkish tutor)
 */
export const getAIResponse = async (
  userMessage: string,
  idiom: Idiom,
  conversationHistory: ChatMessage[]
): Promise<ChatMessage> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 800));

  const responseText = getSimulatedResponse(
    userMessage,
    idiom,
    conversationHistory.length
  );

  return {
    id: generateMessageId(),
    role: 'assistant',
    content: responseText,
    timestamp: new Date(),
  };
};

/**
 * Create a user message object
 */
export const createUserMessage = (content: string): ChatMessage => {
  return {
    id: generateMessageId(),
    role: 'user',
    content,
    timestamp: new Date(),
  };
};

/**
 * Get initial greeting message from AI (in Turkish)
 */
export const getInitialGreeting = (idiom: Idiom): ChatMessage => {
  return {
    id: generateMessageId(),
    role: 'assistant',
    content: `Merhaba! 👋 Ben senin İngilizce öğretmeninim.\n\nBugün "${idiom.idiom}" deyimini öğreneceğiz!\n\n🇹🇷 Türkçesi: ${idiom.meaningTR}\n\n🇬🇧 Örnek: "${idiom.example}"\n\nHaydi, bu deyimi kullanarak bir İngilizce cümle yazmayı dene! Yardıma ihtiyacın olursa aşağıdaki butonları kullanabilirsin. 💪`,
    timestamp: new Date(),
  };
};

/**
 * Quick reply options for Turkish learners
 */
export const quickReplyOptions = [
  { id: 'example', text: '📝 Örnek cümle ver' },
  { id: 'meaning', text: '🇹🇷 Türkçesi ne?' },
  { id: 'pronunciation', text: '🔊 Telaffuzu nasıl?' },
];
