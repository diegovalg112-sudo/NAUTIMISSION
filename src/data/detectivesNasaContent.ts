import type { AppLang } from '../locales';
import type { DetectiveCaseRecord } from '../types/detectivesNasa';

const NASA_WATER_URL =
  'https://www.nasa.gov/missions/station/iss-research/nasa-achieves-water-recovery-milestone-on-international-space-station/';
const NASA_SOLAR_URL =
  'https://www.nasa.gov/mission/international-space-station/';
const NASA_VEGGIE_URL =
  'https://www.nasa.gov/history/veggie-plant-growth-system-activated-on-international-space-station/';
const NASA_ECLSS_URL =
  'https://www.nasa.gov/mission/international-space-station/iss-cetf/environmental-control-and-life-support-systems-eclss/';

const ES_CASES: readonly DetectiveCaseRecord[] = [
  {
    id: 'case-01-water',
    order: 1,
    status: 'available',
    estimatedMinutes: '5–8 min',
    focusTopic: 'Recuperación de agua en órbita (EEI / ECLSS)',
    title: '💧 Caso 01: El misterio del agua',
    mysteryQuestion:
      '¿Cómo pueden las misiones espaciales reducir la cantidad de agua nueva que necesitan transportar?',
    shortDescription:
      'Investiga por qué llevar agua desde la Tierra es tan costoso y qué logro alcanzó la NASA en la Estación Espacial Internacional para aprovechar casi cada gota.',
    stage1Narrative:
      '¡Detectives! Tenemos un gran misterio.\n\nLos astronautas necesitan agua para beber, preparar alimentos y realizar otras actividades esenciales.\n\nPero transportar agua desde la Tierra requiere recursos.\n\n¿Cómo pueden las misiones espaciales reducir la cantidad de agua nueva que necesitan transportar?',
    nautiStagePrompts: {
      mystery:
        '¡Detectives! Tenemos un gran misterio sobre el agua en el espacio. Lean o escuchen la pregunta y pasemos a investigar las pistas.',
      evidence:
        'Revelen cada evidencia una por una. Fíjense tanto en lo que necesitan los astronautas como en las tecnologías y datos de la NASA.',
      connect:
        'Ahora conectemos las tres evidencias: ¿cómo se unen la necesidad de agua, el sistema de recuperación y el porcentaje del 98%?',
      solve:
        'Conversen en equipo: ¿qué explicación está mejor respaldada por las tres evidencias que reunieron?',
      resolved:
        '¡Excelente investigación! Gracias a la recuperación y procesamiento del agua, las estaciones espaciales aprovechan mejor cada gota.',
    },
    evidenceCards: [
      {
        id: 'ev-water-essential',
        order: 1,
        badge: 'Evidencia 1 · Necesidad vital',
        title: 'El agua es esencial',
        fact: 'Los astronautas necesitan agua para beber, preparar alimentos y mantener distintas actividades de la estación espacial.',
        figureValue: 'Uso diario',
        figureLabel: 'Consumo e higiene esenciales',
        explanation:
          'Sin suministro continuo de agua limpia, la tripulación no podría hidratarse, rehidratar alimentos ni sostener operaciones cotidianas a bordo.',
        visualId: 'water_needs',
        roleCategory: 'need',
        isEssential: true,
        sourceLabel: 'NASA · ISS Environmental Control & Life Support',
        sourceUrl: NASA_WATER_URL,
      },
      {
        id: 'ev-water-recovery',
        order: 2,
        badge: 'Evidencia 2 · Tecnología en uso',
        title: 'Tecnología de recuperación de agua',
        fact: 'La Estación Espacial Internacional utiliza sistemas de recuperación y procesamiento de agua para reutilizar parte del agua disponible.',
        figureValue: 'ECLSS',
        figureLabel: 'Sistema activo en la EEI',
        explanation:
          'Los equipos de control ambiental recolectan humedad del aire (respiración y sudor) y aguas residuales procesadas para filtrarlas, purificarlas y volverlas aptas para su reutilización.',
        visualId: 'water_recovery_loop',
        roleCategory: 'technology',
        isEssential: true,
        sourceLabel: 'NASA · Water Recovery System (EEI)',
        sourceUrl: NASA_WATER_URL,
      },
      {
        id: 'ev-water-98',
        order: 3,
        badge: 'Evidencia 3 · Dato demostrado (2023)',
        title: 'El logro del 98%',
        fact: 'En 2023, la NASA informó que los sistemas de recuperación de agua de la Estación Espacial Internacional habían demostrado alcanzar un objetivo de recuperación de aproximadamente el 98%.',
        figureValue: '~98%',
        figureLabel: 'Recuperación demostrada en 2023',
        explanation:
          'Al incorporar el procesador de salmuera (Brine Processor Assembly) junto con el sistema procesador de agua, se logró recuperar agua adicional que antes se perdía.',
        caveatNote:
          'Precisión científica: Esta cifra (~98%) representa una capacidad demostrada bajo condiciones específicas de operación en la Estación Espacial Internacional, no una garantía universal para cualquier nave o escenario.',
        visualId: 'water_98_chart',
        roleCategory: 'metric',
        isEssential: true,
        sourceLabel: 'NASA · Water Recovery Milestone (Junio 2023)',
        sourceUrl: NASA_WATER_URL,
      },
    ],
    connectionQuestion:
      '¿Qué relación existe entre la necesidad de agua, la recuperación de agua y el porcentaje del 98%?',
    connectionGuideHint:
      'Piensen en la secuencia lógica de causa a resultado: primero por qué hace falta agua, luego qué sistema actúa y finalmente qué dato muestra su desempeño.',
    connectionSlots: [
      {
        id: 'step-1',
        stepNumber: 1,
        label: '1. ¿Por qué existe el desafío?',
        hint: 'El problema o necesidad básica de la tripulación.',
        expectedEvidenceId: 'ev-water-essential',
      },
      {
        id: 'step-2',
        stepNumber: 2,
        label: '2. ¿Qué tecnología permite ahorrar agua?',
        hint: 'El sistema que procesa y reutiliza el agua.',
        expectedEvidenceId: 'ev-water-recovery',
      },
      {
        id: 'step-3',
        stepNumber: 3,
        label: '3. ¿Qué resultado demostró el sistema?',
        hint: 'El dato cuantitativo reportado por la NASA en 2023.',
        expectedEvidenceId: 'ev-water-98',
      },
    ],
    connectionSuccessMessage:
      '¡Conexión lógica completa! La necesidad constante de agua motiva usar sistemas de recuperación, cuya capacidad demostrada (~98% en la EEI) reduce drásticamente el agua nueva requerida.',
    connectionMismatchHints: {
      'step-1':
        'En el paso 1 buscamos por qué la tripulación necesita agua todos los días antes de pensar en reciclarla.',
      'step-2':
        'En el paso 2 va la tecnología que realmente captura, filtra y procesa el agua para reutilizarla.',
      'step-3':
        'En el paso 3 va la cifra demostrada en 2023 que muestra cuánta agua logró recuperar ese sistema.',
    },
    finalQuestion:
      '¿Cómo puede una estación espacial reducir la cantidad de agua nueva que necesita recibir desde la Tierra?',
    finalSubprompt: '¿Qué explicación está mejor respaldada por las pistas?',
    answerOptions: [
      {
        id: 'A',
        text: 'Recuperando y procesando agua utilizada para volver a aprovecharla.',
        isCorrect: true,
        feedback:
          '¡Correcto! Las evidencias 2 y 3 muestran que la Estación Espacial Internacional procesa y purifica el agua ya utilizada (alcanzando alrededor del 98% de recuperación en pruebas reportadas en 2023), lo que permite seguir cubriendo las necesidades esenciales de la Evidencia 1 trayendo menos agua nueva desde la Tierra.',
        citedEvidenceIds: [
          'ev-water-essential',
          'ev-water-recovery',
          'ev-water-98',
        ],
      },
      {
        id: 'B',
        text: 'Produciendo toda el agua necesaria únicamente con paneles solares.',
        isCorrect: false,
        feedback:
          'Buen intento para analizar, pero revisemos las pistas: los paneles solares generan electricidad a partir de la luz solar, no fabrican agua. Las evidencias 2 y 3 muestran que el ahorro de agua nueva se logra recuperando y procesando el agua disponible en la estación.',
        citedEvidenceIds: ['ev-water-recovery', 'ev-water-98'],
      },
      {
        id: 'C',
        text: 'Evitando que los astronautas consuman agua.',
        isCorrect: false,
        feedback:
          'Revisemos la Evidencia 1: los astronautas necesitan agua todos los días para beber, preparar alimentos y mantener la vida a bordo. Por eso la solución científica no es dejar de usar agua, sino recuperarla y reutilizarla de forma segura (Evidencias 2 y 3).',
        citedEvidenceIds: ['ev-water-essential', 'ev-water-recovery'],
      },
    ],
    finalExplanationParagraphs: [
      '¡Excelente investigación!',
      'Los sistemas de recuperación de agua permiten procesar y reutilizar agua que de otro modo se perdería.',
      'Gracias a estas tecnologías, las misiones pueden reducir la cantidad de agua nueva que necesitan recibir desde la Tierra.',
      '¡La ciencia nos ayuda a aprovechar mejor los recursos!',
    ],
    scientificContextNote:
      'Tecnología actualmente en uso en la Estación Espacial Internacional (conjunto ECLSS: Water Processor Assembly, Urine Processor Assembly y Brine Processor Assembly). Su perfeccionamiento es clave para futuras misiones humanas de larga duración lejos de la Tierra.',
    discoveryCard: {
      caseId: 'case-01-water',
      caseTitle: '💧 Caso 01: El misterio del agua',
      mainScientificFact:
        'La Estación Espacial Internacional recupera y purifica agua utilizada para reutilizarla en órbita.',
      keyNumericalData: '~98% de recuperación de agua demostrada (NASA, 2023)',
      shortExplanation:
        'Mediante sistemas de procesamiento de agua, humedad y salmuera, una misión espacial reduce cuánta agua nueva necesita recibir desde la Tierra en condiciones específicas de operación.',
      technologyStatusLabel:
        'Tecnología actualmente en uso en la Estación Espacial Internacional',
      sourceTitle:
        'NASA Achieves Water Recovery Milestone on International Space Station',
      sourceOrganization: 'NASA · ISS Research',
      sourceDate: 'Junio de 2023',
      sourceUrl: NASA_WATER_URL,
    },
    nasaSource: {
      title:
        'NASA Achieves Water Recovery Milestone on International Space Station',
      organization: 'NASA (National Aeronautics and Space Administration)',
      publicationDate: 'Junio de 2023',
      url: NASA_WATER_URL,
      technologyStatusLabel:
        'En uso actual en la Estación Espacial Internacional',
    },
  },
  {
    id: 'case-02-electricity',
    order: 2,
    status: 'coming_soon',
    estimatedMinutes: '5–8 min',
    focusTopic: 'Arreglos solares y generación fotovoltaica',
    title: '⚡ Caso 02: ¿De dónde viene la electricidad?',
    mysteryQuestion:
      '¿Cómo obtiene electricidad una estación espacial mientras orbita la Tierra?',
    shortDescription:
      'Próximamente: investiga cómo los arreglos solares capturan luz solar y cargan baterías para mantener encendida una estación orbital incluso en la sombra nocturna.',
    stage1Narrative: '',
    nautiStagePrompts: {
      mystery: '',
      evidence: '',
      connect: '',
      solve: '',
      resolved: '',
    },
    evidenceCards: [],
    connectionQuestion: '',
    connectionGuideHint: '',
    connectionSlots: [],
    connectionSuccessMessage: '',
    connectionMismatchHints: {},
    finalQuestion: '',
    finalSubprompt: '',
    answerOptions: [],
    finalExplanationParagraphs: [],
    scientificContextNote: '',
    discoveryCard: {
      caseId: 'case-02-electricity',
      caseTitle: '⚡ Caso 02: ¿De dónde viene la electricidad?',
      mainScientificFact: '',
      keyNumericalData: '',
      shortExplanation: '',
      technologyStatusLabel: '',
      sourceTitle:
        'International Space Station — Solar Arrays & Electrical Power System',
      sourceOrganization: 'NASA',
      sourceUrl: NASA_SOLAR_URL,
    },
    nasaSource: {
      title:
        'International Space Station — Solar Arrays & Electrical Power System',
      organization: 'NASA',
      url: NASA_SOLAR_URL,
      technologyStatusLabel: 'En preparación para próxima investigación',
    },
  },
  {
    id: 'case-03-plants',
    order: 3,
    status: 'coming_soon',
    estimatedMinutes: '5–8 min',
    focusTopic: 'Investigación de cultivos espaciales y sistema Veggie',
    title: '🌱 Caso 03: ¿Pueden crecer plantas en el espacio?',
    mysteryQuestion:
      '¿Cómo pueden crecer plantas en un ambiente de microgravedad?',
    shortDescription:
      'Próximamente: analiza pistas del sistema Veggie de la NASA para descubrir cómo reciben luz LED, agua y aire las plantas a bordo de la EEI.',
    stage1Narrative: '',
    nautiStagePrompts: {
      mystery: '',
      evidence: '',
      connect: '',
      solve: '',
      resolved: '',
    },
    evidenceCards: [],
    connectionQuestion: '',
    connectionGuideHint: '',
    connectionSlots: [],
    connectionSuccessMessage: '',
    connectionMismatchHints: {},
    finalQuestion: '',
    finalSubprompt: '',
    answerOptions: [],
    finalExplanationParagraphs: [],
    scientificContextNote: '',
    discoveryCard: {
      caseId: 'case-03-plants',
      caseTitle: '🌱 Caso 03: ¿Pueden crecer plantas en el espacio?',
      mainScientificFact: '',
      keyNumericalData: '',
      shortExplanation: '',
      technologyStatusLabel: '',
      sourceTitle:
        'Veggie Plant Growth System Activated on International Space Station',
      sourceOrganization: 'NASA · Biological and Physical Sciences',
      sourceUrl: NASA_VEGGIE_URL,
    },
    nasaSource: {
      title:
        'Veggie Plant Growth System Activated on International Space Station',
      organization: 'NASA · Biological and Physical Sciences',
      url: NASA_VEGGIE_URL,
      technologyStatusLabel: 'En preparación para próxima investigación',
    },
  },
  {
    id: 'case-04-oxygen',
    order: 4,
    status: 'coming_soon',
    estimatedMinutes: '5–8 min',
    focusTopic: 'Generación de oxígeno mediante electrólisis del agua',
    title: '🌬️ Caso 04: ¿De dónde sale el oxígeno?',
    mysteryQuestion:
      '¿Cómo puede una estación espacial producir parte del oxígeno que necesitan sus astronautas?',
    shortDescription:
      'Próximamente: conecta evidencias sobre agua purificada, electricidad solar y electrólisis para descubrir cómo se renueva el aire respirable en órbita.',
    stage1Narrative: '',
    nautiStagePrompts: {
      mystery: '',
      evidence: '',
      connect: '',
      solve: '',
      resolved: '',
    },
    evidenceCards: [],
    connectionQuestion: '',
    connectionGuideHint: '',
    connectionSlots: [],
    connectionSuccessMessage: '',
    connectionMismatchHints: {},
    finalQuestion: '',
    finalSubprompt: '',
    answerOptions: [],
    finalExplanationParagraphs: [],
    scientificContextNote: '',
    discoveryCard: {
      caseId: 'case-04-oxygen',
      caseTitle: '🌬️ Caso 04: ¿De dónde sale el oxígeno?',
      mainScientificFact: '',
      keyNumericalData: '',
      shortExplanation: '',
      technologyStatusLabel: '',
      sourceTitle: 'Environmental Control and Life Support Systems (ECLSS)',
      sourceOrganization: 'NASA · International Space Station',
      sourceUrl: NASA_ECLSS_URL,
    },
    nasaSource: {
      title: 'Environmental Control and Life Support Systems (ECLSS)',
      organization: 'NASA · International Space Station',
      url: NASA_ECLSS_URL,
      technologyStatusLabel: 'En preparación para próxima investigación',
    },
  },
];

const EN_CASES: readonly DetectiveCaseRecord[] = [
  {
    id: 'case-01-water',
    order: 1,
    status: 'available',
    estimatedMinutes: '5–8 min',
    focusTopic: 'Orbital water recovery (ISS / ECLSS)',
    title: '💧 Case 01: The Water Mystery',
    mysteryQuestion:
      'How can space missions reduce the amount of fresh water they need to launch from Earth?',
    shortDescription:
      'Investigate why launching water from Earth is so resource-intensive and what milestone NASA reached aboard the International Space Station to reuse almost every drop.',
    stage1Narrative:
      'Detectives! We have a big mystery.\n\nAstronauts need water for drinking, preparing food, and carrying out essential daily tasks.\n\nYet transporting water from Earth demands significant launch resources.\n\nHow can space missions reduce the amount of fresh water they need to transport?',
    nautiStagePrompts: {
      mystery:
        'Detectives! We have an exciting water mystery in space. Read or listen to the question, then let us investigate the clues.',
      evidence:
        'Reveal each piece of evidence one by one. Pay attention to astronaut needs, recycling technology, and real NASA data.',
      connect:
        'Now connect all three clues: how do water needs, water recovery systems, and the 98% figure fit together?',
      solve:
        'Discuss as a team: which explanation is best supported by all three pieces of evidence?',
      resolved:
        'Awesome investigation! By recovering and processing used water, space stations make the most of every drop.',
    },
    evidenceCards: [
      {
        id: 'ev-water-essential',
        order: 1,
        badge: 'Evidence 1 · Essential need',
        title: 'Water is essential',
        fact: 'Astronauts need water for drinking, preparing meals, and maintaining essential station activities.',
        figureValue: 'Daily use',
        figureLabel: 'Hydration, food & operations',
        explanation:
          'Without a steady supply of clean water, the crew could not stay hydrated, rehydrate food pouches, or run daily life-support operations.',
        visualId: 'water_needs',
        roleCategory: 'need',
        isEssential: true,
        sourceLabel: 'NASA · ISS Environmental Control & Life Support',
        sourceUrl: NASA_WATER_URL,
      },
      {
        id: 'ev-water-recovery',
        order: 2,
        badge: 'Evidence 2 · Technology in use',
        title: 'Water recovery technology',
        fact: 'The International Space Station uses water recovery and processing systems to clean and reuse available water.',
        figureValue: 'ECLSS',
        figureLabel: 'Active system aboard the ISS',
        explanation:
          'Environmental control hardware collects cabin humidity (from breath and sweat) and processed wastewater, purifying them into safe drinking water.',
        visualId: 'water_recovery_loop',
        roleCategory: 'technology',
        isEssential: true,
        sourceLabel: 'NASA · Water Recovery System (ISS)',
        sourceUrl: NASA_WATER_URL,
      },
      {
        id: 'ev-water-98',
        order: 3,
        badge: 'Evidence 3 · Demonstrated milestone (2023)',
        title: 'The 98% achievement',
        fact: 'In 2023, NASA reported that the International Space Station water recovery systems had demonstrated reaching a recovery target of approximately 98%.',
        figureValue: '~98%',
        figureLabel: 'Demonstrated recovery (2023)',
        explanation:
          'Adding the Brine Processor Assembly alongside the Water Processor Assembly allowed the station to extract residual water that previously went unrecovered.',
        caveatNote:
          'Scientific accuracy note: This ~98% figure represents a demonstrated capability under specific operating conditions on the ISS, not a universal guarantee for every spacecraft or situation.',
        visualId: 'water_98_chart',
        roleCategory: 'metric',
        isEssential: true,
        sourceLabel: 'NASA · Water Recovery Milestone (June 2023)',
        sourceUrl: NASA_WATER_URL,
      },
    ],
    connectionQuestion:
      'What is the connection between the need for water, water recovery technology, and the 98% milestone?',
    connectionGuideHint:
      'Think in a cause-to-result chain: why water is needed first, which technology steps in next, and what data shows how well it performs.',
    connectionSlots: [
      {
        id: 'step-1',
        stepNumber: 1,
        label: '1. Why does the challenge exist?',
        hint: 'The crew’s ongoing biological and station need.',
        expectedEvidenceId: 'ev-water-essential',
      },
      {
        id: 'step-2',
        stepNumber: 2,
        label: '2. Which technology saves water?',
        hint: 'The system that cleans and recycles used water.',
        expectedEvidenceId: 'ev-water-recovery',
      },
      {
        id: 'step-3',
        stepNumber: 3,
        label: '3. What result did NASA demonstrate?',
        hint: 'The quantitative milestone reported in 2023.',
        expectedEvidenceId: 'ev-water-98',
      },
    ],
    connectionSuccessMessage:
      'Logical chain complete! Ongoing water needs lead engineers to recycle water, and demonstrating ~98% recovery aboard the ISS greatly reduces fresh supply demands.',
    connectionMismatchHints: {
      'step-1':
        'Step 1 asks why astronauts need water every single day before any recycling happens.',
      'step-2':
        'Step 2 belongs to the hardware system that captures, filters, and processes wastewater.',
      'step-3':
        'Step 3 belongs to the 2023 figure showing how much water the system demonstrated recovering.',
    },
    finalQuestion:
      'How can a space station reduce the amount of new water it needs to receive from Earth?',
    finalSubprompt: 'Which explanation is best supported by the clues?',
    answerOptions: [
      {
        id: 'A',
        text: 'By recovering and processing used water so it can be reused.',
        isCorrect: true,
        feedback:
          'Correct! Evidence 2 and 3 show that the ISS cleans and reuses wastewater (reaching roughly 98% demonstrated recovery in 2023), meeting the crew needs from Evidence 1 with far less resupply from Earth.',
        citedEvidenceIds: [
          'ev-water-essential',
          'ev-water-recovery',
          'ev-water-98',
        ],
      },
      {
        id: 'B',
        text: 'By generating all required water solely with solar panels.',
        isCorrect: false,
        feedback:
          'Let us check the clues carefully: solar panels convert sunlight into electricity, not water. Evidence 2 and 3 show that water savings come from recovery and filtration systems.',
        citedEvidenceIds: ['ev-water-recovery', 'ev-water-98'],
      },
      {
        id: 'C',
        text: 'By stopping astronauts from consuming water.',
        isCorrect: false,
        feedback:
          'Check Evidence 1: astronauts need clean water daily for drinking, meals, and station life. Science solves this safely by recovering and reusing water (Evidence 2 and 3).',
        citedEvidenceIds: ['ev-water-essential', 'ev-water-recovery'],
      },
    ],
    finalExplanationParagraphs: [
      'Excellent investigation!',
      'Water recovery systems allow missions to process and reuse water that would otherwise be lost.',
      'Thanks to these technologies, space crews can cut down on how much fresh water must be shipped from Earth.',
      'Science helps us make smarter use of every resource!',
    ],
    scientificContextNote:
      'Currently operating aboard the International Space Station as part of ECLSS (Water Processor Assembly, Urine Processor Assembly, and Brine Processor Assembly), supporting future deep-space exploration.',
    discoveryCard: {
      caseId: 'case-01-water',
      caseTitle: '💧 Case 01: The Water Mystery',
      mainScientificFact:
        'The International Space Station recovers and purifies used water for reuse in orbit.',
      keyNumericalData: '~98% demonstrated water recovery (NASA, 2023)',
      shortExplanation:
        'Using multi-stage processing for humidity, wastewater, and brine, a space station reduces new water launches under specific operating conditions.',
      technologyStatusLabel:
        'Technology currently operating on the International Space Station',
      sourceTitle:
        'NASA Achieves Water Recovery Milestone on International Space Station',
      sourceOrganization: 'NASA · ISS Research',
      sourceDate: 'June 2023',
      sourceUrl: NASA_WATER_URL,
    },
    nasaSource: {
      title:
        'NASA Achieves Water Recovery Milestone on International Space Station',
      organization: 'NASA (National Aeronautics and Space Administration)',
      publicationDate: 'June 2023',
      url: NASA_WATER_URL,
      technologyStatusLabel:
        'Currently operating on the International Space Station',
    },
  },
  {
    id: 'case-02-electricity',
    order: 2,
    status: 'coming_soon',
    estimatedMinutes: '5–8 min',
    focusTopic: 'Solar arrays and photovoltaic power',
    title: '⚡ Case 02: Where Does the Electricity Come From?',
    mysteryQuestion:
      'How does a space station generate electricity while orbiting Earth?',
    shortDescription:
      'Coming soon: investigate how solar arrays capture sunlight and charge onboard batteries through every orbital day and night.',
    stage1Narrative: '',
    nautiStagePrompts: {
      mystery: '',
      evidence: '',
      connect: '',
      solve: '',
      resolved: '',
    },
    evidenceCards: [],
    connectionQuestion: '',
    connectionGuideHint: '',
    connectionSlots: [],
    connectionSuccessMessage: '',
    connectionMismatchHints: {},
    finalQuestion: '',
    finalSubprompt: '',
    answerOptions: [],
    finalExplanationParagraphs: [],
    scientificContextNote: '',
    discoveryCard: {
      caseId: 'case-02-electricity',
      caseTitle: '⚡ Case 02: Where Does the Electricity Come From?',
      mainScientificFact: '',
      keyNumericalData: '',
      shortExplanation: '',
      technologyStatusLabel: '',
      sourceTitle:
        'International Space Station — Solar Arrays & Electrical Power System',
      sourceOrganization: 'NASA',
      sourceUrl: NASA_SOLAR_URL,
    },
    nasaSource: {
      title:
        'International Space Station — Solar Arrays & Electrical Power System',
      organization: 'NASA',
      url: NASA_SOLAR_URL,
      technologyStatusLabel: 'In preparation for upcoming release',
    },
  },
  {
    id: 'case-03-plants',
    order: 3,
    status: 'coming_soon',
    estimatedMinutes: '5–8 min',
    focusTopic: 'NASA plant growth & Veggie system',
    title: '🌱 Case 03: Can Plants Grow in Space?',
    mysteryQuestion: 'How can plants grow in a microgravity environment?',
    shortDescription:
      'Coming soon: explore clues from NASA’s Veggie chamber to see how astronauts provide light, water, and nutrients in microgravity.',
    stage1Narrative: '',
    nautiStagePrompts: {
      mystery: '',
      evidence: '',
      connect: '',
      solve: '',
      resolved: '',
    },
    evidenceCards: [],
    connectionQuestion: '',
    connectionGuideHint: '',
    connectionSlots: [],
    connectionSuccessMessage: '',
    connectionMismatchHints: {},
    finalQuestion: '',
    finalSubprompt: '',
    answerOptions: [],
    finalExplanationParagraphs: [],
    scientificContextNote: '',
    discoveryCard: {
      caseId: 'case-03-plants',
      caseTitle: '🌱 Case 03: Can Plants Grow in Space?',
      mainScientificFact: '',
      keyNumericalData: '',
      shortExplanation: '',
      technologyStatusLabel: '',
      sourceTitle:
        'Veggie Plant Growth System Activated on International Space Station',
      sourceOrganization: 'NASA · Biological and Physical Sciences',
      sourceUrl: NASA_VEGGIE_URL,
    },
    nasaSource: {
      title:
        'Veggie Plant Growth System Activated on International Space Station',
      organization: 'NASA · Biological and Physical Sciences',
      url: NASA_VEGGIE_URL,
      technologyStatusLabel: 'In preparation for upcoming release',
    },
  },
  {
    id: 'case-04-oxygen',
    order: 4,
    status: 'coming_soon',
    estimatedMinutes: '5–8 min',
    focusTopic: 'Oxygen generation through water electrolysis',
    title: '🌬️ Case 04: Where Does the Oxygen Come From?',
    mysteryQuestion:
      'How can a space station produce part of the oxygen its astronauts need?',
    shortDescription:
      'Coming soon: connect clues about purified water, solar electricity, and electrolysis to see how breathable air is produced in orbit.',
    stage1Narrative: '',
    nautiStagePrompts: {
      mystery: '',
      evidence: '',
      connect: '',
      solve: '',
      resolved: '',
    },
    evidenceCards: [],
    connectionQuestion: '',
    connectionGuideHint: '',
    connectionSlots: [],
    connectionSuccessMessage: '',
    connectionMismatchHints: {},
    finalQuestion: '',
    finalSubprompt: '',
    answerOptions: [],
    finalExplanationParagraphs: [],
    scientificContextNote: '',
    discoveryCard: {
      caseId: 'case-04-oxygen',
      caseTitle: '🌬️ Case 04: Where Does the Oxygen Come From?',
      mainScientificFact: '',
      keyNumericalData: '',
      shortExplanation: '',
      technologyStatusLabel: '',
      sourceTitle: 'Environmental Control and Life Support Systems (ECLSS)',
      sourceOrganization: 'NASA · International Space Station',
      sourceUrl: NASA_ECLSS_URL,
    },
    nasaSource: {
      title: 'Environmental Control and Life Support Systems (ECLSS)',
      organization: 'NASA · International Space Station',
      url: NASA_ECLSS_URL,
      technologyStatusLabel: 'In preparation for upcoming release',
    },
  },
];

const GN_CASES: readonly DetectiveCaseRecord[] = [
  {
    id: 'case-01-water',
    order: 1,
    status: 'available',
    estimatedMinutes: '5–8 min',
    focusTopic: 'Y ñemopotĩ jey arapýpe (EEI / ECLSS)',
    title: '💧 Káso 01: Y ñembyaty',
    mysteryQuestion:
      '¿Mba’éichapa umi tembiapo arapy rehegua ikatu omboguejy y pyahu ojegueraha va’erã Yvýgui?',
    shortDescription:
      'Ehesa’ỹijo mba’érepa hasy ojegueraha hag̃ua heta y Yvýgui ha mba’e jehupyty tuichápa ohupyty NASA EEI-pe (ISS) oiporujey hag̃ua y.',
    stage1Narrative:
      '¡Detectives! Jaguereko peteĩ mba’e ñembyaty tuicháva.\n\nAstronauta-kuéra oikotevẽ y hoy’u hag̃ua, ombosako’i hag̃ua tembi’u ha ojapo hag̃ua ambue tembiapo tekotevẽva.\n\nPéro ojegueraha hag̃ua y Yvýgui oikotevẽ heta mba’erepy.\n\n¿Mba’éichapa umi tembiapo arapy rehegua ikatu omboguejy y pyahu ojegueraha va’erã?',
    nautiStagePrompts: {
      mystery:
        '¡Detectives! Jaguereko peteĩ mba’e ñembyaty y rehegua arapýpe. Pemoñe’ẽ térã pehendu porandu ha jaheka pista-kuéra.',
      evidence:
        'Pehechauka peteĩteĩ umi pista. Pema’ẽ porã mba’épa oikotevẽ astronauta-kuéra ha NASA tembiporu.',
      connect:
        'Ko’ág̃a ñambojoaju mbohapyvéva pista: ¿mba’éichapa ojoaju y ñeikotevẽ, y ñemopotĩ jey ha pe 98%?',
      solve:
        'Peñemongeta atýpe: ¿mba’e mbohovái oñemombaretevépa umi mbohapy pista rupive?',
      resolved:
        '¡Tesa’ỹijo porãite! Y ñemopotĩ jey rupive, umi estación arapýpe oiporuporãve opaite tyky.',
    },
    evidenceCards: [
      {
        id: 'ev-water-essential',
        order: 1,
        badge: 'Pista 1 · Tekotevẽ tekove rehegua',
        title: 'Y niko tekotevẽterei',
        fact: 'Astronauta-kuéra oikotevẽ y hoy’u hag̃ua, ombosako’i hag̃ua tembi’u ha oñangareko hag̃ua estación rehe.',
        figureValue: 'Ára ha ára',
        figureLabel: 'Hoy’u ha tembiapo tekotevẽva',
        explanation:
          'Y potĩ’ỹre, aty ndaikatumo’ãi hoy’u, ombosako’i tembi’u térã omba’apo porã estación-pe.',
        visualId: 'water_needs',
        roleCategory: 'need',
        isEssential: true,
        sourceLabel: 'NASA · ISS Environmental Control & Life Support',
        sourceUrl: NASA_WATER_URL,
      },
      {
        id: 'ev-water-recovery',
        order: 2,
        badge: 'Pista 2 · Tembiporu ojeporúva',
        title: 'Tembiporu oguenohẽ ha omopotĩ jeýva y',
        fact: 'Estación Espacial Internacional oiporu sistema oguenohẽ ha omopotĩ jeýva y oiporujey hag̃ua.',
        figureValue: 'ECLSS',
        figureLabel: 'Sistema omba’apóva EEI-pe',
        explanation:
          'Umi tembiporu ombyaty yvytu he’õ (pytu ha ry’ái) ha y ojeporu va’ekue, omopotĩ jey hag̃ua ikatu hag̃uáicha ojeporujey.',
        visualId: 'water_recovery_loop',
        roleCategory: 'technology',
        isEssential: true,
        sourceLabel: 'NASA · Water Recovery System (EEI)',
        sourceUrl: NASA_WATER_URL,
      },
      {
        id: 'ev-water-98',
        order: 3,
        badge: 'Pista 3 · Jehupyty 2023-pe',
        title: '98% jehupyty',
        fact: '2023-pe, NASA omombe’u EEI sistema ohechauka hague og̃uahẽvo 98% rupi y ñeguenohẽ jeýpe.',
        figureValue: '~98%',
        figureLabel: 'Techauka 2023-pe',
        explanation:
          'Oñemoĩvo tembiporu pyahu (Brine Processor Assembly), oñeguenohẽve y ikatu va’ekue okañy.',
        caveatNote:
          'Kuaapy hesakãva: Ko papapy (~98%) ohechauka mba’e ikatúva ojejapo EEI mba’apo reko teépe, ndaha’éi opaite tendápe g̃uarã.',
        visualId: 'water_98_chart',
        roleCategory: 'metric',
        isEssential: true,
        sourceLabel: 'NASA · Water Recovery Milestone (Junio 2023)',
        sourceUrl: NASA_WATER_URL,
      },
    ],
    connectionQuestion:
      '¿Mba’éichapa ojoaju y ñeikotevẽ, y ñemopotĩ jey ha pe 98%?',
    connectionGuideHint:
      'Pepensa mba’épa ou raẽ: tekotevẽ, tembiporu oipytyvõva ha papapy ohechaukáva osẽ porã hague.',
    connectionSlots: [
      {
        id: 'step-1',
        stepNumber: 1,
        label: '1. ¿Mba’érepa oĩ ko ñeha’ã?',
        hint: 'Astronauta-kuéra oikotevẽva ára ha ára.',
        expectedEvidenceId: 'ev-water-essential',
      },
      {
        id: 'step-2',
        stepNumber: 2,
        label: '2. ¿Mba’e tembiporúpa oñangareko y rehe?',
        hint: 'Pe sistema omopotĩ ha oiporujeýva y.',
        expectedEvidenceId: 'ev-water-recovery',
      },
      {
        id: 'step-3',
        stepNumber: 3,
        label: '3. ¿Mba’épa ohechauka NASA 2023-pe?',
        hint: 'Pe papapy tuicháva ojehechaukáva.',
        expectedEvidenceId: 'ev-water-98',
      },
    ],
    connectionSuccessMessage:
      '¡Joaju oĩmbáma! Y ñeikotevẽ ojerure tembiporu oguenohẽ jeýva y, ha ~98% jehupyty EEI-pe omboguejy y pyahu ojegueraha va’erã Yvýgui.',
    connectionMismatchHints: {
      'step-1':
        'Paso 1-pe jaheka mba’érepa astronauta-kuéra oikotevẽ y ára ha ára.',
      'step-2':
        'Paso 2-pe oho pe tembiporu omopotĩ ha oiporujeýva y.',
      'step-3':
        'Paso 3-pe oho pe papapy (~98%) ohechaukáva mboýpa ojeporujey 2023-pe.',
    },
    finalQuestion:
      '¿Mba’éichapa peteĩ estación espacial ikatu omboguejy y pyahu oikotevẽva oñemondo Yvýgui?',
    finalSubprompt: '¿Mba’e mbohovái oñemombaretevépa pista-kuéra rupive?',
    answerOptions: [
      {
        id: 'A',
        text: 'Oguenohẽ ha omopotĩ jeývo y ojeporu va’ekue oiporujey hag̃ua.',
        isCorrect: true,
        feedback:
          '¡Oĩ porãite! Pista 2 ha 3 ohechauka EEI omopotĩ ha oiporujeýva y (98% rupi 2023-pe), oipytyvõvo Pista 1-pe ojegueraha’ỹ hag̃ua hetaite y pyahu Yvýgui.',
        citedEvidenceIds: [
          'ev-water-essential',
          'ev-water-recovery',
          'ev-water-98',
        ],
      },
      {
        id: 'B',
        text: 'Ojapóvo opaite y panel solar rupive añónte.',
        isCorrect: false,
        feedback:
          'Jahecha jey pista-kuéra: panel solar ojapo tendyry kuarahy resapégui, ndojapói y. Pista 2 ha 3 ohechauka y oñeñongatúva oñemopotĩ jeývo.',
        citedEvidenceIds: ['ev-water-recovery', 'ev-water-98'],
      },
      {
        id: 'C',
        text: 'Ohejávo astronauta-kuéra hoy’u’ỹre y.',
        isCorrect: false,
        feedback:
          'Jahecha Pista 1: astronauta-kuéra oikotevẽ y ára ha ára hoy’u ha okaru hag̃ua. Upévare tembikuaareka omopotĩ ha oiporujey y (Pista 2 ha 3).',
        citedEvidenceIds: ['ev-water-essential', 'ev-water-recovery'],
      },
    ],
    finalExplanationParagraphs: [
      '¡Tesa’ỹijo porãite!',
      'Umi sistema y ñemopotĩ jey rehegua ohejáta ojeporujey y okañy va’erãmo’ã.',
      'Ko’ã tembiporu rupive, umi tembiapo ikatu omboguejy y pyahu ojegueraha va’erã Yvýgui.',
      '¡Tembikuaareka ñanepytyvõ jaiporuporãve hag̃ua mba’erepy!',
    ],
    scientificContextNote:
      'Tembiporu ojeporúva ko’ág̃a EEI-pe (ECLSS), ha tuicha oipytyvõta tembiapo pukúpe mombyryve Yvýgui.',
    discoveryCard: {
      caseId: 'case-01-water',
      caseTitle: '💧 Káso 01: Y ñembyaty',
      mainScientificFact:
        'Estación Espacial Internacional omopotĩ ha oiporujey y arapýpe.',
      keyNumericalData: '~98% y ñeguenohẽ jey ojehechaukáva (NASA, 2023)',
      shortExplanation:
        'Tembiporu omopotĩva yvytu he’õ ha y ojeporu va’ekue rupive, omboguejy y pyahu oñemondóva Yvýgui.',
      technologyStatusLabel:
        'Tembiporu ojeporúva ko’ág̃a Estación Espacial Internacional-pe',
      sourceTitle:
        'NASA Achieves Water Recovery Milestone on International Space Station',
      sourceOrganization: 'NASA · ISS Research',
      sourceDate: 'Junio 2023',
      sourceUrl: NASA_WATER_URL,
    },
    nasaSource: {
      title:
        'NASA Achieves Water Recovery Milestone on International Space Station',
      organization: 'NASA (National Aeronautics and Space Administration)',
      publicationDate: 'Junio 2023',
      url: NASA_WATER_URL,
      technologyStatusLabel:
        'Ojeporúva ko’ág̃a Estación Espacial Internacional-pe',
    },
  },
  {
    id: 'case-02-electricity',
    order: 2,
    status: 'coming_soon',
    estimatedMinutes: '5–8 min',
    focusTopic: 'Panel solar ha tendyry kuarahy resapégui',
    title: '⚡ Káso 02: ¿Moõguipa ou tendyry?',
    mysteryQuestion:
      '¿Mba’éichapa ohupyty tendyry peteĩ estación espacial ojere aja Yvy jerére?',
    shortDescription:
      'Ko’ẽrõite: ehesa’ỹijo mba’éichapa panel solar-kuéra ombyaty kuarahy resape ha omyanyhẽ batería arapýpe.',
    stage1Narrative: '',
    nautiStagePrompts: {
      mystery: '',
      evidence: '',
      connect: '',
      solve: '',
      resolved: '',
    },
    evidenceCards: [],
    connectionQuestion: '',
    connectionGuideHint: '',
    connectionSlots: [],
    connectionSuccessMessage: '',
    connectionMismatchHints: {},
    finalQuestion: '',
    finalSubprompt: '',
    answerOptions: [],
    finalExplanationParagraphs: [],
    scientificContextNote: '',
    discoveryCard: {
      caseId: 'case-02-electricity',
      caseTitle: '⚡ Káso 02: ¿Moõguipa ou tendyry?',
      mainScientificFact: '',
      keyNumericalData: '',
      shortExplanation: '',
      technologyStatusLabel: '',
      sourceTitle:
        'International Space Station — Solar Arrays & Electrical Power System',
      sourceOrganization: 'NASA',
      sourceUrl: NASA_SOLAR_URL,
    },
    nasaSource: {
      title:
        'International Space Station — Solar Arrays & Electrical Power System',
      organization: 'NASA',
      url: NASA_SOLAR_URL,
      technologyStatusLabel: 'Oñembosako’ihína ko’ẽrõite g̃uarã',
    },
  },
  {
    id: 'case-03-plants',
    order: 3,
    status: 'coming_soon',
    estimatedMinutes: '5–8 min',
    focusTopic: 'Ka’avo ñemongakuaa ha sistema Veggie',
    title: '🌱 Káso 03: ¿Ikatúpa okakuaa ka’avo arapýpe?',
    mysteryQuestion:
      '¿Mba’éichapa ikatu okakuaa ka’avo microgravedad rendápe?',
    shortDescription:
      'Ko’ẽrõite: ehesa’ỹijo NASA sistema Veggie rehegua pista-kuéra rehendu hag̃ua mba’éichapa okakuaa ka’avo EEI-pe.',
    stage1Narrative: '',
    nautiStagePrompts: {
      mystery: '',
      evidence: '',
      connect: '',
      solve: '',
      resolved: '',
    },
    evidenceCards: [],
    connectionQuestion: '',
    connectionGuideHint: '',
    connectionSlots: [],
    connectionSuccessMessage: '',
    connectionMismatchHints: {},
    finalQuestion: '',
    finalSubprompt: '',
    answerOptions: [],
    finalExplanationParagraphs: [],
    scientificContextNote: '',
    discoveryCard: {
      caseId: 'case-03-plants',
      caseTitle: '🌱 Káso 03: ¿Ikatúpa okakuaa ka’avo arapýpe?',
      mainScientificFact: '',
      keyNumericalData: '',
      shortExplanation: '',
      technologyStatusLabel: '',
      sourceTitle:
        'Veggie Plant Growth System Activated on International Space Station',
      sourceOrganization: 'NASA · Biological and Physical Sciences',
      sourceUrl: NASA_VEGGIE_URL,
    },
    nasaSource: {
      title:
        'Veggie Plant Growth System Activated on International Space Station',
      organization: 'NASA · Biological and Physical Sciences',
      url: NASA_VEGGIE_URL,
      technologyStatusLabel: 'Oñembosako’ihína ko’ẽrõite g̃uarã',
    },
  },
  {
    id: 'case-04-oxygen',
    order: 4,
    status: 'coming_soon',
    estimatedMinutes: '5–8 min',
    focusTopic: 'Oxígeno ñemoheñói electrólisis rupive',
    title: '🌬️ Káso 04: ¿Moõguipa osẽ oxígeno?',
    mysteryQuestion:
      '¿Mba’éichapa peteĩ estación espacial ikatu ojapo oxígeno oikotevẽva astronauta-kuéra?',
    shortDescription:
      'Ko’ẽrõite: embojoaju pista y potĩ, tendyry ha electrólisis rehegua reikuaa hag̃ua mba’éichapa oñembopyahu yvytu arapýpe.',
    stage1Narrative: '',
    nautiStagePrompts: {
      mystery: '',
      evidence: '',
      connect: '',
      solve: '',
      resolved: '',
    },
    evidenceCards: [],
    connectionQuestion: '',
    connectionGuideHint: '',
    connectionSlots: [],
    connectionSuccessMessage: '',
    connectionMismatchHints: {},
    finalQuestion: '',
    finalSubprompt: '',
    answerOptions: [],
    finalExplanationParagraphs: [],
    scientificContextNote: '',
    discoveryCard: {
      caseId: 'case-04-oxygen',
      caseTitle: '🌬️ Káso 04: ¿Moõguipa osẽ oxígeno?',
      mainScientificFact: '',
      keyNumericalData: '',
      shortExplanation: '',
      technologyStatusLabel: '',
      sourceTitle: 'Environmental Control and Life Support Systems (ECLSS)',
      sourceOrganization: 'NASA · International Space Station',
      sourceUrl: NASA_ECLSS_URL,
    },
    nasaSource: {
      title: 'Environmental Control and Life Support Systems (ECLSS)',
      organization: 'NASA · International Space Station',
      url: NASA_ECLSS_URL,
      technologyStatusLabel: 'Oñembosako’ihína ko’ẽrõite g̃uarã',
    },
  },
];

export function getDetectiveCases(lang: AppLang): readonly DetectiveCaseRecord[] {
  if (lang === 'en') return EN_CASES;
  if (lang === 'gn-PY') return GN_CASES;
  return ES_CASES;
}
