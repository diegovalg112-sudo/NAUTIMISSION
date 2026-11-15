import type { DesktopAppId } from './desktopApps';
import type { AppLang } from '../locales';

export interface ExperienceContributor {
  id: string;
  name: string;
  photo?: string;
  photoAlt?: string;
  role: string;
  affiliation?: string;
}

export interface ExperienceInspirationReference {
  title: string;
  url?: string;
}

export interface ExperienceInspiration {
  title?: string;
  icon?: 'lightbulb' | 'branch';
  description: string;
  references?: ExperienceInspirationReference[];
}

export interface ExperienceCreditsData {
  contributors: ExperienceContributor[];
  inspiration: ExperienceInspiration;
  teamUrl?: string;
}

export interface ExperienceCreditsUiLabels {
  sectionTitle: string;
  inspiredByTitle: string;
  readMoreLabel: string;
  readLessLabel: string;
  teamLinkLabel: string;
  photoPlaceholderAlt: string;
}

/**
 * UI labels for the reusable ExperienceCredits component.
 * Uses explicit Spanish fallback for Paraguayan Guaraní until native
 * review is completed (avoids inventing unverified Guaraní terms).
 */
const EXPERIENCE_CREDITS_LABELS: Record<'es' | 'en', ExperienceCreditsUiLabels> = {
  es: {
    sectionTitle: 'Detrás de esta experiencia',
    inspiredByTitle: 'Inspirada en',
    readMoreLabel: 'Leer más',
    readLessLabel: 'Leer menos',
    teamLinkLabel: 'Conoce al equipo',
    photoPlaceholderAlt: 'Fotografía del equipo creador',
  },
  en: {
    sectionTitle: 'Behind this experience',
    inspiredByTitle: 'Inspired by',
    readMoreLabel: 'Read more',
    readLessLabel: 'Read less',
    teamLinkLabel: 'Meet the team',
    photoPlaceholderAlt: 'Creator team photograph',
  },
};

export function getExperienceCreditsLabels(
  lang: AppLang,
): ExperienceCreditsUiLabels {
  if (lang === 'en') {
    return EXPERIENCE_CREDITS_LABELS.en;
  }
  return EXPERIENCE_CREDITS_LABELS.es;
}

/**
 * Per-experience creator recognition and inspiration registry.
 * Add new entries keyed by DesktopAppId when new NAUTI experiences launch.
 *
 * Only Spanish and verified English entries are stored here; Paraguayan Guaraní
 * gracefully falls back to Spanish until translated and reviewed by a native speaker.
 */
export const EXPERIENCE_CREDITS_REGISTRY: Partial<
  Record<DesktopAppId, Partial<Record<'es' | 'en', ExperienceCreditsData>>>
> = {
  'efecto-domino': {
    es: {
      contributors: [
        {
          id: 'diego-vallejo',
          name: 'Ing. Diego Vallejo',
          photo: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_7.09.32_AM_67d53c82.jpeg',
          photoAlt: 'Retrato de Ing. Diego Vallejo — Filómatas LAB',
          role: 'Una idea de',
          affiliation: 'Filómatas LAB',
        },
      ],
      inspiration: {
        title: 'Inspirado en la genealogía',
        icon: 'branch',
        description:
          'Mi afición por la genealogía me enseñó que las historias no siguen caminos aislados: diferentes ramas pueden conectarse y compartir un mismo origen, como ocurre en el colapso del pedigrí.\n\nEsta idea inspiró Efecto Dominó: un juego donde cada decisión abre nuevos caminos que pueden volver a encontrarse, pero conservan las consecuencias de lo ocurrido anteriormente. Así, como en un árbol genealógico, para comprender el presente es necesario conocer el pasado.',
      },
    },
    en: {
      contributors: [
        {
          id: 'diego-vallejo',
          name: 'Ing. Diego Vallejo',
          photo: '/assets/aistudio/WhatsApp_Image_2026-11-15_at_7.09.32_AM_67d53c82.jpeg',
          photoAlt: 'Portrait of Ing. Diego Vallejo — Filómatas LAB',
          role: 'An idea by',
          affiliation: 'Filómatas LAB',
        },
      ],
      inspiration: {
        title: 'Inspired by genealogy',
        icon: 'branch',
        description:
          'My interest in genealogy taught me that stories do not follow isolated paths: different branches can connect and share a common origin, as happens in pedigree collapse.\n\nThis idea inspired Domino Effect: a game where every decision opens new paths that can meet again, while carrying forward the consequences of what happened before. Thus, just like in a family tree, to understand the present it is necessary to know the past.',
      },
    },
  },
  'traduciendo-la-ciencia': {
    es: {
      contributors: [
        {
          id: 'traduciendo-lead',
          name: 'Nombre por confirmar',
          role: 'Diseño educativo',
          affiliation: 'Filómatas LAB',
        },
      ],
      inspiration: {
        title: 'Inspirada en la divulgación científica',
        icon: 'lightbulb',
        description:
          'El reto de acercar la investigación científica abierta a estudiantes mediante historias claras, diálogo colaborativo y explicaciones creativas comprensibles para cualquier persona.',
      },
    },
    en: {
      contributors: [
        {
          id: 'traduciendo-lead',
          name: 'Name to be confirmed',
          role: 'Educational design',
          affiliation: 'Filómatas LAB',
        },
      ],
      inspiration: {
        title: 'Inspired by science communication',
        icon: 'lightbulb',
        description:
          'The challenge of making open scientific research approachable for students through clear storytelling, collaborative dialogue, and creative explanations anyone can understand.',
      },
    },
  },
  'escucha-imagina-construye': {
    es: {
      contributors: [
        {
          id: 'escucha-team',
          name: 'Equipo Filómatas LAB',
          role: 'Diseño educativo',
          affiliation: 'Filómatas LAB',
        },
      ],
      inspiration: {
        title: 'Inspirada en el razonamiento espacial y la escucha activa',
        icon: 'lightbulb',
        description:
          'Una propuesta colaborativa donde historias sonoras sobre ingeniería espacial invitan a escuchar con atención, imaginar geometrías en equipo y reconstruirlas en papel antes de compararlas con esquemas científicos.',
      },
    },
    en: {
      contributors: [
        {
          id: 'escucha-team',
          name: 'Filómatas LAB Team',
          role: 'Educational design',
          affiliation: 'Filómatas LAB',
        },
      ],
      inspiration: {
        title: 'Inspired by spatial reasoning and active listening',
        icon: 'lightbulb',
        description:
          'A collaborative experience where audio stories about space engineering invite students to listen closely, imagine geometry as a team, and reconstruct parts on paper before comparing with scientific diagrams.',
      },
    },
  },
  'detectives-de-la-nasa': {
    es: {
      contributors: [
        {
          id: 'detectives-team',
          name: 'Equipo Filómatas LAB',
          role: 'Diseño educativo',
          affiliation: 'Filómatas LAB',
        },
      ],
      inspiration: {
        title: 'Inspirada en el método científico y la indagación colaborativa',
        icon: 'lightbulb',
        description:
          'En lugar de memorizar respuestas aisladas, los estudiantes investigan misterios espaciales reales descubriendo pistas, conectando evidencias y construyendo explicaciones respaldadas por datos de la NASA.',
      },
    },
    en: {
      contributors: [
        {
          id: 'detectives-team',
          name: 'Filómatas LAB Team',
          role: 'Educational design',
          affiliation: 'Filómatas LAB',
        },
      ],
      inspiration: {
        title: 'Inspired by scientific inquiry and evidence-based reasoning',
        icon: 'lightbulb',
        description:
          'Instead of memorizing isolated facts, students investigate real space mysteries by uncovering clues, connecting evidence, and constructing explanations grounded in NASA data.',
      },
    },
  },
  'biblioteca-cientifica-nasa': {
    es: {
      contributors: [
        {
          id: 'biblioteca-team',
          name: 'Equipo Filómatas LAB',
          role: 'Curaduría científica y arquitectura educativa',
          affiliation: 'Filómatas LAB',
        },
      ],
      inspiration: {
        title: 'Inspirada en la ciencia abierta y el rigor documental',
        icon: 'lightbulb',
        description:
          'Cada dato que llega a las aulas en NAUTI merece trazabilidad clara hacia su investigación original en la NASA, distinguiendo siempre el alcance del estudio y traduciendo el conocimiento con precisión.',
      },
    },
    en: {
      contributors: [
        {
          id: 'biblioteca-team',
          name: 'Filómatas LAB Team',
          role: 'Scientific curation & educational architecture',
          affiliation: 'Filómatas LAB',
        },
      ],
      inspiration: {
        title: 'Inspired by open science and source rigor',
        icon: 'lightbulb',
        description:
          'Every scientific fact reaching students in NAUTI deserves transparent traceability back to authentic NASA publications, carefully honoring study scope and clear explanations.',
      },
    },
  },
};

export function getExperienceCredits(
  appId: DesktopAppId,
  lang: AppLang,
): ExperienceCreditsData | null {
  const byLang = EXPERIENCE_CREDITS_REGISTRY[appId];
  if (!byLang) return null;
  if (lang === 'en' && byLang.en) {
    return byLang.en;
  }
  return byLang.es ?? null;
}
