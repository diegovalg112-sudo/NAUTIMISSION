import type {
  DetectiveCaseId,
  DetectiveCaseProgress,
  DetectivesSavedState,
} from '../types/detectivesNasa';

export const DETECTIVES_STORAGE_KEY = 'nauti_detectives_nasa_v1';

export function createInitialDetectiveCaseProgress(
  caseId: DetectiveCaseId | null = null,
): DetectiveCaseProgress {
  return {
    caseId,
    stage: 'mystery',
    revealedEvidenceIds: [],
    selectedConnections: {},
    connectionFeedback: null,
    connectionVerified: false,
    selectedOptionId: null,
    attemptsUsed: 0,
    solveFeedback: null,
    caseSolved: false,
  };
}

export function createDefaultDetectivesSavedState(): DetectivesSavedState {
  return {
    unlockedDiscoveries: {},
  };
}

export function readDetectivesSavedState(): DetectivesSavedState {
  const fallback = createDefaultDetectivesSavedState();
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(DETECTIVES_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<DetectivesSavedState>;
    const rawMap = parsed.unlockedDiscoveries;
    if (!rawMap || typeof rawMap !== 'object') return fallback;

    const cleaned: DetectivesSavedState['unlockedDiscoveries'] = {};
    for (const key of Object.keys(rawMap) as DetectiveCaseId[]) {
      const entry = rawMap[key];
      if (
        entry &&
        typeof entry === 'object' &&
        typeof entry.caseId === 'string' &&
        typeof entry.unlockedAtIso === 'string'
      ) {
        cleaned[key] = {
          caseId: entry.caseId as DetectiveCaseId,
          unlockedAtIso: entry.unlockedAtIso,
        };
      }
    }
    return { unlockedDiscoveries: cleaned };
  } catch {
    return fallback;
  }
}

export function saveDetectivesSavedState(state: DetectivesSavedState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      DETECTIVES_STORAGE_KEY,
      JSON.stringify({
        unlockedDiscoveries: state.unlockedDiscoveries,
      }),
    );
  } catch {
    // Ignore storage quota or restricted-mode errors gracefully
  }
}

export function unlockDetectiveDiscovery(
  state: DetectivesSavedState,
  caseId: DetectiveCaseId,
): DetectivesSavedState {
  if (state.unlockedDiscoveries[caseId]) {
    return state;
  }
  const next: DetectivesSavedState = {
    unlockedDiscoveries: {
      ...state.unlockedDiscoveries,
      [caseId]: {
        caseId,
        unlockedAtIso: new Date().toISOString(),
      },
    },
  };
  saveDetectivesSavedState(next);
  return next;
}
