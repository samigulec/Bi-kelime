import { ChatMessage, Idiom } from '../types';
import { LanguageCode, getIdiomMeaning } from '../utils/translations';

/**
 * Language-specific quick reply options
 */
const quickRepliesByLanguage: Record<LanguageCode, { id: string; text: string }[]> = {
  en: [
    { id: 'example', text: '📝 Give me an example' },
    { id: 'meaning', text: '📚 What does it mean?' },
    { id: 'pronunciation', text: '🔊 How to pronounce?' },
  ],
  tr: [
    { id: 'example', text: '📝 Örnek cümle ver' },
    { id: 'meaning', text: '🇹🇷 Türkçesi ne?' },
    { id: 'pronunciation', text: '🔊 Telaffuzu nasıl?' },
  ],
  es: [
    { id: 'example', text: '📝 Dame un ejemplo' },
    { id: 'meaning', text: '📚 ¿Qué significa?' },
    { id: 'pronunciation', text: '🔊 ¿Cómo se pronuncia?' },
  ],
  de: [
    { id: 'example', text: '📝 Gib mir ein Beispiel' },
    { id: 'meaning', text: '📚 Was bedeutet das?' },
    { id: 'pronunciation', text: '🔊 Wie spricht man das aus?' },
  ],
  fr: [
    { id: 'example', text: '📝 Donne-moi un exemple' },
    { id: 'meaning', text: '📚 Qu\'est-ce que ça veut dire?' },
    { id: 'pronunciation', text: '🔊 Comment ça se prononce?' },
  ],
  pt: [
    { id: 'example', text: '📝 Me dê um exemplo' },
    { id: 'meaning', text: '📚 O que significa?' },
    { id: 'pronunciation', text: '🔊 Como se pronuncia?' },
  ],
  it: [
    { id: 'example', text: '📝 Dammi un esempio' },
    { id: 'meaning', text: '📚 Cosa significa?' },
    { id: 'pronunciation', text: '🔊 Come si pronuncia?' },
  ],
  ru: [
    { id: 'example', text: '📝 Дай пример' },
    { id: 'meaning', text: '📚 Что это значит?' },
    { id: 'pronunciation', text: '🔊 Как произносится?' },
  ],
  ja: [
    { id: 'example', text: '📝 例文をください' },
    { id: 'meaning', text: '📚 どういう意味?' },
    { id: 'pronunciation', text: '🔊 発音は?' },
  ],
  ko: [
    { id: 'example', text: '📝 예문 주세요' },
    { id: 'meaning', text: '📚 무슨 뜻이에요?' },
    { id: 'pronunciation', text: '🔊 발음이 어때요?' },
  ],
  zh: [
    { id: 'example', text: '📝 给个例子' },
    { id: 'meaning', text: '📚 什么意思?' },
    { id: 'pronunciation', text: '🔊 怎么发音?' },
  ],
};

/**
 * Language-specific greeting templates
 */
const greetingTemplates: Record<LanguageCode, (idiom: Idiom, meaning: string) => string> = {
  en: (idiom, meaning) => 
    `Hello! 👋 I'm your English teacher.\n\nToday we'll learn: "${idiom.idiom}"!\n\n📚 Meaning: ${meaning}\n\n🇬🇧 Example: "${idiom.example}"\n\nTry making a sentence using this idiom! Use the buttons below if you need help. 💪`,
  tr: (idiom, meaning) => 
    `Merhaba! 👋 Ben senin İngilizce öğretmeninim.\n\nBugün "${idiom.idiom}" deyimini öğreneceğiz!\n\n🇹🇷 Türkçesi: ${meaning}\n\n🇬🇧 Örnek: "${idiom.example}"\n\nHaydi, bu deyimi kullanarak bir İngilizce cümle yazmayı dene! Yardıma ihtiyacın olursa aşağıdaki butonları kullanabilirsin. 💪`,
  es: (idiom, meaning) => 
    `¡Hola! 👋 Soy tu profesor de inglés.\n\nHoy aprenderemos: "${idiom.idiom}"!\n\n📚 Significado: ${meaning}\n\n🇬🇧 Ejemplo: "${idiom.example}"\n\n¡Intenta hacer una oración usando esta expresión! Usa los botones de abajo si necesitas ayuda. 💪`,
  de: (idiom, meaning) => 
    `Hallo! 👋 Ich bin dein Englischlehrer.\n\nHeute lernen wir: "${idiom.idiom}"!\n\n📚 Bedeutung: ${meaning}\n\n🇬🇧 Beispiel: "${idiom.example}"\n\nVersuche einen Satz mit dieser Redewendung zu bilden! Nutze die Buttons unten, wenn du Hilfe brauchst. 💪`,
  fr: (idiom, meaning) => 
    `Bonjour! 👋 Je suis ton professeur d'anglais.\n\nAujourd'hui nous apprenons: "${idiom.idiom}"!\n\n📚 Signification: ${meaning}\n\n🇬🇧 Exemple: "${idiom.example}"\n\nEssaie de faire une phrase avec cette expression! Utilise les boutons ci-dessous si tu as besoin d'aide. 💪`,
  pt: (idiom, meaning) => 
    `Olá! 👋 Sou seu professor de inglês.\n\nHoje vamos aprender: "${idiom.idiom}"!\n\n📚 Significado: ${meaning}\n\n🇬🇧 Exemplo: "${idiom.example}"\n\nTente fazer uma frase usando esta expressão! Use os botões abaixo se precisar de ajuda. 💪`,
  it: (idiom, meaning) => 
    `Ciao! 👋 Sono il tuo insegnante di inglese.\n\nOggi impariamo: "${idiom.idiom}"!\n\n📚 Significato: ${meaning}\n\n🇬🇧 Esempio: "${idiom.example}"\n\nProva a fare una frase usando questa espressione! Usa i pulsanti sotto se hai bisogno di aiuto. 💪`,
  ru: (idiom, meaning) => 
    `Привет! 👋 Я твой учитель английского.\n\nСегодня мы выучим: "${idiom.idiom}"!\n\n📚 Значение: ${meaning}\n\n🇬🇧 Пример: "${idiom.example}"\n\nПопробуй составить предложение с этой идиомой! Используй кнопки ниже, если нужна помощь. 💪`,
  ja: (idiom, meaning) => 
    `こんにちは！ 👋 私はあなたの英語の先生です。\n\n今日学ぶのは: "${idiom.idiom}"!\n\n📚 意味: ${meaning}\n\n🇬🇧 例文: "${idiom.example}"\n\nこのイディオムを使って文を作ってみましょう！助けが必要なら下のボタンを使ってください。 💪`,
  ko: (idiom, meaning) => 
    `안녕하세요! 👋 저는 당신의 영어 선생님입니다.\n\n오늘 배울 것: "${idiom.idiom}"!\n\n📚 의미: ${meaning}\n\n🇬🇧 예문: "${idiom.example}"\n\n이 관용구를 사용해서 문장을 만들어 보세요! 도움이 필요하면 아래 버튼을 사용하세요. 💪`,
  zh: (idiom, meaning) => 
    `你好！ 👋 我是你的英语老师。\n\n今天我们学习: "${idiom.idiom}"!\n\n📚 含义: ${meaning}\n\n🇬🇧 例句: "${idiom.example}"\n\n试着用这个习语造个句子！需要帮助的话可以用下面的按钮。 💪`,
};

/**
 * Language-specific response templates
 */
const responseTemplates: Record<LanguageCode, {
  exampleRequest: (idiom: Idiom) => string;
  meaningRequest: (idiom: Idiom, meaning: string) => string;
  pronunciationRequest: (idiom: Idiom) => string;
  correctUsage: string[];
  encouragement: (idiom: Idiom) => string[];
  shortMessage: (idiom: Idiom) => string;
}> = {
  en: {
    exampleRequest: (idiom) => `Sure! Here's another example with "${idiom.idiom}":\n\n🇬🇧 "I realized I had to ${idiom.idiom.toLowerCase().replace('the ', '')} and take action."\n\nNow try writing your own sentence! 💪`,
    meaningRequest: (idiom, meaning) => `"${idiom.idiom}" means:\n\n📚 ${meaning}\n\nYou can use this idiom in everyday conversation! Want to try making a sentence?`,
    pronunciationRequest: (idiom) => `"${idiom.idiom}" is pronounced:\n\n🔊 ${idiom.pronunciation || idiom.idiom.toLowerCase()}\n\nRepeat it slowly and try using it in a sentence!`,
    correctUsage: [
      'Great job! 🎉 You used the idiom correctly! Your sentence is excellent. Want to try another one?',
      'Perfect! ⭐ You used the idiom in the right context. Your English is improving!',
      'Well done! 👏 That sentence sounds very natural. Can you write one more?',
      'Bravo! 🌟 You used it perfectly. Keep going, you\'re doing great!',
    ],
    encouragement: (idiom) => [
      `Keep going! 💪 Try adding "${idiom.idiom}" to your sentence.`,
      `Good effort! 📝 Try using this idiom in a daily situation.`,
      `Great try! 🌟 Tell me about a situation where you could use "${idiom.idiom}".`,
    ],
    shortMessage: (idiom) => `Try writing a longer sentence! Use "${idiom.idiom}" in an English sentence. I'm here to help! 😊`,
  },
  tr: {
    exampleRequest: (idiom) => `Tabii! İşte "${idiom.idiom}" ile başka bir örnek cümle:\n\n🇬🇧 "I realized I had to ${idiom.idiom.toLowerCase().replace('the ', '')} and take action."\n\nŞimdi sen de kendi cümleni yazmayı dene! 💪`,
    meaningRequest: (idiom, meaning) => `"${idiom.idiom}" deyiminin Türkçe karşılığı:\n\n🇹🇷 ${meaning}\n\nBu deyimi günlük konuşmada sıkça kullanabilirsin! Bir cümle kurmayı dener misin?`,
    pronunciationRequest: (idiom) => `"${idiom.idiom}" şöyle telaffuz edilir:\n\n🔊 ${idiom.pronunciation || idiom.idiom.toLowerCase()}\n\nYavaşça tekrar et ve cümle içinde kullanmayı dene!`,
    correctUsage: [
      'Harika! 🎉 Deyimi doğru kullandın! Cümlen çok güzel olmuş. Başka bir örnek dener misin?',
      'Mükemmel! ⭐ Deyimi tam yerinde kullandın. İngilizce\'n gelişiyor!',
      'Çok iyi! 👏 Bu cümle çok doğal olmuş. Bir tane daha yazar mısın?',
      'Bravo! 🌟 Deyimi harika kullanmışsın. Devam et, çok iyi gidiyorsun!',
    ],
    encouragement: (idiom) => [
      `İyi gidiyorsun! 💪 "${idiom.idiom}" deyimini cümlenin içine eklemeyi dene.`,
      `Devam et! 📝 Bu deyimi günlük bir durumu anlatırken kullanabilirsin.`,
      `Harika çaba! 🌟 "${idiom.idiom}" deyimini kullanarak kendi deneyiminden bir örnek ver.`,
    ],
    shortMessage: (idiom) => `Daha uzun bir cümle kurmayı dene! "${idiom.idiom}" deyimini kullanarak bir İngilizce cümle yaz. Yardıma ihtiyacın olursa buradayım! 😊`,
  },
  es: {
    exampleRequest: (idiom) => `¡Claro! Aquí hay otro ejemplo con "${idiom.idiom}":\n\n🇬🇧 "I realized I had to ${idiom.idiom.toLowerCase().replace('the ', '')} and take action."\n\n¡Ahora intenta escribir tu propia oración! 💪`,
    meaningRequest: (idiom, meaning) => `"${idiom.idiom}" significa:\n\n📚 ${meaning}\n\n¡Puedes usar este modismo en conversaciones diarias! ¿Quieres intentar hacer una oración?`,
    pronunciationRequest: (idiom) => `"${idiom.idiom}" se pronuncia:\n\n🔊 ${idiom.pronunciation || idiom.idiom.toLowerCase()}\n\n¡Repítelo despacio e intenta usarlo en una oración!`,
    correctUsage: [
      '¡Genial! 🎉 ¡Usaste el modismo correctamente! Tu oración es excelente. ¿Quieres intentar otra?',
      '¡Perfecto! ⭐ Usaste el modismo en el contexto correcto. ¡Tu inglés está mejorando!',
      '¡Muy bien! 👏 Esa oración suena muy natural. ¿Puedes escribir una más?',
      '¡Bravo! 🌟 Lo usaste perfectamente. ¡Sigue así, lo estás haciendo genial!',
    ],
    encouragement: (idiom) => [
      `¡Sigue adelante! 💪 Intenta agregar "${idiom.idiom}" a tu oración.`,
      `¡Buen esfuerzo! 📝 Intenta usar este modismo en una situación diaria.`,
      `¡Gran intento! 🌟 Cuéntame una situación donde podrías usar "${idiom.idiom}".`,
    ],
    shortMessage: (idiom) => `¡Intenta escribir una oración más larga! Usa "${idiom.idiom}" en una oración en inglés. ¡Estoy aquí para ayudarte! 😊`,
  },
  de: {
    exampleRequest: (idiom) => `Klar! Hier ist ein weiteres Beispiel mit "${idiom.idiom}":\n\n🇬🇧 "I realized I had to ${idiom.idiom.toLowerCase().replace('the ', '')} and take action."\n\nJetzt versuch deinen eigenen Satz zu schreiben! 💪`,
    meaningRequest: (idiom, meaning) => `"${idiom.idiom}" bedeutet:\n\n📚 ${meaning}\n\nDu kannst diese Redewendung in alltäglichen Gesprächen verwenden! Möchtest du einen Satz versuchen?`,
    pronunciationRequest: (idiom) => `"${idiom.idiom}" wird so ausgesprochen:\n\n🔊 ${idiom.pronunciation || idiom.idiom.toLowerCase()}\n\nWiederhole es langsam und versuche es in einem Satz zu benutzen!`,
    correctUsage: [
      'Super! 🎉 Du hast die Redewendung richtig verwendet! Dein Satz ist ausgezeichnet. Möchtest du noch einen versuchen?',
      'Perfekt! ⭐ Du hast die Redewendung im richtigen Kontext verwendet. Dein Englisch verbessert sich!',
      'Sehr gut! 👏 Der Satz klingt sehr natürlich. Kannst du noch einen schreiben?',
      'Bravo! 🌟 Du hast es perfekt verwendet. Mach weiter so!',
    ],
    encouragement: (idiom) => [
      `Weiter so! 💪 Versuche "${idiom.idiom}" in deinen Satz einzubauen.`,
      `Gute Bemühung! 📝 Versuche diese Redewendung in einer Alltagssituation zu verwenden.`,
      `Guter Versuch! 🌟 Erzähl mir von einer Situation, in der du "${idiom.idiom}" verwenden könntest.`,
    ],
    shortMessage: (idiom) => `Versuche einen längeren Satz zu schreiben! Benutze "${idiom.idiom}" in einem englischen Satz. Ich bin hier um zu helfen! 😊`,
  },
  fr: {
    exampleRequest: (idiom) => `Bien sûr! Voici un autre exemple avec "${idiom.idiom}":\n\n🇬🇧 "I realized I had to ${idiom.idiom.toLowerCase().replace('the ', '')} and take action."\n\nMaintenant essaie d'écrire ta propre phrase! 💪`,
    meaningRequest: (idiom, meaning) => `"${idiom.idiom}" signifie:\n\n📚 ${meaning}\n\nTu peux utiliser cette expression dans les conversations quotidiennes! Tu veux essayer de faire une phrase?`,
    pronunciationRequest: (idiom) => `"${idiom.idiom}" se prononce:\n\n🔊 ${idiom.pronunciation || idiom.idiom.toLowerCase()}\n\nRépète-le lentement et essaie de l'utiliser dans une phrase!`,
    correctUsage: [
      'Génial! 🎉 Tu as utilisé l\'expression correctement! Ta phrase est excellente. Tu veux en essayer une autre?',
      'Parfait! ⭐ Tu as utilisé l\'expression dans le bon contexte. Ton anglais s\'améliore!',
      'Très bien! 👏 Cette phrase sonne très naturelle. Tu peux en écrire une autre?',
      'Bravo! 🌟 Tu l\'as utilisé parfaitement. Continue comme ça!',
    ],
    encouragement: (idiom) => [
      `Continue! 💪 Essaie d'ajouter "${idiom.idiom}" à ta phrase.`,
      `Bon effort! 📝 Essaie d'utiliser cette expression dans une situation quotidienne.`,
      `Bel essai! 🌟 Parle-moi d'une situation où tu pourrais utiliser "${idiom.idiom}".`,
    ],
    shortMessage: (idiom) => `Essaie d'écrire une phrase plus longue! Utilise "${idiom.idiom}" dans une phrase en anglais. Je suis là pour t'aider! 😊`,
  },
  pt: {
    exampleRequest: (idiom) => `Claro! Aqui está outro exemplo com "${idiom.idiom}":\n\n🇬🇧 "I realized I had to ${idiom.idiom.toLowerCase().replace('the ', '')} and take action."\n\nAgora tente escrever sua própria frase! 💪`,
    meaningRequest: (idiom, meaning) => `"${idiom.idiom}" significa:\n\n📚 ${meaning}\n\nVocê pode usar esta expressão em conversas do dia a dia! Quer tentar fazer uma frase?`,
    pronunciationRequest: (idiom) => `"${idiom.idiom}" é pronunciado:\n\n🔊 ${idiom.pronunciation || idiom.idiom.toLowerCase()}\n\nRepita devagar e tente usar em uma frase!`,
    correctUsage: [
      'Ótimo! 🎉 Você usou a expressão corretamente! Sua frase é excelente. Quer tentar outra?',
      'Perfeito! ⭐ Você usou a expressão no contexto certo. Seu inglês está melhorando!',
      'Muito bem! 👏 Essa frase soa muito natural. Pode escrever mais uma?',
      'Bravo! 🌟 Você usou perfeitamente. Continue assim!',
    ],
    encouragement: (idiom) => [
      `Continue! 💪 Tente adicionar "${idiom.idiom}" à sua frase.`,
      `Bom esforço! 📝 Tente usar esta expressão em uma situação do dia a dia.`,
      `Boa tentativa! 🌟 Me conte uma situação onde você poderia usar "${idiom.idiom}".`,
    ],
    shortMessage: (idiom) => `Tente escrever uma frase mais longa! Use "${idiom.idiom}" em uma frase em inglês. Estou aqui para ajudar! 😊`,
  },
  it: {
    exampleRequest: (idiom) => `Certo! Ecco un altro esempio con "${idiom.idiom}":\n\n🇬🇧 "I realized I had to ${idiom.idiom.toLowerCase().replace('the ', '')} and take action."\n\nOra prova a scrivere la tua frase! 💪`,
    meaningRequest: (idiom, meaning) => `"${idiom.idiom}" significa:\n\n📚 ${meaning}\n\nPuoi usare questa espressione nelle conversazioni quotidiane! Vuoi provare a fare una frase?`,
    pronunciationRequest: (idiom) => `"${idiom.idiom}" si pronuncia:\n\n🔊 ${idiom.pronunciation || idiom.idiom.toLowerCase()}\n\nRipetilo lentamente e prova a usarlo in una frase!`,
    correctUsage: [
      'Fantastico! 🎉 Hai usato l\'espressione correttamente! La tua frase è eccellente. Vuoi provarne un\'altra?',
      'Perfetto! ⭐ Hai usato l\'espressione nel contesto giusto. Il tuo inglese sta migliorando!',
      'Molto bene! 👏 Questa frase suona molto naturale. Puoi scriverne un\'altra?',
      'Bravo! 🌟 L\'hai usato perfettamente. Continua così!',
    ],
    encouragement: (idiom) => [
      `Continua! 💪 Prova ad aggiungere "${idiom.idiom}" alla tua frase.`,
      `Buon lavoro! 📝 Prova a usare questa espressione in una situazione quotidiana.`,
      `Bel tentativo! 🌟 Raccontami una situazione dove potresti usare "${idiom.idiom}".`,
    ],
    shortMessage: (idiom) => `Prova a scrivere una frase più lunga! Usa "${idiom.idiom}" in una frase in inglese. Sono qui per aiutarti! 😊`,
  },
  ru: {
    exampleRequest: (idiom) => `Конечно! Вот ещё один пример с "${idiom.idiom}":\n\n🇬🇧 "I realized I had to ${idiom.idiom.toLowerCase().replace('the ', '')} and take action."\n\nТеперь попробуй написать своё предложение! 💪`,
    meaningRequest: (idiom, meaning) => `"${idiom.idiom}" означает:\n\n📚 ${meaning}\n\nМожешь использовать эту идиому в повседневных разговорах! Хочешь попробовать составить предложение?`,
    pronunciationRequest: (idiom) => `"${idiom.idiom}" произносится:\n\n🔊 ${idiom.pronunciation || idiom.idiom.toLowerCase()}\n\nПовтори медленно и попробуй использовать в предложении!`,
    correctUsage: [
      'Отлично! 🎉 Ты правильно использовал идиому! Твоё предложение превосходно. Хочешь попробовать ещё?',
      'Идеально! ⭐ Ты использовал идиому в правильном контексте. Твой английский улучшается!',
      'Молодец! 👏 Это предложение звучит очень естественно. Можешь написать ещё одно?',
      'Браво! 🌟 Ты использовал её идеально. Продолжай в том же духе!',
    ],
    encouragement: (idiom) => [
      `Продолжай! 💪 Попробуй добавить "${idiom.idiom}" в своё предложение.`,
      `Хорошая попытка! 📝 Попробуй использовать эту идиому в повседневной ситуации.`,
      `Отличная попытка! 🌟 Расскажи о ситуации, где ты мог бы использовать "${idiom.idiom}".`,
    ],
    shortMessage: (idiom) => `Попробуй написать более длинное предложение! Используй "${idiom.idiom}" в предложении на английском. Я здесь, чтобы помочь! 😊`,
  },
  ja: {
    exampleRequest: (idiom) => `もちろん！"${idiom.idiom}"のもう一つの例文です：\n\n🇬🇧 "I realized I had to ${idiom.idiom.toLowerCase().replace('the ', '')} and take action."\n\n今度はあなた自身の文を書いてみましょう！ 💪`,
    meaningRequest: (idiom, meaning) => `"${idiom.idiom}"の意味：\n\n📚 ${meaning}\n\n日常会話でこのイディオムを使えます！文を作ってみませんか？`,
    pronunciationRequest: (idiom) => `"${idiom.idiom}"の発音：\n\n🔊 ${idiom.pronunciation || idiom.idiom.toLowerCase()}\n\nゆっくり繰り返して、文の中で使ってみましょう！`,
    correctUsage: [
      '素晴らしい！ 🎉 イディオムを正しく使いました！文がとても良いです。もう一つ試してみますか？',
      '完璧！ ⭐ 正しい文脈でイディオムを使いました。英語が上達していますね！',
      'よくできました！ 👏 その文はとても自然です。もう一つ書けますか？',
      'ブラボー！ 🌟 完璧に使いました。その調子で頑張って！',
    ],
    encouragement: (idiom) => [
      `頑張って！ 💪 "${idiom.idiom}"を文に加えてみましょう。`,
      `いい努力！ 📝 このイディオムを日常の状況で使ってみましょう。`,
      `いい試み！ 🌟 "${idiom.idiom}"を使える状況を教えてください。`,
    ],
    shortMessage: (idiom) => `もっと長い文を書いてみましょう！"${idiom.idiom}"を使って英語の文を作ってください。お手伝いします！ 😊`,
  },
  ko: {
    exampleRequest: (idiom) => `물론이죠! "${idiom.idiom}"의 다른 예문입니다:\n\n🇬🇧 "I realized I had to ${idiom.idiom.toLowerCase().replace('the ', '')} and take action."\n\n이제 직접 문장을 만들어 보세요! 💪`,
    meaningRequest: (idiom, meaning) => `"${idiom.idiom}"의 의미:\n\n📚 ${meaning}\n\n일상 대화에서 이 관용구를 사용할 수 있어요! 문장을 만들어 볼까요?`,
    pronunciationRequest: (idiom) => `"${idiom.idiom}"의 발음:\n\n🔊 ${idiom.pronunciation || idiom.idiom.toLowerCase()}\n\n천천히 따라하고 문장에서 사용해 보세요!`,
    correctUsage: [
      '훌륭해요! 🎉 관용구를 올바르게 사용했어요! 문장이 아주 좋아요. 하나 더 해볼까요?',
      '완벽해요! ⭐ 올바른 맥락에서 관용구를 사용했어요. 영어 실력이 늘고 있어요!',
      '잘했어요! 👏 그 문장은 아주 자연스러워요. 하나 더 써볼 수 있나요?',
      '브라보! 🌟 완벽하게 사용했어요. 계속 화이팅!',
    ],
    encouragement: (idiom) => [
      `계속 해봐요! 💪 "${idiom.idiom}"를 문장에 추가해 보세요.`,
      `좋은 노력이에요! 📝 이 관용구를 일상적인 상황에서 사용해 보세요.`,
      `좋은 시도예요! 🌟 "${idiom.idiom}"를 사용할 수 있는 상황을 알려주세요.`,
    ],
    shortMessage: (idiom) => `더 긴 문장을 써보세요! "${idiom.idiom}"를 사용해서 영어 문장을 만들어 주세요. 도와드릴게요! 😊`,
  },
  zh: {
    exampleRequest: (idiom) => `当然！这是"${idiom.idiom}"的另一个例句：\n\n🇬🇧 "I realized I had to ${idiom.idiom.toLowerCase().replace('the ', '')} and take action."\n\n现在试着写你自己的句子吧！ 💪`,
    meaningRequest: (idiom, meaning) => `"${idiom.idiom}"的意思：\n\n📚 ${meaning}\n\n你可以在日常对话中使用这个习语！想试着造个句子吗？`,
    pronunciationRequest: (idiom) => `"${idiom.idiom}"的发音：\n\n🔊 ${idiom.pronunciation || idiom.idiom.toLowerCase()}\n\n慢慢重复，试着在句子中使用！`,
    correctUsage: [
      '太棒了！ 🎉 你正确使用了习语！你的句子很棒。想再试一个吗？',
      '完美！ ⭐ 你在正确的语境中使用了习语。你的英语在进步！',
      '很好！ 👏 这个句子听起来很自然。能再写一个吗？',
      '太好了！ 🌟 你用得很完美。继续加油！',
    ],
    encouragement: (idiom) => [
      `继续加油！ 💪 试着把"${idiom.idiom}"加到你的句子里。`,
      `不错的尝试！ 📝 试着在日常情境中使用这个习语。`,
      `很好的尝试！ 🌟 告诉我一个你可以使用"${idiom.idiom}"的情境。`,
    ],
    shortMessage: (idiom) => `试着写一个更长的句子！用"${idiom.idiom}"造一个英语句子。我来帮你！ 😊`,
  },
};

/**
 * Generate a unique ID for messages
 */
const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get simulated response based on language
 */
const getSimulatedResponse = (
  userMessage: string,
  idiom: Idiom,
  messageCount: number,
  language: LanguageCode
): string => {
  const lowerMessage = userMessage.toLowerCase();
  const idiomLower = idiom.idiom.toLowerCase();
  const templates = responseTemplates[language] || responseTemplates['en'];
  const meaning = getIdiomMeaning(idiom.id, language, idiom.meaningTR);

  // Check for quick reply requests
  const exampleKeywords = ['örnek', 'example', 'ejemplo', 'beispiel', 'exemple', 'exemplo', 'esempio', 'пример', '例', '예문'];
  const meaningKeywords = ['türkçe', 'anlam', 'meaning', 'significa', 'bedeutet', 'signifie', 'значит', '意味', '뜻', '意思'];
  const pronunciationKeywords = ['telaffuz', 'pronunciation', 'pronuncia', 'ausspr', 'prononce', 'произнос', '発音', '발음', '发音'];

  if (exampleKeywords.some(kw => lowerMessage.includes(kw))) {
    return templates.exampleRequest(idiom);
  }

  if (meaningKeywords.some(kw => lowerMessage.includes(kw))) {
    return templates.meaningRequest(idiom, meaning);
  }

  if (pronunciationKeywords.some(kw => lowerMessage.includes(kw))) {
    return templates.pronunciationRequest(idiom);
  }

  // Check if user used the idiom in their message
  const idiomWords = idiomLower.split(' ');
  const usedIdiom = idiomWords.some(word => 
    word.length > 3 && lowerMessage.includes(word)
  );

  if (usedIdiom || lowerMessage.includes(idiomLower)) {
    return templates.correctUsage[Math.floor(Math.random() * templates.correctUsage.length)];
  }

  // If message is very short
  if (userMessage.length < 10) {
    return templates.shortMessage(idiom);
  }

  // General encouraging responses
  const encouragements = templates.encouragement(idiom);
  return encouragements[Math.floor(Math.random() * encouragements.length)];
};

/**
 * Get quick reply options for the user's language
 */
export const getQuickReplyOptions = (language: LanguageCode) => {
  return quickRepliesByLanguage[language] || quickRepliesByLanguage['en'];
};

/**
 * Simulate AI response
 */
export const getAIResponse = async (
  userMessage: string,
  idiom: Idiom,
  conversationHistory: ChatMessage[],
  language: LanguageCode
): Promise<ChatMessage> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 800));

  const responseText = getSimulatedResponse(
    userMessage,
    idiom,
    conversationHistory.length,
    language
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
 * Get initial greeting message from AI
 */
export const getInitialGreeting = (idiom: Idiom, language: LanguageCode): ChatMessage => {
  const greetingFn = greetingTemplates[language] || greetingTemplates['en'];
  const meaning = getIdiomMeaning(idiom.id, language, idiom.meaningTR);

  return {
    id: generateMessageId(),
    role: 'assistant',
    content: greetingFn(idiom, meaning),
    timestamp: new Date(),
  };
};

// Keep for backwards compatibility
export const quickReplyOptions = quickRepliesByLanguage['tr'];
