import type { AppLang } from '../locales';
import type {
  ScienceCategoryId,
  TraduciendoStage,
} from '../types/traduciendoCiencia';

export interface TraduciendoUiStrings {
  experienceTitle: string;
  experienceSubtitle: string;
  introDescription: string;
  introNautiPrompt: string;
  exploreResearchBtn: string;
  howItWorksBtn: string;
  howItWorksTitle: string;
  howItWorksClose: string;
  howItWorksSteps: {
    stage: string;
    summary: string;
  }[];
  backToIntroBtn: string;
  backToLibraryBtn: string;
  libraryTitle: string;
  librarySubtitle: string;
  osdrIntegrityNote: string;
  allCategoriesLabel: string;
  categories: Record<ScienceCategoryId, string>;
  statusDemoBadge: string;
  statusOsdrBadge: string;
  statusComingSoonBadge: string;
  demoWarningBanner: string;
  ageLabel: string;
  durationLabel: string;
  sourceLabel: string;
  openStudyBtn: string;
  resumeStudyBtn: string;
  comingSoonBtn: string;
  stageNames: Record<TraduciendoStage, string>;
  discoverContinueBtn: string;
  narrativeVsScienceTitle: string;
  methodsLimitsTitle: string;
  methodsLabel: string;
  limitationsLabel: string;
  applicationsLabel: string;
  investigateTitle: string;
  investigateHint: string;
  investigateReviewedCount: (count: number, total: number) => string;
  investigateDoneBtn: string;
  evidenceTapHint: string;
  obsVsInterpLabel: string;
  debateTitle: string;
  debateTeamPrompt: string;
  debateConfirmBtn: string;
  debateShowCluesBtn: string;
  debateHideCluesBtn: string;
  debateSupportedTitle: string;
  debateReviewTitle: string;
  debateWhyOthersLabel: string;
  debateEvidenceRefLabel: string;
  debatePrevBtn: string;
  debateNextBtn: string;
  debateToTranslateBtn: string;
  translateTitle: string;
  translateNautiPrompt: string;
  translateOfflineDrawingNote: string;
  translateDraftLabel: string;
  translateFinishBtn: string;
  shareTitle: string;
  shareNautiPrompt: string;
  shareInviteBody: string;
  shareReflectionTitle: string;
  shareReflectionQuestions: [string, string, string];
  shareFormativeTitle: string;
  shareFormativeDisclaimer: string;
  shareChecklistLabels: {
    question: string;
    finding: string;
    evidence: string;
    communicate: string;
    reflect: string;
  };
  shareMissionComplete: string;
  shareBackToLibraryBtn: string;
  shareRestartBtn: string;
  facilitatorLabel: string;
}

const ES_STRINGS: TraduciendoUiStrings = {
  experienceTitle: 'Traduciendo la ciencia',
  experienceSubtitle: 'Grandes descubrimientos, pequeñas grandes historias.',
  introDescription:
    '¿Alguna vez te preguntaste qué descubren los científicos y para qué sirven sus investigaciones? En esta experiencia, NAUTI te ayudará a convertir descubrimientos reales en historias que todos puedan entender.',
  introNautiPrompt:
    '¡Hola, exploradores! Hoy tenemos una misión especial: descubrir qué investigaron los científicos y aprender a contárselo al mundo.',
  exploreResearchBtn: 'Explorar investigaciones',
  howItWorksBtn: '¿Cómo funciona?',
  howItWorksTitle: '¿Cómo funciona Traduciendo la ciencia?',
  howItWorksClose: 'Entendido',
  howItWorksSteps: [
    {
      stage: '1. DESCUBRIR',
      summary: 'Lean o escuchen juntos la historia de una investigación.',
    },
    {
      stage: '2. INVESTIGAR',
      summary: 'Abran las 4 tarjetas de evidencia para responder qué, cómo, qué encontraron y por qué importa.',
    },
    {
      stage: '3. DEBATIR',
      summary: 'Conversen en equipo sin apuro para elegir respuestas apoyadas en la evidencia.',
    },
    {
      stage: '4. TRADUCIR',
      summary: 'Expliquen el hallazgo con sus palabras, una comparación o un dibujo en papel.',
    },
    {
      stage: '5. COMPARTIR',
      summary: 'Presenten su explicación a otro equipo y reflexionen sobre lo aprendido.',
    },
  ],
  backToIntroBtn: 'Inicio',
  backToLibraryBtn: 'Biblioteca',
  libraryTitle: 'Biblioteca de investigaciones',
  librarySubtitle:
    'Colección preparada para futuras investigaciones verificadas del Open Science Data Repository (OSDR) de la NASA y actividades demostrativas guiadas.',
  osdrIntegrityNote:
    'Principio científico: solo las actividades verificadas citan estudios reales. Las demostraciones ficticias están identificadas explícitamente como ficción educativa.',
  allCategoriesLabel: 'Todas',
  categories: {
    space_biology: 'Biología espacial',
    human_health: 'Salud humana en el espacio',
    plants_food: 'Plantas y producción de alimentos',
    microorganisms: 'Microorganismos',
    extreme_environments: 'Vida en entornos extremos',
  },
  statusDemoBadge: 'Demostración educativa (Ficción)',
  statusOsdrBadge: 'Estudio OSDR verificado',
  statusComingSoonBadge: 'Próximamente (OSDR)',
  demoWarningBanner:
    'Actividad demostrativa con fines educativos: los datos y personajes de esta historia son ficticios y no representan resultados reales de la NASA ni de OSDR.',
  ageLabel: 'Edades',
  durationLabel: 'Duración',
  sourceLabel: 'Fuente',
  openStudyBtn: 'Iniciar demostración',
  resumeStudyBtn: 'Continuar actividad',
  comingSoonBtn: 'Próximamente',
  stageNames: {
    discover: 'Descubrir',
    investigate: 'Investigar',
    debate: 'Debatir',
    translate: 'Traducir',
    share: 'Compartir',
  },
  discoverContinueBtn: 'Continuar',
  narrativeVsScienceTitle: 'Narrativa y ciencia',
  methodsLimitsTitle: 'Método, límites y alcance',
  methodsLabel: 'Cómo se investigó',
  limitationsLabel: 'Límites de esta investigación',
  applicationsLabel: 'Aplicaciones posibles (no garantizadas)',
  investigateTitle: 'Pistas de la investigación',
  investigateHint:
    'Abran cada tarjeta en equipo para revisar qué querían descubrir, cómo lo investigaron, qué encontraron y por qué es importante.',
  investigateReviewedCount: (count, total) =>
    `${count} de ${total} pistas revisadas`,
  investigateDoneBtn: 'Ya revisamos las pistas',
  evidenceTapHint: 'Toca para abrir esta pista',
  obsVsInterpLabel: 'Observación vs. interpretación',
  debateTitle: 'Debate en equipo',
  debateTeamPrompt:
    'Conversen con su equipo. Revisen las pistas y decidan juntos.',
  debateConfirmBtn: 'Ya tenemos una respuesta',
  debateShowCluesBtn: 'Ver pistas',
  debateHideCluesBtn: 'Ocultar pistas',
  debateSupportedTitle: '¡Respuesta respaldada por las pistas!',
  debateReviewTitle: 'Vale la pena revisar otra pista juntos',
  debateWhyOthersLabel: '¿Por qué las otras opciones son menos adecuadas?',
  debateEvidenceRefLabel: 'Pista relacionada',
  debatePrevBtn: 'Pregunta anterior',
  debateNextBtn: 'Siguiente pregunta',
  debateToTranslateBtn: 'Ir a Traducir',
  translateTitle: 'Desafío de divulgación',
  translateNautiPrompt:
    '¡Ahora ustedes son los divulgadores científicos! ¿Cómo explicarían este descubrimiento a alguien que nunca escuchó hablar de él?',
  translateOfflineDrawingNote:
    'Actividad con materiales físicos (papel y lápices): no hace falta subir fotos ni usar cámara. Pueden anotar aquí una idea breve de lo que dibujaron.',
  translateDraftLabel: 'Notas o explicación de su equipo (opcional)',
  translateFinishBtn: 'Compartir descubrimiento',
  shareTitle: 'Compartir y reflexionar',
  shareNautiPrompt:
    '¿Podrían explicar ahora este descubrimiento a otro equipo?',
  shareInviteBody:
    'Tomen turnos para contarle en voz alta a otro equipo qué descubrieron, qué pistas usaron y por qué importa.',
  shareReflectionTitle: 'Preguntas para reflexionar juntos',
  shareReflectionQuestions: [
    '¿Qué fue lo más sorprendente?',
    '¿Qué evidencia utilizamos?',
    '¿Qué nos gustaría investigar ahora?',
  ],
  shareFormativeTitle: 'Recorrido del equipo en esta sesión',
  shareFormativeDisclaimer:
    'Resumen orientativo basado en los pasos realizados por el grupo durante la sesión (no constituye una evaluación individual estandarizada).',
  shareChecklistLabels: {
    question: 'Identificaron la pregunta científica',
    finding: 'Revisaron el hallazgo principal',
    evidence: 'Usaron pistas para respaldar respuestas en el debate',
    communicate: 'Prepararon una explicación para otras personas',
    reflect: 'Reflexionaron sobre el significado del hallazgo',
  },
  shareMissionComplete:
    '¡Misión cumplida! Hoy no solo aprendieron ciencia: también ayudaron a compartirla.',
  shareBackToLibraryBtn: 'Volver a la biblioteca',
  shareRestartBtn: 'Repetir actividad',
  facilitatorLabel: 'Guía docente / facilitación',
};

const EN_STRINGS: TraduciendoUiStrings = {
  experienceTitle: 'Translating Science',
  experienceSubtitle: 'Big discoveries, great little stories.',
  introDescription:
    'Have you ever wondered what scientists discover and how their research helps us? In this experience, NAUTI helps your team turn scientific discoveries into stories everyone can understand.',
  introNautiPrompt:
    'Hello, explorers! Today we have a special mission: discover what scientists investigated and learn how to share it with the world.',
  exploreResearchBtn: 'Explore research',
  howItWorksBtn: 'How does it work?',
  howItWorksTitle: 'How does Translating Science work?',
  howItWorksClose: 'Got it',
  howItWorksSteps: [
    {
      stage: '1. DISCOVER',
      summary: 'Read or listen to the story of an investigation together.',
    },
    {
      stage: '2. INVESTIGATE',
      summary: 'Open the 4 evidence cards covering what, how, what was found, and why it matters.',
    },
    {
      stage: '3. DEBATE',
      summary: 'Discuss as a team without rushing to agree on evidence-backed answers.',
    },
    {
      stage: '4. TRANSLATE',
      summary: 'Explain the finding in your own words, with an analogy, or with a paper drawing.',
    },
    {
      stage: '5. SHARE',
      summary: 'Present your explanation to another team and reflect together.',
    },
  ],
  backToIntroBtn: 'Intro',
  backToLibraryBtn: 'Library',
  libraryTitle: 'Research Library',
  librarySubtitle:
    'A growing collection designed for verified studies from NASA’s Open Science Data Repository (OSDR) alongside clearly labeled demonstration activities.',
  osdrIntegrityNote:
    'Scientific integrity: only verified studies cite real research. Demonstration scenarios are explicitly marked as fictional classroom tools.',
  allCategoriesLabel: 'All',
  categories: {
    space_biology: 'Space biology',
    human_health: 'Human health in space',
    plants_food: 'Plants & food production',
    microorganisms: 'Microorganisms',
    extreme_environments: 'Life in extreme environments',
  },
  statusDemoBadge: 'Educational Demo (Fictional)',
  statusOsdrBadge: 'Verified OSDR study',
  statusComingSoonBadge: 'Coming soon (OSDR)',
  demoWarningBanner:
    'Educational demonstration only: the scenario and measurements here are fictional and do not represent real NASA or OSDR research findings.',
  ageLabel: 'Ages',
  durationLabel: 'Duration',
  sourceLabel: 'Source',
  openStudyBtn: 'Start demonstration',
  resumeStudyBtn: 'Resume activity',
  comingSoonBtn: 'Coming Soon',
  stageNames: {
    discover: 'Discover',
    investigate: 'Investigate',
    debate: 'Debate',
    translate: 'Translate',
    share: 'Share',
  },
  discoverContinueBtn: 'Continue',
  narrativeVsScienceTitle: 'Storytelling & science',
  methodsLimitsTitle: 'Methods, limits & scope',
  methodsLabel: 'How it was studied',
  limitationsLabel: 'Limits of this investigation',
  applicationsLabel: 'Potential applications (not guaranteed)',
  investigateTitle: 'Investigation clues',
  investigateHint:
    'Open each card as a team to check what scientists wanted to know, how they studied it, what they found, and why it matters.',
  investigateReviewedCount: (count, total) =>
    `${count} of ${total} clues reviewed`,
  investigateDoneBtn: 'We reviewed the clues',
  evidenceTapHint: 'Tap to open this clue',
  obsVsInterpLabel: 'Observation vs. interpretation',
  debateTitle: 'Team debate',
  debateTeamPrompt:
    'Talk it over with your team. Check the clues and decide together.',
  debateConfirmBtn: 'We have a team answer',
  debateShowCluesBtn: 'Show clues',
  debateHideCluesBtn: 'Hide clues',
  debateSupportedTitle: 'Answer supported by the clues!',
  debateReviewTitle: 'Let’s double-check the clues together',
  debateWhyOthersLabel: 'Why are the other options less suitable?',
  debateEvidenceRefLabel: 'Related clue',
  debatePrevBtn: 'Previous question',
  debateNextBtn: 'Next question',
  debateToTranslateBtn: 'Go to Translate',
  translateTitle: 'Science communication challenge',
  translateNautiPrompt:
    'Now you are the science communicators! How would you explain this discovery to someone who has never heard of it?',
  translateOfflineDrawingNote:
    'Paper & pencil activity: no photo upload or camera needed. You can optionally write a brief description of your drawing here.',
  translateDraftLabel: 'Team explanation or notes (optional)',
  translateFinishBtn: 'Share discovery',
  shareTitle: 'Share & reflect',
  shareNautiPrompt:
    'Could you explain this discovery to another team now?',
  shareInviteBody:
    'Take turns telling another group aloud what you discovered, which clues supported it, and why it matters.',
  shareReflectionTitle: 'Questions to reflect on together',
  shareReflectionQuestions: [
    'What was most surprising?',
    'Which evidence did we use?',
    'What would we like to investigate next?',
  ],
  shareFormativeTitle: 'Team journey in this session',
  shareFormativeDisclaimer:
    'Supportive summary reflecting the stages your group completed during this session (not an objective individual test score).',
  shareChecklistLabels: {
    question: 'Identified the scientific question',
    finding: 'Reviewed the main finding',
    evidence: 'Used clues to back up debate answers',
    communicate: 'Prepared an explanation for someone else',
    reflect: 'Reflected on why the finding matters',
  },
  shareMissionComplete:
    'Mission complete! Today you didn’t just learn science—you helped share it.',
  shareBackToLibraryBtn: 'Back to library',
  shareRestartBtn: 'Replay activity',
  facilitatorLabel: 'Facilitator prompt',
};

/**
 * Per Section 13 ("Do not fabricate unreviewed Guaraní translations"),
 * `gn-PY` intentionally falls back to verified Spanish strings for Traduciendo la ciencia
 * until translated and reviewed by native bilingual educators.
 */
export function getTraduciendoStrings(lang: AppLang): TraduciendoUiStrings {
  if (lang === 'en') {
    return EN_STRINGS;
  }
  return ES_STRINGS;
}
