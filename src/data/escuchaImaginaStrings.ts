import type { AppLang } from '../locales';
import type { EscuchaStage } from '../types/escuchaImagina';

export interface EscuchaImaginaStrings {
  experienceTitle: string;
  experienceSubtitle: string;
  introParagraphs: readonly string[];
  introNautiPrompt: string;
  exploreTechnologiesBtn: string;
  howItWorksBtn: string;
  howItWorksTitle: string;
  howItWorksClose: string;
  howItWorksSequenceLabel: string;
  howItWorksSteps: readonly {
    title: string;
    detail: string;
  }[];
  pedagogyFocusNote: string;
  libraryTitle: string;
  librarySubtitle: string;
  backToIntroBtn: string;
  backToLibraryBtn: string;
  statusAvailableBadge: string;
  statusComingSoonBadge: string;
  openEpisodeBtn: string;
  resumeEpisodeBtn: string;
  comingSoonBtn: string;
  drawingChallengeLabel: string;
  durationLabel: string;
  nasaSourceLabel: string;
  stageLabels: Record<EscuchaStage, string>;
  stageShortLabels: Record<EscuchaStage, string>;
  stageCounter: (current: number, total: number) => string;
  podcastHeading: string;
  podcastDurationHint: string;
  podcastPlayBtn: string;
  podcastPauseBtn: string;
  podcastResumeBtn: string;
  podcastReplayBtn: string;
  podcastTranscriptLabel: string;
  podcastHiddenNotice: string;
  podcastProgressLabel: (current: number, total: number) => string;
  podcastContinueBtn: string;
  challengeHeading: string;
  challengePlayIntroBtn: string;
  challengePlayDescriptionBtn: string;
  challengeReplayBtn: string;
  challengeTranscriptToggleShow: string;
  challengeTranscriptToggleHide: string;
  challengeHiddenBoxTitle: string;
  challengeHiddenBoxBody: string;
  challengeContinueBtn: string;
  timerHeading: string;
  timerInstruction: string;
  timerStartBtn: string;
  timerPauseBtn: string;
  timerResumeBtn: string;
  timerRestartBtn: string;
  timerRestartConfirmTitle: string;
  timerRestartConfirmYes: string;
  timerRestartConfirmNo: string;
  timerFinalWarning: string;
  timerExpiredTitle: string;
  timerExpiredSub: string;
  timerPaperReminder: string;
  timerRevealPieceBtn: string;
  timerEarlyFinishBtn: string;
  timerEarlyConfirmNote: string;
  timerTeacherControlNote: string;
  revealHeading: string;
  revealListenAgainBtn: string;
  revealTogglePartsShow: string;
  revealTogglePartsHide: string;
  revealComparisonTitle: string;
  revealComparisonSubtitle: string;
  revealContinueBtn: string;
  reflectionHeading: string;
  reflectionNautiPrompt: string;
  reflectionListenBtn: string;
  reflectionPieceLabel: string;
  reflectionFunctionLabel: string;
  reflectionConnectionLabel: string;
  reflectionDesignLabel: string;
  reflectionDetailsLabel: string;
  reflectionFactLabel: string;
  reflectionQuestionsTitle: string;
  reflectionSourceTitle: string;
  reflectionOpenSourceBtn: string;
  reflectionOrganizationLabel: string;
  reflectionDateLabel: string;
  backToTechnologiesBtn: string;
  nextTechnologyBtn: string;
  nextTechnologyUnavailableNote: string;
  diagramPartHub: string;
  diagramPartSupport: string;
  diagramPartGrid: string;
  diagramPartCells: string;
}

const ES_STRINGS: EscuchaImaginaStrings = {
  experienceTitle: 'Escucha, imagina y construye',
  experienceSubtitle:
    'Descubre tecnologías espaciales escuchando, imaginando y dibujando en equipo.',
  introParagraphs: [
    '¡Hola, exploradores!',
    '¿Sabían que las misiones espaciales necesitan tecnologías capaces de producir energía, recuperar agua y ayudar a cultivar alimentos?',
    'Hoy conoceremos algunas de estas increíbles tecnologías utilizadas o investigadas por la NASA.',
    'Primero escucharán una historia científica. Después, les describiré una pieza que deberán imaginar y dibujar junto a su equipo.',
    '¡Pero hay un desafío! Tendrán solamente dos minutos para reconstruirla antes de descubrir cómo es realmente.',
  ],
  introNautiPrompt:
    '¡Hola, exploradores! Escuchen una historia científica, imaginen la pieza secreta en equipo y dibújenla en papel antes de que termine el reloj.',
  exploreTechnologiesBtn: 'Explorar tecnologías',
  howItWorksBtn: 'Cómo funciona',
  howItWorksTitle: 'Cómo funciona: Escucha, imagina y construye',
  howItWorksClose: 'Entendido',
  howItWorksSequenceLabel:
    'ESCUCHAR → IMAGINAR → DIBUJAR → REVELAR → COMPARAR → APRENDER',
  howItWorksSteps: [
    {
      title: '1. Escucha el podcast científico',
      detail:
        'NAUTI cuenta qué es la tecnología, qué problema resuelve en el espacio y cómo funciona.',
    },
    {
      title: '2. Imagina la pieza secreta',
      detail:
        'Escucha con atención la descripción geométrica y espacial sin ver la imagen todavía.',
    },
    {
      title: '3. Dibuja en papel durante 2 minutos',
      detail:
        'El equipo conversa, se organiza y dibuja en papel antes de escuchar "¡Lápices arriba!".',
    },
    {
      title: '4. Revela, compara y reflexiona',
      detail:
        'El docente habilita la imagen de referencia para comparar criterios visuales y dialogar sobre la ciencia real de la NASA.',
    },
  ],
  pedagogyFocusNote:
    'Actividad educativa colaborativa inspirada en el razonamiento espacial y la escucha activa. Se realiza con papel y lápiz en equipo; no es una evaluación psicológica ni mide inteligencia.',
  libraryTitle: 'Biblioteca de tecnologías espaciales',
  librarySubtitle:
    'Elige una tecnología para recorrer las 5 etapas en clase.',
  backToIntroBtn: 'Inicio',
  backToLibraryBtn: 'Tecnologías',
  statusAvailableBadge: 'Disponible',
  statusComingSoonBadge: 'Próximamente',
  openEpisodeBtn: 'Comenzar tecnología',
  resumeEpisodeBtn: 'Continuar etapa',
  comingSoonBtn: 'Próximamente',
  drawingChallengeLabel: 'Desafío de dibujo',
  durationLabel: 'Duración',
  nasaSourceLabel: 'Fuente NASA',
  stageLabels: {
    podcast: 'Etapa 1 · Podcast educativo',
    challenge: 'Etapa 2 · Desafío de dibujo por audio',
    timer: 'Etapa 3 · Temporizador de 2 minutos',
    reveal: 'Etapa 4 · Revelación y comparación',
    reflection: 'Etapa 5 · Reflexión científica',
  },
  stageShortLabels: {
    podcast: 'Podcast',
    challenge: 'Desafío',
    timer: '2 min',
    reveal: 'Revelar',
    reflection: 'Reflexión',
  },
  stageCounter: (current, total) => `Etapa ${current} de ${total}`,
  podcastHeading: 'Podcast científico de NAUTI',
  podcastDurationHint: 'Duración estimada: 2–3 minutos',
  podcastPlayBtn: 'Reproducir',
  podcastPauseBtn: 'Pausar',
  podcastResumeBtn: 'Reanudar',
  podcastReplayBtn: 'Repetir desde el inicio',
  podcastTranscriptLabel: 'Transcripción accesible (lee o escucha)',
  podcastHiddenNotice:
    'La imagen objetivo del desafío permanece oculta durante esta etapa.',
  podcastProgressLabel: (current, total) =>
    `Bloque ${current} de ${total}`,
  podcastContinueBtn: 'Ir al desafío de dibujo',
  challengeHeading: 'Desafío de dibujo en audio',
  challengePlayIntroBtn: 'Escuchar anuncio',
  challengePlayDescriptionBtn: 'Escuchar descripción de la pieza',
  challengeReplayBtn: 'Repetir descripción',
  challengeTranscriptToggleShow: 'Ver transcripción (apoyo docente)',
  challengeTranscriptToggleHide: 'Ocultar transcripción',
  challengeHiddenBoxTitle: 'Imagen secreta protegida',
  challengeHiddenBoxBody:
    'No muestres pistas visuales todavía. Escuchen las formas, proporciones, filas, columnas y soporte para imaginar la pieza en equipo.',
  challengeContinueBtn: 'Preparar temporizador (2 min)',
  timerHeading: '✏️ ¡Es hora de dibujar!',
  timerInstruction:
    'Dibujen en papel junto a su equipo. Cuando el docente o grupo esté listo, presionen "Comenzar dibujo".',
  timerStartBtn: 'Comenzar dibujo',
  timerPauseBtn: 'Pausar',
  timerResumeBtn: 'Reanudar',
  timerRestartBtn: 'Reiniciar',
  timerRestartConfirmTitle: '¿Reiniciar el temporizador a 02:00?',
  timerRestartConfirmYes: 'Sí, reiniciar',
  timerRestartConfirmNo: 'Cancelar',
  timerFinalWarning: '¡Últimos 15 segundos! Terminen los últimos trazos.',
  timerExpiredTitle: '⏰ ¡Tiempo terminado! ¡Lápices arriba!',
  timerExpiredSub:
    'Dejen los lápices sobre la mesa. Cuando el docente lo indique, presionen "Revelar pieza".',
  timerPaperReminder:
    'Dibujo físico en papel · Sin editor en pantalla',
  timerRevealPieceBtn: 'Revelar pieza',
  timerEarlyFinishBtn: 'Finalizar dibujo antes',
  timerEarlyConfirmNote: 'Control docente: solo si el grupo ya terminó de dibujar en papel.',
  timerTeacherControlNote:
    'La imagen de referencia no se muestra automáticamente hasta que el docente seleccione "Revelar pieza".',
  revealHeading: '🔍 ¡Descubramos la pieza!',
  revealListenAgainBtn: 'Escuchar descripción comparando',
  revealTogglePartsShow: 'Mostrar etiquetas de partes',
  revealTogglePartsHide: 'Ocultar etiquetas de partes',
  revealComparisonTitle: 'Criterios de comparación en equipo (guiados por el docente)',
  revealComparisonSubtitle:
    'El docente guía la conversación y observa qué dibujo se acerca más al esquema de referencia.',
  revealContinueBtn: 'Ir a la reflexión científica',
  reflectionHeading: 'Reflexión científica y trabajo en equipo',
  reflectionNautiPrompt:
    '¡Excelente trabajo observando e imaginando! Conversemos sobre lo que hace esta pieza y lo que aprendieron juntos.',
  reflectionListenBtn: 'Escuchar explicación científica',
  reflectionPieceLabel: '¿Qué es esta pieza?',
  reflectionFunctionLabel: '¿Qué función cumple?',
  reflectionConnectionLabel: '¿Cómo se conecta con la tecnología completa?',
  reflectionDesignLabel: '¿Por qué es importante su diseño?',
  reflectionDetailsLabel: 'Detalles clave para reconocer',
  reflectionFactLabel: 'Dato científico de la NASA',
  reflectionQuestionsTitle: 'Preguntas para conversar en clase',
  reflectionSourceTitle: 'Fuente científica verificada',
  reflectionOpenSourceBtn: 'Abrir fuente original de la NASA',
  reflectionOrganizationLabel: 'Organización',
  reflectionDateLabel: 'Fecha / periodo',
  backToTechnologiesBtn: 'Volver a las tecnologías',
  nextTechnologyBtn: 'Siguiente tecnología',
  nextTechnologyUnavailableNote:
    'Las siguientes tecnologías aparecerán aquí cuando estén disponibles.',
  diagramPartHub: 'Conexión al equipo / módulo',
  diagramPartSupport: 'Soporte estructural',
  diagramPartGrid: 'Cuadrícula de paneles (2 filas × 6 columnas)',
  diagramPartCells: 'Celdas fotovoltaicas',
};

const EN_STRINGS: EscuchaImaginaStrings = {
  experienceTitle: 'Listen, Imagine & Build',
  experienceSubtitle:
    'Discover space technologies by listening, imagining, and drawing as a team.',
  introParagraphs: [
    'Hello, explorers!',
    'Did you know space missions need technologies able to produce energy, recover water, and help grow food?',
    'Today we will explore some of these incredible technologies used or researched by NASA.',
    'First you will listen to a science story. Then I will describe one part for you to imagine and draw together with your team.',
    'But there is a challenge! You will only have two minutes to reconstruct it before discovering what it really looks like.',
  ],
  introNautiPrompt:
    'Hello, explorers! Listen to a science story, picture the hidden piece together, and draw it on paper before time runs out.',
  exploreTechnologiesBtn: 'Explore technologies',
  howItWorksBtn: 'How it works',
  howItWorksTitle: 'How it works: Listen, Imagine & Build',
  howItWorksClose: 'Got it',
  howItWorksSequenceLabel:
    'LISTEN → IMAGINE → DRAW → REVEAL → COMPARE → LEARN',
  howItWorksSteps: [
    {
      title: '1. Listen to the science podcast',
      detail:
        'NAUTI explains what the technology is, what problem it solves in space, and how it works.',
    },
    {
      title: '2. Imagine the hidden piece',
      detail:
        'Listen carefully to the geometric and spatial description while the reference image stays hidden.',
    },
    {
      title: '3. Draw on paper for 2 minutes',
      detail:
        'Your team discusses, organizes roles freely, and draws on paper before "Pencils up!".',
    },
    {
      title: '4. Reveal, compare & reflect',
      detail:
        'The teacher unlocks the reference diagram to compare visual criteria and discuss verified NASA science.',
    },
  ],
  pedagogyFocusNote:
    'Collaborative educational activity inspired by spatial reasoning and active listening. Drawings are made physically on paper—not a psychological test or intelligence measurement.',
  libraryTitle: 'Space Technology Library',
  librarySubtitle:
    'Choose a technology to explore the 5-stage challenge with your class.',
  backToIntroBtn: 'Home',
  backToLibraryBtn: 'Technologies',
  statusAvailableBadge: 'Available',
  statusComingSoonBadge: 'Coming Soon',
  openEpisodeBtn: 'Start technology',
  resumeEpisodeBtn: 'Resume stage',
  comingSoonBtn: 'Coming Soon',
  drawingChallengeLabel: 'Drawing challenge',
  durationLabel: 'Duration',
  nasaSourceLabel: 'NASA Source',
  stageLabels: {
    podcast: 'Stage 1 · Educational Podcast',
    challenge: 'Stage 2 · Audio Drawing Challenge',
    timer: 'Stage 3 · Two-Minute Timer',
    reveal: 'Stage 4 · Reveal & Comparison',
    reflection: 'Stage 5 · Scientific Reflection',
  },
  stageShortLabels: {
    podcast: 'Podcast',
    challenge: 'Challenge',
    timer: '2 min',
    reveal: 'Reveal',
    reflection: 'Reflect',
  },
  stageCounter: (current, total) => `Stage ${current} of ${total}`,
  podcastHeading: "NAUTI's Science Podcast",
  podcastDurationHint: 'Target duration: 2–3 minutes',
  podcastPlayBtn: 'Play',
  podcastPauseBtn: 'Pause',
  podcastResumeBtn: 'Resume',
  podcastReplayBtn: 'Replay from start',
  podcastTranscriptLabel: 'Accessible transcript (read or listen)',
  podcastHiddenNotice:
    'The target drawing reference stays hidden during this stage.',
  podcastProgressLabel: (current, total) => `Part ${current} of ${total}`,
  podcastContinueBtn: 'Go to drawing challenge',
  challengeHeading: 'Audio Drawing Challenge',
  challengePlayIntroBtn: 'Play intro',
  challengePlayDescriptionBtn: 'Play piece description',
  challengeReplayBtn: 'Replay description',
  challengeTranscriptToggleShow: 'Show transcript (teacher support)',
  challengeTranscriptToggleHide: 'Hide transcript',
  challengeHiddenBoxTitle: 'Secret image protected',
  challengeHiddenBoxBody:
    'Keep visual hints hidden for now. Listen closely to shape, proportions, rows, columns, and support attachment.',
  challengeContinueBtn: 'Open drawing timer (2 min)',
  timerHeading: '✏️ Time to draw!',
  timerInstruction:
    'Draw on paper together with your team. When your teacher or group is ready, press "Start drawing".',
  timerStartBtn: 'Start drawing',
  timerPauseBtn: 'Pause',
  timerResumeBtn: 'Resume',
  timerRestartBtn: 'Restart',
  timerRestartConfirmTitle: 'Reset the timer back to 02:00?',
  timerRestartConfirmYes: 'Yes, reset',
  timerRestartConfirmNo: 'Cancel',
  timerFinalWarning: 'Final 15 seconds! Finish your last lines.',
  timerExpiredTitle: '⏰ Time is up! Pencils up!',
  timerExpiredSub:
    'Set pencils down. Whenever the teacher is ready, press "Reveal piece".',
  timerPaperReminder: 'Physical drawing on paper · No on-screen editor',
  timerRevealPieceBtn: 'Reveal piece',
  timerEarlyFinishBtn: 'Finish drawing early',
  timerEarlyConfirmNote:
    'Teacher control: use only if every team finished drawing on paper.',
  timerTeacherControlNote:
    'The reference image never appears automatically until the teacher selects "Reveal piece".',
  revealHeading: "🔍 Let's discover the piece!",
  revealListenAgainBtn: 'Replay audio description',
  revealTogglePartsShow: 'Show part labels',
  revealTogglePartsHide: 'Hide part labels',
  revealComparisonTitle: 'Team Comparison Criteria (teacher-guided)',
  revealComparisonSubtitle:
    'The teacher facilitates comparison and decides which drawing matches the reference most closely.',
  revealContinueBtn: 'Continue to scientific reflection',
  reflectionHeading: 'Scientific Reflection & Teamwork',
  reflectionNautiPrompt:
    'Awesome work listening and imagining! Let us reflect on how this piece works and what your team discovered.',
  reflectionListenBtn: 'Listen to science summary',
  reflectionPieceLabel: 'What is this piece?',
  reflectionFunctionLabel: 'What function does it perform?',
  reflectionConnectionLabel: 'How does it connect to the full technology?',
  reflectionDesignLabel: 'Why is its design important?',
  reflectionDetailsLabel: 'Key visual details to recognize',
  reflectionFactLabel: 'NASA-supported scientific fact',
  reflectionQuestionsTitle: 'Classroom reflection questions',
  reflectionSourceTitle: 'Verified scientific source',
  reflectionOpenSourceBtn: 'Open original NASA source',
  reflectionOrganizationLabel: 'Organization',
  reflectionDateLabel: 'Date / period',
  backToTechnologiesBtn: 'Back to technologies',
  nextTechnologyBtn: 'Next technology',
  nextTechnologyUnavailableNote:
    'Additional technologies will unlock here as they become available.',
  diagramPartHub: 'Connection to spacecraft hub',
  diagramPartSupport: 'Structural support arm',
  diagramPartGrid: 'Panel grid (2 rows × 6 columns)',
  diagramPartCells: 'Photovoltaic cells',
};

const GN_STRINGS: EscuchaImaginaStrings = {
  experienceTitle: "Ehendu, eimo'ã ha ejapo",
  experienceSubtitle:
    "Eikuaa tembiporu arapy rehegua rehendúvo, reimo'ãvo ha rehaívo atýpe.",
  introParagraphs: [
    '¡Mba’éichapa, taperekáhara-kuéra!',
    '¿Peikuaápa mba’éichapa umi tembiapo arapýpe oikotevẽ tembiporu ojapóva tendyry, omopotĩ jey y ha oipytyvõva oñemitỹ hag̃ua tembi’u?',
    'Ko ára jaikuaáta ko’ã tembiporu porãite NASA oiporúva térã ohesa’ỹijóva.',
    'Tenonderã pehendúta peteĩ mombe’u tembikuaareka rehegua. Uperire amombe’úta peẽme peteĩ pehẽngue peimo’ã ha pehai va’erã pende aty ndive.',
    '¡Péro oĩ peteĩ ñeha’ã! Peguerekóta mokõi minuto añónte pemohu’ã hag̃ua pehecha mboyve mba’éichapa añetehápe.',
  ],
  introNautiPrompt:
    "¡Mba’éichapa! Pehendu mombe’u tembikuaareka rehegua, peimo'ã oñondive pe pehẽngue kañymby ha pehai kuatiáre ára opa mboyve.",
  exploreTechnologiesBtn: 'Ehecha tembiporu-kuéra',
  howItWorksBtn: 'Mba’éichapa oiko',
  howItWorksTitle: "Mba’éichapa oiko: Ehendu, eimo'ã ha ejapo",
  howItWorksClose: 'Oĩ porã',
  howItWorksSequenceLabel:
    "EHENDU → EIMO'Ã → EHAI → EHECHAUKA → EMBOJOJA → EIKUAA",
  howItWorksSteps: [
    {
      title: '1. Ehendu podcast tembikuaareka rehegua',
      detail:
        'NAUTI omombe’u mba’épa pe tembiporu, mba’e apañuáipa omyatyrõ ha mba’éichapa omba’apo.',
    },
    {
      title: '2. Eimo’ã pe pehẽngue kañymby',
      detail:
        'Ehendu porã hete ha iñemohenda rehegua rehecha’ỹre gueteri ta’ãnga.',
    },
    {
      title: '3. Ehai kuatiáre 2 minuto aja',
      detail:
        'Aty oñemongeta, oñemohenda ha ohai kuatiáre oñehendu mboyve "¡Lápiz yvate!".',
    },
    {
      title: '4. Ehechauka, embojoja ha eñomongeta',
      detail:
        'Mbo’ehára ohechauka ta’ãnga techaukaha oñembojoja ha oñehesa’ỹijo hag̃ua NASA marandu.',
    },
  ],
  pedagogyFocusNote:
    'Tembiapo mbo’epy rehegua oñondivepa oipytyvõva jehechakuaa ha ñehendu porãme. Ojejapo kuatia ha lápiz reheve; ndaha’éi ñeha’ã psicología rehegua.',
  libraryTitle: 'Tembiporu Arapy Rehegua Renda',
  librarySubtitle: 'Eiporavo peteĩ tembiporu rehasa hag̃ua umi 5 pehẽngue rupi.',
  backToIntroBtn: 'Ñepyrũha',
  backToLibraryBtn: 'Tembiporu-kuéra',
  statusAvailableBadge: 'Oĩma',
  statusComingSoonBadge: 'Ko’ẽrõite',
  openEpisodeBtn: 'Eñepyrũ tembiporu',
  resumeEpisodeBtn: 'Embojoapy pehẽngue',
  comingSoonBtn: 'Ko’ẽrõite',
  drawingChallengeLabel: 'Ñeha’ã ta’ãngarã',
  durationLabel: 'Pukukue',
  nasaSourceLabel: 'NASA Maranduha',
  stageLabels: {
    podcast: 'Pehẽngue 1 · Podcast mbo’epy rehegua',
    challenge: 'Pehẽngue 2 · Ta’ãnga aporã púpe',
    timer: 'Pehẽngue 3 · Aravo papaha 2 minuto',
    reveal: 'Pehẽngue 4 · Jehechauka ha ñembojoja',
    reflection: 'Pehẽngue 5 · Ñomongeta tembikuaareka rehegua',
  },
  stageShortLabels: {
    podcast: 'Podcast',
    challenge: 'Ñeha’ã',
    timer: '2 min',
    reveal: 'Jehechauka',
    reflection: 'Ñomongeta',
  },
  stageCounter: (current, total) => `Pehẽngue ${current} / ${total}`,
  podcastHeading: 'NAUTI Podcast tembikuaareka rehegua',
  podcastDurationHint: 'Pukukue oñeimo’ãva: 2–3 minuto',
  podcastPlayBtn: 'Mbopu',
  podcastPauseBtn: 'Mopyta',
  podcastResumeBtn: 'Embojoapy',
  podcastReplayBtn: 'Ehendu jey ñepyrũgui',
  podcastTranscriptLabel: 'Moñe’ẽrã (emoñe’ẽ térã ehendu)',
  podcastHiddenNotice:
    'Ta’ãnga techaukaha opyta kañymby ko pehẽngue pukukue.',
  podcastProgressLabel: (current, total) => `Pehẽngue ${current} / ${total}`,
  podcastContinueBtn: 'Eho ta’ãnga ñeha’ãme',
  challengeHeading: 'Ta’ãnga aporã púpe',
  challengePlayIntroBtn: 'Ehendu marandu ñepyrũ',
  challengePlayDescriptionBtn: 'Ehendu pehẽngue ñemombe’u',
  challengeReplayBtn: 'Ehendu jey ñemombe’u',
  challengeTranscriptToggleShow: 'Ehecha moñe’ẽrã (mbo’ehára pytyvõrã)',
  challengeTranscriptToggleHide: 'Emokañy moñe’ẽrã',
  challengeHiddenBoxTitle: 'Ta’ãnga kañymby oñeñangareko',
  challengeHiddenBoxBody:
    'Ani ehechauka gueteri ta’ãnga. Pehendu porã hete, tuichakue, fila, columna ha ijyva joajuha.',
  challengeContinueBtn: 'Emboguata aravo papaha (2 min)',
  timerHeading: '✏️ ¡Ára pehai hag̃ua!',
  timerInstruction:
    'Pehai kuatiáre pende atýpe. Mbo’ehára térã aty oĩmbávo, pejopy "Ñepyrũ tahai".',
  timerStartBtn: 'Ñepyrũ tahai',
  timerPauseBtn: 'Mopyta',
  timerResumeBtn: 'Embojoapy',
  timerRestartBtn: 'Ñepyrũ jey',
  timerRestartConfirmTitle: '¿Embojevy jey aravo 02:00-pe?',
  timerRestartConfirmYes: 'Héẽ, ñepyrũ jey',
  timerRestartConfirmNo: 'Ani',
  timerFinalWarning: '¡15 segundo opyta! Pemohu’ã pende hai.',
  timerExpiredTitle: '⏰ ¡Ára opa! ¡Lápiz yvate!',
  timerExpiredSub:
    'Peheja lápiz mesápe. Mbo’ehára he’ívo, pejopy "Ehechauka pehẽngue".',
  timerPaperReminder: 'Kuatiáre ñeha’ã · Ndaipóri editor pantalla-pe',
  timerRevealPieceBtn: 'Ehechauka pehẽngue',
  timerEarlyFinishBtn: 'Omohu’ã voi',
  timerEarlyConfirmNote:
    'Mbo’ehára ñangareko: aty omohu’ãmarõ kuatiáre añoite.',
  timerTeacherControlNote:
    'Ta’ãnga ndojehechaukái ijehegui mbo’ehára ojopy peve "Ehechauka pehẽngue".',
  revealHeading: '🔍 ¡Jahechámapa pe pehẽngue!',
  revealListenAgainBtn: 'Ehendu jey ñemombe’u',
  revealTogglePartsShow: 'Ehechauka pehẽngue réra',
  revealTogglePartsHide: 'Emokañy pehẽngue réra',
  revealComparisonTitle: 'Mbojoja apopyrã atýpe (mbo’ehára sãmbyhýpe)',
  revealComparisonSubtitle:
    'Mbo’ehára oipytyvõ oñembojoja hag̃ua ha ohecha máva ta’ãngápa ojoguave techaukahápe.',
  revealContinueBtn: 'Eho ñomongeta tembikuaarekápe',
  reflectionHeading: 'Ñomongeta tembikuaareka ha tembiapo atýpe',
  reflectionNautiPrompt:
    '¡Porãite pemba’apo ha peimo’ã oñondive! Ñañomongeta ko tembiporu rehe ha mba’épa peikuaa pyahu.',
  reflectionListenBtn: 'Ehendu mbyky tembikuaareka',
  reflectionPieceLabel: '¿Mba’épa ko pehẽngue?',
  reflectionFunctionLabel: '¿Mba’épa ojapo?',
  reflectionConnectionLabel: '¿Mba’éichapa ojoaju tembiporu tuichaváre?',
  reflectionDesignLabel: '¿Mba’érepa iñimportánte hete ñemohenda?',
  reflectionDetailsLabel: 'Mba’e ojekuaa porã va’erã',
  reflectionFactLabel: 'NASA marandu tembikuaareka rehegua',
  reflectionQuestionsTitle: 'Porandu ñomongetarã mbo’ehaópe',
  reflectionSourceTitle: 'Maranduha tembikuaareka añetegua',
  reflectionOpenSourceBtn: 'Eike NASA maranduha ypykuépe',
  reflectionOrganizationLabel: 'Tembiporapo aty',
  reflectionDateLabel: 'Ára / arapokõindy',
  backToTechnologiesBtn: 'Ejevy tembiporu-kuérape',
  nextTechnologyBtn: 'Tembiporu tenondegua',
  nextTechnologyUnavailableNote:
    'Ambue tembiporu oĩmbávo ojehechaukáta ko’ápe.',
  diagramPartHub: 'Joajuha tembiporu retépe',
  diagramPartSupport: 'Jyva mbojoajuha',
  diagramPartGrid: 'Cuadrícula panel-kuéra (2 fila × 6 columna)',
  diagramPartCells: 'Celdas fotovoltaicas',
};

export function getEscuchaImaginaStrings(
  lang: AppLang,
): EscuchaImaginaStrings {
  if (lang === 'en') return EN_STRINGS;
  if (lang === 'gn-PY') return GN_STRINGS;
  return ES_STRINGS;
}
