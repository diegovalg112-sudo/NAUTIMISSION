/// <reference types="node" />
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const STORE_FILE = path.join(DATA_DIR, 'nasa_scientific_library.json');

const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

const SPANISH_TO_ENGLISH_TERMS: Array<[RegExp, string]> = [
  [/p[eé]rdida [oó]sea/gi, 'bone loss'],
  [/densidad [oó]sea/gi, 'bone density'],
  [/atrofia muscular/gi, 'muscle atrophy'],
  [/m[uú]sculos?/gi, 'muscle'],
  [/huesos?/gi, 'bone'],
  [/respuesta inmune|sistema inmune|respuesta inmunitaria|inmunidad/gi, 'immune response'],
  [/sue[nñ]o|ritmo circadiano/gi, 'sleep circadian'],
  [/crecimiento de plantas|cultivo de plantas|plantas espaciales|invernadero/gi, 'plant growth'],
  [/microgravedad/gi, 'microgravity'],
  [/recuperaci[oó]n de agua|reciclaje de agua|agua/gi, 'water recovery'],
  [/soporte vital/gi, 'life support ECLSS'],
  [/ox[ií]geno/gi, 'oxygen generation'],
  [/energ[ií]a solar|paneles? solares?|arreglos? solares?/gi, 'solar array power'],
  [/bater[ií]as? lunares?|almacenamiento de energ[ií]a/gi, 'lunar power battery'],
  [/polvo lunar|regolito lunar|regolito/gi, 'lunar regolith dust'],
  [/radiaci[oó]n espacial|tormenta solar|radiaci[oó]n/gi, 'space radiation'],
  [/polo sur lunar|artemis|noche lunar/gi, 'lunar south pole Artemis'],
  [/ratones/gi, 'mice Mus musculus'],
  [/c[eé]lulas/gi, 'cells'],
];

function translateSpanishQueryToEnglish(rawQuery: unknown): {
  translatedQuery: string;
  wasTranslated: boolean;
} {
  const trimmed = String(rawQuery || '').trim();
  if (!trimmed) {
    return { translatedQuery: '', wasTranslated: false };
  }
  let next = trimmed;
  for (const [pattern, replacement] of SPANISH_TO_ENGLISH_TERMS) {
    next = next.replace(pattern, replacement);
  }
  next = next.replace(/\s+/g, ' ').trim();
  return {
    translatedQuery: next,
    wasTranslated: next.toLowerCase() !== trimmed.toLowerCase(),
  };
}

function inferCategoryFromText(text: unknown): string {
  const low = String(text || '').toLowerCase();
  if (
    low.includes('water') ||
    low.includes('eclss') ||
    low.includes('oxygen') ||
    low.includes('life support') ||
    low.includes('agua') ||
    low.includes('oxígeno')
  ) {
    return 'agua_soporte_vital';
  }
  if (
    low.includes('solar') ||
    low.includes('power') ||
    low.includes('battery') ||
    low.includes('energía') ||
    low.includes('energy') ||
    low.includes('irosa')
  ) {
    return 'energia';
  }
  if (
    low.includes('bone') ||
    low.includes('muscle') ||
    low.includes('immune') ||
    low.includes('sleep') ||
    low.includes('health') ||
    low.includes('atrophy') ||
    low.includes('radiation') ||
    low.includes('mouse') ||
    low.includes('mice')
  ) {
    return 'salud_espacial';
  }
  return 'investigacion_espacial';
}

const DEFAULT_CATEGORIES = [
  {
    id: 'agua_soporte_vital',
    order: 1,
    icon: '💧',
    accentColor: '#38bdf8',
    labels: {
      es: '1. Agua y soporte vital',
      en: '1. Water & Life Support',
      'gn-PY': '1. Y ha tekove ñangareko',
    },
    descriptions: {
      es: 'Recuperación de agua, purificación de aire, generación de oxígeno y sistemas ECLSS en órbita.',
      en: 'Water recovery, air purification, oxygen generation, and ECLSS systems in orbit.',
      'gn-PY':
        'Y ñemopotĩ jey, yvytu pytu ñembohekove ha tekove ñangareko sistema arapýpe.',
    },
    isDefault: true,
  },
  {
    id: 'energia',
    order: 2,
    icon: '⚡',
    accentColor: '#facc15',
    labels: {
      es: '2. Energía',
      en: '2. Energy',
      'gn-PY': '2. Tendyry',
    },
    descriptions: {
      es: 'Paneles solares fotovoltaicos, arreglos IROSA, almacenamiento en baterías y estrategias de energía lunar.',
      en: 'Photovoltaic solar panels, IROSA arrays, battery storage, and lunar power planning.',
      'gn-PY':
        'Panel solar fotovoltaico, IROSA, batería ñongatu ha tendyry ñemohenda Jasýpe.',
    },
    isDefault: true,
  },
  {
    id: 'salud_espacial',
    order: 3,
    icon: '🩺',
    accentColor: '#48C5B5',
    labels: {
      es: '3. Salud espacial',
      en: '3. Space Health',
      'gn-PY': '3. Tesãi arapýpe',
    },
    descriptions: {
      es: 'Microgravedad, pérdida ósea y muscular, respuesta inmunológica, radiación y ritmos de sueño en el espacio.',
      en: 'Microgravity, bone and muscle changes, immune response, radiation, and sleep in space.',
      'gn-PY':
        "Microgravedad, kangue ha to'o ñemoambue, ñe'ã ñangareko, radiación ha ke arapýpe.",
    },
    isDefault: true,
  },
  {
    id: 'investigacion_espacial',
    order: 4,
    icon: '🔬',
    accentColor: '#a78bfa',
    labels: {
      es: '4. Investigación espacial',
      en: '4. Space Research',
      'gn-PY': '4. Tembikuaareka arapýpe',
    },
    descriptions: {
      es: 'Cultivos en órbita (Veggie), estudios biológicos NASA OSDR, regolito lunar y ciencia abierta.',
      en: 'Orbital plant growth (Veggie), NASA OSDR biology studies, lunar regolith, and open science.',
      'gn-PY':
        "Ka'avo ñemity arapýpe (Veggie), tekove kuaapy NASA OSDR, Jasy yvyku'i ha ciencia abierta.",
    },
    isDefault: true,
  },
];

const INITIAL_SEED_RECORDS = [
  {
    id: 'nasa-iss-water-recovery-2023',
    category: 'agua_soporte_vital',
    topic: 'Recuperación de agua del 98% en la Estación Espacial Internacional',
    scientific_claim:
      'En junio de 2023, la NASA informó que el sistema de soporte vital ambiental (ECLSS) de la Estación Espacial Internacional demostró alcanzar su objetivo de aproximadamente 98% de recuperación de agua en órbita gracias al procesador de salmuera (Brine Processor Assembly).',
    student_explanation:
      'En el espacio no hay ríos ni grifos infinitos, y enviar agua nueva en cohetes desde la Tierra es muy pesado y costoso. Por eso, los astronautas de la Estación Espacial Internacional capturan la humedad de su respiración y sudor, junto con aguas procesadas, y las filtran hasta reutilizar cerca del 98% de toda el agua.',
    why_it_matters:
      'Reciclar casi cada gota de agua permite que las tripulaciones vivan y realicen ciencia en órbita durante meses sin depender de entregas constantes desde la Tierra, y prepara las misiones futuras hacia la Luna y Marte.',
    where_to_use:
      'Puedes relacionar este hecho con la Jornada 3 de Efecto Dominó (cuando decidimos cuidar o posponer los filtros de agua), con el Caso 01 de Detectives de la NASA y con el módulo de agua en Escucha, imagina y construye.',
    source_title:
      'NASA Achieves Water Recovery Milestone on International Space Station',
    source_organization: 'NASA · International Space Station Research',
    source_url:
      'https://www.nasa.gov/missions/station/iss-research/nasa-achieves-water-recovery-milestone-on-international-space-station/',
    source_identifier: 'NASA-ISS-WATER-2023',
    authors: ['NASA Johnson Space Center / ECLSS Team'],
    publication_date: '2023-06-20',
    organism_or_population: 'Tripulación humana y hardware ECLSS a bordo de la EEI',
    research_context:
      'Operación real en microgravedad dentro de la Estación Espacial Internacional bajo condiciones nominales de vuelo y mantenimiento continuo.',
    numerical_values: ['98'],
    units: ['% de recuperación de agua'],
    limitations:
      'El 98% representa una capacidad demostrada bajo las condiciones específicas de operación de la Estación Espacial Internacional; no garantiza automáticamente la misma tasa en cualquier otro hábitat o nave sin equipos equivalentes.',
    verification_status: 'PUBLISHED',
    verified_by: 'Equipo Científico Filómatas LAB',
    verification_date: '2025-11-10',
    related_experiences: [
      'efecto-domino',
      'detectives-de-la-nasa',
      'escucha-imagina-construye',
    ],
    related_content_ids: [
      'efecto-domino:day-3',
      'detectives-de-la-nasa:case-01-water',
      'escucha-imagina-construye:ep-02-water-recovery',
    ],
    language: 'es',
    created_at: '2025-11-10T10:00:00.000Z',
    updated_at: '2025-11-10T10:00:00.000Z',
    source_repository: 'NASA_ISS_RESEARCH',
    localized: {
      en: {
        topic: '98% Water Recovery Milestone Aboard the International Space Station',
        scientific_claim:
          'In June 2023, NASA reported that the International Space Station Environmental Control and Life Support System (ECLSS) demonstrated reaching its goal of roughly 98% water recovery using the Brine Processor Assembly.',
        student_explanation:
          'In space there are no rivers or taps, and launching water from Earth is heavy and expensive. Astronauts aboard the International Space Station capture moisture from breathing and sweat plus wastewater, filtering and purifying it until nearly 98% of the water can be reused safely.',
        why_it_matters:
          'Recycling almost every drop lets crews live and conduct science in orbit for months with far fewer Earth resupply flights, paving the way for long-duration Moon and Mars missions.',
        where_to_use:
          'Connect this fact with Day 3 of Domino Effect (water filter maintenance), Case 01 in NASA Detectives, and the water recovery episode of Listen, Imagine & Build.',
        organism_or_population: 'Human ISS crew & ECLSS flight hardware',
        research_context:
          'Real orbital operation aboard the International Space Station under active maintenance conditions.',
        limitations:
          'Represents a demonstrated capability under specific ISS operating conditions, not an automatic guarantee for every spacecraft or lunar outpost.',
      },
      'gn-PY': {
        topic: '98% Y ñemopotĩ jey Estación Espacial Internacional-pe',
        scientific_claim:
          "Jasypoteĩ 2023-pe, NASA omombe'u sistema ECLSS Estación Espacial Internacional-pe ohechauka og̃uahẽha 98% rupi y ñemopotĩ jey tembiporu Brine Processor Assembly rupive.",
        student_explanation:
          "Arapýpe ndaipóri ysyry ha y jegueru Yvýgui hepy ha ipohýi. Upévare astronauta-kuéra ombyaty pytu, ry'ái ha y oiporuva'ekue omopotĩ jey hag̃ua ha oiporu jey 98% rupi.",
        why_it_matters:
          "Ñamopotĩ jey ramo haimete opaite y, aty ikatu oikove ha ojapo tembikuaareka are arapýpe oha'ãrõ'ỹre heta carga Yvýgui.",
        where_to_use:
          'Ejoaju ko kuaapy Ára 3 Efecto Dominó ndive, Caso 01 Detectives de la NASA ha Escucha, imagina y construye tembiapo ndive.',
        organism_or_population: 'Yvypóra aty ha tembiporu ECLSS EEI-pe',
        research_context:
          'Tembiapo añetegua microgravedad-pe Estación Espacial Internacional ryepýpe.',
        limitations:
          "98% ohechauka mba'e ojejapokuaáva EEI reko tee rupi; ndaha'éi opavave mba'yrumýipe ijeheguínte og̃uahẽtava upeichaitépe.",
      },
    },
  },
  {
    id: 'nasa-iss-solar-irosa-2025',
    category: 'energia',
    topic: 'Arreglos solares fotovoltaicos y paneles desplegables IROSA en la EEI',
    scientific_claim:
      'La Estación Espacial Internacional convierte la luz solar en electricidad mediante alas solares fotovoltaicas y baterías recargables para cruzar cada eclipse orbital, elevando la potencia disponible de ~160 kW hasta ~215 kW con los arreglos desplegables IROSA.',
    student_explanation:
      'A cientos de kilómetros de la Tierra no hay cables eléctricos. Por eso las estaciones espaciales extienden alas gigantes cubiertas de celdas fotovoltaicas que convierten la luz del Sol en electricidad, y además cargan baterías para seguir encendidas cuando pasan por la sombra de la Tierra.',
    why_it_matters:
      'Sin electricidad dejarían de funcionar el aire respirable, el reciclaje de agua, las luces y las computadoras científicas. Mejorar la eficiencia solar permite sumar más experimentos sin aumentar demasiado el peso.',
    where_to_use:
      'Úsalo para analizar la generación de energía en el Episodio 01 (Jornadas 1, 2 y 4) de Efecto Dominó y la pieza tecnológica de Escucha, imagina y construye.',
    source_title:
      'International Space Station — Solar Arrays & Electrical Power System',
    source_organization: 'NASA (National Aeronautics and Space Administration)',
    source_url: 'https://www.nasa.gov/mission/international-space-station/',
    source_identifier: 'NASA-ISS-SOLAR-IROSA',
    authors: ['NASA International Space Station Program'],
    publication_date: '2025-01-15',
    organism_or_population: 'Sistemas de ingeniería espacial en órbita terrestre baja',
    research_context:
      'Operación de ingeniería orbital continua (ciclos de luz/sombra cada ~90 minutos en órbita terrestre baja).',
    numerical_values: ['160', '215', '90'],
    units: ['kW (capacidad base)', 'kW (con IROSA)', 'minutos por órbita'],
    limitations:
      'Las cifras de 160–215 kW corresponden a la arquitectura eléctrica específica de la EEI en órbita terrestre baja; una base lunar enfrenta ciclos de luz y noche distintos (~14 días en muchas zonas).',
    verification_status: 'PUBLISHED',
    verified_by: 'Equipo Científico Filómatas LAB',
    verification_date: '2025-11-10',
    related_experiences: ['efecto-domino', 'escucha-imagina-construye'],
    related_content_ids: [
      'efecto-domino:day-1',
      'efecto-domino:day-4',
      'escucha-imagina-construye:ep-01-solar-panels',
    ],
    language: 'es',
    created_at: '2025-11-10T10:05:00.000Z',
    updated_at: '2025-11-10T10:05:00.000Z',
    source_repository: 'NASA_ISS_RESEARCH',
    localized: {
      en: {
        topic: 'Photovoltaic Solar Arrays & IROSA Roll-Out Wings on the ISS',
        scientific_claim:
          'The International Space Station converts sunlight into electricity using photovoltaic solar arrays paired with rechargeable batteries during orbital eclipses, raising available electrical power from ~160 kW to ~215 kW with IROSA roll-out arrays.',
        student_explanation:
          'Hundreds of kilometers above Earth there are no power lines. Space stations unfold wide solar wings covered in photovoltaic cells that turn sunlight into electricity and charge batteries for the dark side of each 90-minute orbit.',
        why_it_matters:
          'Without electricity, air circulation, water recycling, lights, and laboratory instruments cannot operate. Newer roll-out arrays produce more power with compact launch mass.',
        where_to_use:
          'Link this reference to Domino Effect Days 1 & 4 and the Solar Arrays module in Listen, Imagine & Build.',
        organism_or_population: 'Orbital electrical engineering hardware',
        research_context: 'Low-Earth orbit ISS electrical power architecture.',
        limitations:
          '160–215 kW applies specifically to the ISS power system in low-Earth orbit; lunar surface missions experience multi-day illumination patterns.',
      },
      'gn-PY': {
        topic: 'Panel solar fotovoltaico ha IROSA Estación Espacial-pe',
        scientific_claim:
          'Estación Espacial Internacional ombohasa kuarahy resape tendyrýpe panel solar ha batería rupive, ombotuichávo tendyry ~160 kW-gui ~215 kW peve umi IROSA pyahu reheve.',
        student_explanation:
          "Arapýpe ndaipóri cable tendyrýgui. Upévare estación-kuéra oipysóva ipepo panel solar oguerekóva celda ombohasáva kuarahy resape tendyrýpe ha omyenyhẽ batería pyhare mbyky jave.",
        why_it_matters:
          "Tendyry'ỹre ndaikatúi omba'apo yvytu ñangareko, y ñemopotĩ ni tembiporu tembikuaareka rehegua.",
        where_to_use:
          'Eiporu ko marandu Ára 1 ha 4 Efecto Dominó-pe ha Escucha, imagina y construye-pe.',
        organism_or_population: 'Tembiporu ingeniería arapýpe',
        research_context: 'Tendyry apopy órbita terrestre baja-pe.',
        limitations:
          "160–215 kW ha'e EEI rekópe g̃uarã añoite; Jasýpe kuarahy ha pyhare puku iñambue.",
      },
    },
  },
  {
    id: 'nasa-iss-veggie-plant-growth-2014',
    category: 'investigacion_espacial',
    topic: 'Cultivo de plantas en microgravedad con el sistema Veggie de la NASA',
    scientific_claim:
      'El sistema de crecimiento vegetal Veggie de la NASA utiliza iluminación LED roja, azul y verde y almohadillas especiales para estudiar cómo germinan, crecen y absorben agua las plantas comestibles en microgravedad a bordo de la EEI.',
    student_explanation:
      'En la Tierra, la gravedad hace que el agua baje y las raíces crezcan hacia abajo. En el espacio todo flota, así que las plantas podrían ahogarse si el agua rodea sus raíces. El experimento Veggie de la NASA usa almohadillas especiales y luces LED de colores para ayudar a que lechugas y flores crezcan en órbita.',
    why_it_matters:
      'Cultivar alimentos frescos en el espacio aporta vitaminas y bienestar psicológico a la tripulación y permite entender cómo interactúan agua, raíces y luz fuera de la Tierra.',
    where_to_use:
      'Relaciónalo con el Episodio 03 de Efecto Dominó (alimentos lunares) y con los estudios biológicos sobre crecimiento de plantas en el espacio.',
    source_title:
      'Veggie Plant Growth System Activated on International Space Station',
    source_organization: 'NASA · Biological and Physical Sciences',
    source_url:
      'https://www.nasa.gov/history/veggie-plant-growth-system-activated-on-international-space-station/',
    source_identifier: 'NASA-ISS-VEGGIE-2014',
    authors: ['NASA Kennedy Space Center / Veggie Team'],
    publication_date: '2014-05-08',
    organism_or_population:
      'Plantas comestibles y ornamentales (ej. lechuga Lactuca sativa, zinnia)',
    research_context:
      'Investigación botánica en cámara controlada en microgravedad a bordo de la Estación Espacial Internacional (estudios en plantas, no ensayos clínicos humanos).',
    numerical_values: ['3'],
    units: ['colores principales de LED (rojo, azul, verde)'],
    limitations:
      'Investigación realizada específicamente en especies vegetales seleccionadas dentro de cámaras controladas; los resultados varían según especie, sustrato, ventilación y riego.',
    verification_status: 'PUBLISHED',
    verified_by: 'Equipo Científico Filómatas LAB',
    verification_date: '2025-11-10',
    related_experiences: [
      'efecto-domino',
      'escucha-imagina-construye',
      'detectives-de-la-nasa',
    ],
    related_content_ids: [
      'efecto-domino:ep-03',
      'escucha-imagina-construye:ep-03-space-plants',
      'detectives-de-la-nasa:case-03-plants',
    ],
    language: 'es',
    created_at: '2025-11-10T10:10:00.000Z',
    updated_at: '2025-11-10T10:10:00.000Z',
    source_repository: 'NASA_ISS_RESEARCH',
    localized: {
      en: {
        topic: 'Growing Plants in Microgravity with NASA’s Veggie System',
        scientific_claim:
          'NASA’s Veggie plant growth chamber combines red, blue, and green LED lighting with specialized root pillows to study how edible plants germinate, orient roots, and absorb water in microgravity aboard the ISS.',
        student_explanation:
          'On Earth gravity pulls water downward and guides roots. In orbit water floats and can suffocate plant roots. NASA’s Veggie chamber uses special pillows and colored LED lights so astronauts can grow leafy greens and study plant biology in space.',
        why_it_matters:
          'Fresh space-grown produce adds nutrients and crew morale while teaching scientists how water and roots behave without gravity.',
        where_to_use:
          'Connect with Domino Effect Episode 03 (lunar food production) and Listen, Imagine & Build Episode 03.',
        organism_or_population: 'Plants (e.g., Lactuca sativa red romaine lettuce, zinnia)',
        research_context: 'Botanical microgravity chamber experiment aboard the ISS.',
        limitations:
          'Study conducted in selected plant species inside controlled spaceflight chambers; behaviors differ across plant species and cannot be generalized directly to human physiology.',
      },
      'gn-PY': {
        topic: "Ka'avo ñemity microgravedad-pe NASA Veggie rupive",
        scientific_claim:
          "NASA tembiporu Veggie oiporu tesape LED pytã, hovy ha hovyũ ha mba'e apu'a oñangareko hag̃ua mba'éichapa ka'avo okakuaa ha ho'u y microgravedad-pe EEI ryepýpe.",
        student_explanation:
          "Yvýpe gravedad ogueraha y ha hapo yvýre. Arapýpe y oveve ha ikatu ombopytu'upa ka'avópe. Upévare Veggie oiporu almohadilla ha tesape LED ikatu hag̃ua ka'avo okakuaa órbita-pe.",
        why_it_matters:
          "Tembi'u pyahu arapýpe ome'ẽ vitamina ha vy'a atýpe, ha ombo'e mba'éichapa oiko ka'avo gravedad'ỹre.",
        where_to_use:
          'Ejoaju Efecto Dominó Episodio 03 ha Escucha, imagina y construye Episodio 03 ndive.',
        organism_or_population: "Ka'avo (lechuga Lactuca sativa, zinnia)",
        research_context: "Tembikuaareka ka'avo rehegua microgravedad-pe EEI-pe.",
        limitations:
          "Ko tembikuaareka ojejapo ka'avóre añoite óga ñangarekopyrépe; ndaikatúi oñembohasa ijeheguiete yvypóra rekópe.",
      },
    },
  },
  {
    id: 'nasa-artemis-lunar-illumination-2025',
    category: 'energia',
    topic: 'Iluminación lunar, sombras prolongadas y planificación energética Artemis',
    scientific_claim:
      'En regiones próximas al polo sur lunar, los ángulos bajos del Sol y el relieve del terreno crean zonas con periodos prolongados de sombra o luz cambiante, obligando a diseñar estrategias integradas de generación y almacenamiento eléctrico.',
    student_explanation:
      'En gran parte de la Luna una noche dura cerca de 14 días terrestres seguidos. Cerca del polo sur lunar hay picos que reciben mucha luz y cráteres que permanecen en sombra permanente, así que una base lunar debe combinar paneles bien ubicados y baterías para sobrevivir.',
    why_it_matters:
      'Planificar cuánta energía guardar antes de que llegue la sombra es vital para no apagar la calefacción ni los equipos de agua cuando baja la luz del Sol.',
    where_to_use:
      'Relaciónalo directamente con las Jornadas 1 y 5 de Efecto Dominó en Base Aurora.',
    source_title: 'Integrated Lunar Power Strategy Considerations',
    source_organization: 'NASA Technical Reports Server (NTRS) / Artemis',
    source_url: 'https://ntrs.nasa.gov/citations/20250010948',
    source_identifier: '20250010948',
    authors: ['NASA Lunar Power Architecture Authors'],
    publication_date: '2025-01-01',
    organism_or_population: 'Sistemas energéticos de superficie lunar (Artemis)',
    research_context:
      'Estudio técnico y simulación de arquitectura energética para misiones lunares sostenibles (modelado de ingeniería, no estudio biológico).',
    numerical_values: ['14'],
    units: ['días terrestres aproximados por noche lunar ecuatorial/media'],
    limitations:
      'La duración exacta de la luz y la sombra depende estrechamente de la latitud, elevación local y topografía del cráter; modelos técnicos requieren validación con datos topográficos locales.',
    verification_status: 'PUBLISHED',
    verified_by: 'Equipo Científico Filómatas LAB',
    verification_date: '2025-11-12',
    related_experiences: ['efecto-domino'],
    related_content_ids: ['efecto-domino:day-1', 'efecto-domino:day-5'],
    language: 'es',
    created_at: '2025-11-12T10:00:00.000Z',
    updated_at: '2025-11-12T10:00:00.000Z',
    source_repository: 'NASA_NTRS',
    localized: {
      en: {
        topic: 'Lunar Illumination, Long Shadows & Artemis Power Planning',
        scientific_claim:
          'Near the lunar south pole, low solar angles and crater topography create complex shifting shadows and prolonged dark intervals, requiring integrated power generation and energy storage architectures.',
        student_explanation:
          'Across much of the Moon, a single night lasts about 14 Earth days. Near the lunar south pole, crater rims get long sunlight while deep crater floors stay in dark shadow, so lunar bases need smart battery storage and solar placement.',
        why_it_matters:
          'Saving energy before reduced-light periods keeps life-support heaters and water processors alive when solar power drops.',
        where_to_use: 'Directly supports Days 1 and 5 of Domino Effect at Aurora Base.',
        organism_or_population: 'Lunar surface power systems (Artemis)',
        research_context: 'Engineering mission-planning study and solar illumination modeling.',
        limitations:
          'Illumination varies dramatically by local latitude and crater elevation; engineering simulations must be validated against local site topography.',
      },
      'gn-PY': {
        topic: "Kuarahy resape Jasýpe, kuarahy'ã puku ha Artemis tendyry rape",
        scientific_claim:
          "Jasy polo sur ag̃ui, Kuarahy karapã ha yvytypa'ũ omoheñói kuarahy'ã puku ha tesape iñambuéva, ojeruréva ñemohenda porã tendyry apopy ha ñongatúpe.",
        student_explanation:
          "Heta Jasy rendápe peteĩ pyhare ipuku 14 ára Yvy pegua rupi. Polo sur ag̃ui oĩ yvyty oguerekóva heta kuarahy ha yvytykua pytũ meméva, upévare base Jasýpe oikotevẽ batería mbarete ha panel oĩ porãva.",
        why_it_matters:
          "Ñañongatu tendyry kuarahy oguejy mboyve oñangareko tekove ñangarekóre ha y ñemopotĩre.",
        where_to_use: 'Ojoaju Ára 1 ha Ára 5 Efecto Dominó ndive Base Aurora-pe.',
        organism_or_population: 'Tendyry sistema Jasy ape ári (Artemis)',
        research_context: 'Tembikuaareka ingeniería ha modelo kuarahy resape rehegua.',
        limitations:
          "Kuarahy resape puku odepende tenda ha yvyty reko tee rehe; modelo oikotevẽ jehechajey tenda añeteguápe.",
      },
    },
  },
  {
    id: 'nasa-osdr-osd-342-review',
    category: 'salud_espacial',
    topic: 'Estudio NASA OSDR OSD-342: Respuesta ósea y muscular en vuelo espacial (en revisión)',
    scientific_claim:
      'Conjunto de datos biológicos abiertos OSD-342 (RR-6 / ISS) que investiga cambios transcriptómicos y fisiológicos en tejidos musculoesqueléticos de ratones (Mus musculus) tras vuelo espacial y recuperación.',
    student_explanation:
      'Borrador pendiente de verificación docente: datos del repositorio NASA OSDR sobre cómo la microgravedad afecta músculos y huesos en modelos animales de ratón.',
    why_it_matters:
      'Comprender qué genes y tejidos cambian en microgravedad ayuda a diseñar ejercicio y contramedidas para cuidar la salud en misiones largas.',
    where_to_use: 'Salud espacial · Pendiente de revisión para Traduciendo la ciencia.',
    source_title:
      'Transcriptional profiling of musculoskeletal tissues from mice flown on Rodent Research-6 (OSD-342)',
    source_organization: 'NASA Open Science Data Repository (OSDR)',
    source_url: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-342',
    source_identifier: 'OSD-342',
    authors: ['NASA GeneLab / Rodent Research-6 Investigators'],
    publication_date: '2021-03-15',
    organism_or_population: 'Ratones (Mus musculus) — modelo animal',
    research_context:
      'Estudio en modelo animal (ratones) a bordo de la Estación Espacial Internacional; NO corresponde directamente a ensayos clínicos en humanos sin validación adicional.',
    numerical_values: ['1', '6'],
    units: ['misión Rodent Research-6', 'grupos experimentales / recuperación'],
    limitations:
      'Estudio realizado en ratones (Mus musculus); los resultados biológicos en modelos animales no deben presentarse como efectos idénticos o ya comprobados en humanos sin estudios clínicos específicos.',
    verification_status: 'UNDER_REVIEW',
    verified_by: '',
    verification_date: '',
    related_experiences: ['traduciendo-la-ciencia'],
    related_content_ids: [],
    language: 'es',
    created_at: '2025-11-14T12:00:00.000Z',
    updated_at: '2025-11-14T12:00:00.000Z',
    source_repository: 'NASA_OSDR',
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

interface LibraryStoreData {
  version: number;
  categories: AnyRecord[];
  records: AnyRecord[];
}

async function ensureStore(): Promise<LibraryStoreData> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(STORE_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Partial<LibraryStoreData>;
    if (Array.isArray(parsed.records) && Array.isArray(parsed.categories)) {
      return {
        version: parsed.version || 1,
        categories: parsed.categories,
        records: parsed.records,
      };
    }
  } catch {
    // Initialize cleanly if missing or unreadable
  }
  const initialStore: LibraryStoreData = {
    version: 1,
    categories: DEFAULT_CATEGORIES as unknown as AnyRecord[],
    records: INITIAL_SEED_RECORDS as unknown as AnyRecord[],
  };
  await fs.writeFile(STORE_FILE, JSON.stringify(initialStore, null, 2), 'utf8');
  return initialStore;
}

async function writeStore(store: LibraryStoreData): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(STORE_FILE, JSON.stringify(store, null, 2), 'utf8');
}

function cleanArray(input: unknown): string[] {
  if (Array.isArray(input)) {
    return input.map((x) => String(x || '').trim()).filter(Boolean);
  }
  if (typeof input === 'string') {
    return input
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);
  }
  return [];
}

function sanitizeText(val: unknown, fallback = ''): string {
  if (val === undefined || val === null) return fallback;
  return String(val).replace(/\s+/g, ' ').trim();
}

function normalizeOsdrUrl(authoritativeUrl: unknown, accession: unknown): string {
  const cleanId = sanitizeText(accession).replace(/\/+$/, '');
  if (!authoritativeUrl) {
    return cleanId ? `https://osdr.nasa.gov/bio/repo/data/studies/${cleanId}` : 'https://osdr.nasa.gov/bio/';
  }
  if (String(authoritativeUrl).startsWith('http')) {
    return String(authoritativeUrl);
  }
  const slug = String(authoritativeUrl).replace(/^\/+|\/+$/g, '') || cleanId;
  return `https://osdr.nasa.gov/bio/repo/data/studies/${slug}`;
}

async function searchOsdrLive(query: string, from = 0, size = 10): Promise<{ total: number; hits: AnyRecord[] }> {
  const url = new URL('https://osdr.nasa.gov/osdr/data/search');
  url.searchParams.set('term', query);
  url.searchParams.set('from', String(from));
  url.searchParams.set('size', String(size));
  url.searchParams.set('type', 'cgene');

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) {
    throw new Error(`OSDR API HTTP ${res.status}`);
  }
  const data = (await res.json()) as AnyRecord;
  const total = Number(data?.hits?.total || 0);
  const rawHits: AnyRecord[] = Array.isArray(data?.hits?.hits) ? data.hits.hits : [];
  const hits = rawHits.map((item: AnyRecord) => {
    const src: AnyRecord = item?._source || {};
    const accession =
      sanitizeText(src['Study Identifier']) ||
      sanitizeText(src.Accession) ||
      sanitizeText(item?._id);
    const title =
      sanitizeText(src['Study Title']) ||
      sanitizeText(src['Project Title']) ||
      accession;
    const desc = sanitizeText(src['Study Description']);
    const organismRaw = src.organism || src['Organism'];
    const organism = Array.isArray(organismRaw)
      ? organismRaw.join(', ')
      : sanitizeText(organismRaw, 'No especificado en resumen');
    const authorsRaw = src['Study Publication Author List'] || src['Study Person'];
    const authors = Array.isArray(authorsRaw)
      ? authorsRaw.slice(0, 6).map((a: unknown) => sanitizeText(a)).filter(Boolean)
      : cleanArray(authorsRaw).slice(0, 6);
    const pubDate = sanitizeText(src['Study Public Release Date']);
    const mission = sanitizeText(
      typeof src.Mission === 'object' ? src.Mission?.Name : src.Mission,
      sanitizeText(src['Experiment Platform'], 'NASA OSDR'),
    );
    const keywords = cleanArray(src['Study Assay Technology Type'] || src['Study Factor Name']);
    const sourceUrl = normalizeOsdrUrl(src['Authoritative Source URL'], accession);

    return {
      externalId: `osdr:${accession}`,
      repository: 'NASA_OSDR',
      repositoryLabel: 'NASA OSDR (Open Science Data Repository)',
      title,
      abstract: desc,
      authors,
      publicationDate: pubDate,
      sourceUrl,
      sourceIdentifier: accession,
      sourceOrganization: sanitizeText(
        src['Managing NASA Center'],
        'NASA Open Science Data Repository (OSDR)',
      ),
      organismOrPopulation: organism,
      missionOrProgram: mission,
      keywords,
      suggestedCategory: inferCategoryFromText(`${title} ${desc} ${organism}`),
    };
  });
  return { total, hits };
}

async function searchNtrsLive(
  query: string,
  from = 0,
  size = 10,
  repositoryOverride = 'NASA_NTRS',
): Promise<{ total: number; hits: AnyRecord[] }> {
  const url = new URL('https://ntrs.nasa.gov/api/citations/search');
  url.searchParams.set('q', query);
  url.searchParams.set('page[size]', String(size));
  url.searchParams.set('page[from]', String(from));

  const res = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) {
    throw new Error(`NTRS API HTTP ${res.status}`);
  }
  const data = (await res.json()) as AnyRecord;
  const total = Number(data?.stats?.total || 0);
  const rawResults: AnyRecord[] = Array.isArray(data?.results) ? data.results : [];
  const hits = rawResults.map((item: AnyRecord) => {
    const id = sanitizeText(item?.id);
    const title = sanitizeText(item?.title, `NTRS ${id}`);
    const abstract = sanitizeText(item?.abstract);
    const authors = Array.isArray(item?.authorAffiliations)
      ? item.authorAffiliations
          .map((a: AnyRecord) => sanitizeText(a?.meta?.author?.name))
          .filter(Boolean)
          .slice(0, 6)
      : [];
    const pubDate = sanitizeText(
      item?.distributionDate || item?.created,
    ).slice(0, 10);
    const keywords = cleanArray(item?.keywords || item?.subjectCategories).slice(0, 8);
    const repoLabels: Record<string, string> = {
      NASA_NTRS: 'NASA Technical Reports Server (NTRS)',
      NASA_ISS_RESEARCH: 'NASA ISS Research (vía NTRS)',
      NASA_ARTEMIS: 'NASA Artemis (vía NTRS)',
      OTHER_OFFICIAL_NASA: 'NASA Publications (vía NTRS)',
    };
    return {
      externalId: `ntrs:${id}`,
      repository: repositoryOverride,
      repositoryLabel: repoLabels[repositoryOverride] || repoLabels.NASA_NTRS,
      title,
      abstract,
      authors,
      publicationDate: pubDate,
      sourceUrl: id ? `https://ntrs.nasa.gov/citations/${id}` : 'https://ntrs.nasa.gov/',
      sourceIdentifier: id || 'NTRS',
      sourceOrganization: 'NASA Technical Reports Server (NTRS)',
      organismOrPopulation: inferCategoryFromText(`${title} ${abstract}`) === 'salud_espacial'
        ? 'Consultar estudio original para población / organismo'
        : 'Sistema espacial / ingeniería / estudio técnico NASA',
      missionOrProgram: sanitizeText(item?.stiType, 'NASA Technical Publication'),
      keywords,
      suggestedCategory: inferCategoryFromText(`${title} ${abstract} ${keywords.join(' ')}`),
    };
  });
  return { total, hits };
}

async function createServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'nauti-nasa-scientific-library' });
  });

  app.get('/api/library/records', async (_req, res) => {
    try {
      const store = await ensureStore();
      res.json({
        ok: true,
        categories: store.categories,
        records: store.records,
      });
    } catch (err) {
      res.status(500).json({
        ok: false,
        error: err instanceof Error ? err.message : 'Failed to load library records',
      });
    }
  });

  app.post('/api/library/categories', async (req, res) => {
    try {
      const store = await ensureStore();
      const body = req.body || {};
      const labelEs = sanitizeText(body.labelEs);
      const labelEn = sanitizeText(body.labelEn) || labelEs;
      const labelGn = sanitizeText(body.labelGn) || labelEs;
      if (!labelEs) {
        return res.status(400).json({ ok: false, error: 'Category Spanish label is required' });
      }
      const slug =
        sanitizeText(body.id) ||
        labelEs
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '_')
          .replace(/^_+|_+$/g, '');
      if (store.categories.some((c: AnyRecord) => c.id === slug)) {
        return res.status(409).json({ ok: false, error: 'Category already exists' });
      }
      const nextCat = {
        id: slug,
        order: store.categories.length + 1,
        icon: sanitizeText(body.icon, '🔭'),
        accentColor: sanitizeText(body.accentColor, '#48C5B5'),
        labels: {
          es: `${store.categories.length + 1}. ${labelEs}`,
          en: `${store.categories.length + 1}. ${labelEn}`,
          'gn-PY': `${store.categories.length + 1}. ${labelGn}`,
        },
        descriptions: {
          es: sanitizeText(body.descriptionEs, 'Categoría científica personalizada de NAUTI.'),
          en: sanitizeText(body.descriptionEn, 'Custom NAUTI scientific category.'),
          'gn-PY': sanitizeText(body.descriptionGn, 'Kuaapy aty pyahu NAUTI-pe.'),
        },
        isDefault: false,
      };
      store.categories.push(nextCat);
      await writeStore(store);
      return res.status(201).json({ ok: true, category: nextCat });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        error: err instanceof Error ? err.message : 'Failed to add category',
      });
    }
  });

  app.post('/api/library/records', async (req, res) => {
    try {
      const store = await ensureStore();
      const body = req.body || {};
      const topic = sanitizeText(body.topic);
      const sourceTitle = sanitizeText(body.source_title);
      const sourceUrl = sanitizeText(body.source_url);
      if (!topic || !sourceTitle || !sourceUrl) {
        return res.status(400).json({
          ok: false,
          error: 'topic, source_title, and source_url are required',
        });
      }

      const requestedStatus = sanitizeText(body.verification_status, 'SOURCE_FOUND');
      const allowedStatuses = ['DRAFT', 'SOURCE_FOUND', 'UNDER_REVIEW', 'VERIFIED', 'PUBLISHED'];
      const status = allowedStatuses.includes(requestedStatus) ? requestedStatus : 'SOURCE_FOUND';
      const verifiedBy = sanitizeText(body.verified_by);
      const verificationDate = sanitizeText(body.verification_date);

      if ((status === 'VERIFIED' || status === 'PUBLISHED') && (!verifiedBy || !verificationDate)) {
        return res.status(400).json({
          ok: false,
          error:
            'Human verification required: verified_by and verification_date are mandatory before setting VERIFIED or PUBLISHED.',
        });
      }

      const now = new Date().toISOString();
      const newId =
        sanitizeText(body.id) ||
        `nasa-lib-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

      const record = {
        id: newId,
        category: sanitizeText(body.category, 'investigacion_espacial'),
        topic,
        scientific_claim: sanitizeText(body.scientific_claim),
        student_explanation: sanitizeText(body.student_explanation),
        why_it_matters: sanitizeText(body.why_it_matters),
        where_to_use: sanitizeText(body.where_to_use),
        source_title: sourceTitle,
        source_organization: sanitizeText(body.source_organization, 'NASA'),
        source_url: sourceUrl,
        source_identifier: sanitizeText(body.source_identifier, newId),
        authors: cleanArray(body.authors),
        publication_date: sanitizeText(body.publication_date),
        organism_or_population: sanitizeText(
          body.organism_or_population,
          'Revisar estudio original',
        ),
        research_context: sanitizeText(
          body.research_context,
          'Revisar contexto metodológico de la fuente primaria NASA',
        ),
        numerical_values: cleanArray(body.numerical_values),
        units: cleanArray(body.units),
        limitations: sanitizeText(
          body.limitations,
          'Verificar alcance experimental, especie/modelo y condiciones de operación antes de publicar para estudiantes.',
        ),
        verification_status: status,
        verified_by: verifiedBy,
        verification_date: verificationDate,
        related_experiences: cleanArray(body.related_experiences),
        related_content_ids: cleanArray(body.related_content_ids),
        language: sanitizeText(body.language, 'es'),
        created_at: now,
        updated_at: now,
        source_repository: sanitizeText(body.source_repository, 'NASA_OSDR'),
      };

      const existingIdx = store.records.findIndex((r: AnyRecord) => r.id === record.id);
      if (existingIdx >= 0) {
        store.records[existingIdx] = { ...store.records[existingIdx], ...record, updated_at: now };
        await writeStore(store);
        return res.status(200).json({ ok: true, record: store.records[existingIdx] });
      }

      store.records.unshift(record);
      await writeStore(store);
      return res.status(201).json({ ok: true, record });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        error: err instanceof Error ? err.message : 'Failed to save scientific record',
      });
    }
  });

  app.patch('/api/library/records/:id', async (req, res) => {
    try {
      const store = await ensureStore();
      const { id } = req.params;
      const idx = store.records.findIndex((r: AnyRecord) => r.id === id);
      if (idx < 0) {
        return res.status(404).json({ ok: false, error: 'Record not found' });
      }
      const current = store.records[idx];
      const patch = req.body || {};

      const nextStatus = patch.verification_status ?? current.verification_status;
      const nextVerifiedBy =
        patch.verified_by !== undefined ? sanitizeText(patch.verified_by) : current.verified_by;
      const nextVerificationDate =
        patch.verification_date !== undefined
          ? sanitizeText(patch.verification_date)
          : current.verification_date;
      const nextSourceUrl =
        patch.source_url !== undefined ? sanitizeText(patch.source_url) : current.source_url;
      const nextSourceTitle =
        patch.source_title !== undefined
          ? sanitizeText(patch.source_title)
          : current.source_title;

      if (nextStatus === 'VERIFIED' || nextStatus === 'PUBLISHED') {
        if (!nextVerifiedBy || !nextVerificationDate) {
          return res.status(400).json({
            ok: false,
            error:
              'Verification guardrail: verified_by and verification_date are required before VERIFIED or PUBLISHED.',
          });
        }
        if (!nextSourceTitle || !nextSourceUrl) {
          return res.status(400).json({
            ok: false,
            error:
              'Verification guardrail: source_title and source_url are required before VERIFIED or PUBLISHED.',
          });
        }
      }

      const updated = {
        ...current,
        ...patch,
        id: current.id,
        authors: patch.authors !== undefined ? cleanArray(patch.authors) : current.authors,
        numerical_values:
          patch.numerical_values !== undefined
            ? cleanArray(patch.numerical_values)
            : current.numerical_values,
        units: patch.units !== undefined ? cleanArray(patch.units) : current.units,
        related_experiences:
          patch.related_experiences !== undefined
            ? cleanArray(patch.related_experiences)
            : current.related_experiences,
        related_content_ids:
          patch.related_content_ids !== undefined
            ? cleanArray(patch.related_content_ids)
            : current.related_content_ids,
        verified_by: nextVerifiedBy,
        verification_date: nextVerificationDate,
        source_url: nextSourceUrl,
        source_title: nextSourceTitle,
        verification_status: nextStatus,
        updated_at: new Date().toISOString(),
      };

      store.records[idx] = updated;
      await writeStore(store);
      return res.json({ ok: true, record: updated });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        error: err instanceof Error ? err.message : 'Failed to update record',
      });
    }
  });

  app.delete('/api/library/records/:id', async (req, res) => {
    try {
      const store = await ensureStore();
      const { id } = req.params;
      const idx = store.records.findIndex((r: AnyRecord) => r.id === id);
      if (idx < 0) {
        return res.status(404).json({ ok: false, error: 'Record not found' });
      }
      store.records.splice(idx, 1);
      await writeStore(store);
      return res.json({ ok: true, deletedId: id });
    } catch (err) {
      return res.status(500).json({
        ok: false,
        error: err instanceof Error ? err.message : 'Failed to delete record',
      });
    }
  });

  app.get('/api/nasa/search', async (req, res) => {
    const rawQuery = sanitizeText(req.query.q);
    const source = sanitizeText(req.query.source, 'all');
    const from = Math.max(0, Number.parseInt(String(req.query.from || '0'), 10) || 0);
    const size = Math.min(20, Math.max(1, Number.parseInt(String(req.query.size || '8'), 10) || 8));

    if (!rawQuery) {
      return res.status(400).json({
        ok: false,
        query: '',
        translatedQuery: '',
        wasTranslated: false,
        source,
        from,
        size,
        total: 0,
        hits: [],
        error: 'Query parameter q is required',
      });
    }

    const { translatedQuery, wasTranslated } = translateSpanishQueryToEnglish(rawQuery);
    const warnings = [];

    try {
      if (source === 'NASA_OSDR') {
        const osdr = await searchOsdrLive(translatedQuery, from, size);
        return res.json({
          ok: true,
          query: rawQuery,
          translatedQuery,
          wasTranslated,
          source,
          from,
          size,
          total: osdr.total,
          hits: osdr.hits,
        });
      }

      if (source === 'NASA_NTRS') {
        const ntrs = await searchNtrsLive(translatedQuery, from, size, 'NASA_NTRS');
        return res.json({
          ok: true,
          query: rawQuery,
          translatedQuery,
          wasTranslated,
          source,
          from,
          size,
          total: ntrs.total,
          hits: ntrs.hits,
        });
      }

      if (source === 'NASA_ISS_RESEARCH') {
        const scoped = `${translatedQuery} International Space Station`;
        const iss = await searchNtrsLive(scoped, from, size, 'NASA_ISS_RESEARCH');
        return res.json({
          ok: true,
          query: rawQuery,
          translatedQuery: scoped,
          wasTranslated: true,
          source,
          from,
          size,
          total: iss.total,
          hits: iss.hits,
        });
      }

      if (source === 'NASA_ARTEMIS') {
        const scoped = `${translatedQuery} Artemis`;
        const artemis = await searchNtrsLive(scoped, from, size, 'NASA_ARTEMIS');
        return res.json({
          ok: true,
          query: rawQuery,
          translatedQuery: scoped,
          wasTranslated: true,
          source,
          from,
          size,
          total: artemis.total,
          hits: artemis.hits,
        });
      }

      if (source === 'OTHER_OFFICIAL_NASA') {
        const scoped = `${translatedQuery} NASA`;
        const other = await searchNtrsLive(scoped, from, size, 'OTHER_OFFICIAL_NASA');
        return res.json({
          ok: true,
          query: rawQuery,
          translatedQuery: scoped,
          wasTranslated: true,
          source,
          from,
          size,
          total: other.total,
          hits: other.hits,
        });
      }

      // Combined live search across OSDR + NTRS
      const half = Math.max(1, Math.ceil(size / 2));
      const [osdrResult, ntrsResult] = await Promise.allSettled([
        searchOsdrLive(translatedQuery, Math.floor(from / 2), half),
        searchNtrsLive(translatedQuery, Math.floor(from / 2), half, 'NASA_NTRS'),
      ]);

      const combinedHits = [];
      let total = 0;
      const osdrHits = osdrResult.status === 'fulfilled' ? osdrResult.value.hits : [];
      const ntrsHits = ntrsResult.status === 'fulfilled' ? ntrsResult.value.hits : [];
      if (osdrResult.status === 'fulfilled') {
        total += osdrResult.value.total;
      } else {
        warnings.push(`NASA OSDR no disponible temporalmente: ${osdrResult.reason?.message || 'error'}`);
      }
      if (ntrsResult.status === 'fulfilled') {
        total += ntrsResult.value.total;
      } else {
        warnings.push(`NASA NTRS no disponible temporalmente: ${ntrsResult.reason?.message || 'error'}`);
      }

      if (osdrResult.status === 'rejected' && ntrsResult.status === 'rejected') {
        return res.status(502).json({
          ok: false,
          query: rawQuery,
          translatedQuery,
          wasTranslated,
          source: 'all',
          from,
          size,
          total: 0,
          hits: [],
          warnings,
          error: 'No se pudo conectar con los servidores de búsqueda de la NASA (OSDR / NTRS).',
        });
      }

      const maxLen = Math.max(osdrHits.length, ntrsHits.length);
      for (let i = 0; i < maxLen; i += 1) {
        if (osdrHits[i]) combinedHits.push(osdrHits[i]);
        if (ntrsHits[i]) combinedHits.push(ntrsHits[i]);
      }

      return res.json({
        ok: true,
        query: rawQuery,
        translatedQuery,
        wasTranslated,
        source: 'all',
        from,
        size,
        total,
        hits: combinedHits.slice(0, size),
        warnings: warnings.length > 0 ? warnings : undefined,
      });
    } catch (err) {
      return res.status(502).json({
        ok: false,
        query: rawQuery,
        translatedQuery,
        wasTranslated,
        source,
        from,
        size,
        total: 0,
        hits: [],
        error:
          err instanceof Error
            ? err.message
            : 'NASA search service temporarily unavailable',
      });
    }
  });

  app.get('/api/nasa/osdr/meta/:studyId', async (req, res) => {
    const rawId = sanitizeText(req.params.studyId);
    const numericId = rawId.replace(/^OSD-/i, '').replace(/\/+$/, '');
    if (!numericId || !/^\d+$/.test(numericId)) {
      return res.status(400).json({ ok: false, error: 'Invalid OSDR study identifier' });
    }
    const osdKey = `OSD-${numericId}`;
    try {
      const [metaRes, filesRes] = await Promise.allSettled([
        fetch(`https://osdr.nasa.gov/osdr/data/osd/meta/${numericId}`, {
          headers: { Accept: 'application/json' },
          signal: AbortSignal.timeout(12000),
        }),
        fetch(`https://osdr.nasa.gov/osdr/data/osd/files/${numericId}`, {
          headers: { Accept: 'application/json' },
          signal: AbortSignal.timeout(12000),
        }),
      ]);

      if (metaRes.status !== 'fulfilled' || !metaRes.value.ok) {
        return res.status(502).json({
          ok: false,
          error: 'Could not retrieve OSDR study metadata',
        });
      }

      const metaJson = (await metaRes.value.json()) as AnyRecord;
      const studyWrapper: AnyRecord = metaJson?.study?.[osdKey] || {};
      const primaryStudy: AnyRecord = Array.isArray(studyWrapper?.studies)
        ? studyWrapper.studies[0] || {}
        : {};

      const people = Array.isArray(studyWrapper?.people)
        ? studyWrapper.people.slice(0, 8).map((p: AnyRecord) => ({
            name: sanitizeText(
              [p?.firstName, p?.middleInitials, p?.lastName].filter(Boolean).join(' '),
            ),
            role: sanitizeText(p?.roles?.[0]?.annotationValue),
            affiliation: sanitizeText(p?.affiliation),
          }))
        : [];

      const publications = Array.isArray(studyWrapper?.publications)
        ? studyWrapper.publications.slice(0, 6).map((pub: AnyRecord) => ({
            title: sanitizeText(pub?.title),
            authorList: sanitizeText(pub?.authorList),
            doi: sanitizeText(pub?.doi),
            pubmedId: sanitizeText(pub?.pubMedID),
          }))
        : [];

      const factors = Array.isArray(primaryStudy?.factors)
        ? primaryStudy.factors.map((f: AnyRecord) => sanitizeText(f?.factorName)).filter(Boolean)
        : [];
      const protocols = Array.isArray(primaryStudy?.protocols)
        ? primaryStudy.protocols.map((pr: AnyRecord) => sanitizeText(pr?.name)).filter(Boolean)
        : [];

      let fileCount = 0;
      let sampleFiles: Array<{ fileName: string; category: string; fileSize: number }> = [];
      if (filesRes.status === 'fulfilled' && filesRes.value.ok) {
        const filesJson = (await filesRes.value.json()) as AnyRecord;
        const fileStudy: AnyRecord = filesJson?.studies?.[osdKey];
        fileCount = Number(fileStudy?.file_count || 0);
        const list: AnyRecord[] = Array.isArray(fileStudy?.study_files) ? fileStudy.study_files : [];
        sampleFiles = list.slice(0, 8).map((f: AnyRecord) => ({
          fileName: sanitizeText(f?.file_name),
          category: sanitizeText(f?.category),
          fileSize: Number(f?.file_size || 0),
        }));
      }

      return res.json({
        ok: true,
        metadata: {
          studyId: osdKey,
          title: sanitizeText(primaryStudy?.title, osdKey),
          description: sanitizeText(primaryStudy?.description),
          publicReleaseDate: sanitizeText(primaryStudy?.publicReleaseDate),
          submissionDate: sanitizeText(primaryStudy?.submissionDate),
          people,
          publications,
          factors,
          protocols,
          fileCount,
          sampleFiles,
          studyUrl: `https://osdr.nasa.gov/bio/repo/data/studies/${osdKey}`,
        },
      });
    } catch (err) {
      return res.status(502).json({
        ok: false,
        error:
          err instanceof Error
            ? err.message
            : 'Failed to retrieve OSDR study metadata',
      });
    }
  });

  if (!IS_PROD) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.join(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NAUTI server listening on http://0.0.0.0:${PORT}`);
  });
}

createServer().catch((err) => {
  console.error('Failed to start NAUTI server:', err);
  process.exit(1);
});
