export type DetectiveCaseId =
  | 'case-01-water'
  | 'case-02-electricity'
  | 'case-03-plants'
  | 'case-04-oxygen';

export type DetectiveCaseStatus = 'available' | 'coming_soon';

export type DetectiveCaseStage =
  | 'mystery'
  | 'evidence'
  | 'connect'
  | 'solve'
  | 'resolved';

export type DetectiveEvidenceVisualId =
  | 'water_needs'
  | 'water_recovery_loop'
  | 'water_98_chart';

export type DetectiveOptionId = 'A' | 'B' | 'C';

export interface DetectiveNasaSource {
  title: string;
  organization: string;
  publicationDate?: string;
  url: string;
  technologyStatusLabel: string;
}

export interface DetectiveEvidenceCard {
  id: string;
  order: number;
  badge: string;
  title: string;
  fact: string;
  figureValue?: string;
  figureLabel?: string;
  explanation: string;
  caveatNote?: string;
  visualId: DetectiveEvidenceVisualId;
  roleCategory: 'need' | 'technology' | 'metric';
  isEssential: boolean;
  sourceLabel: string;
  sourceUrl: string;
}

export interface DetectiveConnectionSlot {
  id: 'step-1' | 'step-2' | 'step-3';
  stepNumber: number;
  label: string;
  hint: string;
  expectedEvidenceId: string;
}

export interface DetectiveAnswerOption {
  id: DetectiveOptionId;
  text: string;
  isCorrect: boolean;
  feedback: string;
  citedEvidenceIds: readonly string[];
}

export interface DetectiveDiscoveryCard {
  caseId: DetectiveCaseId;
  caseTitle: string;
  mainScientificFact: string;
  keyNumericalData: string;
  shortExplanation: string;
  technologyStatusLabel: string;
  sourceTitle: string;
  sourceOrganization: string;
  sourceDate?: string;
  sourceUrl: string;
}

export interface DetectiveCaseRecord {
  id: DetectiveCaseId;
  order: number;
  status: DetectiveCaseStatus;
  estimatedMinutes: string;
  focusTopic: string;
  title: string;
  mysteryQuestion: string;
  shortDescription: string;
  stage1Narrative: string;
  nautiStagePrompts: {
    mystery: string;
    evidence: string;
    connect: string;
    solve: string;
    resolved: string;
  };
  evidenceCards: readonly DetectiveEvidenceCard[];
  connectionQuestion: string;
  connectionGuideHint: string;
  connectionSlots: readonly DetectiveConnectionSlot[];
  connectionSuccessMessage: string;
  connectionMismatchHints: Record<string, string>;
  finalQuestion: string;
  finalSubprompt: string;
  answerOptions: readonly DetectiveAnswerOption[];
  finalExplanationParagraphs: readonly string[];
  scientificContextNote: string;
  discoveryCard: DetectiveDiscoveryCard;
  nasaSource: DetectiveNasaSource;
}

export interface DetectiveSolveFeedback {
  optionId: DetectiveOptionId;
  isCorrect: boolean;
  message: string;
  citedEvidenceIds: readonly string[];
  guidedResolution: boolean;
}

export interface DetectiveCaseProgress {
  caseId: DetectiveCaseId | null;
  stage: DetectiveCaseStage;
  revealedEvidenceIds: string[];
  /** Maps slotId ('step-1' | 'step-2' | 'step-3') -> evidenceId */
  selectedConnections: Record<string, string>;
  connectionFeedback: string | null;
  connectionVerified: boolean;
  selectedOptionId: DetectiveOptionId | null;
  attemptsUsed: number;
  solveFeedback: DetectiveSolveFeedback | null;
  caseSolved: boolean;
}

export interface UnlockedDiscoveryEntry {
  caseId: DetectiveCaseId;
  unlockedAtIso: string;
}

export interface DetectivesSavedState {
  unlockedDiscoveries: Partial<Record<DetectiveCaseId, UnlockedDiscoveryEntry>>;
}
