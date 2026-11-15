import {
  LOCALE_BUNDLES,
  SUPPORTED_LANGS,
  interpolateTemplate,
  type AppLang,
  type LocaleBundle,
} from '../locales';

export type AudioStrings = LocaleBundle['audio'];

export interface UiStrings {
  languageLabel: string;
  portraitTitle: string;
  portraitBody: string;
  welcomePill: string;
  kitBanner: string;
  createdBy: string;
  baseSubtitle: string;
  startMission: string;
  launching: string;
  welcomeTipLeft: string;
  welcomeTipRight: string;
  nautiSays: string;
  speakingStatus: string;
  listenAgain: string;
  stopVoice: string;
  stopShort: string;
  tapToListen: string;
  autoplayBlockedHint: string;
  listenAgainAria: string;
  stopVoiceAria: string;
  hudMission: string;
  hudOfflineSub: string;
  hudShiftPrefix: string;
  hudEnergy: string;
  hudHealth: string;
  hudWater: string;
  hudScience: string;
  hudResearch: string;
  hudScienceTitle: string;
  hudResearchTitle: string;
  skip: string;
  prev: string;
  continueBtn: string;
  startMissionBtn: string;
  finishTutorialBtn: string;
  reviewTutorialBtn: string;
  pauseTutorialBtn: string;
  resumeTutorialBtn: string;
  startTrainingBtn: string;
  tutorialLockedHint: string;
  stepProgressLabel: (current: number, total: number) => string;
  step1Of4: string;
  tutEnergyDesc: string;
  tutHealthDesc: string;
  tutWaterDesc: string;
  tutResearchDesc: string;
  tutTryHelp: string;
  tutHelpExample: string;
  tutHelpGuide: {
    heading: string;
    introParagraphs: readonly string[];
    parts: readonly {
      title: string;
      description: string;
    }[];
    finalReminder: string;
    exampleBadge: string;
    exampleHintHeading: string;
    exampleReflectHeading: string;
    exampleSourceHeading: string;
    exampleSourceUrlLabel: string;
  };
  tutTryModel: string;
  tutModelExample: string;
  tutOptA: string;
  tutOptB: string;
  tutPracticeHint: string;
  tutBadgePrefix: string;
  tutorialOnboarding: LocaleBundle['ui']['tutorialOnboarding'];
  formatPracticeProgressChip: (done: number) => string;
  chapterShift: (shift: number) => string;
  emergencyPrefix: string;
  tutorialBtn: string;
  simActivePrefix: string;
  simPickHintTwo: string;
  simPickHintThree: string;
  helpBtn: string;
  modelActiveBtn: string;
  modelCostBtn: string;
  confirmDecision: string;
  selectOptionBtn: string;
  sceneBadge: (shift: number) => string;
  briefingBadge: (shift: number) => string;
  confirmBadge: (shift: number) => string;
  delayedBadge: string;
  helpBadge: string;
  modelBadge: string;
  resultConseqBadge: (shift: number) => string;
  resultReportBadge: (shift: number) => string;
  resultDeadTitle: string;
  resultTitle: string;
  accumulatedConseq: string;
  resourceZero: string;
  bonusAvailable: string;
  readyContinue: string;
  seeOutcome: string;
  seeEnding: string;
  sciTriviaBtn: string;
  nextShiftBtn: string;
  triviaBadge: string;
  triviaNautiPrompt: string;
  triviaNautiBadge: string;
  triviaEurekaBadge: string;
  triviaLearnBadge: string;
  triviaCorrectTitle: string;
  triviaWrongTitle: string;
  triviaPickHint: string;
  triviaDoneHint: string;
  triviaContinueBtn: string;
  triviaRightBanner: string;
  triviaWrongBanner: string;
  endBadge: string;
  endVictoryTitle: string;
  endDeadTitle: string;
  endPartialTitle: string;
  endVictoryBody: string;
  endDeadBody: string;
  endPartialBody: string;
  discussTitle: string;
  discussBody: string;
  downloadLog: string;
  playAgain: string;
  logSimTitle: string;
  noneRisk: string;
  helpModalTag: string;
  modelModalTag: string;
  helpModalTitle: string;
  modelModalTitle: string;
  closeWindow: string;
  sourceLabel: string;
  viewNasaSource: string;
  offlineSourceNote: string;
  modelSelectPrompt: string;
  modelSelectPromptTwo: string;
  optionPrefix: string;
  possibleRiskPrefix: string;
  delayedRiskFallback: string;
  backToDecisions: string;
  nasaPhotoBtn: string;
  nasaPhotoHoverHint: string;
  nasaPhotoBadge: string;
  nasaPhotoTitle: string;
  nasaPhotoDesc: string;
  nasaPhotoDateLabel: string;
  nasaPhotoDate: string;
  nasaPhotoCreditLabel: string;
  nasaPhotoCredit: string;
  nasaPhotoSourceLabel: string;
  nasaPhotoSource: string;
  nasaPhotoViewOriginal: string;
  nasaPhotoError: string;
  nasaPhotoNautiComment: string;
  nasaPhotoClose: string;
  tooltipInfoAria: (label: string) => string;
  tooltipHelp: string;
  tooltipModel: string;
  tooltipLearnMore: string;
  modelHelpPanel: {
    exploreHeading: string;
    exploreParagraphs: readonly string[];
    howHeading: string;
    howParagraphs: readonly string[];
    rememberHeading: string;
    rememberBody: string;
    nasaConnectionNote: string;
  };
  tooltipWater: string;
  tooltipEnergy: string;
  tooltipHealth: string;
  tooltipScience: string;
  tooltipResearch: string;
  tooltipListenAgain: string;
  tooltipStopVoice: string;
  tooltipConfirmDecision: string;
  tooltipNasaPhoto: string;
  tooltipStartMission: string;
  tooltipTutorial: string;
  tooltipSound: string;
  contextRecapTitle: string;
  analyzeSituationBtn: string;
  viewContextBtn: string;
  confirmTitle: string;
  confirmSubtitle: string;
  confirmReminder: string;
  confirmBackBtn: string;
  confirmApplyBtn: string;
  day5TimelineTitle: string;
  day5CheckDelayedBtn: string;
  day5DelayedTitle: string;
  day5DelayedSubtitle: string;
  day5PostDelayedTitle: string;
  day5ToDecisionBtn: string;
  day5BonusEnergyNote: string;
  dayLabelShort: (day: number) => string;
  researchFullLabel: string;
  endTabOutcome: string;
  endTabChart: string;
  endTabHistory: string;
  endTabReflection: string;
  endNextStepBtn: string;
  endPrevStepBtn: string;
  endSustThresholdNote: string;
  endResGoalNote: string;
  chartTitle: string;
  chartSubtitle: string;
  chartSustMin: string;
  chartResGoal: string;
  chartStageStart: string;
  chartStageDay: (d: number) => string;
  chartStageDelayed: string;
  chartStageFinal: string;
  historyTitle: string;
  historySubtitle: string;
  historyCausalityLabel: string;
  historyEmpty: string;
  reflectionTitle: string;
  reflectionSubtitle: string;
  missionCompleteTitle: string;
  replayMissionBtn: string;
  mainMenuBtn: string;
  reviewDecisionsBtn: string;
  languageSelectorAria: string;
  platformName: string;
  experienceTitle: string;
  adventureSubtitle: string;
  experienceTagline: string;
  aboutTitle: string;
  aboutBody: string;
  howToPlayTitle: string;
  howToPlaySteps: readonly string[];
  startMissionCta: string;
  continueMissionCta: string;
  tryDemoCta: string;
  tooltipDemoBtn: string;
}

export type DemoStrings = LocaleBundle['demo'];
export type DesktopStrings = LocaleBundle['desktop'];
export type PlatformStrings = LocaleBundle['platform'];
export type CatalogStrings = LocaleBundle['catalog'];

function buildUiStrings(bundle: LocaleBundle): UiStrings {
  const u = bundle.ui;
  return {
    ...u,
    stepProgressLabel: (current, total) =>
      interpolateTemplate(u.stepProgressLabel, { current, total }),
    formatPracticeProgressChip: (done) =>
      interpolateTemplate(u.tutorialOnboarding.practice.progressChip, { done }),
    chapterShift: (shift) => interpolateTemplate(u.chapterShift, { shift }),
    sceneBadge: (shift) => interpolateTemplate(u.sceneBadge, { shift }),
    briefingBadge: (shift) => interpolateTemplate(u.briefingBadge, { shift }),
    confirmBadge: (shift) => interpolateTemplate(u.confirmBadge, { shift }),
    resultConseqBadge: (shift) =>
      interpolateTemplate(u.resultConseqBadge, { shift }),
    resultReportBadge: (shift) =>
      interpolateTemplate(u.resultReportBadge, { shift }),
    tooltipInfoAria: (label) =>
      interpolateTemplate(u.tooltipInfoAria, { label }),
    dayLabelShort: (day) => interpolateTemplate(u.dayLabelShort, { day }),
    chartStageDay: (day) => interpolateTemplate(u.chartStageDay, { day }),
  };
}

export const UI_STRINGS: Record<AppLang, UiStrings> = SUPPORTED_LANGS.reduce(
  (acc, lang) => {
    acc[lang] = buildUiStrings(LOCALE_BUNDLES[lang]);
    return acc;
  },
  {} as Record<AppLang, UiStrings>,
);

export const AUDIO_STRINGS: Record<AppLang, AudioStrings> =
  SUPPORTED_LANGS.reduce(
    (acc, lang) => {
      acc[lang] = LOCALE_BUNDLES[lang].audio;
      return acc;
    },
    {} as Record<AppLang, AudioStrings>,
  );

export const DEMO_STRINGS: Record<AppLang, DemoStrings> = SUPPORTED_LANGS.reduce(
  (acc, lang) => {
    acc[lang] = LOCALE_BUNDLES[lang].demo;
    return acc;
  },
  {} as Record<AppLang, DemoStrings>,
);

export const DESKTOP_STRINGS: Record<AppLang, DesktopStrings> =
  SUPPORTED_LANGS.reduce(
    (acc, lang) => {
      acc[lang] = LOCALE_BUNDLES[lang].desktop;
      return acc;
    },
    {} as Record<AppLang, DesktopStrings>,
  );

export const PLATFORM_STRINGS: Record<AppLang, PlatformStrings> =
  SUPPORTED_LANGS.reduce(
    (acc, lang) => {
      acc[lang] = LOCALE_BUNDLES[lang].platform;
      return acc;
    },
    {} as Record<AppLang, PlatformStrings>,
  );

export const CATALOG_STRINGS: Record<AppLang, CatalogStrings> =
  SUPPORTED_LANGS.reduce(
    (acc, lang) => {
      acc[lang] = LOCALE_BUNDLES[lang].catalog;
      return acc;
    },
    {} as Record<AppLang, CatalogStrings>,
  );
