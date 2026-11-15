import type { AuditContentItem } from '../types/scientificLibrary';

/**
 * Curated audit index of scientific statements and quantitative figures already
 * presented across NAUTI experiences. Used strictly in Administrator Mode
 * ("Auditor científico") to evaluate evidence backing and approve reference links
 * without altering game mechanics, progression, scores, or episode behavior.
 */
export const NAUTI_AUDIT_CONTENT_ITEMS: readonly AuditContentItem[] = [
  {
    contentId: 'efecto-domino:day-1',
    experienceId: 'efecto-domino',
    experienceName: {
      es: 'Efecto Dominó',
      en: 'Domino Effect',
      'gn-PY': 'Efecto Dominó',
    },
    title: {
      es: 'Jornada 1 — Despertar de Base Aurora y paneles solares',
      en: 'Day 1 — Aurora Base Awakening & Solar Panels',
      'gn-PY': 'Ára 1 — Base Aurora ñepyrũ ha panel solar',
    },
    contentLocation: 'src/locales/es.json · mission.days["1"]',
    claims: [
      'En gran parte de la Luna, la noche lunar dura aproximadamente 14 días terrestres (~2 semanas).',
      'Los paneles solares generan electricidad a partir de la luz solar (ejemplo Artemis I / Orion y sistemas de estación).',
    ],
    numericalValues: ['~14 días terrestres'],
    existingSourceTitle: 'NASA (2024), Lunar Survival & Exploration Resources',
    existingSourceUrl:
      'https://science.nasa.gov/moon/facts/',
    suggestedCategory: 'energia',
    recommendedQuery: 'lunar night solar power',
    suggestedRecordIds: [
      'nasa-artemis-lunar-illumination-2025',
      'nasa-iss-solar-irosa-2025',
    ],
  },
  {
    contentId: 'efecto-domino:day-3',
    experienceId: 'efecto-domino',
    experienceName: {
      es: 'Efecto Dominó',
      en: 'Domino Effect',
      'gn-PY': 'Efecto Dominó',
    },
    title: {
      es: 'Jornada 3 — Mantenimiento y recuperación del agua (98%)',
      en: 'Day 3 — Water Recovery & Filter Maintenance (98%)',
      'gn-PY': 'Ára 3 — Y ñemopotĩ jey ha filtro ñangareko (98%)',
    },
    contentLocation: 'src/locales/es.json · mission.days["3"] + Trivia 3',
    claims: [
      'La NASA demostró en la Estación Espacial Internacional una recuperación de agua cercana al 98% mediante sistemas ECLSS.',
      'Mantener filtros y mantenimiento preventivo evita pérdidas acumulativas en el sistema de agua.',
    ],
    numericalValues: ['98%'],
    existingSourceTitle:
      'NASA (2023), Water Recovery Milestone on the ISS',
    existingSourceUrl:
      'https://www.nasa.gov/missions/station/iss-research/nasa-achieves-water-recovery-milestone-on-international-space-station/',
    suggestedCategory: 'agua_soporte_vital',
    recommendedQuery: 'water recovery ISS ECLSS',
    suggestedRecordIds: ['nasa-iss-water-recovery-2023'],
  },
  {
    contentId: 'efecto-domino:day-4',
    experienceId: 'efecto-domino',
    experienceName: {
      es: 'Efecto Dominó',
      en: 'Domino Effect',
      'gn-PY': 'Efecto Dominó',
    },
    title: {
      es: 'Jornada 4 — Polvo lunar abrasivo (regolito) y equipos solares',
      en: 'Day 4 — Abrasive Lunar Dust (Regolith) & Solar Hardware',
      'gn-PY': 'Ára 4 — Jasy yvyku\'i (regolito) ha panel solar',
    },
    contentLocation: 'src/locales/es.json · mission.days["4"] + Trivia 4',
    claims: [
      'El polvo o regolito lunar es fino, abrasivo y electrostático; puede adherirse a superficies ópticas, sellos y paneles solares reduciendo su rendimiento.',
    ],
    numericalValues: ['Sin cifra fija en historia (dato cualitativo)'],
    existingSourceTitle:
      'NASA (2025), Lunar Dust Mitigation & Electrodynamic Dust Shield Studies',
    existingSourceUrl: 'https://ntrs.nasa.gov/citations/20250002145',
    suggestedCategory: 'energia',
    recommendedQuery: 'lunar regolith dust solar panels',
    suggestedRecordIds: ['nasa-iss-solar-irosa-2025'],
  },
  {
    contentId: 'efecto-domino:day-5',
    experienceId: 'efecto-domino',
    experienceName: {
      es: 'Efecto Dominó',
      en: 'Domino Effect',
      'gn-PY': 'Efecto Dominó',
    },
    title: {
      es: 'Jornada 5 — Iluminación y sombras cerca del polo sur lunar',
      en: 'Day 5 — Illumination & Shadows Near Lunar South Pole',
      'gn-PY': 'Ára 5 — Tesape ha kuarahy\'ã Jasy polo sur-pe',
    },
    contentLocation: 'src/locales/es.json · mission.days["5"]',
    claims: [
      'En regiones próximas al polo sur lunar, la topografía y los ángulos bajos del Sol producen patrones complejos de iluminación y sombra que exigen planificación energética integrada.',
    ],
    numericalValues: ['Topografía y ángulos solares bajos'],
    existingSourceTitle:
      'NASA (2025), Integrated Lunar Power Strategy Considerations',
    existingSourceUrl: 'https://ntrs.nasa.gov/citations/20250010948',
    suggestedCategory: 'energia',
    recommendedQuery: 'Integrated Lunar Power Strategy South Pole',
    suggestedRecordIds: ['nasa-artemis-lunar-illumination-2025'],
  },
  {
    contentId: 'detectives-de-la-nasa:case-01-water',
    experienceId: 'detectives-de-la-nasa',
    experienceName: {
      es: 'Detectives de la NASA',
      en: 'NASA Detectives',
      'gn-PY': 'Detectives de la NASA',
    },
    title: {
      es: 'Caso 01: El misterio del agua en la EEI',
      en: 'Case 01: The Mystery of Water Aboard the ISS',
      'gn-PY': 'Caso 01: Y ñembyaty mba\'e ñehesa\'ỹijo',
    },
    contentLocation: 'src/data/detectivesNasaContent.ts · case-01-water',
    claims: [
      'Los sistemas ECLSS de la Estación Espacial Internacional capturan humedad ambiental y agua usada para reutilizarla.',
      'En junio de 2023, la NASA informó haber demostrado un ~98% de recuperación de agua en la EEI tras incorporar el Brine Processor Assembly.',
    ],
    numericalValues: ['~98%', '2023'],
    existingSourceTitle:
      'NASA Achieves Water Recovery Milestone on International Space Station',
    existingSourceUrl:
      'https://www.nasa.gov/missions/station/iss-research/nasa-achieves-water-recovery-milestone-on-international-space-station/',
    suggestedCategory: 'agua_soporte_vital',
    recommendedQuery: 'water recovery ISS brine processor',
    suggestedRecordIds: ['nasa-iss-water-recovery-2023'],
  },
  {
    contentId: 'escucha-imagina-construye:ep-01-solar-panels',
    experienceId: 'escucha-imagina-construye',
    experienceName: {
      es: 'Escucha, imagina y construye',
      en: 'Listen, Imagine & Build',
      'gn-PY': 'Ehendu, eimo\'ã ha ejapo',
    },
    title: {
      es: 'Episodio 1 — Paneles solares fotovoltaicos y arreglos IROSA',
      en: 'Episode 1 — Photovoltaic Solar Arrays & IROSA',
      'gn-PY': 'Episodio 1 — Panel solar fotovoltaico ha IROSA',
    },
    contentLocation: 'src/data/escuchaImaginaContent.ts · ep-01-solar-panels',
    claims: [
      'Las alas solares de la EEI producen corriente eléctrica continua al recibir luz solar y cargan baterías para los ~90 minutos de cada órbita.',
      'La instalación de los arreglos desplegables IROSA aumentó la potencia eléctrica total de ~160 kW a ~215 kW.',
    ],
    numericalValues: ['~160 kW', '~215 kW', '~90 min'],
    existingSourceTitle:
      'International Space Station — Solar Arrays & Electrical Power System',
    existingSourceUrl:
      'https://www.nasa.gov/mission/international-space-station/',
    suggestedCategory: 'energia',
    recommendedQuery: 'International Space Station solar arrays IROSA',
    suggestedRecordIds: ['nasa-iss-solar-irosa-2025'],
  },
  {
    contentId: 'escucha-imagina-construye:ep-03-space-plants',
    experienceId: 'escucha-imagina-construye',
    experienceName: {
      es: 'Escucha, imagina y construye',
      en: 'Listen, Imagine & Build',
      'gn-PY': 'Ehendu, eimo\'ã ha ejapo',
    },
    title: {
      es: 'Episodio 3 (en preparación) — Sistema vegetal Veggie en la EEI',
      en: 'Episode 3 (coming soon) — Veggie Plant Growth System on ISS',
      'gn-PY': 'Episodio 3 — Veggie ka\'avo ñemity EEI-pe',
    },
    contentLocation: 'src/data/escuchaImaginaContent.ts · ep-03-space-plants',
    claims: [
      'Veggie combina luces LED rojas, azules y verdes para cultivar especies comestibles como lechuga y flores zinnia en microgravedad.',
    ],
    numericalValues: ['3 colores LED'],
    existingSourceTitle:
      'Veggie Plant Growth System Activated on International Space Station',
    existingSourceUrl:
      'https://www.nasa.gov/history/veggie-plant-growth-system-activated-on-international-space-station/',
    suggestedCategory: 'investigacion_espacial',
    recommendedQuery: 'plant growth Veggie microgravity',
    suggestedRecordIds: ['nasa-iss-veggie-plant-growth-2014'],
  },
  {
    contentId: 'traduciendo-la-ciencia:demo-fictional-brote-01',
    experienceId: 'traduciendo-la-ciencia',
    experienceName: {
      es: 'Traduciendo la ciencia',
      en: 'Translating Science',
      'gn-PY': 'Traduciendo la ciencia',
    },
    title: {
      es: 'Módulo de muestra — Proyecto Brote-01 (demostración ficticia declarada)',
      en: 'Sample Module — Project Brote-01 (declared fictional demonstration)',
      'gn-PY': 'Techaukaha — Proyecto Brote-01 (demo ficticio)',
    },
    contentLocation: 'src/data/traduciendoContent.ts · demo-fictional-brote-01',
    claims: [
      'Ejemplo pedagógico ficticio diseñado para mostrar el flujo de Traduciendo la ciencia hasta importar estudios verificados de NASA OSDR.',
    ],
    numericalValues: ['0 (no usar como dato NASA real)'],
    isDeclaredFictionalDemo: true,
    suggestedCategory: 'investigacion_espacial',
    recommendedQuery: 'plant growth',
    suggestedRecordIds: ['nasa-iss-veggie-plant-growth-2014'],
  },
  {
    contentId: 'traduciendo-la-ciencia:osdr-health-backlog',
    experienceId: 'traduciendo-la-ciencia',
    experienceName: {
      es: 'Traduciendo la ciencia',
      en: 'Translating Science',
      'gn-PY': 'Traduciendo la ciencia',
    },
    title: {
      es: 'Colección futura NASA OSDR — Salud ósea y muscular en vuelos espaciales',
      en: 'Upcoming NASA OSDR Collection — Bone & Muscle Health in Spaceflight',
      'gn-PY': 'Tembikuaareka pyahu NASA OSDR — Kangue ha to\'o tesãi',
    },
    contentLocation: 'Traduciendo la ciencia · Próxima colección OSDR',
    claims: [
      'Estudios futuros de NASA OSDR sobre atrofia muscular y pérdida ósea en modelos animales (ratones Mus musculus) requieren revisión y publicación explícita antes de mostrarse a estudiantes.',
    ],
    numericalValues: ['Pendiente de revisión por administrador'],
    suggestedCategory: 'salud_espacial',
    recommendedQuery: 'bone loss muscle atrophy',
    suggestedRecordIds: ['nasa-osdr-osd-342-review'],
  },
];
