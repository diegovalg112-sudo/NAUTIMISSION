export const TUTORIAL_STORAGE_KEY = 'nauti_efecto_domino_tutorial_v1';

/**
 * 0..4: 5 learning sections
 * 5: Short interactive practice
 * 6: Completion screen
 */
export const TOTAL_TUTORIAL_STEPS = 7;

export interface TutorialProgressState {
  completed: boolean;
  currentStep: number;
  practiceCompleted: boolean;
}

export function createDefaultTutorialProgress(): TutorialProgressState {
  return {
    completed: false,
    currentStep: 0,
    practiceCompleted: false,
  };
}

export function clampTutorialStep(step: number): number {
  if (!Number.isFinite(step)) return 0;
  return Math.max(0, Math.min(TOTAL_TUTORIAL_STEPS - 1, Math.floor(step)));
}

export function readTutorialProgress(): TutorialProgressState {
  const fallback = createDefaultTutorialProgress();
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(TUTORIAL_STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<TutorialProgressState>;
    const completed = parsed.completed === true;
    const practiceCompleted = completed || parsed.practiceCompleted === true;
    return {
      completed,
      currentStep: clampTutorialStep(
        typeof parsed.currentStep === 'number' ? parsed.currentStep : 0,
      ),
      practiceCompleted,
    };
  } catch {
    return fallback;
  }
}

export function saveTutorialProgress(state: TutorialProgressState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      TUTORIAL_STORAGE_KEY,
      JSON.stringify({
        completed: state.completed,
        currentStep: clampTutorialStep(state.currentStep),
        practiceCompleted: state.practiceCompleted,
      }),
    );
  } catch {
    // Ignore storage quota or private-browsing write failures cleanly
  }
}
