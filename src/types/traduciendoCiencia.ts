export type ScienceCategoryId =
  | 'space_biology'
  | 'human_health'
  | 'plants_food'
  | 'microorganisms'
  | 'extreme_environments';

export type ScienceStudyStatus = 'verified_osdr' | 'demonstration' | 'coming_soon';

export type TraduciendoStage =
  | 'discover'
  | 'investigate'
  | 'debate'
  | 'translate'
  | 'share';

export type TranslateActivityChoice = 'explain' | 'analogy' | 'draw';

export interface ScienceEvidenceCard {
  id: 'question' | 'method' | 'finding' | 'importance';
  promptTitle: string;
  summary: string;
  detail: string;
  observationVsInterpretationNote: string;
}

export interface ScienceDebateQuestion {
  id: string;
  question: string;
  options: [string, string, string];
  supportedOptionIndex: 0 | 1 | 2;
  supportingEvidenceCardId: ScienceEvidenceCard['id'];
  scientificExplanation: string;
  whyOthersAreLessAppropriate: string;
  facilitatorPrompt: string;
}

export interface ScienceTranslateOption {
  choice: TranslateActivityChoice;
  title: string;
  instructions: string;
  guidingPrompt: string;
  placeholderText: string;
}

export interface ScienceStudyRecord {
  id: string;
  category: ScienceCategoryId;
  status: ScienceStudyStatus;
  isDemonstration: boolean;
  isVerifiedOsdr: boolean;
  osdrIdentifier: string;
  officialTitle: string;
  studentTitle: string;
  topicLabel: string;
  shortDescription: string;
  ageRange: string;
  durationMinutes: string;
  sourceLabel: string;
  sourceUrl?: string;
  researchQuestion: string;
  studyMethods: string;
  verifiedFindings: string;
  limitations: string;
  potentialApplications: string;
  storyParagraphs: string[];
  storyDistinctionNote: string;
  facilitatorDiscoverPrompt: string;
  evidenceCards: [
    ScienceEvidenceCard,
    ScienceEvidenceCard,
    ScienceEvidenceCard,
    ScienceEvidenceCard,
  ];
  debateQuestions: [
    ScienceDebateQuestion,
    ScienceDebateQuestion,
    ScienceDebateQuestion,
  ];
  translateChallenge: {
    contextHint: string;
    options: [
      ScienceTranslateOption,
      ScienceTranslateOption,
      ScienceTranslateOption,
    ];
  };
  referenceNote: string;
}

export interface TraduciendoProgressState {
  studyId: string | null;
  stage: TraduciendoStage;
  reviewedEvidenceIds: ScienceEvidenceCard['id'][];
  debateIndex: number;
  selectedDebateOption: number | null;
  submittedDebateAnswers: Record<string, number>;
  translateChoice: TranslateActivityChoice | null;
  translateDraft: string;
  completedReflection: boolean;
}
