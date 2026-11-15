import type { AppLang } from '../locales';

export interface DetectivesUiStrings {
  experienceTitle: string;
  experienceSubtitle: string;
  corePrinciple: string;
  welcomeBadge: string;
  welcomeParagraphs: readonly string[];
  welcomeNautiPrompt: string;
  startInvestigationBtn: string;
  howToPlayBtn: string;
  myDiscoveriesBtn: string;
  backToIntroBtn: string;
  backToLibraryBtn: string;
  howToPlayTitle: string;
  howToPlayIntro: string;
  howToPlaySteps: readonly {
    title: string;
    detail: string;
  }[];
  teacherNote: string;
  closeModalBtn: string;
  libraryTitle: string;
  librarySubtitle: string;
  tabCases: string;
  tabDiscoveries: string;
  statusAvailableBadge: string;
  statusComingSoonBadge: string;
  openCaseBtn: string;
  resumeCaseBtn: string;
  reviewCaseBtn: string;
  comingSoonBtn: string;
  solvedChip: string;
  stageLabels: readonly {
    id: 'mystery' | 'evidence' | 'connect' | 'solve' | 'resolved';
    shortLabel: string;
  }[];
  stagePrefix: string;
  stage1QuestionLabel: string;
  stage1InvestigateBtn: string;
  stage2Title: string;
  stage2Subtitle: string;
  revealCardBtn: string;
  revealedStatusLabel: string;
  listenCardBtn: string;
  evidenceProgressLabel: (revealed: number, total: number) => string;
  stage2ContinueBtn: string;
  stage3Title: string;
  stage3Subtitle: string;
  stage3SelectCardPrompt: string;
  stage3PlaceHereBtn: string;
  stage3ClearSlotBtn: string;
  stage3CheckBtn: string;
  stage3ContinueBtn: string;
  stage4Title: string;
  stage4AttemptsRemaining: string;
  stage4FinalAttempt: string;
  stage4SubmitBtn: string;
  stage4RetryBtn: string;
  stage4ToResolvedBtn: string;
  stage5Title: string;
  stage5DiscoveryCardTitle: string;
  stage5SavedBadge: string;
  stage5FactLabel: string;
  stage5DataLabel: string;
  stage5ExplanationLabel: string;
  stage5TechStatusLabel: string;
  stage5SourceLabel: string;
  stage5OpenSourceBtn: string;
  stage5InvestigateAnotherBtn: string;
  stage5ViewDiscoveriesBtn: string;
  stage5BackMenuBtn: string;
  discoveriesTitle: string;
  discoveriesSubtitle: string;
  discoveriesEmptyTitle: string;
  discoveriesEmptyBody: string;
  discoveriesGoToCasesBtn: string;
  nasaSourceShort: string;
  caseFocusLabel: string;
}

const ES_STRINGS: DetectivesUiStrings = {
  experienceTitle: '🔎 Detectives de la NASA',
  experienceSubtitle:
    '¡Investiga misterios espaciales utilizando datos y descubrimientos científicos!',
  corePrinciple: 'DESCUBRIR → INVESTIGAR → CONECTAR → EXPLICAR → APRENDER',
  welcomeBadge: 'Investigación espacial colaborativa',
  welcomeParagraphs: [
    '🔎 ¡Bienvenidos, detectives espaciales!',
    'En la NASA, los científicos investigan preguntas difíciles utilizando observaciones, experimentos y datos.',
    'Ahora ustedes también podrán convertirse en investigadores.',
    'En cada misión encontrarán un misterio relacionado con la exploración espacial.',
    'Deberán descubrir pistas, analizar datos y trabajar en equipo para encontrar una explicación científica.',
    '¿Están listos para resolver su primer caso?',
  ],
  welcomeNautiPrompt:
    '¡Bienvenidos, detectives espaciales! En cada misión investigaremos misterios reales del espacio usando observaciones y datos de la NASA.',
  startInvestigationBtn: 'Comenzar investigación',
  howToPlayBtn: 'Cómo se juega',
  myDiscoveriesBtn: 'Mis descubrimientos',
  backToIntroBtn: 'Inicio de Detectives',
  backToLibraryBtn: 'Casos',
  howToPlayTitle: '¿Cómo se juega Detectives de la NASA?',
  howToPlayIntro:
    'Todo el grupo trabaja unido como un mismo equipo de investigación, conversando antes de avanzar en cada etapa:',
  howToPlaySteps: [
    {
      title: '1. El misterio',
      detail:
        'NAUTI presenta una pregunta científica real sobre la vida y la tecnología en el espacio.',
    },
    {
      title: '2. Descubrir las evidencias',
      detail:
        'Revelan una a una tarjetas con hechos, datos numéricos e ilustraciones basadas en fuentes de la NASA.',
    },
    {
      title: '3. Conectar las evidencias',
      detail:
        'Relacionan las pistas en el tablero para entender cómo el problema, la tecnología y los datos se conectan.',
    },
    {
      title: '4. Resolver el misterio',
      detail:
        'Debaten en equipo y eligen la explicación mejor respaldada por las evidencias descubiertas.',
    },
    {
      title: '5. Caso resuelto',
      detail:
        'Exploran la respuesta científica completa, la referencia original de la NASA y guardan su tarjeta en Mis descubrimientos.',
    },
  ],
  teacherNote:
    'Guía para docentes: No se requieren cuentas ni roles individuales. Basta con un dispositivo compartido para leer o escuchar cada pista, pausar a dialogar y construir la explicación entre todos.',
  closeModalBtn: 'Entendido',
  libraryTitle: 'Archivo de misterios espaciales',
  librarySubtitle:
    'Elige un caso para investigar en equipo o revisa las tarjetas guardadas en Mis descubrimientos.',
  tabCases: 'Casos de investigación',
  tabDiscoveries: 'Mis descubrimientos',
  statusAvailableBadge: 'Disponible',
  statusComingSoonBadge: 'Próximamente',
  openCaseBtn: 'Investigar caso',
  resumeCaseBtn: 'Continuar investigación',
  reviewCaseBtn: 'Volver a explorar caso',
  comingSoonBtn: 'Próximamente',
  solvedChip: 'Caso resuelto',
  stageLabels: [
    { id: 'mystery', shortLabel: '1. Misterio' },
    { id: 'evidence', shortLabel: '2. Evidencias' },
    { id: 'connect', shortLabel: '3. Conectar' },
    { id: 'solve', shortLabel: '4. Explicar' },
    { id: 'resolved', shortLabel: '5. Descubrimiento' },
  ],
  stagePrefix: 'Etapa',
  stage1QuestionLabel: 'Pregunta principal de investigación',
  stage1InvestigateBtn: 'Investigar pistas',
  stage2Title: 'Tablero de evidencias científicas',
  stage2Subtitle:
    'Revelen cada tarjeta una por una para reunir hechos reales, datos numéricos y fuentes de la NASA.',
  revealCardBtn: 'Descubrir evidencia',
  revealedStatusLabel: 'Evidencia descubierta',
  listenCardBtn: 'Escuchar pista',
  evidenceProgressLabel: (revealed, total) =>
    `${revealed} de ${total} evidencias descubiertas`,
  stage2ContinueBtn: 'Conectar las evidencias',
  stage3Title: 'Conecta las evidencias en el tablero',
  stage3Subtitle:
    'Toca primero una tarjeta de evidencia y luego toca el paso del razonamiento al que corresponde.',
  stage3SelectCardPrompt: '1. Elige una evidencia descubierta',
  stage3PlaceHereBtn: 'Colocar evidencia aquí',
  stage3ClearSlotBtn: 'Quitar',
  stage3CheckBtn: 'Comprobar conexión',
  stage3ContinueBtn: 'Ir a resolver el misterio',
  stage4Title: 'Construye la explicación científica',
  stage4AttemptsRemaining: 'Tienes 2 intentos para razonar en equipo.',
  stage4FinalAttempt: 'Segundo intento: revisa las evidencias y prueba otra explicación.',
  stage4SubmitBtn: 'Comprobar explicación',
  stage4RetryBtn: 'Intentar otra explicación',
  stage4ToResolvedBtn: 'Ver caso resuelto',
  stage5Title: '🎉 ¡Caso resuelto!',
  stage5DiscoveryCardTitle: 'Tarjeta digital de descubrimiento científico',
  stage5SavedBadge: 'Guardada en Mis descubrimientos',
  stage5FactLabel: 'Hecho científico principal',
  stage5DataLabel: 'Dato numérico clave',
  stage5ExplanationLabel: 'Explicación científica',
  stage5TechStatusLabel: 'Estado de la tecnología',
  stage5SourceLabel: 'Fuente científica oficial',
  stage5OpenSourceBtn: 'Ver publicación original en NASA.gov',
  stage5InvestigateAnotherBtn: 'Investigar otro caso',
  stage5ViewDiscoveriesBtn: 'Ver Mis descubrimientos',
  stage5BackMenuBtn: 'Volver al menú',
  discoveriesTitle: 'Mis descubrimientos',
  discoveriesSubtitle:
    'Cada misterio resuelto entrega una tarjeta científica verificada para repasar en clase o en casa.',
  discoveriesEmptyTitle: 'Aún no han desbloqueado tarjetas científicas',
  discoveriesEmptyBody:
    'Resuelvan «Caso 01: El misterio del agua» para obtener su primera tarjeta digital de descubrimiento científico.',
  discoveriesGoToCasesBtn: 'Ir a los casos',
  nasaSourceShort: 'Fuente NASA',
  caseFocusLabel: 'Enfoque científico',
};

const EN_STRINGS: DetectivesUiStrings = {
  experienceTitle: '🔎 NASA Detectives',
  experienceSubtitle:
    'Investigate space mysteries using real scientific data and discoveries!',
  corePrinciple: 'DISCOVER → INVESTIGATE → CONNECT → EXPLAIN → LEARN',
  welcomeBadge: 'Collaborative space investigation',
  welcomeParagraphs: [
    '🔎 Welcome, space detectives!',
    'At NASA, scientists investigate challenging questions using observations, experiments, and real data.',
    'Now you can become space investigators too.',
    'In each mission, you will uncover a mystery about space exploration.',
    'You will gather clues, analyze data, and work as a team to build a scientific explanation.',
    'Are you ready to solve your first case?',
  ],
  welcomeNautiPrompt:
    'Welcome, space detectives! In every mission we investigate real space mysteries using NASA observations and data.',
  startInvestigationBtn: 'Start investigation',
  howToPlayBtn: 'How to play',
  myDiscoveriesBtn: 'My discoveries',
  backToIntroBtn: 'Detectives Home',
  backToLibraryBtn: 'Cases',
  howToPlayTitle: 'How to play NASA Detectives',
  howToPlayIntro:
    'Everyone collaborates as one shared investigation team, discussing clues together before moving forward:',
  howToPlaySteps: [
    {
      title: '1. The Mystery',
      detail:
        'NAUTI introduces a real scientific question about living and working in space.',
    },
    {
      title: '2. Discover the Evidence',
      detail:
        'Reveal evidence cards one by one to inspect facts, numerical data, visuals, and NASA sources.',
    },
    {
      title: '3. Connect the Evidence',
      detail:
        'Arrange the clues on the board to see how the need, technology, and data link together.',
    },
    {
      title: '4. Solve the Mystery',
      detail:
        'Discuss as a team and choose the scientific explanation best supported by the evidence.',
    },
    {
      title: '5. Case Resolved',
      detail:
        'Read the full scientific answer, check the NASA publication, and collect your Discovery Card.',
    },
  ],
  teacherNote:
    'Teacher guide: No accounts or individual student roles are required. One shared screen works great for reading or listening together, pausing to discuss, and agreeing on an evidence-based answer.',
  closeModalBtn: 'Got it',
  libraryTitle: 'Space Mystery Case Library',
  librarySubtitle:
    'Pick a case to investigate as a team or revisit unlocked cards in My Discoveries.',
  tabCases: 'Investigation Cases',
  tabDiscoveries: 'My Discoveries',
  statusAvailableBadge: 'Available',
  statusComingSoonBadge: 'Coming Soon',
  openCaseBtn: 'Investigate case',
  resumeCaseBtn: 'Resume investigation',
  reviewCaseBtn: 'Revisit case',
  comingSoonBtn: 'Coming Soon',
  solvedChip: 'Case resolved',
  stageLabels: [
    { id: 'mystery', shortLabel: '1. Mystery' },
    { id: 'evidence', shortLabel: '2. Evidence' },
    { id: 'connect', shortLabel: '3. Connect' },
    { id: 'solve', shortLabel: '4. Explain' },
    { id: 'resolved', shortLabel: '5. Discovery' },
  ],
  stagePrefix: 'Stage',
  stage1QuestionLabel: 'Main investigation question',
  stage1InvestigateBtn: 'Investigate clues',
  stage2Title: 'Scientific Evidence Board',
  stage2Subtitle:
    'Reveal each card one by one to collect real facts, numerical data, and NASA references.',
  revealCardBtn: 'Discover evidence',
  revealedStatusLabel: 'Evidence revealed',
  listenCardBtn: 'Listen to clue',
  evidenceProgressLabel: (revealed, total) =>
    `${revealed} of ${total} evidence cards revealed`,
  stage2ContinueBtn: 'Connect the evidence',
  stage3Title: 'Connect the Evidence Board',
  stage3Subtitle:
    'First tap a discovered evidence card, then tap the reasoning step where it fits.',
  stage3SelectCardPrompt: '1. Pick a revealed evidence card',
  stage3PlaceHereBtn: 'Place evidence here',
  stage3ClearSlotBtn: 'Remove',
  stage3CheckBtn: 'Check connection',
  stage3ContinueBtn: 'Proceed to solve the mystery',
  stage4Title: 'Choose an Evidence-Based Explanation',
  stage4AttemptsRemaining: 'Your team has 2 attempts to test its reasoning.',
  stage4FinalAttempt: 'Second attempt: review the clues and choose another explanation.',
  stage4SubmitBtn: 'Submit explanation',
  stage4RetryBtn: 'Try another explanation',
  stage4ToResolvedBtn: 'See resolved case',
  stage5Title: '🎉 Case Resolved!',
  stage5DiscoveryCardTitle: 'Digital Scientific Discovery Card',
  stage5SavedBadge: 'Saved in My Discoveries',
  stage5FactLabel: 'Core scientific fact',
  stage5DataLabel: 'Key numerical figure',
  stage5ExplanationLabel: 'Short explanation',
  stage5TechStatusLabel: 'Technology status',
  stage5SourceLabel: 'Official scientific source',
  stage5OpenSourceBtn: 'Read original source on NASA.gov',
  stage5InvestigateAnotherBtn: 'Investigate another case',
  stage5ViewDiscoveriesBtn: 'Open My Discoveries',
  stage5BackMenuBtn: 'Back to menu',
  discoveriesTitle: 'My Discoveries',
  discoveriesSubtitle:
    'Every solved mystery unlocks a verified science card you can revisit anytime.',
  discoveriesEmptyTitle: 'No discovery cards unlocked yet',
  discoveriesEmptyBody:
    'Solve "Case 01: The Water Mystery" to collect your first digital scientific discovery card.',
  discoveriesGoToCasesBtn: 'Go to cases',
  nasaSourceShort: 'NASA source',
  caseFocusLabel: 'Scientific focus',
};

const GN_STRINGS: DetectivesUiStrings = {
  experienceTitle: '🔎 Detectives de la NASA',
  experienceSubtitle:
    '¡Ehesa’ỹijo mba’e ñembyaty arapýgui kuaapy ha tembikuaareka añetegua reheve!',
  corePrinciple: 'JEHECHA → TESA’ỸIJO → JOAJU → MYESAKÃ → ÑEMOARANDU',
  welcomeBadge: 'Tembikuaareka arapýgui oñondivepa',
  welcomeParagraphs: [
    '🔎 ¡Tapeguahẽ porãite, detective arapy rehegua!',
    'NASA-pe, umi tembikuaarekaha ohesa’ỹijo porandu hasýva ojesarekóvo, oha’ãvo ha oiporúvo kuaapy añetegua.',
    'Ko’ág̃a peẽ avei ikatu peiko tembikuaarekaháramo.',
    'Opaite tembiapópe pejuhúta peteĩ mba’e ñembyaty arapy ñemongu’e rehegua.',
    'Peheka va’erã pista-kuéra, pehesa’ỹijo marandu ha pemba’apo oñondivepa pejuhu hag̃ua mba’éichapa oiko.',
    '¿Peĩmbámapa pembohováivo pende káso peteĩha?',
  ],
  welcomeNautiPrompt:
    '¡Tapeguahẽ porãite, detectives arapy rehegua! Opaite tembiapópe jahesa’ỹijóta mba’e ñembyaty arapýgui NASA marandu añetegua rupive.',
  startInvestigationBtn: 'Ñepyrũ tesa’ỹijo',
  howToPlayBtn: 'Mba’éichapa oñeñembosarái',
  myDiscoveriesBtn: 'Che jehupytykuéra',
  backToIntroBtn: 'Detectives ñepyrũha',
  backToLibraryBtn: 'Káso-kuéra',
  howToPlayTitle: '¿Mba’éichapa oñeñembosarái Detectives de la NASA?',
  howToPlayIntro:
    'Opaite aty omba’apo oñondive peteĩ atýpe, oñe’ẽvo ojuehe ohasa mboyve peteĩteĩ vore:',
  howToPlaySteps: [
    {
      title: '1. Mba’e ñembyaty',
      detail:
        'NAUTI ohechauka peteĩ porandu tembikuaareka rehegua tekove ha tembiporu arapýgui.',
    },
    {
      title: '2. Eheka pista-kuéra',
      detail:
        'Pehechauka peteĩteĩ kuatia’atã oguerekóva marandu, papapy, ta’ãnga ha NASA kuatia.',
    },
    {
      title: '3. Embojoaju pista-kuéra',
      detail:
        'Pembojoaju kuaapy tablérope pentende hag̃ua mba’éichapa oñondive omba’apo.',
    },
    {
      title: '4. Embohovái mba’e ñembyaty',
      detail:
        'Peñemongeta atýpe ha peiporavo mbohovái iporãvéva pista-kuéra ohechaukáva.',
    },
    {
      title: '5. Káso oñembohováima',
      detail:
        'Pemoñe’ẽ mbohovái paha, pehecha NASA marandu ha peñongatu pende tarjeta Che jehupytykuérape.',
    },
  ],
  teacherNote:
    'Mbo’ehára pytyvõrã: Natekotevẽi kuatia tee térã tembiapo ha’eñóva. Peteĩ dispositivo oñondiveguápe ikatu pemoñe’ẽ, pehendu ha peñemongeta.',
  closeModalBtn: 'Aikũmbýma',
  libraryTitle: 'Arapy mba’e ñembyaty renda',
  librarySubtitle:
    'Eiporavo peteĩ káso pehesa’ỹijo hag̃ua atýpe térã ehecha umi tarjeta oñongatupyre.',
  tabCases: 'Káso ñembohesa’ỹijo',
  tabDiscoveries: 'Che jehupytykuéra',
  statusAvailableBadge: 'Oĩma',
  statusComingSoonBadge: 'Ko’ẽrõite',
  openCaseBtn: 'Ehesa’ỹijo káso',
  resumeCaseBtn: 'Embojoapy tesa’ỹijo',
  reviewCaseBtn: 'Ehecha jey káso',
  comingSoonBtn: 'Ko’ẽrõite',
  solvedChip: 'Káso oñembohováima',
  stageLabels: [
    { id: 'mystery', shortLabel: '1. Porandu' },
    { id: 'evidence', shortLabel: '2. Pista' },
    { id: 'connect', shortLabel: '3. Joaju' },
    { id: 'solve', shortLabel: '4. Myesakã' },
    { id: 'resolved', shortLabel: '5. Jehupyty' },
  ],
  stagePrefix: 'Vore',
  stage1QuestionLabel: 'Porandu guasu ñembohesa’ỹijorã',
  stage1InvestigateBtn: 'Eheka pista-kuéra',
  stage2Title: 'Pista tembikuaareka rehegua tablero',
  stage2Subtitle:
    'Pehechauka peteĩteĩ kuatia’atã pembyaty hag̃ua marandu, papapy ha NASA kuatia.',
  revealCardBtn: 'Ehechauka pista',
  revealedStatusLabel: 'Pista ojehechaukáma',
  listenCardBtn: 'Ehendu pista',
  evidenceProgressLabel: (revealed, total) =>
    `${revealed} / ${total} pista ojehechaukáma`,
  stage2ContinueBtn: 'Embojoaju pista-kuéra',
  stage3Title: 'Embojoaju pista-kuéra tablérope',
  stage3Subtitle:
    'Epoko raẽ peteĩ pista ojehechaukávare ha upéi epoko tenda oho hag̃uáme.',
  stage3SelectCardPrompt: '1. Eiporavo peteĩ pista ojehechaukáva',
  stage3PlaceHereBtn: 'Emoĩ pista ko’ápe',
  stage3ClearSlotBtn: 'Eipe’a',
  stage3CheckBtn: 'Ehecha joaju',
  stage3ContinueBtn: 'Eho embohovái porandu',
  stage4Title: 'Eiporavo mbohovái tembikuaareka ári',
  stage4AttemptsRemaining: 'Peguereko 2 jehasa peñeha’ã hag̃ua atýpe.',
  stage4FinalAttempt:
    'Mokõiha jehasa: ehecha jey pista-kuéra ha eha’ã ambue mbohovái.',
  stage4SubmitBtn: 'Ehecha mbohovái',
  stage4RetryBtn: 'Eha’ã ambue mbohovái',
  stage4ToResolvedBtn: 'Ehecha káso oñembohováiva',
  stage5Title: '🎉 ¡Káso oñembohováima!',
  stage5DiscoveryCardTitle: 'Tarjeta digital tembikuaareka jehupyty rehegua',
  stage5SavedBadge: 'Oñongatúma Che jehupytykuérape',
  stage5FactLabel: 'Marandu tembikuaareka tenondegua',
  stage5DataLabel: 'Papapy tuicháva',
  stage5ExplanationLabel: 'Myesakã mbyky',
  stage5TechStatusLabel: 'Tembiporu reko',
  stage5SourceLabel: 'NASA marandu tee',
  stage5OpenSourceBtn: 'Ehecha kuatia tee NASA.gov-pe',
  stage5InvestigateAnotherBtn: 'Ehesa’ỹijo ambue káso',
  stage5ViewDiscoveriesBtn: 'Ehecha Che jehupytykuéra',
  stage5BackMenuBtn: 'Ejevy menúpe',
  discoveriesTitle: 'Che jehupytykuéra',
  discoveriesSubtitle:
    'Opaite káso oñembohováiva ome’ẽ peteĩ tarjeta tembikuaareka rehegua ojehecha jey hag̃ua.',
  discoveriesEmptyTitle: 'Ne’ĩrã gueteri tarjeta ojepe’a',
  discoveriesEmptyBody:
    'Pembohovái «Káso 01: Y ñembyaty» pehupyty hag̃ua pende tarjeta peteĩha.',
  discoveriesGoToCasesBtn: 'Eho káso-kuérape',
  nasaSourceShort: 'NASA marandu',
  caseFocusLabel: 'Tembikuaareka renda',
};

export function getDetectivesStrings(lang: AppLang): DetectivesUiStrings {
  if (lang === 'en') return EN_STRINGS;
  if (lang === 'gn-PY') return GN_STRINGS;
  return ES_STRINGS;
}
