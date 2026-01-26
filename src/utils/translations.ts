// Translations for the app UI
export type LanguageCode = 'en' | 'tr' | 'es' | 'de' | 'fr' | 'pt' | 'it' | 'ru' | 'ja' | 'ko' | 'zh';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
];

type TranslationKey = 
  | 'appName'
  | 'idiomOfTheDay'
  | 'showMeaning'
  | 'hideMeaning'
  | 'meaning'
  | 'exampleSentence'
  | 'practiceWithAI'
  | 'practiceHint'
  | 'dayStreak'
  | 'loading'
  | 'practiceTime'
  | 'typing'
  | 'writeYourSentence'
  | 'quickReplyExample'
  | 'quickReplyMeaning'
  | 'quickReplyPronunciation'
  | 'languageSelectTitle'
  | 'continue'
  | 'aiGreeting'
  | 'errorMessage';

const translations: Record<LanguageCode, Record<TranslationKey, string>> = {
  en: {
    appName: "Bi'Kelime",
    idiomOfTheDay: '🎯 Idiom of the Day',
    showMeaning: 'Show Meaning',
    hideMeaning: 'Hide',
    meaning: '📚 Meaning',
    exampleSentence: '📝 Example Sentence',
    practiceWithAI: 'Practice with AI!',
    practiceHint: 'Learn by chatting with AI teacher! 🎉',
    dayStreak: 'day',
    loading: 'Loading... ✨',
    practiceTime: '💬 Practice Time!',
    typing: 'Typing...',
    writeYourSentence: 'Write your sentence... ✍️',
    quickReplyExample: '📝 Give example',
    quickReplyMeaning: '📚 What does it mean?',
    quickReplyPronunciation: '🔊 How to pronounce?',
    languageSelectTitle: 'Which language do you speak?',
    continue: 'Continue',
    aiGreeting: "Hello! 👋 I'm your English teacher.\n\nToday we'll learn:",
    errorMessage: 'An error occurred. Please try again! 😅',
  },
  tr: {
    appName: "Bi'Kelime",
    idiomOfTheDay: '🎯 Günün Deyimi',
    showMeaning: 'Anlamını Göster',
    hideMeaning: 'Gizle',
    meaning: '📚 Anlam',
    exampleSentence: '📝 Örnek Cümle',
    practiceWithAI: 'Bu Deyimle Pratik Yap!',
    practiceHint: 'Yapay zeka öğretmenle eğlenerek öğren! 🎉',
    dayStreak: 'gün',
    loading: 'Yükleniyor... ✨',
    practiceTime: '💬 Pratik Zamanı!',
    typing: 'Yazıyor...',
    writeYourSentence: 'İngilizce cümleni yaz... ✍️',
    quickReplyExample: '📝 Örnek cümle ver',
    quickReplyMeaning: '📚 Türkçesi ne?',
    quickReplyPronunciation: '🔊 Telaffuzu nasıl?',
    languageSelectTitle: 'Hangi dili konuşuyorsun?',
    continue: 'Devam Et',
    aiGreeting: "Merhaba! 👋 Ben senin İngilizce öğretmeninim.\n\nBugün şunu öğreneceğiz:",
    errorMessage: 'Bir hata oluştu. Lütfen tekrar dene! 😅',
  },
  es: {
    appName: "Bi'Kelime",
    idiomOfTheDay: '🎯 Modismo del Día',
    showMeaning: 'Mostrar Significado',
    hideMeaning: 'Ocultar',
    meaning: '📚 Significado',
    exampleSentence: '📝 Oración de Ejemplo',
    practiceWithAI: '¡Practica con IA!',
    practiceHint: '¡Aprende charlando con tu profesor IA! 🎉',
    dayStreak: 'día',
    loading: 'Cargando... ✨',
    practiceTime: '💬 ¡Hora de Practicar!',
    typing: 'Escribiendo...',
    writeYourSentence: 'Escribe tu oración... ✍️',
    quickReplyExample: '📝 Dame un ejemplo',
    quickReplyMeaning: '📚 ¿Qué significa?',
    quickReplyPronunciation: '🔊 ¿Cómo se pronuncia?',
    languageSelectTitle: '¿Qué idioma hablas?',
    continue: 'Continuar',
    aiGreeting: "¡Hola! 👋 Soy tu profesor de inglés.\n\nHoy aprenderemos:",
    errorMessage: 'Ocurrió un error. ¡Inténtalo de nuevo! 😅',
  },
  de: {
    appName: "Bi'Kelime",
    idiomOfTheDay: '🎯 Redewendung des Tages',
    showMeaning: 'Bedeutung zeigen',
    hideMeaning: 'Verstecken',
    meaning: '📚 Bedeutung',
    exampleSentence: '📝 Beispielsatz',
    practiceWithAI: 'Mit KI üben!',
    practiceHint: 'Lerne durch Chatten mit dem KI-Lehrer! 🎉',
    dayStreak: 'Tag',
    loading: 'Laden... ✨',
    practiceTime: '💬 Übungszeit!',
    typing: 'Schreibt...',
    writeYourSentence: 'Schreibe deinen Satz... ✍️',
    quickReplyExample: '📝 Gib ein Beispiel',
    quickReplyMeaning: '📚 Was bedeutet das?',
    quickReplyPronunciation: '🔊 Wie spricht man das aus?',
    languageSelectTitle: 'Welche Sprache sprichst du?',
    continue: 'Weiter',
    aiGreeting: "Hallo! 👋 Ich bin dein Englischlehrer.\n\nHeute lernen wir:",
    errorMessage: 'Ein Fehler ist aufgetreten. Bitte versuche es erneut! 😅',
  },
  fr: {
    appName: "Bi'Kelime",
    idiomOfTheDay: "🎯 Expression du Jour",
    showMeaning: 'Afficher le Sens',
    hideMeaning: 'Cacher',
    meaning: '📚 Signification',
    exampleSentence: '📝 Phrase Exemple',
    practiceWithAI: "Pratiquer avec l'IA!",
    practiceHint: "Apprends en discutant avec ton prof IA! 🎉",
    dayStreak: 'jour',
    loading: 'Chargement... ✨',
    practiceTime: '💬 Temps de Pratique!',
    typing: 'Écrit...',
    writeYourSentence: 'Écris ta phrase... ✍️',
    quickReplyExample: '📝 Donne un exemple',
    quickReplyMeaning: '📚 Ça veut dire quoi?',
    quickReplyPronunciation: '🔊 Comment ça se prononce?',
    languageSelectTitle: 'Quelle langue parles-tu?',
    continue: 'Continuer',
    aiGreeting: "Bonjour! 👋 Je suis ton professeur d'anglais.\n\nAujourd'hui nous apprendrons:",
    errorMessage: "Une erreur s'est produite. Réessaie! 😅",
  },
  pt: {
    appName: "Bi'Kelime",
    idiomOfTheDay: '🎯 Expressão do Dia',
    showMeaning: 'Mostrar Significado',
    hideMeaning: 'Esconder',
    meaning: '📚 Significado',
    exampleSentence: '📝 Frase de Exemplo',
    practiceWithAI: 'Praticar com IA!',
    practiceHint: 'Aprenda conversando com o professor IA! 🎉',
    dayStreak: 'dia',
    loading: 'Carregando... ✨',
    practiceTime: '💬 Hora de Praticar!',
    typing: 'Digitando...',
    writeYourSentence: 'Escreva sua frase... ✍️',
    quickReplyExample: '📝 Dê um exemplo',
    quickReplyMeaning: '📚 O que significa?',
    quickReplyPronunciation: '🔊 Como se pronuncia?',
    languageSelectTitle: 'Qual idioma você fala?',
    continue: 'Continuar',
    aiGreeting: "Olá! 👋 Sou seu professor de inglês.\n\nHoje vamos aprender:",
    errorMessage: 'Ocorreu um erro. Tente novamente! 😅',
  },
  it: {
    appName: "Bi'Kelime",
    idiomOfTheDay: '🎯 Modi di Dire del Giorno',
    showMeaning: 'Mostra Significato',
    hideMeaning: 'Nascondi',
    meaning: '📚 Significato',
    exampleSentence: '📝 Frase di Esempio',
    practiceWithAI: "Pratica con l'IA!",
    practiceHint: "Impara chiacchierando con l'insegnante IA! 🎉",
    dayStreak: 'giorno',
    loading: 'Caricamento... ✨',
    practiceTime: '💬 Tempo di Pratica!',
    typing: 'Scrivendo...',
    writeYourSentence: 'Scrivi la tua frase... ✍️',
    quickReplyExample: '📝 Dammi un esempio',
    quickReplyMeaning: '📚 Cosa significa?',
    quickReplyPronunciation: '🔊 Come si pronuncia?',
    languageSelectTitle: 'Che lingua parli?',
    continue: 'Continua',
    aiGreeting: "Ciao! 👋 Sono il tuo insegnante di inglese.\n\nOggi impareremo:",
    errorMessage: 'Si è verificato un errore. Riprova! 😅',
  },
  ru: {
    appName: "Bi'Kelime",
    idiomOfTheDay: '🎯 Идиома Дня',
    showMeaning: 'Показать Значение',
    hideMeaning: 'Скрыть',
    meaning: '📚 Значение',
    exampleSentence: '📝 Пример Предложения',
    practiceWithAI: 'Практика с ИИ!',
    practiceHint: 'Учись общаясь с ИИ учителем! 🎉',
    dayStreak: 'день',
    loading: 'Загрузка... ✨',
    practiceTime: '💬 Время Практики!',
    typing: 'Печатает...',
    writeYourSentence: 'Напиши своё предложение... ✍️',
    quickReplyExample: '📝 Дай пример',
    quickReplyMeaning: '📚 Что это значит?',
    quickReplyPronunciation: '🔊 Как произносится?',
    languageSelectTitle: 'На каком языке ты говоришь?',
    continue: 'Продолжить',
    aiGreeting: "Привет! 👋 Я твой учитель английского.\n\nСегодня мы выучим:",
    errorMessage: 'Произошла ошибка. Попробуй снова! 😅',
  },
  ja: {
    appName: "Bi'Kelime",
    idiomOfTheDay: '🎯 今日のイディオム',
    showMeaning: '意味を表示',
    hideMeaning: '隠す',
    meaning: '📚 意味',
    exampleSentence: '📝 例文',
    practiceWithAI: 'AIと練習！',
    practiceHint: 'AI先生とチャットで学ぼう！ 🎉',
    dayStreak: '日',
    loading: '読み込み中... ✨',
    practiceTime: '💬 練習タイム！',
    typing: '入力中...',
    writeYourSentence: '文を書いてください... ✍️',
    quickReplyExample: '📝 例文をください',
    quickReplyMeaning: '📚 どういう意味？',
    quickReplyPronunciation: '🔊 発音は？',
    languageSelectTitle: '何語を話しますか？',
    continue: '続ける',
    aiGreeting: "こんにちは！ 👋 私はあなたの英語の先生です。\n\n今日学ぶのは:",
    errorMessage: 'エラーが発生しました。もう一度試してください！ 😅',
  },
  ko: {
    appName: "Bi'Kelime",
    idiomOfTheDay: '🎯 오늘의 관용구',
    showMeaning: '의미 보기',
    hideMeaning: '숨기기',
    meaning: '📚 의미',
    exampleSentence: '📝 예문',
    practiceWithAI: 'AI와 연습!',
    practiceHint: 'AI 선생님과 채팅하며 배워요! 🎉',
    dayStreak: '일',
    loading: '로딩 중... ✨',
    practiceTime: '💬 연습 시간!',
    typing: '입력 중...',
    writeYourSentence: '문장을 써보세요... ✍️',
    quickReplyExample: '📝 예문 주세요',
    quickReplyMeaning: '📚 무슨 뜻이에요?',
    quickReplyPronunciation: '🔊 발음이 어떻게 돼요?',
    languageSelectTitle: '어떤 언어를 사용하시나요?',
    continue: '계속',
    aiGreeting: "안녕하세요! 👋 저는 당신의 영어 선생님입니다.\n\n오늘 배울 것:",
    errorMessage: '오류가 발생했습니다. 다시 시도해 주세요! 😅',
  },
  zh: {
    appName: "Bi'Kelime",
    idiomOfTheDay: '🎯 每日习语',
    showMeaning: '显示含义',
    hideMeaning: '隐藏',
    meaning: '📚 含义',
    exampleSentence: '📝 例句',
    practiceWithAI: '与AI练习！',
    practiceHint: '和AI老师聊天学习！ 🎉',
    dayStreak: '天',
    loading: '加载中... ✨',
    practiceTime: '💬 练习时间！',
    typing: '输入中...',
    writeYourSentence: '写下你的句子... ✍️',
    quickReplyExample: '📝 给个例子',
    quickReplyMeaning: '📚 什么意思？',
    quickReplyPronunciation: '🔊 怎么发音？',
    languageSelectTitle: '你说什么语言？',
    continue: '继续',
    aiGreeting: "你好！ 👋 我是你的英语老师。\n\n今天我们学习:",
    errorMessage: '发生错误。请再试一次！ 😅',
  },
};

// Idiom meanings in different languages
export const idiomMeanings: Record<number, Record<LanguageCode, string>> = {
  1: {
    en: 'To initiate social interaction and conversation',
    tr: 'Buzları kırmak, sohbeti başlatmak',
    es: 'Romper el hielo, iniciar una conversación',
    de: 'Das Eis brechen, ein Gespräch beginnen',
    fr: 'Briser la glace, engager la conversation',
    pt: 'Quebrar o gelo, iniciar uma conversa',
    it: 'Rompere il ghiaccio, iniziare una conversazione',
    ru: 'Сломать лёд, начать разговор',
    ja: '緊張をほぐす、会話を始める',
    ko: '어색함을 깨다, 대화를 시작하다',
    zh: '打破僵局，开始交谈',
  },
  2: {
    en: 'To endure a painful situation with courage',
    tr: 'Dişini sıkıp katlanmak, cesurca dayanmak',
    es: 'Aguantar una situación difícil con valentía',
    de: 'Eine schwierige Situation mutig durchstehen',
    fr: 'Endurer une situation difficile avec courage',
    pt: 'Aguentar uma situação difícil com coragem',
    it: 'Sopportare una situazione difficile con coraggio',
    ru: 'Стойко переносить трудности',
    ja: '困難な状況に耐える',
    ko: '어려운 상황을 용기있게 견디다',
    zh: '咬紧牙关，勇敢面对',
  },
  3: {
    en: 'Something very easy to do',
    tr: 'Çok kolay bir şey, çocuk oyuncağı',
    es: 'Algo muy fácil de hacer',
    de: 'Etwas sehr Einfaches',
    fr: 'Quelque chose de très facile',
    pt: 'Algo muito fácil de fazer',
    it: 'Qualcosa di molto facile',
    ru: 'Очень легко, проще простого',
    ja: 'とても簡単なこと',
    ko: '아주 쉬운 일',
    zh: '非常容易的事',
  },
  // Add more as needed - for now use Turkish as fallback
};

/**
 * Get translation for a key in the specified language
 */
export const getTranslation = (key: TranslationKey, lang: LanguageCode): string => {
  return translations[lang]?.[key] || translations['en'][key];
};

/**
 * Get idiom meaning in the specified language
 */
export const getIdiomMeaning = (idiomId: number, lang: LanguageCode, fallbackMeaning: string): string => {
  return idiomMeanings[idiomId]?.[lang] || fallbackMeaning;
};

/**
 * Get all translations for a language
 */
export const getLanguageTranslations = (lang: LanguageCode) => {
  return translations[lang] || translations['en'];
};


