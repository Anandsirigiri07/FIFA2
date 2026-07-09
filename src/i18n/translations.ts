/**
 * Multilingual translations for StadiumIQ Pro.
 * Supports 10 languages for FIFA World Cup 2026.
 * @module translations
 */

import type { Language } from '../types';

export interface Translations {
  readonly appName: string;
  readonly tagline: string;
  readonly welcome: string;
  readonly selectPersona: string;
  readonly fan: string;
  readonly staff: string;
  readonly volunteer: string;
  readonly organizer: string;
  readonly askAI: string;
  readonly chatPlaceholder: string;
  readonly crowdLevel: string;
  readonly navigation: string;
  readonly transport: string;
  readonly accessibility: string;
  readonly sustainability: string;
  readonly findFood: string;
  readonly findRestroom: string;
  readonly nearestMedical: string;
  readonly reportIncident: string;
  readonly gateStatus: string;
  readonly loading: string;
  readonly send: string;
  readonly selectVenue: string;
}

export const TRANSLATIONS: Readonly<Record<Language, Translations>> = {
  en: {
    appName: 'StadiumIQ Pro',
    tagline: 'GenAI Command Center for FIFA 2026',
    welcome: 'Welcome to FIFA World Cup 2026',
    selectPersona: 'I am a...',
    fan: 'Fan',
    staff: 'Stadium Staff',
    volunteer: 'Volunteer',
    organizer: 'Organizer',
    askAI: 'Ask StadiumIQ AI',
    chatPlaceholder: 'Ask anything about the stadium...',
    crowdLevel: 'Crowd Level',
    navigation: 'Navigation',
    transport: 'Transport',
    accessibility: 'Accessibility',
    sustainability: 'Sustainability',
    findFood: 'Find Food',
    findRestroom: 'Find Restroom',
    nearestMedical: 'Medical Help',
    reportIncident: 'Report Incident',
    gateStatus: 'Gate Status',
    loading: 'Loading...',
    send: 'Send',
    selectVenue: 'Select Stadium',
  },
  es: {
    appName: 'StadiumIQ Pro',
    tagline: 'Centro de Comando GenAI para FIFA 2026',
    welcome: 'Bienvenido a la Copa Mundial FIFA 2026',
    selectPersona: 'Soy...',
    fan: 'Fanático',
    staff: 'Personal del Estadio',
    volunteer: 'Voluntario',
    organizer: 'Organizador',
    askAI: 'Preguntar a StadiumIQ AI',
    chatPlaceholder: 'Pregunta lo que quieras...',
    crowdLevel: 'Nivel de Multitud',
    navigation: 'Navegación',
    transport: 'Transporte',
    accessibility: 'Accesibilidad',
    sustainability: 'Sostenibilidad',
    findFood: 'Buscar Comida',
    findRestroom: 'Buscar Baño',
    nearestMedical: 'Ayuda Médica',
    reportIncident: 'Reportar Incidente',
    gateStatus: 'Estado de Puertas',
    loading: 'Cargando...',
    send: 'Enviar',
    selectVenue: 'Seleccionar Estadio',
  },
  fr: {
    appName: 'StadiumIQ Pro',
    tagline: 'Centre de Commande GenAI pour FIFA 2026',
    welcome: 'Bienvenue à la Coupe du Monde FIFA 2026',
    selectPersona: 'Je suis...',
    fan: 'Fan',
    staff: 'Personnel du Stade',
    volunteer: 'Bénévole',
    organizer: 'Organisateur',
    askAI: 'Demander à StadiumIQ AI',
    chatPlaceholder: 'Posez une question sur le stade...',
    crowdLevel: 'Niveau de Foule',
    navigation: 'Navigation',
    transport: 'Transport',
    accessibility: 'Accessibilité',
    sustainability: 'Durabilité',
    findFood: 'Trouver de la Nourriture',
    findRestroom: 'Trouver les Toilettes',
    nearestMedical: 'Aide Médicale',
    reportIncident: 'Signaler un Incident',
    gateStatus: 'État des Portes',
    loading: 'Chargement...',
    send: 'Envoyer',
    selectVenue: 'Sélectionner le Stade',
  },
  pt: {
    appName: 'StadiumIQ Pro',
    tagline: 'Centro de Comando GenAI para FIFA 2026',
    welcome: 'Bem-vindo à Copa do Mundo FIFA 2026',
    selectPersona: 'Eu sou...',
    fan: 'Torcedor',
    staff: 'Equipe do Estádio',
    volunteer: 'Voluntário',
    organizer: 'Organizador',
    askAI: 'Perguntar ao StadiumIQ AI',
    chatPlaceholder: 'Pergunte sobre o estádio...',
    crowdLevel: 'Nível de Multidão',
    navigation: 'Navegação',
    transport: 'Transporte',
    accessibility: 'Acessibilidade',
    sustainability: 'Sustentabilidade',
    findFood: 'Encontrar Comida',
    findRestroom: 'Encontrar Banheiro',
    nearestMedical: 'Ajuda Médica',
    reportIncident: 'Reportar Incidente',
    gateStatus: 'Status dos Portões',
    loading: 'Carregando...',
    send: 'Enviar',
    selectVenue: 'Selecionar Estádio',
  },
  ar: {
    appName: 'StadiumIQ Pro',
    tagline: 'مركز القيادة بالذكاء الاصطناعي لكأس العالم 2026',
    welcome: 'مرحباً بكم في كأس العالم FIFA 2026',
    selectPersona: 'أنا...',
    fan: 'مشجع',
    staff: 'طاقم الملعب',
    volunteer: 'متطوع',
    organizer: 'منظم',
    askAI: 'اسأل StadiumIQ AI',
    chatPlaceholder: 'اسأل أي شيء عن الملعب...',
    crowdLevel: 'مستوى الحشود',
    navigation: 'التنقل',
    transport: 'المواصلات',
    accessibility: 'إمكانية الوصول',
    sustainability: 'الاستدامة',
    findFood: 'البحث عن طعام',
    findRestroom: 'البحث عن دورة مياه',
    nearestMedical: 'المساعدة الطبية',
    reportIncident: 'الإبلاغ عن حادثة',
    gateStatus: 'حالة البوابات',
    loading: 'جار التحميل...',
    send: 'إرسال',
    selectVenue: 'اختر الملعب',
  },
  de: {
    appName: 'StadiumIQ Pro',
    tagline: 'GenAI-Kommandozentrale für FIFA 2026',
    welcome: 'Willkommen bei der FIFA Weltmeisterschaft 2026',
    selectPersona: 'Ich bin...',
    fan: 'Fan',
    staff: 'Stadionpersonal',
    volunteer: 'Freiwilliger',
    organizer: 'Organisator',
    askAI: 'StadiumIQ AI fragen',
    chatPlaceholder: 'Fragen Sie etwas über das Stadion...',
    crowdLevel: 'Menschenmenge',
    navigation: 'Navigation',
    transport: 'Transport',
    accessibility: 'Barrierefreiheit',
    sustainability: 'Nachhaltigkeit',
    findFood: 'Essen finden',
    findRestroom: 'Toilette finden',
    nearestMedical: 'Medizinische Hilfe',
    reportIncident: 'Vorfall melden',
    gateStatus: 'Tor-Status',
    loading: 'Laden...',
    send: 'Senden',
    selectVenue: 'Stadion auswählen',
  },
  ja: {
    appName: 'StadiumIQ Pro',
    tagline: 'FIFA 2026のためのGenAIコマンドセンター',
    welcome: 'FIFAワールドカップ2026へようこそ',
    selectPersona: '私は...',
    fan: 'ファン',
    staff: 'スタジアムスタッフ',
    volunteer: 'ボランティア',
    organizer: 'オーガナイザー',
    askAI: 'StadiumIQ AIに質問',
    chatPlaceholder: 'スタジアムについて質問してください...',
    crowdLevel: '混雑レベル',
    navigation: 'ナビゲーション',
    transport: '交通',
    accessibility: 'アクセシビリティ',
    sustainability: 'サステナビリティ',
    findFood: '食べ物を探す',
    findRestroom: 'トイレを探す',
    nearestMedical: '医療援助',
    reportIncident: 'インシデントを報告',
    gateStatus: 'ゲートの状態',
    loading: '読み込み中...',
    send: '送信',
    selectVenue: 'スタジアムを選択',
  },
  zh: {
    appName: 'StadiumIQ Pro',
    tagline: 'FIFA 2026人工智能指挥中心',
    welcome: '欢迎来到FIFA世界杯2026',
    selectPersona: '我是...',
    fan: '球迷',
    staff: '场馆工作人员',
    volunteer: '志愿者',
    organizer: '组织者',
    askAI: '询问StadiumIQ AI',
    chatPlaceholder: '询问关于体育场的任何问题...',
    crowdLevel: '人群密度',
    navigation: '导航',
    transport: '交通',
    accessibility: '无障碍',
    sustainability: '可持续性',
    findFood: '查找食物',
    findRestroom: '查找卫生间',
    nearestMedical: '医疗援助',
    reportIncident: '报告事件',
    gateStatus: '入口状态',
    loading: '加载中...',
    send: '发送',
    selectVenue: '选择场馆',
  },
  hi: {
    appName: 'StadiumIQ Pro',
    tagline: 'FIFA 2026 के लिए GenAI कमांड सेंटर',
    welcome: 'FIFA विश्व कप 2026 में आपका स्वागत है',
    selectPersona: 'मैं हूं...',
    fan: 'प्रशंसक',
    staff: 'स्टेडियम स्टाफ',
    volunteer: 'स्वयंसेवक',
    organizer: 'आयोजक',
    askAI: 'StadiumIQ AI से पूछें',
    chatPlaceholder: 'स्टेडियम के बारे में कुछ भी पूछें...',
    crowdLevel: 'भीड़ स्तर',
    navigation: 'नेविगेशन',
    transport: 'परिवहन',
    accessibility: 'पहुंच',
    sustainability: 'स्थिरता',
    findFood: 'खाना ढूंढें',
    findRestroom: 'शौचालय ढूंढें',
    nearestMedical: 'चिकित्सा सहायता',
    reportIncident: 'घटना रिपोर्ट करें',
    gateStatus: 'गेट स्थिति',
    loading: 'लोड हो रहा है...',
    send: 'भेजें',
    selectVenue: 'स्टेडियम चुनें',
  },
  ko: {
    appName: 'StadiumIQ Pro',
    tagline: 'FIFA 2026을 위한 GenAI 지휘 센터',
    welcome: 'FIFA 월드컵 2026에 오신 것을 환영합니다',
    selectPersona: '나는...',
    fan: '팬',
    staff: '경기장 직원',
    volunteer: '자원봉사자',
    organizer: '주최자',
    askAI: 'StadiumIQ AI에게 물어보기',
    chatPlaceholder: '경기장에 대해 무엇이든 물어보세요...',
    crowdLevel: '군중 수준',
    navigation: '내비게이션',
    transport: '교통',
    accessibility: '접근성',
    sustainability: '지속가능성',
    findFood: '음식 찾기',
    findRestroom: '화장실 찾기',
    nearestMedical: '의료 도움',
    reportIncident: '사건 신고',
    gateStatus: '게이트 상태',
    loading: '로딩 중...',
    send: '보내기',
    selectVenue: '경기장 선택',
  },
};

/**
 * Returns translations for the given language.
 * Falls back to English if language not found.
 * @param lang - Language code
 * @returns Translations object for that language
 */
export const t = (lang: Language): Translations =>
  TRANSLATIONS[lang] ?? TRANSLATIONS.en;

/**
 * Detects browser language and maps to supported Language.
 * @returns Detected Language code, defaults to 'en'
 */
export const detectLanguage = (): Language => {
  const browserLang = typeof navigator !== 'undefined' ? navigator.language.split('-')[0] : 'en';
  const supported: Language[] = [
    'en', 'es', 'fr', 'pt', 'ar',
    'de', 'ja', 'zh', 'hi', 'ko'
  ];
  return supported.includes(browserLang as Language)
    ? (browserLang as Language)
    : 'en';
};
