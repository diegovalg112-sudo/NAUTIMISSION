import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FlaskConical,
  Lightbulb,
  Radio,
  RotateCw,
  Sparkles,
  AlertTriangle,
  Info,
  Clock,
} from 'lucide-react';
import {
  buildSceneDataForDay,
  CANONICAL_DAYS,
  formatModelPrediction,
  formatSigned,
  getDecisionId,
  getDecisionTitleById,
  getDelayedConsequenceContent,
  getMissionContent,
  getOptionTooltip,
  getResultNarrativeByDecisionId,
  type AppLang,
  type DaySubPhase,
  type GamePhase,
  type GameStats,
  type StatKey,
} from './data/missionData';
import {
  applyDay5DelayedIdempotent,
  applyDecisionIdempotent,
  createInitialSimulationState,
  evaluateOutcome,
  getEffectiveDecisionDelta,
  isCriticalFailure,
  isSustainabilityFragile,
  THRESHOLDS,
  type DecisionId,
  type MissionDay,
  type MissionSimulationState,
  type Resources,
} from './utils/missionEngine';
import {
  clampTutorialStep,
  readTutorialProgress,
  saveTutorialProgress,
  TOTAL_TUTORIAL_STEPS,
  type TutorialProgressState,
} from './utils/tutorialProgress';
import {
  getNautiSpecialLines,
  pickNautiLine,
  pickTickleLine,
} from './data/nautiLines';
import { isAppLang } from './locales';
import {
  CATALOG_STRINGS,
  DEMO_STRINGS,
  DESKTOP_STRINGS,
  PLATFORM_STRINGS,
  UI_STRINGS,
} from './data/uiStrings';
import { DESKTOP_APPS } from './data/desktopApps';
import { EPISODE_CATALOG, type EpisodeId } from './data/episodesCatalog';
import { getTraduciendoStudies } from './data/traduciendoContent';
import { getTraduciendoStrings } from './data/traduciendoStrings';
import type { TraduciendoProgressState } from './types/traduciendoCiencia';
import { createInitialTraduciendoState } from './utils/traduciendoEngine';
import { getEscuchaImaginaStrings } from './data/escuchaImaginaStrings';
import type { EscuchaEpisodeProgress } from './types/escuchaImagina';
import { getDetectivesStrings } from './data/detectivesNasaStrings';
import type {
  DetectiveCaseProgress,
  DetectivesSavedState,
} from './types/detectivesNasa';
import {
  createInitialDetectiveCaseProgress,
  readDetectivesSavedState,
  unlockDetectiveDiscovery,
} from './utils/detectivesStorage';
import { useSpeech } from './hooks/useSpeech';
import { useMusicAudio } from './hooks/useMusicAudio';
import type { MusicTheme } from './utils/musicEngine';
import { playUiTone } from './utils/soundFx';
import { LunarSceneBackdrop } from './components/LunarSceneBackdrop';
import { HudBar } from './components/HudBar';
import { NautiMascot } from './components/NautiMascot';
import {
  NautiCharacterRig,
  type NautiExpression,
  type NautiGaze,
  type NautiHandPose,
  type TickleIntensity,
} from './components/NautiCharacterRig';
import { NautiDesktop } from './components/NautiDesktop';
import { NautiMainMenu } from './components/NautiMainMenu';
import { EpisodeCatalogScreen } from './components/EpisodeCatalogScreen';
import {
  TraduciendoExperience,
  type TraduciendoView,
} from './components/TraduciendoExperience';
import {
  EscuchaImaginaExperience,
  createInitialEscuchaProgress,
  type EscuchaView,
} from './components/EscuchaImaginaExperience';
import {
  DetectivesNasaExperience,
  type DetectivesLibraryTab,
  type DetectivesView,
} from './components/DetectivesNasaExperience';
import { BibliotecaNasaExperience } from './components/BibliotecaNasaExperience';
import { getScientificLibraryStrings } from './data/scientificLibraryStrings';
import { ScientificLibraryProvider } from './utils/scientificLibraryStore';
import { WelcomeScreen } from './components/WelcomeScreen';
import { DemoExperience } from './components/DemoExperience';
import { TutorialExperience } from './components/TutorialExperience';
import { AudioModal } from './components/AudioModal';
import { HelpModelModal } from './components/HelpModelModal';
import { ModelHelpPanel } from './components/ModelHelpPanel';
import { NasaPhotoModal } from './components/NasaPhotoModal';
import { EduTooltip, TooltipProvider } from './components/EduTooltip';
import {
  EndMissionReport,
  type EndReportTab,
} from './components/EndMissionReport';
import {
  AguaStickerIcon,
  EnergiaStickerIcon,
  SaludStickerIcon,
} from './components/ResourceStickers';

const SCENE_FOCUS_STAT: (StatKey | 'research')[] = [
  'energia',
  'energia',
  'agua',
  'energia',
  'energia',
];

const TRIVIA_DAYS = [1, 3, 4] as const;

function readInitialAppLang(): AppLang {
  if (typeof window === 'undefined') return 'es';
  try {
    const raw = window.localStorage.getItem('nauti_audio_prefs_v1');
    if (!raw) return 'es';
    const parsed = JSON.parse(raw) as { audioLang?: unknown };
    return isAppLang(parsed.audioLang) ? parsed.audioLang : 'es';
  } catch {
    return 'es';
  }
}

export default function App() {
  const [lang, setLang] = useState<AppLang>(readInitialAppLang);
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [introView, setIntroView] = useState<
    | 'desktop'
    | 'platform'
    | 'catalog'
    | 'episode_intro'
    | 'traduciendo'
    | 'escucha_imagina'
    | 'detectives_nasa'
    | 'biblioteca_nasa'
  >('desktop');
  const [traduciendoView, setTraduciendoView] =
    useState<TraduciendoView>('intro');
  const [traduciendoProgress, setTraduciendoProgress] =
    useState<TraduciendoProgressState>(() => createInitialTraduciendoState());
  const [escuchaView, setEscuchaView] = useState<EscuchaView>('intro');
  const [escuchaProgress, setEscuchaProgress] =
    useState<EscuchaEpisodeProgress>(() => createInitialEscuchaProgress());
  const [detectivesView, setDetectivesView] = useState<DetectivesView>('intro');
  const [detectivesLibraryTab, setDetectivesLibraryTab] =
    useState<DetectivesLibraryTab>('cases');
  const [detectivesProgress, setDetectivesProgress] =
    useState<DetectiveCaseProgress>(() => createInitialDetectiveCaseProgress());
  const [detectivesSavedState, setDetectivesSavedState] =
    useState<DetectivesSavedState>(readDetectivesSavedState);
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<EpisodeId>(
    'ep-01-energia-aurora',
  );
  const [tutorialProgress, setTutorialProgress] =
    useState<TutorialProgressState>(readTutorialProgress);
  const tutorialReturnViewRef = useRef<'platform' | 'catalog' | 'episode_intro'>(
    'platform',
  );
  const [savedMissionPhase, setSavedMissionPhase] = useState<Exclude<
    GamePhase,
    'intro'
  > | null>(null);
  const [step, setStep] = useState<number>(0); // 0..4 => Day 1..5 in active mission; 0..3 in tutorial
  const [daySubPhase, setDaySubPhase] = useState<DaySubPhase>('decision');
  const [chosen, setChosen] = useState<number>(-1);
  const [hoveredOption, setHoveredOption] = useState<number>(-1);
  const [simState, setSimState] = useState<MissionSimulationState>(
    createInitialSimulationState,
  );
  const [science, setScience] = useState<number>(1);
  const [triviaDone, setTriviaDone] = useState<Record<number, number>>({});
  const [modelUsed, setModelUsed] = useState<boolean>(false);
  const [lastDecisionId, setLastDecisionId] = useState<DecisionId | null>(null);
  const [lastDeltas, setLastDeltas] = useState<Resources | null>(null);
  const [lastSpecialRuleApplied, setLastSpecialRuleApplied] =
    useState<boolean>(false);
  const [lastChoiceGood, setLastChoiceGood] = useState<boolean>(true);
  const [endTab, setEndTab] = useState<EndReportTab>('outcome');

  // Welcome launch transition state
  const [isLaunching, setIsLaunching] = useState<boolean>(false);
  const launchTimerRef = useRef<number | null>(null);

  // Isolated demonstration mode state (never mutates full-mission simState)
  const [demoOpen, setDemoOpen] = useState<boolean>(false);
  const [demoSelected, setDemoSelected] = useState<number | null>(null);
  const [demoSubmitted, setDemoSubmitted] = useState<boolean>(false);

  // Highlighted HUD meter & temporary story-driven eye gaze override
  const [highlightedStat, setHighlightedStat] = useState<
    StatKey | 'science' | 'research' | null
  >(null);
  const [storyGaze, setStoryGaze] = useState<NautiGaze | null>(null);
  const storyGazeTimerRef = useRef<number | null>(null);

  const preTutorialStepRef = useRef<number | null>(null);

  useEffect(() => {
    saveTutorialProgress(tutorialProgress);
  }, [tutorialProgress]);

  // Modals & audio state
  const [audioModalOpen, setAudioModalOpen] = useState<boolean>(false);
  const [activeToolModal, setActiveToolModal] = useState<'help' | 'model' | null>(
    null,
  );
  const [nasaPhotoOpen, setNasaPhotoOpen] = useState<boolean>(false);
  const [modelHelpOpen, setModelHelpOpen] = useState<boolean>(false);

  // Interactive tickling caption & sound cooldown refs
  const [tickleCaption, setTickleCaption] = useState<string | null>(null);
  const tickleTimerRef = useRef<number | null>(null);
  const nextTickleSoundAtRef = useRef<number>(0);
  const lastTickleLineRef = useRef<string | null>(null);

  const speech = useSpeech(lang);

  useEffect(() => {
    return () => {
      if (launchTimerRef.current) window.clearTimeout(launchTimerRef.current);
      if (storyGazeTimerRef.current) window.clearTimeout(storyGazeTimerRef.current);
      if (tickleTimerRef.current) window.clearTimeout(tickleTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!(phase === 'scene' && step === 0)) {
      setNasaPhotoOpen(false);
    }
  }, [phase, step]);

  const currentDay: MissionDay = Math.min(Math.max(step + 1, 1), 5) as MissionDay;
  const stats: GameStats = useMemo(
    () => ({
      energia: simState.resources.energy,
      salud: simState.resources.health,
      agua: simState.resources.water,
    }),
    [simState.resources],
  );
  const research = simState.resources.research;

  const t = UI_STRINGS[lang];
  const mission = useMemo(() => getMissionContent(lang), [lang]);
  const { outcomes, reflectionQuestions, triviaByDay } = mission;

  const currentScene = useMemo(
    () => buildSceneDataForDay(lang, currentDay, simState.decisions),
    [lang, currentDay, simState.decisions],
  );

  const currentCanonicalSpec = useMemo(
    () => (currentDay === 1 ? null : CANONICAL_DAYS[lang][currentDay]),
    [lang, currentDay],
  );

  const criticalKeys = useMemo(() => {
    const names: Record<keyof GameStats, string> = {
      energia: t.hudEnergy,
      salud: t.hudHealth,
      agua: t.hudWater,
    };
    return (Object.entries(stats) as [keyof GameStats, number][])
      .filter(([, val]) => val < THRESHOLDS.sustainability)
      .map(([k]) => names[k]);
  }, [stats, t]);

  const dead = isCriticalFailure(simState.resources);
  const fragile = isSustainabilityFragile(simState.resources);
  const isDanger =
    (dead || fragile) && phase !== 'intro' && phase !== 'tutorial';
  const outcomeId = evaluateOutcome(simState.resources);
  const outcomeSpec = outcomes[outcomeId];
  const fullVictory = outcomeId === 'SUSTAINABLE_MISSION';

  // Adaptive background soundtrack selection for every game moment
  const activeMusicTheme = useMemo<MusicTheme>(() => {
    if (phase === 'intro') {
      if (demoOpen) return 'tutorial';
      if (introView === 'escucha_imagina' && escuchaView === 'activity') {
        if (escuchaProgress.stage === 'timer') return 'practice';
        if (escuchaProgress.stage === 'reflection') return 'victory';
        return 'tutorial';
      }
      if (introView === 'detectives_nasa' && detectivesView === 'activity') {
        if (detectivesProgress.stage === 'resolved') return 'victory';
        return 'tutorial';
      }
      return 'menu';
    }
    if (phase === 'tutorial') {
      if (step === 6) return 'victory';
      return step === 5 ? 'practice' : 'tutorial';
    }
    if (phase === 'trivia') return 'trivia';
    if (phase === 'end') {
      if (outcomeId === 'SUSTAINABLE_MISSION') return 'victory';
      if (outcomeId === 'CRITICAL_FAILURE') return 'danger';
      return 'mission';
    }
    if (isDanger) return 'danger';
    return 'mission';
  }, [
    phase,
    demoOpen,
    introView,
    escuchaView,
    escuchaProgress.stage,
    detectivesView,
    detectivesProgress.stage,
    step,
    outcomeId,
    isDanger,
  ]);

  const audio = useMusicAudio(activeMusicTheme, speech.isSpeaking);

  // Sync live language toggle & HTML lang attribute without resetting mission progress
  useEffect(() => {
    if (audio.audioLang !== lang) {
      setLang(audio.audioLang);
    }
  }, [audio.audioLang, lang]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const customResultNarrative = useMemo(
    () => getResultNarrativeByDecisionId(lang, lastDecisionId),
    [lang, lastDecisionId],
  );

  const prevContextText = useMemo(() => {
    if (!currentCanonicalSpec || currentDay === 5) return '';
    const prevDay = (currentDay - 1) as 1 | 2 | 3;
    const prevId = simState.decisions[prevDay];
    if (!prevId) return '';
    return currentCanonicalSpec.context[prevId] ?? '';
  }, [currentCanonicalSpec, currentDay, simState.decisions]);

  const day5DelayedCards = useMemo(() => {
    return simState.delayedApplied
      .map((item) => {
        const content = getDelayedConsequenceContent(lang, item.key);
        return content ? { ...item, ...content } : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [simState.delayedApplied, lang]);

  const day5BonusActiveForSelection = useMemo(() => {
    if (currentDay !== 5 || chosen < 0 || !currentCanonicalSpec) return false;
    const picked = currentCanonicalSpec.options[chosen];
    return (
      picked?.id === 'FINAL_RESEARCH' &&
      simState.decisions[2] === 'SCHEDULE_SCIENCE'
    );
  }, [currentDay, chosen, currentCanonicalSpec, simState.decisions]);

  const welcomeLine = useMemo(() => pickNautiLine('welcome', 0, lang), [lang]);
  const launchLine = useMemo(() => pickNautiLine('launch', 0, lang), [lang]);

  const computeScreenNarration = useCallback(
    (targetLang: AppLang): string => {
      const lt = UI_STRINGS[targetLang];
      const lMission = getMissionContent(targetLang);
      const lScene = buildSceneDataForDay(
        targetLang,
        currentDay,
        simState.decisions,
      );
      const lCanonical =
        currentDay === 1 ? null : CANONICAL_DAYS[targetLang][currentDay];
      const lOutcomeSpec = lMission.outcomes[outcomeId];
      const lWelcome = pickNautiLine('welcome', 0, targetLang);
      const lLaunch = pickNautiLine('launch', 0, targetLang);

      if (phase === 'intro') {
        if (demoOpen) {
          const ld = DEMO_STRINGS[targetLang];
          if (demoSubmitted && demoSelected !== null && ld.options[demoSelected]) {
            const opt = ld.options[demoSelected];
            return `${opt.resultTitle}. ${opt.resultNarrative} ${opt.nautiReaction}`;
          }
          return `${ld.title}. ${ld.problem} ${ld.question}`;
        }
        if (introView === 'desktop') {
          return DESKTOP_STRINGS[targetLang].nautiPrompt;
        }
        if (introView === 'platform') {
          return PLATFORM_STRINGS[targetLang].nautiPrompt;
        }
        if (introView === 'catalog') {
          return CATALOG_STRINGS[targetLang].nautiPrompt;
        }
        if (introView === 'traduciendo') {
          const ts = getTraduciendoStrings(targetLang);
          if (traduciendoView === 'library') {
            return ts.librarySubtitle;
          }
          if (traduciendoView === 'activity' && traduciendoProgress.studyId) {
            const study = getTraduciendoStudies(targetLang).find(
              (st) => st.id === traduciendoProgress.studyId,
            );
            if (study) {
              if (traduciendoProgress.stage === 'discover') {
                return `${study.studentTitle}. ${study.storyParagraphs.join(' ')}`;
              }
              if (traduciendoProgress.stage === 'investigate') {
                return `${ts.investigateTitle}. ${ts.investigateHint}`;
              }
              if (traduciendoProgress.stage === 'debate') {
                return `${ts.debateTitle}. ${ts.debateTeamPrompt}`;
              }
              if (traduciendoProgress.stage === 'translate') {
                return `${ts.translateTitle}. ${ts.translateNautiPrompt}`;
              }
              return `${ts.shareTitle}. ${ts.shareNautiPrompt}`;
            }
          }
          return ts.introNautiPrompt;
        }
        if (introView === 'escucha_imagina') {
          if (escuchaView === 'activity') {
            return '';
          }
          const esStrings = getEscuchaImaginaStrings(targetLang);
          if (escuchaView === 'library') {
            return esStrings.librarySubtitle;
          }
          return esStrings.introParagraphs.join(' ');
        }
        if (introView === 'detectives_nasa') {
          if (detectivesView === 'activity') {
            return '';
          }
          const detStrings = getDetectivesStrings(targetLang);
          if (detectivesView === 'library') {
            return detectivesLibraryTab === 'discoveries'
              ? detStrings.discoveriesSubtitle
              : detStrings.librarySubtitle;
          }
          return detStrings.welcomeParagraphs.join(' ');
        }
        if (introView === 'biblioteca_nasa') {
          return getScientificLibraryStrings(targetLang).nautiStudentPrompt;
        }
        const ep =
          CATALOG_STRINGS[targetLang].episodes[selectedEpisodeId] ??
          CATALOG_STRINGS[targetLang].episodes['ep-01-energia-aurora'];
        return isLaunching
          ? lLaunch
          : `${lWelcome} ${ep.title}. ${ep.coverSynopsis}`;
      }
      if (phase === 'tutorial') {
        const ob = lt.tutorialOnboarding;
        if (step === 0) {
          return `${ob.section1.title}. ${ob.section1.intro} ${lt.hudEnergy}: ${lt.tutEnergyDesc} ${lt.hudWater}: ${lt.tutWaterDesc} ${lt.hudHealth}: ${lt.tutHealthDesc} ${lt.researchFullLabel}: ${lt.tutResearchDesc}`;
        }
        if (step === 1) {
          return `${ob.section2.title}. ${ob.section2.intro} ${ob.section2.researchCardTitle}: ${ob.section2.researchCardDesc} ${ob.section2.scienceCardTitle}: ${ob.section2.scienceCardDesc}`;
        }
        if (step === 2) {
          return `${ob.section3.title}. ${ob.section3.selectTitle}: ${ob.section3.selectBody} ${ob.section3.modelTitle}: ${ob.section3.modelBody} ${ob.section3.confirmTitle}: ${ob.section3.confirmBody} ${ob.section3.importantWarning}`;
        }
        if (step === 3) {
          const cardsText = ob.section4.cards
            .map((c) => `${c.heading}. ${c.body}`)
            .join(' ');
          return `${ob.section4.title}. ${ob.section4.intro} ${cardsText} ${ob.section4.distinctionBanner}`;
        }
        if (step === 4) {
          const rulesText = ob.section5.rules
            .map((r) => `${r.badge}: ${r.body}`)
            .join(' ');
          return `${ob.section5.title}. ${ob.section5.objectiveText} ${rulesText} ${ob.section5.triviaReminder}`;
        }
        if (step === 5) {
          return `${ob.practice.title}. ${ob.practice.subtitle}`;
        }
        return `${ob.completion.title}. ${ob.completion.paragraphs.join(' ')}`;
      }
      if (phase === 'scene') {
        if (nasaPhotoOpen) {
          return lt.nasaPhotoNautiComment;
        }
        if (activeToolModal === 'help') {
          return lScene.help;
        }
        if (activeToolModal === 'model') {
          if (chosen < 0) {
            return lScene.options.length === 2
              ? lt.modelSelectPromptTwo
              : lt.modelSelectPrompt;
          }
          return `${lt.optionPrefix} ${'ABC'[chosen]}: ${lScene.options[chosen][0]}. ${formatModelPrediction(lScene.options[chosen], targetLang)}`;
        }
        if (currentDay >= 2 && daySubPhase === 'briefing' && lCanonical) {
          const prevDay = (currentDay - 1) as 1 | 2 | 3;
          const prevId = simState.decisions[prevDay];
          const lPrevContext =
            currentDay !== 5 && prevId
              ? lCanonical.context[prevId] ?? ''
              : '';
          return `${lCanonical.title}. ${lCanonical.intro} ${lPrevContext}`.trim();
        }
        if (currentDay === 5 && daySubPhase === 'day5_delayed') {
          const cardsSummary = simState.delayedApplied
            .map((item) => {
              const c = getDelayedConsequenceContent(targetLang, item.key);
              return c ? `${c.title}. ${c.text}` : '';
            })
            .filter(Boolean)
            .join(' ');
          const critLead = dead ? `${lt.resultDeadTitle}. ` : '';
          return `${critLead}${lt.day5DelayedTitle}. ${cardsSummary}`.trim();
        }
        if (currentDay >= 2 && daySubPhase === 'confirm' && chosen >= 0) {
          const opt = lScene.options[chosen];
          return `${lt.confirmTitle} ${opt[0]}. ${opt[1]}`;
        }
        const statNames: Record<keyof GameStats, string> = {
          energia: lt.hudEnergy,
          salud: lt.hudHealth,
          agua: lt.hudWater,
        };
        const lCriticalKeys = (Object.entries(stats) as [keyof GameStats, number][])
          .filter(([, val]) => val < THRESHOLDS.sustainability)
          .map(([k]) => statNames[k]);
        const emergencyLead = isDanger
          ? `${lt.emergencyPrefix} ${lCriticalKeys.join(', ')}. `
          : '';
        return `${emergencyLead}${lScene.title}. ${lScene.story} ${lScene.question}`;
      }
      if (phase === 'result') {
        const deadLead = dead ? `${lt.resultDeadTitle}. ` : '';
        const lNarrative = getResultNarrativeByDecisionId(
          targetLang,
          lastDecisionId,
        );
        if (lNarrative) {
          return `${deadLead}${lNarrative.spokenNarration}`.trim();
        }
        return `${deadLead}${lt.resultTitle}`.trim();
      }
      if (phase === 'trivia') {
        const q = lMission.triviaByDay[currentDay as 1 | 3 | 4];
        if (!q) return lt.triviaBadge;
        const answered = triviaDone[currentDay];
        if (answered !== undefined) {
          const isCorrect = answered === q[2];
          return `${isCorrect ? lt.triviaCorrectTitle : lt.triviaWrongTitle}. ${q[3]}`;
        }
        return `${q[0]}`;
      }
      if (endTab === 'outcome') {
        return `${lOutcomeSpec.title}. ${lOutcomeSpec.story} ${lOutcomeSpec.nauti}`;
      }
      if (endTab === 'chart') {
        return `${lt.chartTitle}. ${lt.chartSubtitle}`;
      }
      if (endTab === 'history') {
        return `${lt.historyTitle}. ${lt.historySubtitle}`;
      }
      return `${lt.reflectionTitle}. ${lMission.reflectionQuestions.join(' ')}`;
    },
    [
      phase,
      introView,
      traduciendoView,
      traduciendoProgress.studyId,
      traduciendoProgress.stage,
      escuchaView,
      detectivesView,
      detectivesLibraryTab,
      demoOpen,
      demoSelected,
      demoSubmitted,
      isLaunching,
      selectedEpisodeId,
      step,
      nasaPhotoOpen,
      activeToolModal,
      chosen,
      currentDay,
      daySubPhase,
      simState.decisions,
      simState.delayedApplied,
      stats,
      isDanger,
      dead,
      lastDecisionId,
      triviaDone,
      endTab,
      outcomeId,
    ],
  );

  // Compute current screen narration text matching the selected language
  const narrationText = useMemo(
    () => computeScreenNarration(lang),
    [computeScreenNarration, lang],
  );

  const narrationFallbacks = useMemo(
    () =>
      lang === 'gn-PY'
        ? {
            es: computeScreenNarration('es'),
            en: computeScreenNarration('en'),
          }
        : undefined,
    [lang, computeScreenNarration],
  );

  // Automatic screen-transition narration with zero overlap
  const narrationTextRef = useRef(narrationText);
  narrationTextRef.current = narrationText;
  const narrationFallbacksRef = useRef(narrationFallbacks);
  narrationFallbacksRef.current = narrationFallbacks;
  const speakRef = useRef(speech.speak);
  speakRef.current = speech.speak;
  const stopRef = useRef(speech.stop);
  stopRef.current = speech.stop;
  const autoNarrateRef = useRef(speech.autoNarrate);
  autoNarrateRef.current = speech.autoNarrate;
  const volumeRef = useRef(speech.volume);
  volumeRef.current = speech.volume;

  const triviaAnsweredForDay =
    phase === 'trivia' ? triviaDone[currentDay] : undefined;
  const autoScreenKey = [
    lang,
    phase,
    phase === 'intro'
      ? demoOpen
        ? `demo-${demoSubmitted}`
        : introView === 'traduciendo'
          ? `traduciendo-${traduciendoView}-${traduciendoProgress.studyId ?? 'none'}-${traduciendoProgress.stage}`
          : introView === 'escucha_imagina'
            ? `escucha-${escuchaView}-${escuchaProgress.episodeId ?? 'none'}`
            : introView === 'detectives_nasa'
              ? `detectives-${detectivesView}-${detectivesLibraryTab}-${detectivesProgress.caseId ?? 'none'}`
              : introView === 'biblioteca_nasa'
                ? 'biblioteca-nasa'
                : introView
      : '',
    step,
    phase === 'scene' ? daySubPhase : '',
    phase === 'end' ? endTab : '',
    activeToolModal ?? '',
    activeToolModal === 'model' ? chosen : '',
    triviaAnsweredForDay ?? 'unanswered',
  ].join('|');

  const clearTickleCaption = useCallback(() => {
    if (tickleTimerRef.current) {
      window.clearTimeout(tickleTimerRef.current);
      tickleTimerRef.current = null;
    }
    setTickleCaption(null);
  }, []);

  useEffect(() => {
    clearTickleCaption();
  }, [autoScreenKey, nasaPhotoOpen, clearTickleCaption]);

  useEffect(() => {
    if (isLaunching) return;

    stopRef.current();

    if (!autoNarrateRef.current || volumeRef.current <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (autoNarrateRef.current && volumeRef.current > 0) {
        speakRef.current(narrationTextRef.current, {
          force: false,
          isAuto: true,
          fallbackTexts: narrationFallbacksRef.current,
        });
      }
    }, 380);

    return () => {
      window.clearTimeout(timer);
    };
  }, [autoScreenKey, isLaunching]);

  const handleReadCurrent = useCallback(() => {
    clearTickleCaption();
    speech.markUserUnlocked();
    if (
      lang === 'gn-PY' &&
      !speech.isGuaraniVoiceSupported &&
      speech.guaraniFallbackMode === 'none'
    ) {
      setAudioModalOpen(true);
      return;
    }
    speech.speak(narrationText, {
      force: true,
      fallbackTexts: narrationFallbacks,
    });
  }, [speech, narrationText, narrationFallbacks, lang, clearTickleCaption]);

  const handleReadTraduciendo = useCallback(
    (customText?: string) => {
      if (!customText) {
        handleReadCurrent();
        return;
      }
      clearTickleCaption();
      speech.markUserUnlocked();
      if (
        lang === 'gn-PY' &&
        !speech.isGuaraniVoiceSupported &&
        speech.guaraniFallbackMode === 'none'
      ) {
        setAudioModalOpen(true);
        return;
      }
      speech.speak(customText, {
        force: true,
        fallbackTexts:
          lang === 'gn-PY'
            ? {
                es: customText,
                en: computeScreenNarration('en'),
              }
            : undefined,
      });
    },
    [
      handleReadCurrent,
      clearTickleCaption,
      speech,
      lang,
      computeScreenNarration,
    ],
  );

  const handleToggleSpeak = useCallback(() => {
    clearTickleCaption();
    if (speech.isSpeaking) {
      speech.stop();
    } else {
      speech.markUserUnlocked();
      if (
        lang === 'gn-PY' &&
        !speech.isGuaraniVoiceSupported &&
        speech.guaraniFallbackMode === 'none'
      ) {
        setAudioModalOpen(true);
        return;
      }
      speech.speak(narrationText, {
        force: true,
        fallbackTexts: narrationFallbacks,
      });
    }
  }, [speech, narrationText, narrationFallbacks, lang, clearTickleCaption]);

  const handleTickleSound = useCallback(
    (_intensity: TickleIntensity) => {
      if (
        speech.isSpeaking ||
        isLaunching ||
        activeToolModal !== null ||
        nasaPhotoOpen ||
        audioModalOpen
      ) {
        return;
      }

      const now = performance.now();
      if (now < nextTickleSoundAtRef.current) return;

      nextTickleSoundAtRef.current = now + 5500 + Math.random() * 2200;

      const line = pickTickleLine(lang, lastTickleLineRef.current);
      lastTickleLineRef.current = line;
      setTickleCaption(line);

      if (tickleTimerRef.current) {
        window.clearTimeout(tickleTimerRef.current);
      }
      tickleTimerRef.current = window.setTimeout(() => {
        setTickleCaption(null);
        tickleTimerRef.current = null;
      }, 2150);

      playUiTone('giggle', audio.sfxEnabled, false);

      if (
        speech.volume > 0 &&
        speech.voiceOn &&
        speech.audioUnlocked &&
        !speech.isSpeaking
      ) {
        speech.speak(line, {
          force: false,
          isAuto: false,
          pitchBoost: 0.14,
          rateBoost: 0.08,
          suppressBlockedPrompt: true,
          fallbackTexts: {
            es: pickTickleLine('es'),
            en: pickTickleLine('en'),
          },
        });
      }
    },
    [
      audio.sfxEnabled,
      speech,
      lang,
      isLaunching,
      activeToolModal,
      nasaPhotoOpen,
      audioModalOpen,
    ],
  );

  // Dynamic NAUTI personality & temporary story-driven eye gaze
  const nautiBehavior = useMemo((): {
    message: string;
    mood: NautiExpression;
    gaze: NautiGaze;
    handPose: NautiHandPose;
    badge: string;
  } => {
    const activeStoryGaze = storyGaze ?? 'center';

    if (phase === 'tutorial') {
      return {
        message: pickNautiLine('tutorial', step, lang),
        mood:
          step === 6
            ? 'celebrate'
            : step === 2 || step === 3
              ? 'surprised'
              : 'thinking',
        gaze: activeStoryGaze,
        handPose: step === 6 ? 'wave' : 'none',
        badge:
          t.tutorialOnboarding.sectionBadges[step] ??
          `${t.tutBadgePrefix} · ${step + 1}/${TOTAL_TUTORIAL_STEPS}`,
      };
    }

    if (phase === 'scene') {
      if (nasaPhotoOpen) {
        return {
          message: t.nasaPhotoNautiComment,
          mood: 'happy',
          gaze: activeStoryGaze,
          handPose: 'none',
          badge: t.nasaPhotoBadge,
        };
      }
      if (activeToolModal === 'help') {
        return {
          message: pickNautiLine('help', step, lang),
          mood: 'surprised',
          gaze: activeStoryGaze,
          handPose: 'none',
          badge: t.helpBadge,
        };
      }
      if (activeToolModal === 'model') {
        return {
          message: pickNautiLine('model', step, lang),
          mood: 'thinking',
          gaze: activeStoryGaze,
          handPose: 'none',
          badge: t.modelBadge,
        };
      }

      if (currentDay >= 2 && daySubPhase === 'briefing' && currentCanonicalSpec) {
        return {
          message: currentCanonicalSpec.intro,
          mood: isDanger ? 'danger' : 'happy',
          gaze: activeStoryGaze,
          handPose: 'none',
          badge: t.briefingBadge(currentDay),
        };
      }

      if (currentDay === 5 && daySubPhase === 'day5_delayed') {
        const hasPenalty = day5DelayedCards.some(
          (c) =>
            (c.effects.energy ?? 0) < 0 ||
            (c.effects.water ?? 0) < 0 ||
            (c.effects.health ?? 0) < 0,
        );
        const nautiSpecial = getNautiSpecialLines(lang);
        return {
          message: dead
            ? pickNautiLine('evacuation', step, lang)
            : hasPenalty
              ? nautiSpecial.day5DelayedPenaltyNauti
              : nautiSpecial.day5DelayedSafeNauti,
          mood: dead || isDanger ? 'danger' : hasPenalty ? 'thinking' : 'celebrate',
          gaze: activeStoryGaze,
          handPose: 'none',
          badge: t.delayedBadge,
        };
      }

      if (currentDay >= 2 && daySubPhase === 'confirm') {
        const nautiSpecial = getNautiSpecialLines(lang);
        return {
          message: nautiSpecial.confirmStepNauti,
          mood: isDanger ? 'danger' : 'thinking',
          gaze: activeStoryGaze,
          handPose: 'none',
          badge: t.confirmBadge(currentDay),
        };
      }

      const activeLook = hoveredOption >= 0 ? hoveredOption : chosen;
      return {
        message: isDanger
          ? pickNautiLine('sceneDanger', step, lang)
          : pickNautiLine('sceneIdle', step, lang),
        mood: isDanger
          ? 'danger'
          : modelUsed
            ? 'surprised'
            : activeLook >= 0
              ? 'thinking'
              : 'normal',
        gaze: activeStoryGaze,
        handPose: 'none',
        badge: t.sceneBadge(currentDay),
      };
    }

    if (phase === 'result') {
      if (customResultNarrative && !dead) {
        return {
          message: customResultNarrative.nautiDialogue,
          mood: isDanger ? 'danger' : customResultNarrative.nautiMood,
          gaze: activeStoryGaze,
          handPose: 'none',
          badge: t.resultReportBadge(currentDay),
        };
      }
      return {
        message: dead
          ? pickNautiLine('evacuation', step, lang)
          : lastChoiceGood
            ? pickNautiLine('goodDecision', step, lang)
            : pickNautiLine('riskDecision', step, lang),
        mood: dead || isDanger ? 'danger' : lastChoiceGood ? 'celebrate' : 'thinking',
        gaze: activeStoryGaze,
        handPose: 'none',
        badge: t.resultReportBadge(currentDay),
      };
    }

    if (phase === 'trivia') {
      const q = triviaByDay[currentDay as 1 | 3 | 4];
      const answered = triviaDone[currentDay];
      const correct = answered !== undefined && q && answered === q[2];
      if (answered === undefined) {
        return {
          message: t.triviaNautiPrompt,
          mood: 'thinking',
          gaze: activeStoryGaze,
          handPose: 'none',
          badge: t.triviaNautiBadge,
        };
      }
      return {
        message: correct
          ? pickNautiLine('triviaRight', step, lang)
          : pickNautiLine('triviaWrong', step, lang),
        mood: correct ? 'celebrate' : 'surprised',
        gaze: activeStoryGaze,
        handPose: 'none',
        badge: correct ? t.triviaEurekaBadge : t.triviaLearnBadge,
      };
    }

    // End phase
    return {
      message: outcomeSpec.nauti,
      mood:
        outcomeId === 'SUSTAINABLE_MISSION'
          ? 'celebrate'
          : outcomeId === 'CRITICAL_FAILURE'
            ? 'danger'
            : 'happy',
      gaze: activeStoryGaze,
      handPose: 'none',
      badge: t.endBadge,
    };
  }, [
    storyGaze,
    phase,
    step,
    currentDay,
    daySubPhase,
    currentCanonicalSpec,
    day5DelayedCards,
    lang,
    t,
    nasaPhotoOpen,
    activeToolModal,
    hoveredOption,
    chosen,
    isDanger,
    modelUsed,
    dead,
    customResultNarrative,
    lastChoiceGood,
    triviaDone,
    triviaByDay,
    outcomeSpec,
    outcomeId,
  ]);

  // Temporary story-driven glance
  const triggerStoryGaze = useCallback(
    (target: NautiGaze | null, durationMs = 1650) => {
      if (storyGazeTimerRef.current) {
        window.clearTimeout(storyGazeTimerRef.current);
        storyGazeTimerRef.current = null;
      }
      setStoryGaze(target);
      if (target && target !== 'center') {
        storyGazeTimerRef.current = window.setTimeout(() => {
          setStoryGaze(null);
        }, durationMs);
      }
    },
    [],
  );

  // Pulse indicator highlight & momentarily look toward changed HUD indicator
  const triggerStatHighlight = useCallback(
    (target: StatKey | 'science' | 'research' | null) => {
      setHighlightedStat(target);
      if (target) {
        triggerStoryGaze('up-right', 1750);
      }
    },
    [triggerStoryGaze],
  );

  const resetAllMissionState = useCallback(() => {
    clearTickleCaption();
    speech.stop();
    setStep(0);
    setDaySubPhase('decision');
    setChosen(-1);
    setHoveredOption(-1);
    setSimState(createInitialSimulationState());
    setScience(1);
    setTriviaDone({});
    setModelUsed(false);
    setLastDecisionId(null);
    setLastDeltas(null);
    setLastSpecialRuleApplied(false);
    setLastChoiceGood(true);
    setEndTab('outcome');
    setActiveToolModal(null);
    setHighlightedStat(null);
  }, [clearTickleCaption, speech]);

  const startTutorial = (
    returnView: 'platform' | 'catalog' | 'episode_intro' = 'platform',
    forceRestartForReview = false,
  ) => {
    clearTickleCaption();
    audio.unlockAndStart();
    speech.stop();
    speech.markUserUnlocked();
    playUiTone('confirm', audio.sfxEnabled, false);
    tutorialReturnViewRef.current = returnView;
    preTutorialStepRef.current = step;
    const resumeStep =
      forceRestartForReview || tutorialProgress.completed
        ? 0
        : clampTutorialStep(tutorialProgress.currentStep);
    setPhase('tutorial');
    setStep(resumeStep);
    triggerStatHighlight(resumeStep === 0 ? 'energia' : null);
  };

  // Actions
  const handleLaunchFromWelcome = () => {
    if (isLaunching) return;
    if (!tutorialProgress.completed) {
      startTutorial('platform');
      return;
    }
    resetAllMissionState();
    setSavedMissionPhase(null);
    setDemoOpen(false);
    setDemoSelected(null);
    setDemoSubmitted(false);
    setIsLaunching(true);
    audio.unlockAndStart();
    speech.markUserUnlocked();
    playUiTone('success', audio.sfxEnabled, speech.isSpeaking);
    if (speech.volume > 0 && speech.autoNarrate) {
      speech.speak(launchLine, {
        force: true,
        fallbackTexts: {
          es: pickNautiLine('launch', 0, 'es'),
          en: pickNautiLine('launch', 0, 'en'),
        },
      });
    }
    launchTimerRef.current = window.setTimeout(() => {
      setIsLaunching(false);
      setStep(0);
      setDaySubPhase('decision');
      setChosen(-1);
      setPhase('scene');
      triggerStatHighlight('energia');
      window.setTimeout(() => setHighlightedStat(null), 1800);
    }, 1450);
  };

  const handleResumeSavedMission = () => {
    if (!savedMissionPhase) return;
    if (!tutorialProgress.completed) {
      startTutorial('platform');
      return;
    }
    clearTickleCaption();
    setDemoOpen(false);
    audio.unlockAndStart();
    speech.markUserUnlocked();
    playUiTone('success', audio.sfxEnabled, false);
    setPhase(savedMissionPhase);
  };

  const pauseTutorial = (tone: 'tap' | 'confirm' = 'tap') => {
    clearTickleCaption();
    speech.stop();
    playUiTone(tone, audio.sfxEnabled, false);
    if (!tutorialProgress.completed) {
      setTutorialProgress((prev) => ({
        ...prev,
        currentStep: clampTutorialStep(step),
      }));
    }
    if (preTutorialStepRef.current !== null) {
      setStep(preTutorialStepRef.current);
      preTutorialStepRef.current = null;
    } else {
      setStep(0);
    }
    setHighlightedStat(null);
    setIntroView(
      tutorialProgress.completed ? tutorialReturnViewRef.current : 'platform',
    );
    setPhase('intro');
  };

  const completeTutorialAndOpenCatalog = () => {
    clearTickleCaption();
    speech.stop();
    playUiTone('success', audio.sfxEnabled, false);
    setTutorialProgress({
      completed: true,
      currentStep: TOTAL_TUTORIAL_STEPS - 1,
      practiceCompleted: true,
    });
    if (preTutorialStepRef.current !== null) {
      setStep(preTutorialStepRef.current);
      preTutorialStepRef.current = null;
    } else {
      setStep(0);
    }
    setHighlightedStat(null);
    setIntroView('catalog');
    setPhase('intro');
  };

  const handleBackToCatalogFromMission = () => {
    if (phase === 'tutorial') {
      pauseTutorial('tap');
      return;
    }
    clearTickleCaption();
    speech.stop();
    playUiTone('tap', audio.sfxEnabled, false);
    if (phase === 'end') {
      setSavedMissionPhase(null);
      resetAllMissionState();
    } else if (phase !== 'intro') {
      setSavedMissionPhase(phase);
    }
    setDemoOpen(false);
    setIntroView('catalog');
    setPhase('intro');
  };

  const handleOpenHelp = () => {
    speech.markUserUnlocked();
    playUiTone('science', audio.sfxEnabled, speech.isSpeaking);
    setActiveToolModal('help');
    triggerStatHighlight(SCENE_FOCUS_STAT[step] || 'energia');
  };

  const handleModel = () => {
    speech.markUserUnlocked();
    if (modelUsed) {
      playUiTone('science', audio.sfxEnabled, speech.isSpeaking);
      setActiveToolModal('model');
      triggerStoryGaze('up', 1400);
      return;
    }
    if (science < 1) return;
    playUiTone('science', audio.sfxEnabled, speech.isSpeaking);
    setScience((s) => s - 1);
    setModelUsed(true);
    setActiveToolModal('model');
    triggerStatHighlight('science');
  };

  const handleEnterDay5Delayed = () => {
    speech.stop();
    speech.markUserUnlocked();
    const nextSim = applyDay5DelayedIdempotent(simState);
    setSimState(nextSim);

    const hasPenalty = nextSim.delayedApplied.some(
      (d) =>
        (d.effects.energy ?? 0) < 0 ||
        (d.effects.water ?? 0) < 0 ||
        (d.effects.health ?? 0) < 0,
    );

    playUiTone(
      nextSim.haltedByCriticalFailure || hasPenalty ? 'alert' : 'success',
      audio.sfxEnabled,
      false,
    );

    if (nextSim.delayedApplied.some((d) => (d.effects.water ?? 0) < 0)) {
      triggerStatHighlight('agua');
    } else if (nextSim.delayedApplied.some((d) => (d.effects.energy ?? 0) < 0)) {
      triggerStatHighlight('energia');
    }

    setDaySubPhase('day5_delayed');
  };

  const confirmChoice = () => {
    if (chosen < 0) return;
    speech.stop();
    speech.markUserUnlocked();

    const decisionId = getDecisionId(currentDay, chosen);
    const decisionTitle = getDecisionTitleById(lang, currentDay, decisionId);

    // Strictly idempotent: never apply twice if already transacted for this day
    const alreadyApplied = simState.appliedTransactions.includes(
      `decision_day_${currentDay}`,
    );
    if (alreadyApplied || simState.haltedByCriticalFailure) {
      setActiveToolModal(null);
      setPhase('result');
      return;
    }

    const { effects, specialRuleApplied } = getEffectiveDecisionDelta(
      currentDay,
      decisionId,
      simState.decisions,
    );

    const nextSim = applyDecisionIdempotent(
      simState,
      currentDay,
      decisionId,
      decisionTitle,
    );
    const willFail = nextSim.haltedByCriticalFailure;
    const netPositive =
      !willFail &&
      effects.energy + effects.health + effects.water + effects.research * 2 >= -2;

    playUiTone(
      willFail ? 'alert' : netPositive ? 'success' : 'confirm',
      audio.sfxEnabled,
      false,
    );

    const deltaPairs: [StatKey | 'research', number][] = [
      ['energia', Math.abs(effects.energy)],
      ['salud', Math.abs(effects.health)],
      ['agua', Math.abs(effects.water)],
      ['research', Math.abs(effects.research) * 3],
    ];
    deltaPairs.sort((a, b) => b[1] - a[1]);
    triggerStatHighlight(deltaPairs[0][0]);

    setSimState(nextSim);
    setLastDecisionId(decisionId);
    setLastDeltas(effects);
    setLastSpecialRuleApplied(specialRuleApplied);
    setLastChoiceGood(netPositive);
    setActiveToolModal(null);
    setPhase('result');
  };

  const advanceToNextDay = () => {
    speech.stop();
    speech.markUserUnlocked();
    playUiTone('tap', audio.sfxEnabled, false);
    const nextStep = step + 1;
    setStep(nextStep);
    setDaySubPhase(nextStep === 0 ? 'decision' : 'briefing');
    setChosen(-1);
    setHoveredOption(-1);
    setModelUsed(false);
    setActiveToolModal(null);
    setLastDecisionId(null);
    setLastDeltas(null);
    setLastSpecialRuleApplied(false);
    setHighlightedStat(null);
    setPhase('scene');
  };

  const hasTriviaAfterCurrentDay = (TRIVIA_DAYS as readonly number[]).includes(
    currentDay,
  );

  const handleResultContinue = () => {
    speech.stop();
    speech.markUserUnlocked();
    setHighlightedStat(null);
    if (dead || currentDay === 5) {
      playUiTone(
        fullVictory ? 'success' : dead ? 'alert' : 'confirm',
        audio.sfxEnabled,
        false,
      );
      setEndTab('outcome');
      setPhase('end');
    } else if (hasTriviaAfterCurrentDay) {
      playUiTone('science', audio.sfxEnabled, false);
      setPhase('trivia');
    } else {
      advanceToNextDay();
    }
  };

  const handleAnswerTrivia = (index: number) => {
    if (triviaDone[currentDay] !== undefined) return;
    speech.markUserUnlocked();
    const q = triviaByDay[currentDay as 1 | 3 | 4];
    if (!q) return;
    const isCorrect = index === q[2];
    playUiTone(isCorrect ? 'success' : 'tap', audio.sfxEnabled, speech.isSpeaking);
    setTriviaDone((prev) => ({ ...prev, [currentDay]: index }));
    if (isCorrect) {
      setScience((s) => s + 1);
      triggerStatHighlight('science');
    }
  };

  const downloadLog = () => {
    playUiTone('confirm', audio.sfxEnabled, speech.isSpeaking);
    const data = {
      simulador: t.logSimTitle,
      idioma: lang,
      resultadoFinal: outcomeId,
      indicadoresFinales: simState.resources,
      cienciaParaModelar: science,
      evolucionRecursos: simState.snapshots,
      efectosDiferidosJornada5: simState.delayedApplied,
      decisiones: simState.history,
    };
    const a = document.createElement('a');
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    a.href = URL.createObjectURL(blob);
    a.download = 'NAUTI_bitacora.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const replayMission = () => {
    speech.markUserUnlocked();
    playUiTone('confirm', audio.sfxEnabled, false);
    setSavedMissionPhase(null);
    resetAllMissionState();
    setPhase('scene');
  };

  const returnToMainMenu = () => {
    speech.markUserUnlocked();
    playUiTone('confirm', audio.sfxEnabled, false);
    setSavedMissionPhase(null);
    resetAllMissionState();
    setIntroView('catalog');
    setPhase('intro');
  };

  const isDay1DecisionScreen = currentDay === 1;
  const isDays2To5Decision =
    currentDay >= 2 && daySubPhase === 'decision';
  const showDecisionCards = isDay1DecisionScreen || isDays2To5Decision;

  useEffect(() => {
    if (!(phase === 'scene' && showDecisionCards)) {
      setModelHelpOpen(false);
    }
  }, [phase, showDecisionCards]);

  return (
    <ScientificLibraryProvider>
      <TooltipProvider>
        <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-[#07173b] text-[#f4fcff]">
        {/* Portrait Orientation Guard for Narrow Mobile Screens */}
        <div className="portrait-guard fixed inset-0 z-[999] flex-col items-center justify-center gap-4 bg-[#07173b] p-7 text-center">
          <div className="w-44">
            <NautiCharacterRig
              expression="surprised"
              gaze="center"
              handPose="wave"
              interactiveTickle={false}
            />
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#facc15] text-[#08265b] shadow-lg">
            <RotateCw
              className="h-7 w-7 animate-spin"
              style={{ animationDuration: '4s' }}
            />
          </div>
          <div className="max-w-xs space-y-2">
            <h2 className="text-2xl font-black text-white">{t.portraitTitle}</h2>
            <p className="text-sm font-semibold text-[#9df8ff]">{t.portraitBody}</p>
          </div>
        </div>

        {/* Dynamic Offline Vector Lunar Backdrop */}
        <LunarSceneBackdrop
          phase={phase}
          step={step}
          isDanger={isDanger}
          isVictory={phase === 'end' && fullVictory}
        />

        {/* PHASE 0: NAUTI MAIN MENU -> EFECTO DOMINÓ EPISODE CATALOG -> EPISODE INTRO & DEMO */}
        {phase === 'intro' ? (
          demoOpen ? (
            <DemoExperience
              selectedOption={demoSelected}
              submitted={demoSubmitted}
              onSelectOption={(idx) => {
                speech.markUserUnlocked();
                playUiTone('tap', audio.sfxEnabled, speech.isSpeaking);
                setDemoSelected(idx);
              }}
              onSubmitDecision={() => {
                if (demoSelected === null) return;
                speech.stop();
                speech.markUserUnlocked();
                playUiTone('confirm', audio.sfxEnabled, false);
                setDemoSubmitted(true);
              }}
              onRetryDemo={() => {
                speech.stop();
                speech.markUserUnlocked();
                playUiTone('tap', audio.sfxEnabled, false);
                setDemoSelected(null);
                setDemoSubmitted(false);
              }}
              onBackToWelcome={() => {
                speech.stop();
                speech.markUserUnlocked();
                playUiTone('tap', audio.sfxEnabled, false);
                setDemoOpen(false);
                setDemoSelected(null);
                setDemoSubmitted(false);
              }}
              audio={audio}
              speech={speech}
              onOpenVoiceModal={() => {
                playUiTone('tap', audio.sfxEnabled, speech.isSpeaking);
                setAudioModalOpen(true);
              }}
              onReplayCurrent={handleReadCurrent}
              onToggleSpeak={handleToggleSpeak}
              tickleCaption={tickleCaption}
              onTickleSound={handleTickleSound}
            />
          ) : introView === 'desktop' ? (
            <NautiDesktop
              isSpeaking={speech.isSpeaking}
              mouthPulse={speech.mouthPulse}
              audio={audio}
              speech={speech}
              onListenPrompt={handleReadCurrent}
              onStopVoice={speech.stop}
              onOpenVoiceSettings={() => {
                playUiTone('tap', audio.sfxEnabled, speech.isSpeaking);
                setAudioModalOpen(true);
              }}
              onOpenApp={(appId) => {
                const targetApp = DESKTOP_APPS.find((a) => a.id === appId);
                if (
                  !targetApp ||
                  (targetApp.status !== 'available' &&
                    targetApp.status !== 'in_preparation')
                ) {
                  return;
                }
                clearTickleCaption();
                audio.unlockAndStart();
                speech.markUserUnlocked();
                playUiTone('confirm', audio.sfxEnabled, false);
                if (targetApp.destination === 'efecto_domino_welcome') {
                  if (!tutorialProgress.completed) {
                    startTutorial('platform');
                  } else {
                    setIntroView('platform');
                  }
                } else if (
                  targetApp.destination === 'traduciendo_ciencia_intro'
                ) {
                  setTraduciendoView('intro');
                  setIntroView('traduciendo');
                } else if (
                  targetApp.destination === 'escucha_imagina_intro'
                ) {
                  setEscuchaView('intro');
                  setIntroView('escucha_imagina');
                } else if (
                  targetApp.destination === 'detectives_nasa_intro'
                ) {
                  setDetectivesView('intro');
                  setDetectivesLibraryTab('cases');
                  setIntroView('detectives_nasa');
                } else if (
                  targetApp.destination === 'biblioteca_nasa_intro'
                ) {
                  setIntroView('biblioteca_nasa');
                }
              }}
              tickleCaption={tickleCaption}
              onTickleSound={handleTickleSound}
            />
          ) : introView === 'biblioteca_nasa' ? (
            <BibliotecaNasaExperience
              audio={audio}
              speech={speech}
              onListen={handleReadTraduciendo}
              onStopVoice={speech.stop}
              onOpenVoiceSettings={() => {
                playUiTone('tap', audio.sfxEnabled, speech.isSpeaking);
                setAudioModalOpen(true);
              }}
              onBackToDesktop={() => {
                clearTickleCaption();
                speech.stop();
                playUiTone('tap', audio.sfxEnabled, false);
                setIntroView('desktop');
              }}
              tickleCaption={tickleCaption}
              onTickleSound={handleTickleSound}
            />
          ) : introView === 'escucha_imagina' ? (
            <EscuchaImaginaExperience
              view={escuchaView}
              onChangeView={(nextView) => {
                clearTickleCaption();
                playUiTone('tap', audio.sfxEnabled, false);
                setEscuchaView(nextView);
              }}
              progress={escuchaProgress}
              onChangeProgress={setEscuchaProgress}
              audio={audio}
              speech={speech}
              onListen={handleReadTraduciendo}
              onStopVoice={speech.stop}
              onOpenVoiceSettings={() => {
                playUiTone('tap', audio.sfxEnabled, speech.isSpeaking);
                setAudioModalOpen(true);
              }}
              onBackToDesktop={() => {
                clearTickleCaption();
                speech.stop();
                playUiTone('tap', audio.sfxEnabled, false);
                setIntroView('desktop');
              }}
              tickleCaption={tickleCaption}
              onTickleSound={handleTickleSound}
            />
          ) : introView === 'detectives_nasa' ? (
            <DetectivesNasaExperience
              view={detectivesView}
              onChangeView={(nextView) => {
                clearTickleCaption();
                playUiTone('tap', audio.sfxEnabled, false);
                setDetectivesView(nextView);
              }}
              libraryTab={detectivesLibraryTab}
              onChangeLibraryTab={(nextTab) => {
                clearTickleCaption();
                playUiTone('tap', audio.sfxEnabled, false);
                setDetectivesLibraryTab(nextTab);
              }}
              progress={detectivesProgress}
              onChangeProgress={setDetectivesProgress}
              savedState={detectivesSavedState}
              onCaseSolved={(solvedCaseId) => {
                setDetectivesSavedState((prev) =>
                  unlockDetectiveDiscovery(prev, solvedCaseId),
                );
              }}
              audio={audio}
              speech={speech}
              onListen={handleReadTraduciendo}
              onStopVoice={speech.stop}
              onOpenVoiceSettings={() => {
                playUiTone('tap', audio.sfxEnabled, speech.isSpeaking);
                setAudioModalOpen(true);
              }}
              onBackToDesktop={() => {
                clearTickleCaption();
                speech.stop();
                playUiTone('tap', audio.sfxEnabled, false);
                setIntroView('desktop');
              }}
              tickleCaption={tickleCaption}
              onTickleSound={handleTickleSound}
            />
          ) : introView === 'traduciendo' ? (
            <TraduciendoExperience
              view={traduciendoView}
              onChangeView={(nextView) => {
                clearTickleCaption();
                playUiTone('tap', audio.sfxEnabled, false);
                setTraduciendoView(nextView);
              }}
              progress={traduciendoProgress}
              onChangeProgress={setTraduciendoProgress}
              audio={audio}
              speech={speech}
              onListen={handleReadTraduciendo}
              onStopVoice={speech.stop}
              onOpenVoiceSettings={() => {
                playUiTone('tap', audio.sfxEnabled, speech.isSpeaking);
                setAudioModalOpen(true);
              }}
              onBackToDesktop={() => {
                clearTickleCaption();
                speech.stop();
                playUiTone('tap', audio.sfxEnabled, false);
                setIntroView('desktop');
              }}
              tickleCaption={tickleCaption}
              onTickleSound={handleTickleSound}
            />
          ) : introView === 'platform' ? (
            <NautiMainMenu
              tutorialCompleted={tutorialProgress.completed}
              tutorialSavedStep={tutorialProgress.currentStep}
              isSpeaking={speech.isSpeaking}
              mouthPulse={speech.mouthPulse}
              audio={audio}
              speech={speech}
              onListenPrompt={handleReadCurrent}
              onStopVoice={speech.stop}
              onOpenVoiceSettings={() => {
                playUiTone('tap', audio.sfxEnabled, speech.isSpeaking);
                setAudioModalOpen(true);
              }}
              onBackToDesktop={() => {
                clearTickleCaption();
                speech.stop();
                playUiTone('tap', audio.sfxEnabled, false);
                setIntroView('desktop');
              }}
              onEnterEfectoDomino={() => {
                if (!tutorialProgress.completed) {
                  startTutorial('platform');
                  return;
                }
                clearTickleCaption();
                audio.unlockAndStart();
                speech.markUserUnlocked();
                playUiTone('confirm', audio.sfxEnabled, false);
                setIntroView('catalog');
              }}
              onStartTutorial={() =>
                startTutorial('platform', tutorialProgress.completed)
              }
              tickleCaption={tickleCaption}
              onTickleSound={handleTickleSound}
            />
          ) : introView === 'catalog' ? (
            <EpisodeCatalogScreen
              hasSavedMission={savedMissionPhase !== null}
              savedDayNumber={currentDay}
              isSpeaking={speech.isSpeaking}
              mouthPulse={speech.mouthPulse}
              audio={audio}
              speech={speech}
              onListenPrompt={handleReadCurrent}
              onStopVoice={speech.stop}
              onOpenVoiceSettings={() => {
                playUiTone('tap', audio.sfxEnabled, speech.isSpeaking);
                setAudioModalOpen(true);
              }}
              onBackToDesktop={() => {
                clearTickleCaption();
                speech.stop();
                playUiTone('tap', audio.sfxEnabled, false);
                setIntroView('desktop');
              }}
              onBackToNauti={() => {
                clearTickleCaption();
                speech.stop();
                playUiTone('tap', audio.sfxEnabled, false);
                setIntroView('platform');
              }}
              onSelectEpisode={(episodeId) => {
                if (!tutorialProgress.completed) {
                  startTutorial('platform');
                  return;
                }
                const targetEpisode = EPISODE_CATALOG.find(
                  (ep) => ep.id === episodeId,
                );
                if (!targetEpisode || targetEpisode.status !== 'available') {
                  return;
                }
                clearTickleCaption();
                audio.unlockAndStart();
                speech.markUserUnlocked();
                playUiTone('confirm', audio.sfxEnabled, false);
                setSelectedEpisodeId(episodeId);
                setIntroView('episode_intro');
              }}
              onResumeSavedMission={handleResumeSavedMission}
              onReviewTutorial={() => startTutorial('catalog', true)}
            />
          ) : (
            <WelcomeScreen
              episodeId={selectedEpisodeId}
              welcomeLine={welcomeLine}
              launchLine={launchLine}
              isLaunching={isLaunching}
              isSpeaking={speech.isSpeaking}
              mouthPulse={speech.mouthPulse}
              audio={audio}
              speech={speech}
              onListenWelcome={handleReadCurrent}
              onStopVoice={speech.stop}
              onOpenVoiceSettings={() => {
                playUiTone('tap', audio.sfxEnabled, speech.isSpeaking);
                setAudioModalOpen(true);
              }}
              onBackToCatalog={() => {
                clearTickleCaption();
                speech.stop();
                playUiTone('tap', audio.sfxEnabled, false);
                setIntroView('catalog');
              }}
              hasSavedMission={savedMissionPhase !== null}
              onResumeMission={handleResumeSavedMission}
              onStartMission={handleLaunchFromWelcome}
              onReviewTutorial={() => startTutorial('episode_intro', true)}
              tickleCaption={tickleCaption}
              onTickleSound={handleTickleSound}
            />
          )
        ) : (
          <>
            {/* Top Cockpit Command HUD */}
            <HudBar
              phase={phase}
              step={step}
              stats={stats}
              science={science}
              research={research}
              isSpeaking={speech.isSpeaking}
              highlightedStat={highlightedStat}
              audio={audio}
              speech={speech}
              onOpenAudio={() => {
                playUiTone('tap', audio.sfxEnabled, speech.isSpeaking);
                setAudioModalOpen(true);
              }}
              onReplayCurrent={handleReadCurrent}
              onToggleSpeak={handleToggleSpeak}
              onBackToCatalog={handleBackToCatalogFromMission}
            />

            {/* Main 16:9 Horizontal Split Stage */}
            <main className="relative z-10 mx-auto flex min-h-0 w-full max-w-[1220px] flex-1 flex-row gap-2.5 p-2 sm:gap-3.5 sm:p-3">
              {/* LEFT BAY (38%): Live Animated NAUTI Character & Dialogue */}
              <aside className="w-[38%] min-w-[205px] max-w-[380px] flex-none">
                <NautiMascot
                  lang={lang}
                  message={nautiBehavior.message}
                  mood={nautiBehavior.mood}
                  gaze={nautiBehavior.gaze}
                  handPose={nautiBehavior.handPose}
                  isSpeaking={speech.isSpeaking}
                  narrationBlocked={speech.narrationBlocked}
                  mouthPulse={speech.mouthPulse}
                  onListen={handleReadCurrent}
                  onStop={speech.stop}
                  chapterBadge={nautiBehavior.badge}
                  showRealPhotoButton={phase === 'scene' && step === 0}
                  onOpenRealPhoto={() => {
                    clearTickleCaption();
                    speech.markUserUnlocked();
                    playUiTone('science', audio.sfxEnabled, speech.isSpeaking);
                    setNasaPhotoOpen(true);
                    triggerStoryGaze('up', 1400);
                    if (speech.autoNarrate && speech.volume > 0) {
                      speech.speak(t.nasaPhotoNautiComment, {
                        force: false,
                        isAuto: true,
                        fallbackTexts: {
                          es: UI_STRINGS.es.nasaPhotoNautiComment,
                          en: UI_STRINGS.en.nasaPhotoNautiComment,
                        },
                      });
                    }
                  }}
                  tickleCaption={tickleCaption}
                  onTickleSound={handleTickleSound}
                />
              </aside>

              {/* RIGHT BAY (62%): Interactive Mission Console */}
              <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border-2 border-white bg-[#f4fcff]/95 text-[#08265b] shadow-[0_6px_0_#041029] backdrop-blur-md">
                {/* TUTORIAL (5 Learning Sections + Short Interactive Practice + Completion Screen) */}
                {phase === 'tutorial' && (
                  <TutorialExperience
                    lang={lang}
                    step={step}
                    tutorialCompleted={tutorialProgress.completed}
                    practiceCompleted={tutorialProgress.practiceCompleted}
                    sfxEnabled={audio.sfxEnabled}
                    isSpeaking={speech.isSpeaking}
                    onStepChange={(nextStep) => {
                      speech.stop();
                      const clamped = clampTutorialStep(nextStep);
                      setStep(clamped);
                      setTutorialProgress((prev) => ({
                        ...prev,
                        currentStep: prev.completed ? prev.currentStep : clamped,
                        completed: prev.completed || clamped === TOTAL_TUTORIAL_STEPS - 1,
                      }));
                    }}
                    onPracticeCompleted={() => {
                      setTutorialProgress((prev) => ({
                        ...prev,
                        practiceCompleted: true,
                      }));
                    }}
                    onCompleteAndExplore={completeTutorialAndOpenCatalog}
                    onPauseTutorial={() => pauseTutorial('tap')}
                    onHighlightStat={triggerStatHighlight}
                  />
                )}

                {/* ACTIVE MISSION SCENE — DAYS 2–5 BRIEFING (Intro + Contextual Recap / Timeline) */}
                {phase === 'scene' &&
                  currentDay >= 2 &&
                  daySubPhase === 'briefing' &&
                  currentCanonicalSpec && (
                    <div className="flex h-full flex-col justify-between p-3 sm:p-5">
                      <div className="cockpit-scroll min-h-0 flex-1 overflow-y-auto pr-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="inline-block rounded-full bg-[#facc15] px-2.5 py-0.5 text-[10px] font-black tracking-wide text-[#08265b] uppercase">
                            {t.chapterShift(currentDay)}
                          </span>
                          {isDanger && (
                            <span className="flex items-center gap-1 rounded-lg bg-[#ffe4e6] px-2 py-0.5 text-[10px] font-black text-[#be123c] ring-1 ring-[#ff5c6c]">
                              <AlertTriangle className="h-3 w-3" />
                              <span>
                                {t.emergencyPrefix} {criticalKeys.join(', ')}
                              </span>
                            </span>
                          )}
                        </div>

                        <h1 className="mt-1.5 text-lg leading-tight font-black text-[#08265b] sm:text-2xl">
                          {currentCanonicalSpec.title}
                        </h1>

                        <div className="mt-2 rounded-xl border-2 border-[#bce8f5] bg-white p-3 shadow-[0_2px_0_#d7ebf5]">
                          <p className="text-xs leading-relaxed font-bold text-[#08265b] sm:text-sm">
                            {currentCanonicalSpec.intro}
                          </p>
                        </div>

                        {/* Contextual Recap (Days 2–4) */}
                        {currentDay !== 5 && prevContextText && (
                          <div className="mt-2.5 rounded-xl border-2 border-[#00d2e0] bg-[#e6f9fd] p-3 shadow-[0_2px_0_#bae6fd]">
                            <span className="block text-[10px] font-black tracking-wider text-[#007e99] uppercase">
                              {t.contextRecapTitle}
                            </span>
                            <p className="mt-1 text-xs leading-relaxed font-semibold text-[#08265b] sm:text-[13px]">
                              {prevContextText}
                            </p>
                          </div>
                        )}

                        {/* Timeline of Decisions Days 1–4 (Day 5 Briefing Step 2) */}
                        {currentDay === 5 && (
                          <div className="mt-2.5 rounded-xl border-2 border-[#00d2e0] bg-[#e6f9fd] p-3 shadow-[0_2px_0_#bae6fd]">
                            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-black tracking-wide text-[#007e99] uppercase">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{t.day5TimelineTitle}</span>
                            </div>
                            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                              {([1, 2, 3, 4] as MissionDay[]).map((d) => {
                                const decId = simState.decisions[d];
                                return (
                                  <div
                                    key={d}
                                    className="flex items-center gap-2 rounded-lg border border-[#bae6fd] bg-white px-2.5 py-1.5 text-xs"
                                  >
                                    <span className="rounded bg-[#08265b] px-1.5 py-0.5 text-[10px] font-black text-[#facc15]">
                                      {t.hudShiftPrefix}
                                      {d}
                                    </span>
                                    <span className="truncate font-bold text-[#08265b]">
                                      {decId
                                        ? getDecisionTitleById(lang, d, decId)
                                        : '—'}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-2.5 flex flex-none items-center justify-end border-t border-[#d6eef7] pt-2.5">
                        {currentDay === 5 ? (
                          <button
                            type="button"
                            onClick={handleEnterDay5Delayed}
                            className="flex min-h-[44px] items-center gap-2 rounded-xl bg-[#facc15] px-5 py-2 text-sm font-black text-[#08265b] shadow-[0_3px_0_#b45309] transition hover:bg-[#fde047] active:translate-y-[1px]"
                          >
                            <span>{t.day5CheckDelayedBtn}</span>
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              playUiTone('tap', audio.sfxEnabled);
                              setDaySubPhase('decision');
                            }}
                            className="flex min-h-[44px] items-center gap-2 rounded-xl bg-[#facc15] px-5 py-2 text-sm font-black text-[#08265b] shadow-[0_3px_0_#b45309] transition hover:bg-[#fde047] active:translate-y-[1px]"
                          >
                            <span>{t.analyzeSituationBtn}</span>
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                {/* ACTIVE MISSION SCENE — DAY 5 DELAYED CONSEQUENCES (Steps 3–4) */}
                {phase === 'scene' &&
                  currentDay === 5 &&
                  daySubPhase === 'day5_delayed' && (
                    <div className="flex h-full flex-col justify-between p-3 sm:p-5">
                      <div className="cockpit-scroll min-h-0 flex-1 overflow-y-auto pr-1">
                        <span className="inline-block rounded-full bg-[#facc15] px-2.5 py-0.5 text-[10px] font-black tracking-wide text-[#08265b] uppercase">
                          {t.delayedBadge}
                        </span>

                        <h1 className="mt-1 text-lg leading-tight font-black text-[#08265b] sm:text-xl">
                          {dead ? t.resultDeadTitle : t.day5DelayedTitle}
                        </h1>
                        <p className="mt-0.5 text-xs font-semibold text-[#52708b]">
                          {t.day5DelayedSubtitle}
                        </p>

                        <div className="mt-2 space-y-2">
                          {day5DelayedCards.map((card) => {
                            const hasNegative =
                              (card.effects.energy ?? 0) < 0 ||
                              (card.effects.water ?? 0) < 0 ||
                              (card.effects.health ?? 0) < 0;
                            return (
                              <div
                                key={card.key}
                                className={`rounded-xl border-2 p-2.5 shadow-[0_2px_0_#d7ebf5] ${
                                  hasNegative
                                    ? 'border-[#ff5c6c] bg-[#fff1f2]'
                                    : 'border-[#4ade80] bg-[#f0fdf4]'
                                }`}
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <span
                                    className={`text-xs font-black sm:text-[13px] ${
                                      hasNegative
                                        ? 'text-[#9f1239]'
                                        : 'text-[#14532d]'
                                    }`}
                                  >
                                    {card.title}
                                  </span>
                                  <div className="flex items-center gap-1.5 text-[10px] font-black tabular-nums">
                                    {card.effects.energy !== undefined && (
                                      <span className="rounded bg-white/80 px-1.5 py-0.5 text-[#9f1239]">
                                        ⚡ {t.hudEnergy}{' '}
                                        {formatSigned(card.effects.energy)}
                                      </span>
                                    )}
                                    {card.effects.water !== undefined && (
                                      <span className="rounded bg-white/80 px-1.5 py-0.5 text-[#9f1239]">
                                        💧 {t.hudWater}{' '}
                                        {formatSigned(card.effects.water)}
                                      </span>
                                    )}
                                    {card.effects.health !== undefined && (
                                      <span className="rounded bg-white/80 px-1.5 py-0.5 text-[#9f1239]">
                                        💚 {t.hudHealth}{' '}
                                        {formatSigned(card.effects.health)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <p className="mt-1 text-xs leading-snug font-semibold text-[#15385e]">
                                  {card.text}
                                </p>
                              </div>
                            );
                          })}
                        </div>

                        {/* Step 4: Post-Delayed Resource State */}
                        <div className="mt-2.5 rounded-xl border-2 border-[#bce8f5] bg-white p-2.5">
                          <span className="block text-[10px] font-black tracking-wider text-[#007e99] uppercase">
                            {t.day5PostDelayedTitle}
                          </span>
                          <div className="mt-1.5 grid grid-cols-4 gap-1.5 text-center">
                            <div className="rounded-lg border border-[#facc15] bg-[#fefce8] py-1">
                              <span className="block text-[10px] font-extrabold text-[#854d0e]">
                                ⚡ {t.hudEnergy}
                              </span>
                              <span className="tabular-nums text-sm font-black text-[#08265b]">
                                {simState.resources.energy}
                              </span>
                            </div>
                            <div className="rounded-lg border border-[#4ade80] bg-[#f0fdf4] py-1">
                              <span className="block text-[10px] font-extrabold text-[#166534]">
                                💚 {t.hudHealth}
                              </span>
                              <span className="tabular-nums text-sm font-black text-[#08265b]">
                                {simState.resources.health}
                              </span>
                            </div>
                            <div className="rounded-lg border border-[#38bdf8] bg-[#f0f9ff] py-1">
                              <span className="block text-[10px] font-extrabold text-[#075985]">
                                💧 {t.hudWater}
                              </span>
                              <span className="tabular-nums text-sm font-black text-[#08265b]">
                                {simState.resources.water}
                              </span>
                            </div>
                            <div className="rounded-lg border border-[#00d2e0] bg-[#ecfeff] py-1">
                              <span className="block text-[10px] font-extrabold text-[#0e7490]">
                                🔬 {t.hudResearch}
                              </span>
                              <span className="tabular-nums text-sm font-black text-[#08265b]">
                                {simState.resources.research}/60
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-2.5 flex flex-none items-center justify-between gap-2 border-t border-[#d6eef7] pt-2.5">
                        <span className="text-[11px] font-bold text-[#52708b]">
                          {dead ? t.resourceZero : t.readyContinue}
                        </span>
                        {dead ? (
                          <button
                            type="button"
                            onClick={() => {
                              playUiTone('alert', audio.sfxEnabled, false);
                              setEndTab('outcome');
                              setPhase('end');
                            }}
                            className="flex min-h-[44px] items-center gap-2 rounded-xl bg-[#ff5c6c] px-5 py-2 text-sm font-black text-white shadow-[0_3px_0_#9f1239] transition active:translate-y-[1px]"
                          >
                            <span>{t.seeOutcome}</span>
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              playUiTone('tap', audio.sfxEnabled);
                              setChosen(-1);
                              setModelUsed(false);
                              setDaySubPhase('decision');
                            }}
                            className="flex min-h-[44px] items-center gap-2 rounded-xl bg-[#facc15] px-5 py-2 text-sm font-black text-[#08265b] shadow-[0_3px_0_#b45309] transition hover:bg-[#fde047] active:translate-y-[1px]"
                          >
                            <span>{t.day5ToDecisionBtn}</span>
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                {/* ACTIVE MISSION SCENE — DECISION SCREEN (Day 1 intact OR Days 2–5 decision) */}
                {phase === 'scene' && showDecisionCards && (
                  <div className="flex h-full flex-col justify-between p-2.5 sm:p-4">
                    <div className="cockpit-scroll min-h-0 flex-1 overflow-y-auto pr-1">
                      <div className="flex flex-wrap items-center justify-between gap-1.5">
                        <span className="inline-block rounded-full bg-[#facc15] px-2.5 py-0.5 text-[10px] font-black tracking-wide text-[#08265b] uppercase">
                          {t.chapterShift(currentDay)}
                        </span>
                        <div className="flex items-center gap-2">
                          {isDanger && (
                            <span className="flex items-center gap-1 rounded-lg bg-[#ffe4e6] px-2 py-0.5 text-[10px] font-black text-[#be123c] ring-1 ring-[#ff5c6c]">
                              <AlertTriangle className="h-3 w-3" />
                              <span>
                                {t.emergencyPrefix} {criticalKeys.join(', ')}
                              </span>
                            </span>
                          )}
                          {currentDay >= 2 && (
                            <button
                              type="button"
                              onClick={() => {
                                playUiTone('tap', audio.sfxEnabled);
                                setDaySubPhase(
                                  currentDay === 5 ? 'day5_delayed' : 'briefing',
                                );
                              }}
                              className="inline-flex items-center gap-1 rounded-lg bg-[#e0f2fe] px-2 py-0.5 text-[10px] font-black text-[#0369a1] hover:bg-[#bae6fd]"
                            >
                              <ArrowLeft className="h-3 w-3" />
                              <span>{t.viewContextBtn}</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <h1 className="mt-1 text-base leading-tight font-black text-[#08265b] sm:text-xl">
                        {currentScene.title}
                      </h1>
                      <p className="mt-1 text-xs leading-snug font-semibold text-[#15385e] sm:text-[13px]">
                        {currentScene.story}
                      </p>
                      <h2 className="mt-1.5 text-xs font-black text-[#08265b] sm:text-sm">
                        {currentScene.question}
                      </h2>

                      {/* Decision Cards (3 on Day 1, 2 on Days 2–5) */}
                      <div
                        className="mt-2 grid gap-1.5 sm:gap-2"
                        role="radiogroup"
                        aria-label={currentScene.question}
                      >
                        {currentScene.options.map((opt, idx) => {
                          const isSelected = chosen === idx;
                          const letter = 'ABC'[idx];
                          return (
                            <EduTooltip
                              key={letter}
                              content={getOptionTooltip(lang, step, idx)}
                              preferredSide="top"
                              className="w-full"
                            >
                              {({ isOpen, openTouch, triggerProps }) => (
                                <div
                                  className={`group flex min-h-[44px] w-full items-stretch rounded-xl border-2 transition ${
                                    isSelected
                                      ? 'border-[#08265b] bg-[#d9f8fc] text-[#08265b] shadow-[0_3px_0_#00b2c4]'
                                      : 'border-[#c3e4f2] bg-white text-[#15385e] shadow-[0_2px_0_#d7ebf5] hover:border-[#00d2e0]'
                                  }`}
                                >
                                  <button
                                    type="button"
                                    role="radio"
                                    aria-checked={isSelected}
                                    onMouseEnter={() => setHoveredOption(idx)}
                                    onMouseLeave={() => setHoveredOption(-1)}
                                    onFocus={() => setHoveredOption(idx)}
                                    onBlur={() => setHoveredOption(-1)}
                                    onClick={() => {
                                      playUiTone(
                                        'tap',
                                        audio.sfxEnabled,
                                        speech.isSpeaking,
                                      );
                                      setChosen(idx);
                                    }}
                                    className="flex min-h-[44px] flex-1 items-center gap-2.5 px-3 py-2 text-left active:translate-y-[1px]"
                                  >
                                    <span
                                      className={`flex h-7 w-7 flex-none items-center justify-center rounded-lg text-xs font-black transition-colors ${
                                        isSelected
                                          ? 'bg-[#08265b] text-[#facc15]'
                                          : 'bg-[#e1f5f9] text-[#007e99] group-hover:bg-[#00d2e0] group-hover:text-[#08265b]'
                                      }`}
                                    >
                                      {letter}
                                    </span>
                                    <div className="min-w-0 flex-1">
                                      <span className="block text-xs leading-snug font-extrabold sm:text-[13px]">
                                        {opt[0]}
                                      </span>
                                      {currentDay >= 2 && (
                                        <span className="mt-0.5 block text-[11px] leading-snug font-semibold text-[#52708b]">
                                          {opt[1]}
                                        </span>
                                      )}
                                    </div>
                                    {isSelected && (
                                      <CheckCircle2 className="h-4.5 w-4.5 flex-none text-[#008fa1]" />
                                    )}
                                  </button>

                                  <div className="flex flex-none items-center pr-2">
                                    <button
                                      type="button"
                                      data-edu-info-btn="true"
                                      {...triggerProps}
                                      aria-label={t.tooltipInfoAria(
                                        `${t.optionPrefix} ${letter}`,
                                      )}
                                      aria-expanded={isOpen}
                                      onPointerDown={(e) => e.stopPropagation()}
                                      onClick={openTouch}
                                      className={`flex h-7 w-7 items-center justify-center rounded-full border transition active:scale-95 ${
                                        isOpen
                                          ? 'border-[#00a7b8] bg-[#00d2e0] text-[#08265b]'
                                          : 'border-[#b9dff0] bg-[#eef9fd] text-[#007e99] hover:border-[#00d2e0] hover:bg-[#dff6fc]'
                                      }`}
                                    >
                                      <Info className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </EduTooltip>
                          );
                        })}
                      </div>

                      {modelUsed && (
                        <div className="mt-2 rounded-xl border-2 border-[#facc15] bg-[#fefce8] px-2.5 py-1.5 text-[11px] leading-snug font-bold text-[#713f12]">
                          <span className="font-black text-[#b45309]">
                            {t.simActivePrefix}{' '}
                          </span>
                          {chosen < 0
                            ? currentScene.options.length === 2
                              ? t.simPickHintTwo
                              : t.simPickHintThree
                            : formatModelPrediction(currentScene.options[chosen], lang)}
                          {day5BonusActiveForSelection && (
                            <span className="mt-0.5 block font-extrabold text-[#0e7490]">
                              {t.day5BonusEnergyNote}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bottom Sticky Decision Action Bar */}
                    <div className="mt-2 flex flex-none flex-wrap items-center justify-between gap-2 border-t border-[#d6eef7] pt-2">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <EduTooltip
                          content={t.tooltipHelp}
                          preferredSide="top"
                          showInfoButton
                          infoAriaLabel={t.tooltipInfoAria(t.helpBtn)}
                        >
                          <button
                            type="button"
                            onClick={handleOpenHelp}
                            className="flex min-h-[44px] items-center gap-1.5 rounded-xl bg-[#00d2e0] px-3 py-1.5 text-xs font-black text-[#08265b] shadow-[0_3px_0_#0284c7] transition hover:bg-[#34f0fa] active:translate-y-[1px]"
                          >
                            <Lightbulb className="h-4 w-4" />
                            <span>{t.helpBtn}</span>
                          </button>
                        </EduTooltip>

                        <EduTooltip
                          content={t.tooltipModel}
                          preferredSide="top"
                          showInfoButton
                          infoAriaLabel={t.tooltipInfoAria(t.modelCostBtn)}
                          actionLabel={t.tooltipLearnMore}
                          onAction={() => {
                            clearTickleCaption();
                            playUiTone('science', audio.sfxEnabled, speech.isSpeaking);
                            setModelHelpOpen(true);
                          }}
                          className={`relative inline-flex items-center gap-1 ${
                            !modelUsed && science < 1 ? 'cursor-not-allowed' : ''
                          }`}
                        >
                          <button
                            type="button"
                            disabled={!modelUsed && science < 1}
                            onClick={handleModel}
                            className="flex min-h-[44px] items-center gap-1.5 rounded-xl border-2 border-[#08265b]/20 bg-white px-3 py-1.5 text-xs font-black text-[#08265b] shadow-[0_3px_0_#cbd5e1] transition hover:bg-[#f0f9ff] active:translate-y-[1px] disabled:pointer-events-none disabled:opacity-45"
                          >
                            <FlaskConical className="h-4 w-4 text-[#d97706]" />
                            <span>
                              {modelUsed ? t.modelActiveBtn : t.modelCostBtn}
                            </span>
                          </button>
                        </EduTooltip>
                      </div>

                      <EduTooltip
                        content={t.tooltipConfirmDecision}
                        preferredSide="top"
                        showInfoButton
                        infoAriaLabel={t.tooltipInfoAria(t.confirmDecision)}
                        className={`relative inline-flex items-center gap-1 ${
                          chosen < 0 ? 'cursor-not-allowed' : ''
                        }`}
                      >
                        <button
                          type="button"
                          disabled={chosen < 0}
                          onClick={() => {
                            if (currentDay === 1) {
                              confirmChoice();
                            } else {
                              playUiTone('tap', audio.sfxEnabled);
                              setDaySubPhase('confirm');
                            }
                          }}
                          className="flex min-h-[44px] items-center gap-1.5 rounded-xl bg-[#facc15] px-4 py-2 text-xs font-black text-[#08265b] shadow-[0_3px_0_#b45309] transition hover:bg-[#fde047] active:translate-y-[1px] disabled:pointer-events-none disabled:opacity-45 sm:text-sm"
                        >
                          <span>
                            {currentDay === 1
                              ? t.confirmDecision
                              : t.selectOptionBtn}
                          </span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </EduTooltip>
                    </div>
                  </div>
                )}

                {/* ACTIVE MISSION SCENE — DAYS 2–5 CONFIRMATION (Volver / Confirmar) */}
                {phase === 'scene' &&
                  currentDay >= 2 &&
                  daySubPhase === 'confirm' &&
                  chosen >= 0 && (
                    <div className="flex h-full flex-col justify-between p-3 sm:p-5">
                      <div className="cockpit-scroll min-h-0 flex-1 overflow-y-auto pr-1">
                        <span className="inline-block rounded-full bg-[#facc15] px-2.5 py-0.5 text-[10px] font-black tracking-wide text-[#08265b] uppercase">
                          {t.confirmBadge(currentDay)}
                        </span>

                        <h1 className="mt-1.5 text-lg leading-tight font-black text-[#08265b] sm:text-2xl">
                          {t.confirmTitle}
                        </h1>
                        <p className="mt-0.5 text-xs font-semibold text-[#52708b]">
                          {t.confirmSubtitle}
                        </p>

                        <div className="mt-3 rounded-2xl border-2 border-[#08265b] bg-[#d9f8fc] p-3.5 shadow-[0_3px_0_#00b2c4]">
                          <div className="flex items-start gap-3">
                            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-[#08265b] text-sm font-black text-[#facc15]">
                              {'AB'[chosen]}
                            </span>
                            <div>
                              <h2 className="text-sm font-black text-[#08265b] sm:text-base">
                                {currentScene.options[chosen][0]}
                              </h2>
                              <p className="mt-1 text-xs leading-relaxed font-semibold text-[#15385e] sm:text-sm">
                                {currentScene.options[chosen][1]}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 rounded-xl border-2 border-[#fde047] bg-[#fefce8] p-2.5 text-xs font-bold text-[#713f12]">
                          {t.confirmReminder}
                        </div>
                      </div>

                      <div className="mt-2.5 flex flex-none items-center justify-between gap-2 border-t border-[#d6eef7] pt-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            playUiTone('tap', audio.sfxEnabled);
                            setDaySubPhase('decision');
                          }}
                          className="flex min-h-[44px] items-center gap-1.5 rounded-xl bg-[#dff2f8] px-4 py-2 text-xs font-extrabold text-[#08265b] shadow-[0_2px_0_#b6dceb] hover:bg-[#cbe7f2] active:translate-y-[1px] sm:text-sm"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          <span>{t.confirmBackBtn}</span>
                        </button>

                        <button
                          type="button"
                          onClick={confirmChoice}
                          className="flex min-h-[44px] items-center gap-2 rounded-xl bg-[#facc15] px-5 py-2 text-xs font-black text-[#08265b] shadow-[0_3px_0_#b45309] transition hover:bg-[#fde047] active:translate-y-[1px] sm:text-sm"
                        >
                          <span>{t.confirmApplyBtn}</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                {/* CONSEQUENCE RESULT */}
                {phase === 'result' && (
                  <div className="flex min-h-0 flex-1 flex-col justify-between p-2.5 sm:p-4">
                    <div className="cockpit-scroll min-h-0 flex-1 overflow-y-auto pr-1">
                      <span className="inline-block rounded-full bg-[#facc15] px-2.5 py-0.5 text-[10px] font-black tracking-wide text-[#08265b] uppercase">
                        {t.resultConseqBadge(currentDay)}
                      </span>

                      <h1 className="mt-1 text-lg leading-tight font-black text-[#08265b] sm:text-2xl">
                        {dead
                          ? t.resultDeadTitle
                          : customResultNarrative
                            ? customResultNarrative.title
                            : t.resultTitle}
                      </h1>

                      {customResultNarrative && (
                        <div className="mt-2 space-y-2">
                          <div className="rounded-xl border-2 border-[#bce8f5] bg-white px-3 py-2 shadow-[0_2px_0_#d7ebf5]">
                            <p className="text-xs leading-snug font-bold text-[#08265b] sm:text-[13px]">
                              {customResultNarrative.narrative}
                            </p>
                          </div>

                          {lastDeltas && (
                            <div className="grid grid-cols-1 gap-1.5 md:grid-cols-2">
                              <button
                                type="button"
                                onClick={() => triggerStatHighlight('energia')}
                                className="flex items-start gap-2 rounded-xl border-2 border-[#facc15] bg-[#fefce8] px-2.5 py-2 text-left transition hover:brightness-95"
                              >
                                <EnergiaStickerIcon className="mt-0.5 h-5 w-5 flex-none" />
                                <p className="m-0 text-[11px] leading-snug font-semibold text-[#15385e] sm:text-xs">
                                  <strong className="font-black text-[#08265b]">
                                    ⚡ {t.hudEnergy} (
                                    {formatSigned(lastDeltas.energy)}):
                                  </strong>{' '}
                                  {customResultNarrative.energyExplanation}
                                </p>
                              </button>

                              <button
                                type="button"
                                onClick={() => triggerStatHighlight('salud')}
                                className="flex items-start gap-2 rounded-xl border-2 border-[#4ade80] bg-[#f0fdf4] px-2.5 py-2 text-left transition hover:brightness-95"
                              >
                                <SaludStickerIcon className="mt-0.5 h-5 w-5 flex-none" />
                                <p className="m-0 text-[11px] leading-snug font-semibold text-[#15385e] sm:text-xs">
                                  <strong className="font-black text-[#08265b]">
                                    💚 {t.hudHealth} (
                                    {formatSigned(lastDeltas.health)}):
                                  </strong>{' '}
                                  {customResultNarrative.healthExplanation}
                                </p>
                              </button>

                              <button
                                type="button"
                                onClick={() => triggerStatHighlight('agua')}
                                className="flex items-start gap-2 rounded-xl border-2 border-[#38bdf8] bg-[#f0f9ff] px-2.5 py-2 text-left transition hover:brightness-95"
                              >
                                <AguaStickerIcon className="mt-0.5 h-5 w-5 flex-none" />
                                <p className="m-0 text-[11px] leading-snug font-semibold text-[#15385e] sm:text-xs">
                                  <strong className="font-black text-[#08265b]">
                                    💧 {t.hudWater} (
                                    {formatSigned(lastDeltas.water)}):
                                  </strong>{' '}
                                  {customResultNarrative.waterExplanation}
                                </p>
                              </button>

                              <button
                                type="button"
                                onClick={() => triggerStatHighlight('research')}
                                className="flex items-start gap-2 rounded-xl border-2 border-[#00d2e0] bg-[#ecfeff] px-2.5 py-2 text-left transition hover:brightness-95"
                              >
                                <div className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[#08265b] text-[#34f0fa]">
                                  <Radio className="h-3 w-3" />
                                </div>
                                <p className="m-0 text-[11px] leading-snug font-semibold text-[#15385e] sm:text-xs">
                                  <strong className="font-black text-[#08265b]">
                                    🔬 {t.researchFullLabel} (
                                    {formatSigned(lastDeltas.research)}):
                                  </strong>{' '}
                                  {customResultNarrative.researchExplanation}
                                </p>
                              </button>
                            </div>
                          )}

                          {lastSpecialRuleApplied && (
                            <div className="rounded-xl border-2 border-[#34f0fa] bg-[#ecfeff] px-3 py-1.5 text-[11px] font-bold text-[#0e7490]">
                              {t.day5BonusEnergyNote}
                            </div>
                          )}

                          <div className="rounded-xl border-2 border-[#00d2e0]/65 bg-[#e6f9fd] px-3 py-2 shadow-[0_2px_0_#bae6fd]">
                            <p className="m-0 text-[11px] leading-snug font-bold text-[#08265b] sm:text-xs">
                              <strong className="font-black text-[#007e99]">
                                NAUTI:
                              </strong>{' '}
                              {customResultNarrative.nautiDialogue}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-2.5 flex flex-none items-center justify-between gap-2 border-t border-[#d6eef7] pt-2.5">
                      <span className="text-[11px] font-bold text-[#52708b]">
                        {dead
                          ? t.resourceZero
                          : currentDay < 5 && hasTriviaAfterCurrentDay
                            ? t.bonusAvailable
                            : t.readyContinue}
                      </span>
                      <button
                        type="button"
                        onClick={handleResultContinue}
                        className="flex min-h-[44px] items-center gap-2 rounded-xl bg-[#facc15] px-5 py-2 text-sm font-black text-[#08265b] shadow-[0_3px_0_#b45309] transition hover:bg-[#fde047] active:translate-y-[1px]"
                      >
                        <span>
                          {dead
                            ? t.seeOutcome
                            : currentDay === 5
                              ? t.seeEnding
                              : hasTriviaAfterCurrentDay
                                ? t.sciTriviaBtn
                                : t.nextShiftBtn}
                        </span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* TRIVIA (Science points ONLY — never modifies research indicator) */}
                {phase === 'trivia' &&
                  (() => {
                    const q = triviaByDay[currentDay as 1 | 3 | 4];
                    if (!q) return null;
                    const answered = triviaDone[currentDay];
                    const isCorrect = answered !== undefined && answered === q[2];
                    return (
                      <div className="flex h-full flex-col justify-between p-3 sm:p-5">
                        <div className="cockpit-scroll min-h-0 flex-1 overflow-y-auto pr-1">
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#facc15] px-2.5 py-0.5 text-[10px] font-black tracking-wide text-[#08265b] uppercase">
                            <Sparkles className="h-3 w-3" />
                            <span>{t.triviaBadge}</span>
                          </span>

                          <h1 className="mt-1.5 text-base leading-snug font-black text-[#08265b] sm:text-xl">
                            {q[0]}
                          </h1>

                          <div className="mt-2.5 grid gap-2">
                            {q[1].map((answer, i) => {
                              const picked = answered === i;
                              const showRight =
                                answered !== undefined && i === q[2];
                              return (
                                <button
                                  key={i}
                                  type="button"
                                  disabled={answered !== undefined}
                                  onClick={() => handleAnswerTrivia(i)}
                                  className={`flex min-h-[44px] items-center gap-2.5 rounded-xl border-2 px-3 py-2 text-left text-xs font-extrabold transition sm:text-sm ${
                                    showRight
                                      ? 'border-[#16a34a] bg-[#dcfce7] text-[#14532d] shadow-[0_3px_0_#15803d]'
                                      : picked
                                        ? 'border-[#eab308] bg-[#fef9c3] text-[#713f12]'
                                        : 'border-[#c3e4f2] bg-white text-[#15385e] shadow-[0_2px_0_#d7ebf5] hover:border-[#00d2e0]'
                                  } disabled:cursor-default`}
                                >
                                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-[#e1f5f9] text-xs font-black text-[#007e99]">
                                    {'ABC'[i]}
                                  </span>
                                  <span>{answer}</span>
                                </button>
                              );
                            })}
                          </div>

                          {answered !== undefined && (
                            <div
                              className={`mt-2.5 rounded-xl border-2 p-2.5 text-xs font-bold ${
                                isCorrect
                                  ? 'border-[#22c55e] bg-[#f0fdf4] text-[#14532d]'
                                  : 'border-[#38bdf8] bg-white text-[#08265b]'
                              }`}
                            >
                              <strong className="block">
                                {isCorrect
                                  ? t.triviaCorrectTitle
                                  : t.triviaWrongTitle}
                              </strong>
                              <span className="mt-0.5 block font-semibold">
                                {q[3]}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mt-2.5 flex flex-none items-center justify-between border-t border-[#d6eef7] pt-2.5">
                          <span className="text-[11px] font-bold text-[#52708b]">
                            {answered === undefined
                              ? t.triviaPickHint
                              : t.triviaDoneHint}
                          </span>
                          {answered !== undefined && (
                            <button
                              type="button"
                              onClick={advanceToNextDay}
                              className="flex min-h-[44px] items-center gap-2 rounded-xl bg-[#facc15] px-5 py-2 text-sm font-black text-[#08265b] shadow-[0_3px_0_#b45309] transition hover:bg-[#fde047] active:translate-y-[1px]"
                            >
                              <span>{t.triviaContinueBtn}</span>
                              <ArrowRight className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                {/* END EVALUATION, CHART, HISTORY & REFLECTION (Steps 10–15) */}
                {phase === 'end' && (
                  <EndMissionReport
                    lang={lang}
                    activeTab={endTab}
                    onChangeTab={setEndTab}
                    outcomeId={outcomeId}
                    outcomeSpec={outcomeSpec}
                    resources={simState.resources}
                    science={science}
                    snapshots={simState.snapshots}
                    history={simState.history}
                    delayedApplied={simState.delayedApplied}
                    reflectionQuestions={reflectionQuestions}
                    onDownloadLog={downloadLog}
                    onReplayMission={replayMission}
                    onMainMenu={returnToMainMenu}
                  />
                )}
              </section>
            </main>
          </>
        )}

        {/* Modals for Audio Settings & Scientific Help / Modeling */}
        <AudioModal
          open={audioModalOpen}
          onClose={() => setAudioModalOpen(false)}
          speech={speech}
          audio={audio}
          onReadCurrent={handleReadCurrent}
        />

        <HelpModelModal
          lang={lang}
          mode={activeToolModal}
          onClose={() => {
            setActiveToolModal(null);
            setHighlightedStat(null);
            triggerStoryGaze(null);
          }}
          scene={currentScene}
          chosenIndex={chosen}
          day5BonusNote={day5BonusActiveForSelection ? t.day5BonusEnergyNote : null}
          isSpeaking={speech.isSpeaking}
          onReplay={handleReadCurrent}
          onStop={speech.stop}
        />

        <ModelHelpPanel
          open={modelHelpOpen}
          lang={lang}
          onClose={() => {
            playUiTone('tap', audio.sfxEnabled, speech.isSpeaking);
            setModelHelpOpen(false);
          }}
        />

        <NasaPhotoModal
          open={nasaPhotoOpen}
          lang={lang}
          onClose={() => {
            speech.stop();
            setNasaPhotoOpen(false);
            triggerStoryGaze(null);
          }}
          isSpeaking={speech.isSpeaking}
          onReplayComment={() => {
            speech.markUserUnlocked();
            speech.speak(t.nasaPhotoNautiComment, {
              force: true,
              fallbackTexts: {
                es: UI_STRINGS.es.nasaPhotoNautiComment,
                en: UI_STRINGS.en.nasaPhotoNautiComment,
              },
            });
          }}
          onStopVoice={speech.stop}
        />
      </div>
      </TooltipProvider>
    </ScientificLibraryProvider>
  );
}
