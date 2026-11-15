import type { AppLang } from '../locales';
import type { ScienceStudyRecord } from '../types/traduciendoCiencia';

const ES_STUDIES: readonly ScienceStudyRecord[] = [
  {
    id: 'demo-fictional-brote-01',
    category: 'plants_food',
    status: 'demonstration',
    isDemonstration: true,
    isVerifiedOsdr: false,
    osdrIdentifier: 'DEMO-EDUCATIVA-01 (Ficción, no OSDR)',
    officialTitle:
      'Demostración guiada: Orientación luminosa en plántulas dentro de un módulo orbital ficticio (Brote-01)',
    studentTitle: 'Estación Brote-01: ¿Hacia dónde crecen las hojas sin gravedad?',
    topicLabel: 'Plantas, luz y orientación (Demostración)',
    shortDescription:
      'Actividad demostrativa con datos ficticios para practicar cómo leer evidencias científicas, debatir en equipo y explicar una investigación con tus propias palabras.',
    ageRange: '10–16 años',
    durationMinutes: '15–20 min',
    sourceLabel:
      'Demostración educativa ficticia de Filómatas LAB (no corresponde a un estudio real de la NASA ni OSDR)',
    researchQuestion:
      'En este escenario ficticio, el equipo investigador se preguntó si las plántulas pueden usar una lámpara azul superior para orientar sus tallos cuando no sienten la gravedad habitual de la Tierra.',
    studyMethods:
      'Escenario ficticio de práctica: se compararon dos cámaras cerradas idénticas durante 7 días simulados; una permaneció a oscuras y otra recibió luz azul solo desde la parte superior.',
    verifiedFindings:
      'En esta demostración ficticia, los brotes del grupo con luz superior crecieron en su mayoría apuntando hacia la lámpara, mientras que en la cámara oscura crecieron en direcciones desordenadas.',
    limitations:
      'Al ser un ejercicio ficticio de demostración, sus resultados no provienen de un experimento espacial real y no pueden generalizarse a cultivos reales en órbita.',
    potentialApplications:
      'En la investigación real sobre cultivos espaciales, comprender cómo responden las plantas a la luz ayuda a pensar diseños de invernaderos más eficientes.',
    storyParagraphs: [
      'Imagina que abres la compuerta de un pequeño invernadero experimental llamado Brote-01. En la Tierra, si siembras una semilla, la raíz sabe ir hacia abajo y el tallo hacia arriba gracias a la gravedad.',
      'Pero cuando la gravedad casi no se siente, las plantas necesitan otra brújula. En esta historia demostrativa, un equipo colocó semillas idénticas en dos cajitas: la Caja A recibió una luz azul suave desde arriba y la Caja B quedó completamente a oscuras.',
      'Después de siete días simulados, el equipo midió hacia dónde apuntaba cada tallo. En la Caja A, casi todos buscaron la luz azul; en la Caja B, cada brote creció hacia un lado distinto.',
    ],
    storyDistinctionNote:
      'Nota importante: la historia de Brote-01 es una demostración educativa ficticia creada para aprender la dinámica de Traduciendo la ciencia mientras se integran estudios reales verificados de NASA OSDR.',
    facilitatorDiscoverPrompt:
      'Pregunta al grupo antes de avanzar: ¿Qué cambió entre la Caja A y la Caja B en esta historia?',
    evidenceCards: [
      {
        id: 'question',
        promptTitle: '¿Qué querían descubrir?',
        summary:
          'Si una fuente de luz superior basta para orientar los tallos cuando no actúa la gravedad terrestre.',
        detail:
          'Sin la señal habitual de "arriba y abajo", el equipo quiso comprobar si la dirección de la luz funciona como guía principal para el crecimiento del tallo.',
        observationVsInterpretationNote:
          'Pregunta científica comprobable: compara una condición con luz direccional frente a otra sin luz.',
      },
      {
        id: 'method',
        promptTitle: '¿Cómo lo investigaron?',
        summary:
          'Comparando dos grupos iguales durante 7 días: Caja A con luz azul superior y Caja B en oscuridad.',
        detail:
          'Ambas cajas mantuvieron igual humedad y temperatura para que la única diferencia clara fuera la presencia de luz direccional desde arriba.',
        observationVsInterpretationNote:
          'Control experimental: mantener agua y temperatura iguales evita confundir la causa del resultado.',
      },
      {
        id: 'finding',
        promptTitle: '¿Qué encontraron?',
        summary:
          'En la demostración, los brotes iluminados crecieron hacia la lámpara y los de oscuridad crecieron desordenados.',
        detail:
          'Observación ficticia: en la Caja A casi todos los tallos se inclinaron hacia el foco superior; en la Caja B no siguieron una dirección común.',
        observationVsInterpretationNote:
          'Observación: dirección medida de los tallos. Interpretación: la luz actuó como señal orientadora.',
      },
      {
        id: 'importance',
        promptTitle: '¿Por qué es importante?',
        summary:
          'Comprender qué orienta a las plantas ayuda a diseñar mejores formas de cultivarlas fuera de la Tierra.',
        detail:
          'Si los astronautas necesitan producir vegetales frescos en misiones largas, saber qué señales guían el crecimiento permite cuidar mejor las hojas y raíces.',
        observationVsInterpretationNote:
          'Aplicación potencial: orienta ideas de diseño agrícola, pero requiere estudios reales en cada especie.',
      },
    ],
    debateQuestions: [
      {
        id: 'demo-q1',
        question:
          '¿Por qué el equipo investigador usó también una Caja B completamente a oscuras además de la Caja A con luz?',
        options: [
          'Para comparar qué pasa sin luz y confirmar si la luz fue la causa de la orientación.',
          'Para ahorrar electricidad apagando una de las cámaras.',
          'Porque algunas semillas solo pueden germinar si hace mucho frío.',
        ],
        supportedOptionIndex: 0,
        supportingEvidenceCardId: 'method',
        scientificExplanation:
          'Tener un grupo de comparación sin el factor que se investiga permite comprobar si realmente la luz provocó el cambio observado.',
        whyOthersAreLessAppropriate:
          'Ahorrar energía o cambiar la temperatura no era el propósito del experimento; de hecho, cambiar la temperatura habría estropeado la comparación justa.',
        facilitatorPrompt:
          'Invita al equipo a señalar qué pista explica cómo se prepararon las dos cajas.',
      },
      {
        id: 'demo-q2',
        question:
          'Según las pistas de esta demostración, ¿cuál afirmación describe con mayor precisión lo observado?',
        options: [
          'Todas las plantas espaciales crecen el doble de rápido bajo luz azul.',
          'Los brotes de la Caja A se orientaron hacia la luz superior, mientras en la Caja B crecieron sin dirección común.',
          'La oscuridad convirtió las raíces en hojas verdes.',
        ],
        supportedOptionIndex: 1,
        supportingEvidenceCardId: 'finding',
        scientificExplanation:
          'La afirmación correcta describe exactamente lo medido (la dirección de crecimiento) sin exagerar ni inventar efectos sobre velocidad o transformación de órganos.',
        whyOthersAreLessAppropriate:
          'Las pistas no mencionan que crecieran el doble de rápido ni que las raíces se transformaran en hojas; en ciencia no debemos afirmar más de lo que muestran los datos.',
        facilitatorPrompt:
          'Conversen: ¿qué palabras de la respuesta 1 exageran lo que realmente dicen las pistas?',
      },
      {
        id: 'demo-q3',
        question:
          'Si quisiéramos compartir este aprendizaje de forma responsable, ¿qué aclaración conviene incluir?',
        options: [
          'Que las conclusiones ya resuelven todos los cultivos en Marte sin más pruebas.',
          'Que solo importa la luz y el agua no afecta a las plantas.',
          'Que esto muestra una idea útil sobre la luz, pero en la vida real cada especie requiere pruebas reales y control de otros factores.',
        ],
        supportedOptionIndex: 2,
        supportingEvidenceCardId: 'importance',
        scientificExplanation:
          'Comunicar ciencia con rigor significa explicar tanto lo que se observó como los límites de lo que podemos asegurar.',
        whyOthersAreLessAppropriate:
          'Dar por resuelto todo cultivo en Marte exagera el alcance, e ignorar el agua contradice las necesidades básicas de cualquier planta.',
        facilitatorPrompt:
          'Reflexionen: ¿por qué es valioso contar también los límites de un experimento?',
      },
    ],
    translateChallenge: {
      contextHint:
        'Imaginen que le cuentan esta historia demostrativa a un hermano menor o a una abuela que nunca visitó un laboratorio.',
      options: [
        {
          choice: 'explain',
          title: 'Explícalo con tus palabras',
          instructions:
            'Redacta o conversa en equipo una explicación breve de 2 o 3 oraciones sin usar jerga difícil.',
          guidingPrompt:
            '¿Qué pregunta tenían, qué probaron y qué descubrieron sobre las plantas y la luz?',
          placeholderText:
            'Ejemplo: Cuando una planta no siente hacia dónde está el suelo, puede usar una luz desde arriba como si fuera un faro para saber hacia dónde estirar sus hojas...',
        },
        {
          choice: 'analogy',
          title: 'Encuentra una comparación',
          instructions:
            'Piensen en algo de la vida diaria que funcione parecido a usar la luz como brújula cuando falta la gravedad.',
          guidingPrompt:
            '¿A qué objeto o situación cotidiana se parece? (Por ejemplo: seguir una linterna en un cuarto oscuro o un faro en el mar).',
          placeholderText:
            'Ejemplo: Es como caminar en una habitación oscura siguiendo la luz de una puerta abierta para no perder el rumbo...',
        },
        {
          choice: 'draw',
          title: 'Dibuja el descubrimiento',
          instructions:
            'Hagan un dibujo en papel comparando la Caja A (con luz arriba) y la Caja B (sin luz). No necesitan cámara ni subir fotos.',
          guidingPrompt:
            'Si desean, escriban aquí en pocas palabras qué dibujaron para recordarlo al compartir con otro equipo.',
          placeholderText:
            'Describe brevemente tu dibujo en papel (opcional)...',
        },
      ],
    },
    referenceNote:
      'Escenario demostrativo ficticio diseñado para aprender la metodología antes de incorporar estudios reales verificados de NASA OSDR.',
  },
  {
    id: 'osdr-upcoming-space-biology',
    category: 'space_biology',
    status: 'coming_soon',
    isDemonstration: false,
    isVerifiedOsdr: false,
    osdrIdentifier: 'Próximamente (OSDR)',
    officialTitle: 'Investigación en preparación · Biología espacial',
    studentTitle: '¿Cómo responden las células al entorno espacial?',
    topicLabel: 'Biología espacial',
    shortDescription:
      'Espacio reservado para integrar un estudio verificado de NASA Open Science Data Repository sobre adaptaciones celulares en microgravedad.',
    ageRange: '10–16 años',
    durationMinutes: '20 min',
    sourceLabel: 'NASA Open Science Data Repository (OSDR) — En curación',
    researchQuestion: '',
    studyMethods: '',
    verifiedFindings: '',
    limitations: '',
    potentialApplications: '',
    storyParagraphs: [],
    storyDistinctionNote: '',
    facilitatorDiscoverPrompt: '',
    evidenceCards: [
      { id: 'question', promptTitle: '', summary: '', detail: '', observationVsInterpretationNote: '' },
      { id: 'method', promptTitle: '', summary: '', detail: '', observationVsInterpretationNote: '' },
      { id: 'finding', promptTitle: '', summary: '', detail: '', observationVsInterpretationNote: '' },
      { id: 'importance', promptTitle: '', summary: '', detail: '', observationVsInterpretationNote: '' },
    ],
    debateQuestions: [
      { id: 'u1', question: '', options: ['', '', ''], supportedOptionIndex: 0, supportingEvidenceCardId: 'question', scientificExplanation: '', whyOthersAreLessAppropriate: '', facilitatorPrompt: '' },
      { id: 'u2', question: '', options: ['', '', ''], supportedOptionIndex: 0, supportingEvidenceCardId: 'method', scientificExplanation: '', whyOthersAreLessAppropriate: '', facilitatorPrompt: '' },
      { id: 'u3', question: '', options: ['', '', ''], supportedOptionIndex: 0, supportingEvidenceCardId: 'finding', scientificExplanation: '', whyOthersAreLessAppropriate: '', facilitatorPrompt: '' },
    ],
    translateChallenge: {
      contextHint: '',
      options: [
        { choice: 'explain', title: '', instructions: '', guidingPrompt: '', placeholderText: '' },
        { choice: 'analogy', title: '', instructions: '', guidingPrompt: '', placeholderText: '' },
        { choice: 'draw', title: '', instructions: '', guidingPrompt: '', placeholderText: '' },
      ],
    },
    referenceNote: 'Pendiente de revisión científica antes de su publicación.',
  },
  {
    id: 'osdr-upcoming-human-health',
    category: 'human_health',
    status: 'coming_soon',
    isDemonstration: false,
    isVerifiedOsdr: false,
    osdrIdentifier: 'Próximamente (OSDR)',
    officialTitle: 'Investigación en preparación · Salud humana en el espacio',
    studentTitle: '¿Qué aprende la ciencia sobre el cuerpo humano en órbita?',
    topicLabel: 'Salud humana en el espacio',
    shortDescription:
      'Espacio reservado para integrar un estudio verificado de OSDR sobre músculos, huesos o defensas humanas durante vuelos espaciales.',
    ageRange: '10–16 años',
    durationMinutes: '20 min',
    sourceLabel: 'NASA Open Science Data Repository (OSDR) — En curación',
    researchQuestion: '',
    studyMethods: '',
    verifiedFindings: '',
    limitations: '',
    potentialApplications: '',
    storyParagraphs: [],
    storyDistinctionNote: '',
    facilitatorDiscoverPrompt: '',
    evidenceCards: [
      { id: 'question', promptTitle: '', summary: '', detail: '', observationVsInterpretationNote: '' },
      { id: 'method', promptTitle: '', summary: '', detail: '', observationVsInterpretationNote: '' },
      { id: 'finding', promptTitle: '', summary: '', detail: '', observationVsInterpretationNote: '' },
      { id: 'importance', promptTitle: '', summary: '', detail: '', observationVsInterpretationNote: '' },
    ],
    debateQuestions: [
      { id: 'u1', question: '', options: ['', '', ''], supportedOptionIndex: 0, supportingEvidenceCardId: 'question', scientificExplanation: '', whyOthersAreLessAppropriate: '', facilitatorPrompt: '' },
      { id: 'u2', question: '', options: ['', '', ''], supportedOptionIndex: 0, supportingEvidenceCardId: 'method', scientificExplanation: '', whyOthersAreLessAppropriate: '', facilitatorPrompt: '' },
      { id: 'u3', question: '', options: ['', '', ''], supportedOptionIndex: 0, supportingEvidenceCardId: 'finding', scientificExplanation: '', whyOthersAreLessAppropriate: '', facilitatorPrompt: '' },
    ],
    translateChallenge: {
      contextHint: '',
      options: [
        { choice: 'explain', title: '', instructions: '', guidingPrompt: '', placeholderText: '' },
        { choice: 'analogy', title: '', instructions: '', guidingPrompt: '', placeholderText: '' },
        { choice: 'draw', title: '', instructions: '', guidingPrompt: '', placeholderText: '' },
      ],
    },
    referenceNote: 'Pendiente de revisión científica antes de su publicación.',
  },
  {
    id: 'osdr-upcoming-microorganisms',
    category: 'microorganisms',
    status: 'coming_soon',
    isDemonstration: false,
    isVerifiedOsdr: false,
    osdrIdentifier: 'Próximamente (OSDR)',
    officialTitle: 'Investigación en preparación · Microorganismos',
    studentTitle: 'Pequeños viajeros invisibles en estaciones espaciales',
    topicLabel: 'Microorganismos',
    shortDescription:
      'Espacio reservado para integrar datos verificados de OSDR sobre cómo se comportan microorganismos en hábitats cerrados.',
    ageRange: '10–16 años',
    durationMinutes: '20 min',
    sourceLabel: 'NASA Open Science Data Repository (OSDR) — En curación',
    researchQuestion: '',
    studyMethods: '',
    verifiedFindings: '',
    limitations: '',
    potentialApplications: '',
    storyParagraphs: [],
    storyDistinctionNote: '',
    facilitatorDiscoverPrompt: '',
    evidenceCards: [
      { id: 'question', promptTitle: '', summary: '', detail: '', observationVsInterpretationNote: '' },
      { id: 'method', promptTitle: '', summary: '', detail: '', observationVsInterpretationNote: '' },
      { id: 'finding', promptTitle: '', summary: '', detail: '', observationVsInterpretationNote: '' },
      { id: 'importance', promptTitle: '', summary: '', detail: '', observationVsInterpretationNote: '' },
    ],
    debateQuestions: [
      { id: 'u1', question: '', options: ['', '', ''], supportedOptionIndex: 0, supportingEvidenceCardId: 'question', scientificExplanation: '', whyOthersAreLessAppropriate: '', facilitatorPrompt: '' },
      { id: 'u2', question: '', options: ['', '', ''], supportedOptionIndex: 0, supportingEvidenceCardId: 'method', scientificExplanation: '', whyOthersAreLessAppropriate: '', facilitatorPrompt: '' },
      { id: 'u3', question: '', options: ['', '', ''], supportedOptionIndex: 0, supportingEvidenceCardId: 'finding', scientificExplanation: '', whyOthersAreLessAppropriate: '', facilitatorPrompt: '' },
    ],
    translateChallenge: {
      contextHint: '',
      options: [
        { choice: 'explain', title: '', instructions: '', guidingPrompt: '', placeholderText: '' },
        { choice: 'analogy', title: '', instructions: '', guidingPrompt: '', placeholderText: '' },
        { choice: 'draw', title: '', instructions: '', guidingPrompt: '', placeholderText: '' },
      ],
    },
    referenceNote: 'Pendiente de revisión científica antes de su publicación.',
  },
  {
    id: 'osdr-upcoming-extreme',
    category: 'extreme_environments',
    status: 'coming_soon',
    isDemonstration: false,
    isVerifiedOsdr: false,
    osdrIdentifier: 'Próximamente (OSDR)',
    officialTitle: 'Investigación en preparación · Vida en entornos extremos',
    studentTitle: 'Sobrevivir al frío, la radiación y el vacío',
    topicLabel: 'Vida en entornos extremos',
    shortDescription:
      'Espacio reservado para integrar un estudio verificado de OSDR sobre organismos resistentes a condiciones extremas.',
    ageRange: '10–16 años',
    durationMinutes: '20 min',
    sourceLabel: 'NASA Open Science Data Repository (OSDR) — En curación',
    researchQuestion: '',
    studyMethods: '',
    verifiedFindings: '',
    limitations: '',
    potentialApplications: '',
    storyParagraphs: [],
    storyDistinctionNote: '',
    facilitatorDiscoverPrompt: '',
    evidenceCards: [
      { id: 'question', promptTitle: '', summary: '', detail: '', observationVsInterpretationNote: '' },
      { id: 'method', promptTitle: '', summary: '', detail: '', observationVsInterpretationNote: '' },
      { id: 'finding', promptTitle: '', summary: '', detail: '', observationVsInterpretationNote: '' },
      { id: 'importance', promptTitle: '', summary: '', detail: '', observationVsInterpretationNote: '' },
    ],
    debateQuestions: [
      { id: 'u1', question: '', options: ['', '', ''], supportedOptionIndex: 0, supportingEvidenceCardId: 'question', scientificExplanation: '', whyOthersAreLessAppropriate: '', facilitatorPrompt: '' },
      { id: 'u2', question: '', options: ['', '', ''], supportedOptionIndex: 0, supportingEvidenceCardId: 'method', scientificExplanation: '', whyOthersAreLessAppropriate: '', facilitatorPrompt: '' },
      { id: 'u3', question: '', options: ['', '', ''], supportedOptionIndex: 0, supportingEvidenceCardId: 'finding', scientificExplanation: '', whyOthersAreLessAppropriate: '', facilitatorPrompt: '' },
    ],
    translateChallenge: {
      contextHint: '',
      options: [
        { choice: 'explain', title: '', instructions: '', guidingPrompt: '', placeholderText: '' },
        { choice: 'analogy', title: '', instructions: '', guidingPrompt: '', placeholderText: '' },
        { choice: 'draw', title: '', instructions: '', guidingPrompt: '', placeholderText: '' },
      ],
    },
    referenceNote: 'Pendiente de revisión científica antes de su publicación.',
  },
];

const EN_STUDIES: readonly ScienceStudyRecord[] = [
  {
    id: 'demo-fictional-brote-01',
    category: 'plants_food',
    status: 'demonstration',
    isDemonstration: true,
    isVerifiedOsdr: false,
    osdrIdentifier: 'DEMO-EDUCATIONAL-01 (Fictional, non-OSDR)',
    officialTitle:
      'Guided Demonstration: Light orientation of seedlings in a fictional orbital chamber (Sprout-01)',
    studentTitle: 'Station Sprout-01: Which way do leaves grow without gravity?',
    topicLabel: 'Plants, light & orientation (Demonstration)',
    shortDescription:
      'A clearly labeled fictional demonstration activity to practice reading scientific clues, debating as a team, and explaining research in everyday words.',
    ageRange: '10–16 years',
    durationMinutes: '15–20 min',
    sourceLabel:
      'Filómatas LAB fictional educational demonstration (not real NASA or OSDR research)',
    researchQuestion:
      'In this fictional scenario, researchers asked whether seedlings can use an overhead blue lamp to orient their stems when Earth’s normal downward gravity cue is absent.',
    studyMethods:
      'Fictional classroom example: two identical sealed boxes were observed for 7 simulated days—one kept in darkness and one given overhead blue light.',
    verifiedFindings:
      'In this fictional demo, stems in the lit chamber mostly grew toward the lamp, whereas stems in the dark chamber grew in scattered directions.',
    limitations:
      'Because this is a fictional practice demonstration, its results are not real spaceflight data and cannot be generalized to actual orbital crops.',
    potentialApplications:
      'In real space plant research, understanding light responses helps inform more efficient greenhouse designs.',
    storyParagraphs: [
      'Imagine opening the hatch of a small experimental greenhouse called Sprout-01. On Earth, when you plant a seed, gravity tells the root which way is down and the stem which way is up.',
      'When gravity is barely felt, plants look for another compass. In this practice story, a team placed matching seeds in two boxes: Box A got gentle blue light from above, while Box B stayed completely dark.',
      'After seven simulated days, the team checked every stem. In Box A, almost all stems leaned toward the blue lamp; in Box B, stems wandered in many directions.',
    ],
    storyDistinctionNote:
      'Important note: Sprout-01 is a fictional educational demonstration created so teams can practice Translating Science while verified NASA OSDR studies are curated.',
    facilitatorDiscoverPrompt:
      'Ask the group before moving on: What was the key difference between Box A and Box B in this story?',
    evidenceCards: [
      {
        id: 'question',
        promptTitle: 'What did they want to discover?',
        summary:
          'Whether an overhead light source is enough to guide stem direction when Earth’s gravity cue is missing.',
        detail:
          'Without the familiar up-and-down pull of Earth, the team tested whether directional light becomes the main signal guiding stem growth.',
        observationVsInterpretationNote:
          'Testable question: compares directional lighting against total darkness.',
      },
      {
        id: 'method',
        promptTitle: 'How did they investigate it?',
        summary:
          'By comparing two matched chambers for 7 simulated days: Box A lit from above, Box B kept dark.',
        detail:
          'Both boxes kept the same moisture and temperature so directional light would be the only planned difference.',
        observationVsInterpretationNote:
          'Fair test: keeping water and warmth equal prevents mixing up what caused the difference.',
      },
      {
        id: 'finding',
        promptTitle: 'What did they find?',
        summary:
          'In the demo, lit seedlings grew toward the overhead lamp while dark seedlings grew in scattered directions.',
        detail:
          'Fictional observation: Box A stems tilted upward toward the light, whereas Box B showed no shared orientation.',
        observationVsInterpretationNote:
          'Observation: measured stem angles. Interpretation: light served as an orientation cue.',
      },
      {
        id: 'importance',
        promptTitle: 'Why is it important?',
        summary:
          'Understanding what guides plant growth helps engineers design better ways to grow food beyond Earth.',
        detail:
          'If future crews grow fresh vegetables on long missions, knowing which signals steer leaves and stems improves habitat care.',
        observationVsInterpretationNote:
          'Potential application: informs lighting ideas, though real crops require species-specific flight data.',
      },
    ],
    debateQuestions: [
      {
        id: 'demo-q1',
        question:
          'Why did the researchers include a completely dark Box B alongside Box A with overhead light?',
        options: [
          'To compare growth without light and verify whether the light caused the orientation.',
          'To save electricity by turning one box off.',
          'Because seeds only sprout in freezing cold darkness.',
        ],
        supportedOptionIndex: 0,
        supportingEvidenceCardId: 'method',
        scientificExplanation:
          'A comparison group without the tested factor helps check whether light actually caused the observed orientation.',
        whyOthersAreLessAppropriate:
          'Saving power or freezing seeds was not part of the test—changing temperature would make the comparison unfair.',
        facilitatorPrompt:
          'Invite the group to point out which clue card explains how both boxes were set up.',
      },
      {
        id: 'demo-q2',
        question:
          'Based on the clues in this demonstration, which statement most accurately describes what was observed?',
        options: [
          'All space plants grow twice as fast under blue light.',
          'Seedlings in Box A leaned toward the overhead light, while Box B grew without a common direction.',
          'Darkness turned roots into green leaves.',
        ],
        supportedOptionIndex: 1,
        supportingEvidenceCardId: 'finding',
        scientificExplanation:
          'This matches the exact observed pattern (growth direction) without exaggerating growth speed or inventing organ changes.',
        whyOthersAreLessAppropriate:
          'The clues never mention doubled speed or roots turning into leaves—good science avoids claiming more than data show.',
        facilitatorPrompt:
          'Discuss together: which words in option 1 go beyond what the clues actually state?',
      },
      {
        id: 'demo-q3',
        question:
          'If your team shares this lesson responsibly, what note should you include?',
        options: [
          'That these results already solve all farming on Mars with no further testing.',
          'That only light matters and plants never need water.',
          'That it shows a helpful idea about light cues, while real crops still require verified studies and balanced conditions.',
        ],
        supportedOptionIndex: 2,
        supportingEvidenceCardId: 'importance',
        scientificExplanation:
          'Responsible science communication explains both what was seen and the limits of what it proves.',
        whyOthersAreLessAppropriate:
          'Claiming Mars farming is solved exaggerates far beyond the scenario, and ignoring water contradicts plant biology.',
        facilitatorPrompt:
          'Reflect: why is sharing limitations a strength in science communication?',
      },
    ],
    translateChallenge: {
      contextHint:
        'Imagine telling this practice story to a younger sibling or grandparent who has never stepped inside a lab.',
      options: [
        {
          choice: 'explain',
          title: 'Explain it in your own words',
          instructions:
            'Write or discuss a short 2–3 sentence explanation without technical jargon.',
          guidingPrompt:
            'What did they wonder, what did they test, and what happened with the light?',
          placeholderText:
            'Example: When a young plant cannot feel which way Earth pulls down, a lamp above acts like a lighthouse telling its leaves which way to reach...',
        },
        {
          choice: 'analogy',
          title: 'Find a comparison',
          instructions:
            'Pick or invent an everyday comparison that works like using light as a compass.',
          guidingPrompt:
            'What familiar object or moment works the same way? (For instance, walking toward a lit doorway in the dark).',
          placeholderText:
            'Example: It is like walking across a dark room by aiming toward a glowing doorway...',
        },
        {
          choice: 'draw',
          title: 'Draw the discovery',
          instructions:
            'Draw Box A (lit from above) vs. Box B (dark) on paper together. No camera or upload needed.',
          guidingPrompt:
            'Optionally jot a quick note describing your paper drawing so you remember your talking points.',
          placeholderText:
            'Briefly describe your paper drawing (optional)...',
        },
      ],
    },
    referenceNote:
      'Fictional demonstration activity designed to practice science communication before curated NASA OSDR studies are added.',
  },
  ...ES_STUDIES.slice(1).map((item) => ({
    ...item,
    osdrIdentifier: 'Coming soon (OSDR)',
    officialTitle: `In preparation · ${item.category}`,
    studentTitle:
      item.category === 'space_biology'
        ? 'How do cells respond to the space environment?'
        : item.category === 'human_health'
          ? 'What does science learn about human bodies in orbit?'
          : item.category === 'microorganisms'
            ? 'Invisible fellow travelers on space stations'
            : 'Surviving cold, radiation, and vacuum',
    topicLabel:
      item.category === 'space_biology'
        ? 'Space biology'
        : item.category === 'human_health'
          ? 'Human health in space'
          : item.category === 'microorganisms'
            ? 'Microorganisms'
            : 'Life in extreme environments',
    shortDescription:
      'Slot ready to host a verified NASA Open Science Data Repository (OSDR) study once curated and reviewed.',
    ageRange: '10–16 years',
    durationMinutes: '20 min',
    sourceLabel: 'NASA Open Science Data Repository (OSDR) — In curation',
    referenceNote: 'Pending scientific curation before publication.',
  })),
];

export function getTraduciendoStudies(lang: AppLang): readonly ScienceStudyRecord[] {
  if (lang === 'en') {
    return EN_STUDIES;
  }
  return ES_STUDIES;
}
