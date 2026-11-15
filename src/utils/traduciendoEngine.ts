import type {
  ScienceEvidenceCard,
  ScienceStudyRecord,
  TraduciendoProgressState,
  TraduciendoStage,
  TranslateActivityChoice,
} from '../types/traduciendoCiencia';

export const TRADUCIENDO_STAGE_ORDER: readonly TraduciendoStage[] = [
  'discover',
  'investigate',
  'debate',
  'translate',
  'share',
] as const;

export function createInitialTraduciendoState(
  studyId: string | null = null,
): TraduciendoProgressState {
  return {
    studyId,
    stage: 'discover',
    reviewedEvidenceIds: [],
    debateIndex: 0,
    selectedDebateOption: null,
    submittedDebateAnswers: {},
    translateChoice: null,
    translateDraft: '',
    completedReflection: false,
  };
}

export function markEvidenceCardReviewed(
  state: TraduciendoProgressState,
  cardId: ScienceEvidenceCard['id'],
): TraduciendoProgressState {
  if (state.reviewedEvidenceIds.includes(cardId)) {
    return state;
  }
  return {
    ...state,
    reviewedEvidenceIds: [...state.reviewedEvidenceIds, cardId],
  };
}

export function submitDebateGroupAnswer(
  state: TraduciendoProgressState,
  questionId: string,
): TraduciendoProgressState {
  if (state.selectedDebateOption === null) {
    return state;
  }
  return {
    ...state,
    submittedDebateAnswers: {
      ...state.submittedDebateAnswers,
      [questionId]: state.selectedDebateOption,
    },
  };
}

export function moveDebateQuestion(
  state: TraduciendoProgressState,
  nextIndex: number,
  study: ScienceStudyRecord,
): TraduciendoProgressState {
  const clamped = Math.max(
    0,
    Math.min(study.debateQuestions.length - 1, nextIndex),
  );
  const nextQ = study.debateQuestions[clamped];
  const existingAnswer = state.submittedDebateAnswers[nextQ.id] ?? null;
  return {
    ...state,
    debateIndex: clamped,
    selectedDebateOption: existingAnswer,
  };
}

export function selectTranslateChoice(
  state: TraduciendoProgressState,
  choice: TranslateActivityChoice,
): TraduciendoProgressState {
  return {
    ...state,
    translateChoice: choice,
  };
}

export interface FormativeLearningChecklistItem {
  id: 'question' | 'finding' | 'evidence' | 'communicate' | 'reflect';
  completed: boolean;
}

/**
 * Generates an honest formative learning checklist based strictly on the actions
 * the group completed during the activity (never claiming objective assessment).
 */
export function buildFormativeChecklist(
  state: TraduciendoProgressState,
  study: ScienceStudyRecord,
): FormativeLearningChecklistItem[] {
  const reviewedQuestion = state.reviewedEvidenceIds.includes('question');
  const reviewedFinding = state.reviewedEvidenceIds.includes('finding');
  const answeredCount = Object.keys(state.submittedDebateAnswers).length;
  const usedEvidenceInDebate =
    answeredCount === study.debateQuestions.length &&
    state.reviewedEvidenceIds.length >= 2;
  const communicated =
    state.translateChoice !== null &&
    (state.translateChoice === 'draw' || state.translateDraft.trim().length > 0);

  return [
    {
      id: 'question',
      completed: reviewedQuestion || state.stage !== 'discover',
    },
    {
      id: 'finding',
      completed: reviewedFinding || answeredCount > 0,
    },
    {
      id: 'evidence',
      completed: usedEvidenceInDebate,
    },
    {
      id: 'communicate',
      completed: communicated,
    },
    {
      id: 'reflect',
      completed: state.stage === 'share',
    },
  ];
}
