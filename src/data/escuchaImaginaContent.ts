import type { AppLang } from '../locales';
import type { TechnologyEpisodeRecord } from '../types/escuchaImagina';

const ES_EPISODES: readonly TechnologyEpisodeRecord[] = [
  {
    id: 'ep-01-solar-panels',
    order: 1,
    category: 'solar_power',
    categoryLabel: 'Energía solar',
    status: 'available',
    title: '⚡ La energía que viene del Sol',
    shortTopic:
      'Cómo los paneles solares fotovoltaicos generan electricidad para naves y estaciones espaciales.',
    drawingChallengeSummary:
      'Sección simplificada de un arreglo solar rectangular organizado en cuadrícula con su soporte de conexión.',
    estimatedMinutes: '12–15 min',
    targetDiagramId: 'solar_array_wing',
    targetPieceTitle: 'Ala de arreglo solar fotovoltaico (estructura simplificada)',
    referenceKindLabel: 'Representación educativa simplificada',
    podcastTitle: 'Podcast científico · Atrapando luz en el espacio',
    podcastSegments: [
      '¡Hola de nuevo, equipo! Soy NAUTI. Hoy quiero invitarlos a imaginar cómo funciona una casa o un laboratorio que flota a cientos de kilómetros sobre la Tierra, como la Estación Espacial Internacional.',
      'Allá arriba no podemos enchufar un cable gigante hasta una planta eléctrica en nuestro planeta, y llevar miles de litros de combustible sería demasiado pesado y costoso. Entonces, ¿de dónde sale la electricidad para encender las luces, purificar el aire, reciclar el agua y hacer funcionar las computadoras científicas?',
      'La respuesta brilla cada día en el cielo: ¡el Sol! Muchas naves y estaciones espaciales utilizan grandes estructuras llamadas paneles o arreglos solares fotovoltaicos. Cada panel está formado por muchísimas piezas pequeñas llamadas celdas fotovoltaicas.',
      '¿Cómo funcionan esas celdas? Aunque el nombre suena largo, su idea es maravillosa: "foto" significa luz y "voltaico" se refiere a la electricidad. Cuando los diminutos paquetes de energía de la luz solar golpean materiales especiales dentro de la celda —como el silicio—, empujan pequeñas cargas llamadas electrones y las ponen en movimiento. Ese movimiento ordenado de electrones es justamente la corriente eléctrica.',
      'En el espacio, los ingenieros agrupan cientos o miles de celdas en alas muy amplias y delgadas orientadas hacia el Sol. Cuanta más superficie iluminada tengan, más electricidad pueden producir para los sistemas vitales y los experimentos de los astronautas.',
      'Aquí va un dato increíble respaldado por la NASA: las grandes alas solares de la Estación Espacial Internacional recogen luz durante la parte iluminada de cada órbita y no solo alimentan la estación al instante, sino que también cargan baterías potentes para mantener todo funcionando cuando la nave cruza por la sombra de la Tierra cada noventa minutos.',
      'Incluso, la NASA y sus socios han instalado paneles solares modernos que se desenrollan en órbita, aumentando la capacidad total de energía eléctrica de la estación de unos ciento sesenta kilovatios hasta cerca de doscientos quince kilovatios. ¡Todo gracias a transformar luz del Sol en electricidad limpia y constante!',
    ],
    challengeIntroLines: [
      '¡Ahora viene el desafío!',
      'Voy a describir una pieza de esta tecnología, pero no podrán verla todavía.',
      'Escuchen con atención, imaginen su forma y trabajen juntos para dibujarla.',
      'Cuando termine mi descripción, tendrán dos minutos para completar su dibujo.',
      '¿Preparados?',
    ],
    audioDescriptionLines: [
      'Imaginen una estructura muy ancha y delgada, orientada en posición horizontal.',
      'Su forma general es rectangular y alargada, dividida en varias secciones más pequeñas del mismo tamaño.',
      'Las secciones están organizadas en filas y columnas, como una cuadrícula ordenada de dos filas de alto por seis columnas de ancho.',
      'Entre ellas pueden observarse líneas rectas horizontales y verticales que separan con claridad cada panel.',
      'En el lado izquierdo, la estructura rectangular está sostenida por un soporte recto que la conecta con una pieza cilíndrica del resto del equipo.',
      'Dibujen primero la forma rectangular general y su soporte izquierdo, y después agreguen sus divisiones interiores en filas y columnas.',
    ],
    comparisonCriteria: [
      {
        id: 'shape',
        label: '1. Forma general',
        detail: '¿Dibujaron una estructura rectangular ancha, alargada y delgada?',
      },
      {
        id: 'orientation',
        label: '2. Posición y orientación de los componentes',
        detail:
          '¿El arreglo está horizontal y el soporte del lado izquierdo conecta con el cuerpo principal?',
      },
      {
        id: 'proportions',
        label: '3. Proporciones relativas',
        detail:
          '¿El rectángulo es claramente más ancho que alto y las celdas mantienen tamaños parecidos?',
      },
      {
        id: 'details',
        label: '4. Detalles importantes',
        detail:
          '¿Están presentes las líneas rectas en cuadrícula (2 filas por 6 columnas) que separan los paneles?',
      },
      {
        id: 'resemblance',
        label: '5. Parecido general',
        detail:
          'Al comparar todo el dibujo con el esquema de referencia, ¿se reconoce la pieza completa?',
      },
    ],
    scientificExplanation: {
      whatPieceIs:
        'La pieza dibujada representa un ala simplificada de arreglo solar fotovoltaico espacial con su brazo de soporte estructural.',
      functionPerformed:
        'Captura la luz solar sobre una gran superficie plana y la convierte directamente en corriente eléctrica continua para alimentar los equipos y cargar baterías.',
      howItConnects:
        'El brazo de soporte mecánico fija el marco rectangular al módulo o armazón principal de la nave y conduce la energía eléctrica hacia los distribuidores y baterías internas.',
      whyDesignMatters:
        'Su forma ancha y delgada maximiza el área expuesta al Sol manteniendo poco peso para el lanzamiento, mientras la división modular en filas y columnas permite conectar celdas en circuitos confiables y resistentes.',
      detailsToRecognize: [
        'Contorno rectangular ancho y delgado orientado horizontalmente.',
        'División interna regular en cuadrícula (2 filas × 6 columnas) mediante líneas rectas.',
        'Soporte lateral que une la estructura solar con el módulo cilíndrico del equipo.',
      ],
      scientificFact:
        'La Estación Espacial Internacional combina arreglos solares rígidos originales con nuevos arreglos desplegables IROSA instalados durante caminatas espaciales para superar los 215 kilovatios de potencia disponible.',
    },
    reflectionQuestions: [
      '¿Qué detalles fueron fáciles de imaginar?',
      '¿Qué partes fueron difíciles de dibujar?',
      '¿Cómo se organizaron para trabajar en equipo?',
      '¿Qué aprendieron sobre esta tecnología espacial?',
    ],
    nasaSource: {
      title: 'International Space Station — Solar Arrays & Electrical Power System',
      organization: 'NASA (National Aeronautics and Space Administration)',
      url: 'https://www.nasa.gov/mission/international-space-station/',
      publicationDate: '2025–2026',
      deploymentStatus: 'operating_in_space',
      deploymentLabel: 'Tecnología actualmente en uso en el espacio',
    },
  },
  {
    id: 'ep-02-water-recovery',
    order: 2,
    category: 'water_recovery',
    categoryLabel: 'Recuperación de agua',
    status: 'coming_soon',
    title: '💧 Cada gota cuenta en órbita',
    shortTopic:
      'Cómo se recupera, filtra y purifica el agua a bordo de la Estación Espacial Internacional.',
    drawingChallengeSummary:
      'Esquema educativo simplificado de un módulo procesador y filtrador de agua en circuito cerrado.',
    estimatedMinutes: '12–15 min',
    targetPieceTitle: 'Módulo de recuperación y filtración de agua',
    referenceKindLabel: 'Representación educativa simplificada',
    podcastTitle: 'Próximamente · El ciclo cerrado del agua espacial',
    podcastSegments: [],
    challengeIntroLines: [],
    audioDescriptionLines: [],
    comparisonCriteria: [],
    scientificExplanation: {
      whatPieceIs: 'Módulo educativo de recuperación de agua en preparación.',
      functionPerformed:
        'Recupera humedad ambiental y agua usada mediante filtración multietapa y destilación en microgravedad.',
      howItConnects:
        'Se enlaza con los tanques de agua limpia y los sistemas de control ambiental y soporte vital (ECLSS).',
      whyDesignMatters:
        'Alcanzar cerca del 98 % de recuperación reduce drásticamente el agua que debe enviarse desde la Tierra.',
      detailsToRecognize: [],
      scientificFact:
        'La NASA demostró en la Estación Espacial Internacional una tasa de recuperación cercana al 98 % del agua llevada y recolectada a bordo.',
    },
    reflectionQuestions: [],
    nasaSource: {
      title: 'NASA Achieves Water Recovery Milestone on International Space Station',
      organization: 'NASA · ISS Research',
      url: 'https://www.nasa.gov/missions/station/iss-research/nasa-achieves-water-recovery-milestone-on-international-space-station/',
      publicationDate: '2023',
      deploymentStatus: 'operating_in_space',
      deploymentLabel: 'Tecnología actualmente en uso en el espacio',
    },
  },
  {
    id: 'ep-03-space-plants',
    order: 3,
    category: 'plant_growth',
    categoryLabel: 'Cultivos espaciales',
    status: 'coming_soon',
    title: '🌱 Huertas bajo luz rosa en microgravedad',
    shortTopic:
      'El sistema Veggie de la NASA y la investigación para cultivar plantas comestibles en el espacio.',
    drawingChallengeSummary:
      'Unidad simplificada de crecimiento vegetal con panel superior LED, cámara desplegable y almohadillas de cultivo.',
    estimatedMinutes: '12–15 min',
    targetPieceTitle: 'Unidad de crecimiento vegetal Veggie',
    referenceKindLabel: 'Representación educativa simplificada',
    podcastTitle: 'Próximamente · Cultivar hojas frescas en órbita',
    podcastSegments: [],
    challengeIntroLines: [],
    audioDescriptionLines: [],
    comparisonCriteria: [],
    scientificExplanation: {
      whatPieceIs: 'Unidad educativa de cultivo espacial en preparación.',
      functionPerformed:
        'Proporciona luz LED controlada y sustrato en almohadillas para hacer crecer plantas sin gravedad habitual.',
      howItConnects:
        'Usa energía eléctrica de la estación y agua controlada para aportar alimento fresco y estudio botánico.',
      whyDesignMatters:
        'Sin gravedad, el agua y las raíces necesitan guía física y lumínica equilibrada para no asfixiarse.',
      detailsToRecognize: [],
      scientificFact:
        'Veggie combina LED rojos, azules y verdes que dan a la cámara un característico brillo magenta mientras crecen lechugas, mostaza y flores zinnia.',
    },
    reflectionQuestions: [],
    nasaSource: {
      title: 'Veggie Plant Growth System Activated on International Space Station',
      organization: 'NASA · Biological and Physical Sciences',
      url: 'https://www.nasa.gov/history/veggie-plant-growth-system-activated-on-international-space-station/',
      publicationDate: '2014–2024',
      deploymentStatus: 'operating_in_space',
      deploymentLabel: 'Tecnología actualmente en uso en el espacio',
    },
  },
  {
    id: 'ep-04-oxygen-generation',
    order: 4,
    category: 'oxygen_generation',
    categoryLabel: 'Generación de oxígeno',
    status: 'coming_soon',
    title: '🫧 Aire respirable a partir de agua',
    shortTopic:
      'Cómo los sistemas de generación de oxígeno producen aire respirable para la tripulación.',
    drawingChallengeSummary:
      'Representación educativa simplificada de un ensamblaje funcional de electrólisis y distribución de oxígeno.',
    estimatedMinutes: '12–15 min',
    targetPieceTitle: 'Módulo generador de oxígeno (OGS)',
    referenceKindLabel: 'Representación educativa simplificada',
    podcastTitle: 'Próximamente · Respirar en el vacío espacial',
    podcastSegments: [],
    challengeIntroLines: [],
    audioDescriptionLines: [],
    comparisonCriteria: [],
    scientificExplanation: {
      whatPieceIs: 'Ensamblaje educativo de generación de oxígeno en preparación.',
      functionPerformed:
        'Separa moléculas de agua mediante electricidad (electrólisis) para liberar oxígeno respirable a la cabina.',
      howItConnects:
        'Recibe agua purificada y electricidad de los paneles solares dentro del sistema ECLSS de soporte vital.',
      whyDesignMatters:
        'Permite renovar el aire continuamente sin depender únicamente de tanques de oxígeno enviados desde la Tierra.',
      detailsToRecognize: [],
      scientificFact:
        'En la Estación Espacial Internacional, el Sistema de Generación de Oxígeno forma parte del conjunto ECLSS que recicla aire y agua de manera integrada.',
    },
    reflectionQuestions: [],
    nasaSource: {
      title: 'Environmental Control and Life Support Systems (ECLSS)',
      organization: 'NASA · International Space Station',
      url: 'https://www.nasa.gov/mission/international-space-station/iss-cetf/environmental-control-and-life-support-systems-eclss/',
      deploymentStatus: 'operating_in_space',
      deploymentLabel: 'Tecnología actualmente en uso en el espacio',
    },
  },
];

const EN_EPISODES: readonly TechnologyEpisodeRecord[] = [
  {
    id: 'ep-01-solar-panels',
    order: 1,
    category: 'solar_power',
    categoryLabel: 'Solar Power',
    status: 'available',
    title: '⚡ Energy That Comes From the Sun',
    shortTopic:
      'How photovoltaic solar arrays generate electricity for spacecraft and space stations.',
    drawingChallengeSummary:
      'A simplified rectangular solar array section organized into a grid with its mounting support.',
    estimatedMinutes: '12–15 min',
    targetDiagramId: 'solar_array_wing',
    targetPieceTitle: 'Photovoltaic Solar Array Wing (Simplified Structure)',
    referenceKindLabel: 'Simplified educational representation',
    podcastTitle: 'Science Podcast · Catching Sunlight in Space',
    podcastSegments: [
      'Hello again, crew! I am NAUTI. Today, let us imagine how a home or science laboratory works while floating hundreds of kilometers above Earth, like the International Space Station.',
      'Up there, we cannot plug a giant power cord into a power plant on Earth, and carrying huge tanks of heavy fuel would be far too costly. So where does the electricity come from to power the lights, clean the air, recycle water, and run science computers?',
      'The answer shines brightly every single day: the Sun! Many spacecraft and space stations use large structures called photovoltaic solar panels or solar arrays. Each array is made of many smaller units called photovoltaic cells.',
      'How do those cells work? Even though the name sounds big, the idea is wonderfully clear: "photo" means light, and "voltaic" relates to electricity. When tiny packets of energy from sunlight hit special materials inside each cell—such as silicon—they nudge tiny electric charges called electrons into motion. That steady flow of moving electrons is electricity!',
      'In space, engineers group hundreds or thousands of cells into very wide, thin wings pointed toward the Sun. The more sunlit surface they expose, the more electricity they can generate for life-support systems and astronaut experiments.',
      'Here is an amazing NASA-supported fact: the International Space Station’s giant solar wings gather sunlight during the sunlit part of every orbit—not only powering the station right away, but also charging heavy-duty batteries so systems keep running each time the station passes through Earth’s shadow every ninety minutes.',
      'NASA and its partners have also installed modern roll-out solar arrays in orbit, boosting the station’s total electrical power generation capacity from roughly 160 kilowatts to around 215 kilowatts. All from turning sunlight into clean, reliable electricity!',
    ],
    challengeIntroLines: [
      'Now comes the challenge!',
      'I am going to describe one piece of this technology, and you will not be able to see it yet.',
      'Listen carefully, picture its shape in your mind, and work together with your team to draw it.',
      'Once my description finishes, you will have two minutes to complete your drawing.',
      'Are you ready?',
    ],
    audioDescriptionLines: [
      'Imagine a very wide and thin structure oriented horizontally.',
      'Its overall shape is a long rectangle divided into several smaller, equal sections.',
      'The sections are organized in rows and columns, like an orderly grid two rows tall by six columns wide.',
      'Between the sections, straight horizontal and vertical lines clearly separate every panel.',
      'On the left side, the rectangular structure is held by a straight support arm that connects it to a cylindrical equipment hub.',
      'Draw the overall rectangular outline and its left support first, and then add the interior grid divisions in rows and columns.',
    ],
    comparisonCriteria: [
      {
        id: 'shape',
        label: '1. Overall shape',
        detail: 'Did your team draw a wide, thin, elongated rectangular structure?',
      },
      {
        id: 'orientation',
        label: '2. Position and orientation of components',
        detail:
          'Is the array oriented horizontally with the left support connecting to the equipment hub?',
      },
      {
        id: 'proportions',
        label: '3. Relative proportions',
        detail:
          'Is the rectangle clearly much wider than it is tall, with evenly sized cell sections?',
      },
      {
        id: 'details',
        label: '4. Important details',
        detail:
          'Are the straight grid lines dividing the array into 2 rows and 6 columns clearly visible?',
      },
      {
        id: 'resemblance',
        label: '5. Overall resemblance',
        detail:
          'When comparing your full drawing with the reference diagram, is the complete piece recognizable?',
      },
    ],
    scientificExplanation: {
      whatPieceIs:
        'The piece you drew represents a simplified spacecraft photovoltaic solar array wing with its structural mounting arm.',
      functionPerformed:
        'It captures sunlight across a wide flat surface and converts light directly into electrical current to power onboard equipment and charge batteries.',
      howItConnects:
        'The mechanical support arm anchors the rectangular frame to the main station hub and routes electrical power into internal power distributors and batteries.',
      whyDesignMatters:
        'A wide, thin geometry maximizes sunlit surface area while keeping launch weight low, and organizing cells into rows and columns allows reliable electrical connections.',
      detailsToRecognize: [
        'Wide, thin horizontal rectangular frame.',
        'Regular internal grid (2 rows × 6 columns) separated by straight divider lines.',
        'Left structural support arm connecting the array to the cylindrical equipment body.',
      ],
      scientificFact:
        'The International Space Station combines original rigid solar wings with newer IROSA roll-out solar arrays installed during spacewalks to reach roughly 215 kilowatts of total power.',
    },
    reflectionQuestions: [
      'Which details were easy to picture in your mind?',
      'Which parts were challenging to draw?',
      'How did your team organize yourselves to collaborate?',
      'What did you learn about this space technology?',
    ],
    nasaSource: {
      title: 'International Space Station — Solar Arrays & Electrical Power System',
      organization: 'NASA (National Aeronautics and Space Administration)',
      url: 'https://www.nasa.gov/mission/international-space-station/',
      publicationDate: '2025–2026',
      deploymentStatus: 'operating_in_space',
      deploymentLabel: 'Currently operating in space',
    },
  },
  {
    id: 'ep-02-water-recovery',
    order: 2,
    category: 'water_recovery',
    categoryLabel: 'Water Recovery',
    status: 'coming_soon',
    title: '💧 Every Drop Counts in Orbit',
    shortTopic:
      'How water is recovered, filtered, and purified aboard the International Space Station.',
    drawingChallengeSummary:
      'Simplified educational diagram of a closed-loop water-processing module.',
    estimatedMinutes: '12–15 min',
    targetPieceTitle: 'Water Recovery & Filtration Module',
    referenceKindLabel: 'Simplified educational representation',
    podcastTitle: 'Coming Soon · The Closed Water Cycle in Orbit',
    podcastSegments: [],
    challengeIntroLines: [],
    audioDescriptionLines: [],
    comparisonCriteria: [],
    scientificExplanation: {
      whatPieceIs: 'Educational water recovery module coming soon.',
      functionPerformed:
        'Recovers cabin humidity and used water through multi-stage filtration and distillation in microgravity.',
      howItConnects:
        'Connects to clean water tanks and the Environmental Control and Life Support System (ECLSS).',
      whyDesignMatters:
        'Reaching ~98% water recovery dramatically lowers how much water must be launched from Earth.',
      detailsToRecognize: [],
      scientificFact:
        'NASA demonstrated approximately 98% water recovery aboard the International Space Station using advanced processing hardware.',
    },
    reflectionQuestions: [],
    nasaSource: {
      title: 'NASA Achieves Water Recovery Milestone on International Space Station',
      organization: 'NASA · ISS Research',
      url: 'https://www.nasa.gov/missions/station/iss-research/nasa-achieves-water-recovery-milestone-on-international-space-station/',
      publicationDate: '2023',
      deploymentStatus: 'operating_in_space',
      deploymentLabel: 'Currently operating in space',
    },
  },
  {
    id: 'ep-03-space-plants',
    order: 3,
    category: 'plant_growth',
    categoryLabel: 'Space Plant Growth',
    status: 'coming_soon',
    title: '🌱 Pink-Lit Gardens in Microgravity',
    shortTopic:
      "NASA's Veggie plant growth system and research into growing fresh crops in space.",
    drawingChallengeSummary:
      'Simplified plant growth unit with top LED panel, collapsible chamber, and plant pillows.',
    estimatedMinutes: '12–15 min',
    targetPieceTitle: 'Veggie Plant Growth Unit',
    referenceKindLabel: 'Simplified educational representation',
    podcastTitle: 'Coming Soon · Growing Fresh Greens in Orbit',
    podcastSegments: [],
    challengeIntroLines: [],
    audioDescriptionLines: [],
    comparisonCriteria: [],
    scientificExplanation: {
      whatPieceIs: 'Space plant growth unit coming soon.',
      functionPerformed:
        'Provides controlled LED lighting and pillowed rooting substrate for crops growing in microgravity.',
      howItConnects:
        'Draws station electricity and carefully managed water for food production and botany research.',
      whyDesignMatters:
        'Without normal Earth gravity, water and roots need balanced physical and light cues.',
      detailsToRecognize: [],
      scientificFact:
        'Veggie uses red, blue, and green LEDs that give the chamber a magenta glow while growing lettuce, mustard greens, and zinnias.',
    },
    reflectionQuestions: [],
    nasaSource: {
      title: 'Veggie Plant Growth System Activated on International Space Station',
      organization: 'NASA · Biological and Physical Sciences',
      url: 'https://www.nasa.gov/history/veggie-plant-growth-system-activated-on-international-space-station/',
      publicationDate: '2014–2024',
      deploymentStatus: 'operating_in_space',
      deploymentLabel: 'Currently operating in space',
    },
  },
  {
    id: 'ep-04-oxygen-generation',
    order: 4,
    category: 'oxygen_generation',
    categoryLabel: 'Oxygen Generation',
    status: 'coming_soon',
    title: '🫧 Breathable Air From Water',
    shortTopic:
      'How oxygen generation technologies supply breathable air for astronauts.',
    drawingChallengeSummary:
      'Simplified educational representation of an electrolysis and oxygen distribution assembly.',
    estimatedMinutes: '12–15 min',
    targetPieceTitle: 'Oxygen Generation System (OGS)',
    referenceKindLabel: 'Simplified educational representation',
    podcastTitle: 'Coming Soon · Making Breathable Air in Space',
    podcastSegments: [],
    challengeIntroLines: [],
    audioDescriptionLines: [],
    comparisonCriteria: [],
    scientificExplanation: {
      whatPieceIs: 'Oxygen generation assembly coming soon.',
      functionPerformed:
        'Uses electricity to split water molecules through electrolysis and release breathable oxygen.',
      howItConnects:
        'Receives purified water and solar electrical power inside the integrated ECLSS life-support loop.',
      whyDesignMatters:
        'Continuously renews cabin air instead of relying solely on resupply oxygen tanks from Earth.',
      detailsToRecognize: [],
      scientificFact:
        'On the International Space Station, the Oxygen Generation System works inside ECLSS alongside water recovery and carbon dioxide scrubbing.',
    },
    reflectionQuestions: [],
    nasaSource: {
      title: 'Environmental Control and Life Support Systems (ECLSS)',
      organization: 'NASA · International Space Station',
      url: 'https://www.nasa.gov/mission/international-space-station/iss-cetf/environmental-control-and-life-support-systems-eclss/',
      deploymentStatus: 'operating_in_space',
      deploymentLabel: 'Currently operating in space',
    },
  },
];

const GN_EPISODES: readonly TechnologyEpisodeRecord[] = [
  {
    id: 'ep-01-solar-panels',
    order: 1,
    category: 'solar_power',
    categoryLabel: 'Kuarahy tendyry',
    status: 'available',
    title: '⚡ Tendyry oúva Kuarahýgui',
    shortTopic:
      'Mba’éichapa umi panel solar fotovoltaico ojapo tendyry nave ha estación arapýpe.',
    drawingChallengeSummary:
      'Panel solar rectángulo michĩmíva oñemohendáva cuadrícula-pe ha oguerekóva ijyke joajuha.',
    estimatedMinutes: '12–15 min',
    targetDiagramId: 'solar_array_wing',
    targetPieceTitle: 'Panel solar fotovoltaico pepo (ta’ãnga mombykypyre)',
    referenceKindLabel: "Ta'ãnga mbo'epy mombykypyre",
    podcastTitle: 'Podcast tembikuaareka · Ñambyaty kuarahy resape arapýpe',
    podcastSegments: [
      '¡Mba’éichapa jey, aty! Che ha’e NAUTI. Ko ára roipota peimo’ã mba’éichapa oiko peteĩ óga térã laboratorio ovevéva yvate arapýpe, Estación Espacial Internacional-icha.',
      'Upépe yvate ndaikatúi ñambojoaju peteĩ cable puku Yvýgui, ha jagueraha heta combustible ipohýi ha hepyetereíne. Upéicharõ, ¿moõguipa osẽ tendyry omyendy hag̃ua tesape, omopotĩ y ha omboguata computadora-kuéra?',
      'Mbohovái omimbíva ko ára pukukue yvágape: ¡Kuarahy! Heta nave ha estación oiporu tembiporu tuicháva hérava panel solar fotovoltaico. Peteĩteĩ panel oguereko heta pehẽngue michĩva hérava celda fotovoltaica.',
      '¿Mba’éichapa omba’apo ko’ã celda? Héra ipukúramo jepe, iñakãrapu’ã hesakã: "foto" he’ise tesape, ha "voltaico" tendyry. Kuarahy resape ohupytývo silicio ha mba’e porã oĩva celda ryepýpe, omyaña umi partícula michĩva hérava electrón oku’e hag̃ua. Upe syry oku’éva ha’e hína tendyry.',
      'Arapýpe, ingeniero-kuéra ombyaty heta celda umi pepo puku ha po’ípe omañáva Kuarahy gotyo. Tuichavévo upe ape oguahẽhápe tesape, hetave tendyry ojapo astronauta-kuéra rembiaporã.',
      'Kóva peteĩ marandu añetegua NASA ohechaukáva: Estación Espacial Internacional panel solar-kuéra ombyaty tesape oikóvo Kuarahy rendýpe, ha omomyenyhẽ avei batería mbarete ani hag̃ua opa tendyry estación ohasávo Yvy kuarahy’ãme cada noventa minuto.',
      'Avei NASA ha iñirũnguéra omoĩ panel solar pyahu ojeipysóva arapýpe, ohupíva tendyry apopyre 160 kilovatio-gui 215 kilovatio rupi. ¡Opaite mba’e Kuarahy resape rupive!',
    ],
    challengeIntroLines: [
      '¡Ko’ág̃a ou ñeha’ã!',
      'Amombe’úta peẽme peteĩ pehẽngue ko tembiporu rehegua, péro ndaikatúi gueteri pehecha.',
      'Pehendu porãke, peimo’ã pende akãme ha pemba’apo oñondive pehai hag̃ua.',
      'Amohu’ãvo che ñemombe’u, peguerekóta mokõi minuto pemohu’ã hag̃ua pende ta’ãnga.',
      '¿Peĩmbámapa?',
    ],
    audioDescriptionLines: [
      'Peimo’ã peteĩ tembiporu puku ha po’i, oñembohasáva yvyke gotyo (horizontal).',
      'Hete tuicháva ha’e peteĩ rectángulo puku oñemboja’óva heta pehẽngue michĩvéva peteĩchaguápe.',
      'Umi pehẽngue oñemohenda fila ha columna-pe, peteĩ cuadrícula-icha oguerekóva mokõi fila yvatekue ha poteĩ columna pukukue.',
      'Imbytépe ojekuaa porã umi línea karẽ’ỹva (recta) oipe’áva peteĩteĩ panel.',
      'Asu gotyo (lado izquierdo), pe rectángulo ojepytaso peteĩ jyva (soporte) pukúre ombojoajúva chupe ambue tembiporu cilindro-pe.',
      'Pehai raẽ pe rectángulo tuicháva ha isojoko asu gotyo, ha uperire pemoĩ umi división ryepygui fila ha columna-pe.',
    ],
    comparisonCriteria: [
      {
        id: 'shape',
        label: '1. Hete tuicháva (forma general)',
        detail: '¿Pehaípa peteĩ rectángulo puku ha po’i?',
      },
      {
        id: 'orientation',
        label: '2. Tenda ha ñembohasa (posición y orientación)',
        detail:
          '¿Oĩpa horizontal ha pe soporte asu gotyo ojoajúpa tembiporu apu’a rehe?',
      },
      {
        id: 'proportions',
        label: '3. Tuichakue joja (proporciones)',
        detail:
          '¿Ijyke pukuvépa ijyvatekuégui ha umi celda tuichakue ojoguaitepa?',
      },
      {
        id: 'details',
        label: '4. Mba’e michĩva iñimportánteva',
        detail:
          '¿Ojekuaápa umi línea recta cuadrícula-pe (2 fila × 6 columna) oipe’áva umi panel?',
      },
      {
        id: 'resemblance',
        label: '5. Ojoguápa opaite mba’e',
        detail:
          'Pembojojávo pende ta’ãnga ta’ãnga techaukaha ndive, ¿ojekuaa porãpa pe pehẽngue?',
      },
    ],
    scientificExplanation: {
      whatPieceIs:
        'Pe ta’ãnga pehaíva ohechauka peteĩ panel solar fotovoltaico pepo mombykypyre ha ijyva mbojoajuha.',
      functionPerformed:
        'Ombyaty kuarahy resape ape tuichávare ha omoambue tendyrýpe omyendy hag̃ua tembiporu ha batería.',
      howItConnects:
        'Pe jyva mbojoajuha ombopyta panel rectángulo nave retépe ha ogueraha tendyry batería ha ambue sistema-pe.',
      whyDesignMatters:
        'Ipuku ha ipo’ígui ombyaty hetave tesape pohýi’ỹre ojegueraha hag̃ua arapýpe, ha iñemohenda cuadrícula-pe ombojoaju porã umi celda.',
      detailsToRecognize: [
        'Rectángulo puku ha po’i oĩva horizontal-pe.',
        'Ñemboja’o joja cuadrícula-pe (2 fila × 6 columna) línea recta rupive.',
        'Soporte asu gotyo ombojoajúva panel pe tembiporu cilindro rehe.',
      ],
      scientificFact:
        'Estación Espacial Internacional oiporu panel solar tuicháva ha avei panel pyahu ojeipysóva IROSA ohupyty hag̃ua 215 kilovatio rupi.',
    },
    reflectionQuestions: [
      '¿Mba’e mba’épa hasy’ỹ kuri peimo’ã hag̃ua?',
      '¿Mba’e pehẽnguépa hasyve kuri pehai hag̃ua?',
      '¿Mba’éichapa peñemohenda pemba’apo hag̃ua oñondive atýpe?',
      '¿Mba’épa peikuaa pyahu ko tembiporu arapy reheguágui?',
    ],
    nasaSource: {
      title: 'International Space Station — Solar Arrays & Electrical Power System',
      organization: 'NASA (National Aeronautics and Space Administration)',
      url: 'https://www.nasa.gov/mission/international-space-station/',
      publicationDate: '2025–2026',
      deploymentStatus: 'operating_in_space',
      deploymentLabel: 'Tembiporu oiporúva ko’ág̃a arapýpe',
    },
  },
  {
    id: 'ep-02-water-recovery',
    order: 2,
    category: 'water_recovery',
    categoryLabel: 'Y ñemopotĩ jey',
    status: 'coming_soon',
    title: '💧 Y ñemopotĩ jey Estación Espacial-pe',
    shortTopic:
      'Mba’éichapa oñembyaty ha oñemopotĩ jey y Estación Espacial Internacional ryepýpe.',
    drawingChallengeSummary:
      'Ta’ãnga mbo’epy mombykypyre peteĩ módulo omopotĩva y.',
    estimatedMinutes: '12–15 min',
    targetPieceTitle: 'Módulo y ñemopotĩ jey rehegua',
    referenceKindLabel: "Ta'ãnga mbo'epy mombykypyre",
    podcastTitle: 'Ko’ẽrõite · Y ñemopotĩ jey arapýpe',
    podcastSegments: [],
    challengeIntroLines: [],
    audioDescriptionLines: [],
    comparisonCriteria: [],
    scientificExplanation: {
      whatPieceIs: 'Módulo y ñemopotĩ jey ojejapóvahína.',
      functionPerformed: 'Omopotĩ jey y oiporúva aty ha yvytu rykue microgravedad-pe.',
      howItConnects: 'Ojoaju tanque y potĩ ha sistema soporte vital (ECLSS) rehe.',
      whyDesignMatters: 'Ohupytývo 98 % rupi ndatekotevẽi ojegueraha heta y Yvýgui.',
      detailsToRecognize: [],
      scientificFact:
        'NASA ohechauka Estación Espacial Internacional-pe oñemopotĩ jey 98 % rupi pe y ojeporúva.',
    },
    reflectionQuestions: [],
    nasaSource: {
      title: 'NASA Achieves Water Recovery Milestone on International Space Station',
      organization: 'NASA · ISS Research',
      url: 'https://www.nasa.gov/missions/station/iss-research/nasa-achieves-water-recovery-milestone-on-international-space-station/',
      publicationDate: '2023',
      deploymentStatus: 'operating_in_space',
      deploymentLabel: 'Tembiporu oiporúva ko’ág̃a arapýpe',
    },
  },
  {
    id: 'ep-03-space-plants',
    order: 3,
    category: 'plant_growth',
    categoryLabel: 'Ka’avo ñemity arapýpe',
    status: 'coming_soon',
    title: '🌱 Ka’avo ñemity Veggie tesape pytã-hovỹ ndive',
    shortTopic:
      'Sistema Veggie NASA mba’éva ha mba’éichapa oñemitỹ ka’avo arapýpe.',
    drawingChallengeSummary:
      'Tembiporu mombykypyre ka’avo ñemongakuaarã LED tesape ndive.',
    estimatedMinutes: '12–15 min',
    targetPieceTitle: 'Unidad Veggie ka’avo ñemitỹrã',
    referenceKindLabel: "Ta'ãnga mbo'epy mombykypyre",
    podcastTitle: 'Ko’ẽrõite · Ka’avo ñemity microgravedad-pe',
    podcastSegments: [],
    challengeIntroLines: [],
    audioDescriptionLines: [],
    comparisonCriteria: [],
    scientificExplanation: {
      whatPieceIs: 'Unidad Veggie ojejapóvahína.',
      functionPerformed: 'Ome’ẽ tesape LED ha y ñangareko porã ka’avokuérape arapýpe.',
      howItConnects: 'Oiporu tendyry ha y estación mba’éva tembi’u pyahurã.',
      whyDesignMatters: 'Gravedad michĩhápe umi hapo oikotevẽ ñangareko ijojáva.',
      detailsToRecognize: [],
      scientificFact:
        'Veggie oiporu LED pytã, hovy ha hovyũ omongakuaa hag̃ua lechuga ha zinnia yvoty.',
    },
    reflectionQuestions: [],
    nasaSource: {
      title: 'Veggie Plant Growth System Activated on International Space Station',
      organization: 'NASA · Biological and Physical Sciences',
      url: 'https://www.nasa.gov/history/veggie-plant-growth-system-activated-on-international-space-station/',
      publicationDate: '2014–2024',
      deploymentStatus: 'operating_in_space',
      deploymentLabel: 'Tembiporu oiporúva ko’ág̃a arapýpe',
    },
  },
  {
    id: 'ep-04-oxygen-generation',
    order: 4,
    category: 'oxygen_generation',
    categoryLabel: 'Oxígeno apopyre',
    status: 'coming_soon',
    title: '🫧 Yvytu pyahu y rupive',
    shortTopic:
      'Mba’éichapa umi sistema ojapo oxígeno oikotevẽva astronauta-kuéra.',
    drawingChallengeSummary:
      'Ta’ãnga mombykypyre peteĩ ensamblaje ojapóva oxígeno.',
    estimatedMinutes: '12–15 min',
    targetPieceTitle: 'Módulo generador de oxígeno (OGS)',
    referenceKindLabel: "Ta'ãnga mbo'epy mombykypyre",
    podcastTitle: 'Ko’ẽrõite · Yvytu pyahu arapýpe',
    podcastSegments: [],
    challengeIntroLines: [],
    audioDescriptionLines: [],
    comparisonCriteria: [],
    scientificExplanation: {
      whatPieceIs: 'Módulo oxígeno apoha ojejapóvahína.',
      functionPerformed: 'Omboja’o y tendyry rupive ojapo hag̃ua oxígeno pyahu.',
      howItConnects: 'Ojoaju y potĩ ha panel solar tendyry ndive sistema ECLSS ryepýpe.',
      whyDesignMatters: 'Omombarete yvytu oñepytuhẽva ojegueraha’ỹre heta tanque Yvýgui.',
      detailsToRecognize: [],
      scientificFact:
        'Sistema ECLSS Estación Espacial-pe ombojoaju oxígeno apopyre ha y ñemopotĩ jey.',
    },
    reflectionQuestions: [],
    nasaSource: {
      title: 'Environmental Control and Life Support Systems (ECLSS)',
      organization: 'NASA · International Space Station',
      url: 'https://www.nasa.gov/mission/international-space-station/iss-cetf/environmental-control-and-life-support-systems-eclss/',
      deploymentStatus: 'operating_in_space',
      deploymentLabel: 'Tembiporu oiporúva ko’ág̃a arapýpe',
    },
  },
];

export function getEscuchaEpisodes(
  lang: AppLang,
): readonly TechnologyEpisodeRecord[] {
  if (lang === 'en') return EN_EPISODES;
  if (lang === 'gn-PY') return GN_EPISODES;
  return ES_EPISODES;
}
