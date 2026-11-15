import type {
  DecisionId,
  MissionDay,
  OutcomeId,
  Resources,
} from '../utils/missionEngine';
import {
  LOCALE_BUNDLES,
  SUPPORTED_LANGS,
  interpolateTemplate,
  type AppLang,
  type LocaleBundle,
} from '../locales';

export type { AppLang };

export type RiskFlag = 'water_delayed' | 'solar_delayed';

export type StatKey = 'energia' | 'salud' | 'agua';

export type GameStats = Record<StatKey, number>;

/** [label, modelSummary, [energia, salud, agua, investigacion], feedback, riskFlag] */
export type DecisionOption = [
  label: string,
  modelSummary: string,
  deltas: [number, number, number, number],
  feedback: string,
  riskFlag: RiskFlag | null,
];

export interface SceneHelpSection {
  hintHeading: string;
  hintBody: string;
  reflectHeading: string;
  reflectParagraphs: string[];
  sourceHeading: string;
  sourceCitationPrefix: string;
  sourceCitationTitle: string;
  sourceCitationSuffix: string;
}

export interface SceneData {
  title: string;
  story: string;
  question: string;
  help: string;
  helpSections?: SceneHelpSection;
  source: string;
  url: string;
  options: DecisionOption[];
}

/** [question, options, correctIndex, explanation] */
export type TriviaQuestion = [
  question: string,
  options: [string, string, string],
  correctIndex: number,
  explanation: string,
];

export interface TutorialScreen {
  title: string;
  desc: string;
  badge: string;
}

export interface LogEntry {
  jornada: number;
  decisionId?: DecisionId;
  decision?: string;
  efectos?: [number, number, number, number];
  riesgo?: string;
  efectoDiferido?: string;
}

export type GamePhase =
  | 'intro'
  | 'tutorial'
  | 'scene'
  | 'result'
  | 'trivia'
  | 'end';

export type DaySubPhase =
  | 'briefing'
  | 'day5_delayed'
  | 'decision'
  | 'confirm';

export interface CanonicalOptionSpec {
  id: DecisionId;
  title: string;
  description: string;
  effects: Resources;
  resultTitle: string;
  consequence: string;
  nauti: string;
  indicatorExplanations: {
    energy: string;
    health: string;
    water: string;
    research: string;
  };
  riskHint?: RiskFlag | null;
}

export interface DelayedConsequenceSpec {
  if: DecisionId;
  title: string;
  text: string;
  effects: Partial<Resources>;
}

export interface CanonicalDaySpec {
  day: 2 | 3 | 4 | 5;
  title: string;
  intro: string;
  context: Partial<Record<DecisionId, string>>;
  situation: string;
  question: string;
  science: string;
  reflection: string;
  source: {
    title: string;
    url: string;
  };
  options: [CanonicalOptionSpec, CanonicalOptionSpec];
  delayedConsequences?: DelayedConsequenceSpec[];
}

export interface OutcomeSpec {
  title: string;
  story: string;
  nauti: string;
}

export interface DecisionResultNarrative {
  title: string;
  narrative: string;
  energyExplanation: string;
  healthExplanation: string;
  waterExplanation: string;
  researchExplanation: string;
  nautiDialogue: string;
  nautiMood: 'happy' | 'surprised' | 'thinking';
  spokenNarration: string;
}

export const DAY1_DECISION_IDS: readonly [DecisionId, DecisionId, DecisionId] = [
  'LIFE_SUPPORT',
  'LABORATORY',
  'BALANCED',
];

function buildDay1SceneFromBundle(bundle: LocaleBundle): SceneData {
  const d1 = bundle.mission.day1;
  return {
    title: d1.title,
    story: d1.story,
    question: d1.question,
    help: d1.help,
    helpSections: d1.helpSections,
    source: d1.source,
    url: d1.url,
    options: d1.options.map(
      (opt) =>
        [
          opt.title,
          opt.modelSummary,
          opt.deltas as [number, number, number, number],
          opt.feedback,
          (opt.riskFlag as RiskFlag | null) ?? null,
        ] as DecisionOption,
    ),
  };
}

function buildCanonicalDaysFromBundle(
  bundle: LocaleBundle,
): Record<2 | 3 | 4 | 5, CanonicalDaySpec> {
  const days = bundle.mission.days;
  const mapDay = (key: '2' | '3' | '4' | '5'): CanonicalDaySpec => {
    const raw = days[key];
    return {
      day: raw.day as 2 | 3 | 4 | 5,
      title: raw.title,
      intro: raw.intro,
      context: raw.context as Partial<Record<DecisionId, string>>,
      situation: raw.situation,
      question: raw.question,
      science: raw.science,
      reflection: raw.reflection,
      source: raw.source,
      options: raw.options.map((o) => ({
        id: o.id as DecisionId,
        title: o.title,
        description: o.description,
        effects: o.effects,
        resultTitle: o.resultTitle,
        consequence: o.consequence,
        nauti: o.nauti,
        indicatorExplanations: o.indicatorExplanations,
        riskHint: (o.riskHint as RiskFlag | null) ?? null,
      })) as [CanonicalOptionSpec, CanonicalOptionSpec],
      delayedConsequences:
        'delayedConsequences' in raw && Array.isArray(raw.delayedConsequences)
          ? raw.delayedConsequences.map((dc) => ({
              if: dc.if as DecisionId,
              title: dc.title,
              text: dc.text,
              effects: dc.effects,
            }))
          : undefined,
    };
  };
  return {
    2: mapDay('2'),
    3: mapDay('3'),
    4: mapDay('4'),
    5: mapDay('5'),
  };
}

export const RISK_LABELS_BY_LANG: Record<AppLang, Record<RiskFlag, string>> =
  SUPPORTED_LANGS.reduce(
    (acc, lang) => {
      acc[lang] = LOCALE_BUNDLES[lang].mission.riskLabels;
      return acc;
    },
    {} as Record<AppLang, Record<RiskFlag, string>>,
  );

export const DAY1_SCENES: Record<AppLang, SceneData> = SUPPORTED_LANGS.reduce(
  (acc, lang) => {
    acc[lang] = buildDay1SceneFromBundle(LOCALE_BUNDLES[lang]);
    return acc;
  },
  {} as Record<AppLang, SceneData>,
);

export const CANONICAL_DAYS: Record<
  AppLang,
  Record<2 | 3 | 4 | 5, CanonicalDaySpec>
> = SUPPORTED_LANGS.reduce(
  (acc, lang) => {
    acc[lang] = buildCanonicalDaysFromBundle(LOCALE_BUNDLES[lang]);
    return acc;
  },
  {} as Record<AppLang, Record<2 | 3 | 4 | 5, CanonicalDaySpec>>,
);

export const OUTCOMES_CONTENT: Record<
  AppLang,
  Record<OutcomeId, OutcomeSpec>
> = SUPPORTED_LANGS.reduce(
  (acc, lang) => {
    acc[lang] = LOCALE_BUNDLES[lang].mission.outcomes as Record<
      OutcomeId,
      OutcomeSpec
    >;
    return acc;
  },
  {} as Record<AppLang, Record<OutcomeId, OutcomeSpec>>,
);

export const REFLECTION_QUESTIONS: Record<AppLang, [string, string, string]> =
  SUPPORTED_LANGS.reduce(
    (acc, lang) => {
      acc[lang] = LOCALE_BUNDLES[lang].mission.reflectionQuestions as [
        string,
        string,
        string,
      ];
      return acc;
    },
    {} as Record<AppLang, [string, string, string]>,
  );

export const TRIVIA_BY_DAY: Record<
  AppLang,
  Partial<Record<1 | 3 | 4, TriviaQuestion>>
> = SUPPORTED_LANGS.reduce(
  (acc, lang) => {
    const t = LOCALE_BUNDLES[lang].mission.triviaByDay;
    acc[lang] = {
      1: [
        t['1'].question,
        t['1'].options as [string, string, string],
        t['1'].correctIndex,
        t['1'].explanation,
      ],
      3: [
        t['3'].question,
        t['3'].options as [string, string, string],
        t['3'].correctIndex,
        t['3'].explanation,
      ],
      4: [
        t['4'].question,
        t['4'].options as [string, string, string],
        t['4'].correctIndex,
        t['4'].explanation,
      ],
    };
    return acc;
  },
  {} as Record<AppLang, Partial<Record<1 | 3 | 4, TriviaQuestion>>>,
);

export const OPTION_TOOLTIPS: Record<AppLang, string[][]> =
  SUPPORTED_LANGS.reduce(
    (acc, lang) => {
      const m = LOCALE_BUNDLES[lang].mission;
      acc[lang] = [
        m.day1.options.map((o) => o.tooltip),
        m.days['2'].options.map((o) => o.tooltip),
        m.days['3'].options.map((o) => o.tooltip),
        m.days['4'].options.map((o) => o.tooltip),
        m.days['5'].options.map((o) => o.tooltip),
      ];
      return acc;
    },
    {} as Record<AppLang, string[][]>,
  );

export const DAY1_RESULT_NARRATIVES: Record<
  AppLang,
  Record<string, DecisionResultNarrative>
> = SUPPORTED_LANGS.reduce(
  (acc, lang) => {
    const entries: Record<string, DecisionResultNarrative> = {};
    for (const opt of LOCALE_BUNDLES[lang].mission.day1.options) {
      entries[opt.id] = {
        ...opt.resultNarrative,
        nautiMood: opt.resultNarrative.nautiMood as
          | 'happy'
          | 'surprised'
          | 'thinking',
      };
    }
    acc[lang] = entries;
    return acc;
  },
  {} as Record<AppLang, Record<string, DecisionResultNarrative>>,
);

export function getMissionContent(lang: AppLang) {
  const safeLang: AppLang = LOCALE_BUNDLES[lang] ? lang : 'es';
  const bundle = LOCALE_BUNDLES[safeLang];
  return {
    day1Scene: DAY1_SCENES[safeLang],
    canonicalDays: CANONICAL_DAYS[safeLang],
    outcomes: OUTCOMES_CONTENT[safeLang],
    reflectionQuestions: REFLECTION_QUESTIONS[safeLang],
    triviaByDay: TRIVIA_BY_DAY[safeLang],
    tutorialScreens: bundle.mission.tutorialScreens as TutorialScreen[],
    riskLabels: RISK_LABELS_BY_LANG[safeLang],
    causality: bundle.mission.causality,
  };
}

export const clampStat = (value: number): number =>
  Math.max(0, Math.min(100, value));

export const formatSigned = (n: number): string => (n > 0 ? `+${n}` : `${n}`);

export const formatModelPrediction = (
  option: DecisionOption,
  lang: AppLang = 'es',
): string => {
  const [, summary, deltas, , riskFlag] = option;
  const bundle = LOCALE_BUNDLES[lang] ?? LOCALE_BUNDLES.es;
  const riskText = riskFlag
    ? ` ${interpolateTemplate(bundle.mission.modelPrediction.possibleRisk, {
        risk:
          bundle.mission.riskLabels[riskFlag] ?? bundle.ui.delayedRiskFallback,
      })}`
    : '';
  const projected = interpolateTemplate(
    bundle.mission.modelPrediction.projectedChanges,
    {
      energy: formatSigned(deltas[0]),
      health: formatSigned(deltas[1]),
      water: formatSigned(deltas[2]),
      research: formatSigned(deltas[3]),
    },
  );
  return `${summary} ${projected}${riskText}`;
};

export function getOptionTooltip(
  lang: AppLang,
  dayIndexZeroBased: number,
  optionIndex: number,
): string {
  const byLang = OPTION_TOOLTIPS[lang] ?? OPTION_TOOLTIPS.es;
  return byLang[dayIndexZeroBased]?.[optionIndex] ?? '';
}

export function buildSceneDataForDay(
  lang: AppLang,
  day: MissionDay,
  priorDecisions: Partial<Record<MissionDay, DecisionId>>,
): SceneData {
  const safeLang: AppLang = LOCALE_BUNDLES[lang] ? lang : 'es';
  if (day === 1) {
    return DAY1_SCENES[safeLang];
  }

  const spec = CANONICAL_DAYS[safeLang][day];
  const headings = LOCALE_BUNDLES[safeLang].mission.helpHeadings;
  const mappedOptions: DecisionOption[] = spec.options.map((opt) => {
    const effectiveEnergy =
      day === 5 &&
      opt.id === 'FINAL_RESEARCH' &&
      priorDecisions[2] === 'SCHEDULE_SCIENCE'
        ? -5
        : opt.effects.energy;

    return [
      opt.title,
      opt.description,
      [
        effectiveEnergy,
        opt.effects.health,
        opt.effects.water,
        opt.effects.research,
      ],
      opt.consequence,
      opt.riskHint ?? null,
    ];
  });

  return {
    title: spec.title,
    story: spec.situation,
    question: spec.question,
    help: `${headings.hintHeading}. ${spec.science} ${headings.reflectHeading} ${spec.reflection}`,
    helpSections: {
      hintHeading: headings.hintHeading,
      hintBody: spec.science,
      reflectHeading: headings.reflectHeading,
      reflectParagraphs: [spec.reflection],
      sourceHeading: headings.sourceHeading,
      sourceCitationPrefix: '',
      sourceCitationTitle: spec.source.title,
      sourceCitationSuffix: '',
    },
    source: spec.source.title,
    url: spec.source.url,
    options: mappedOptions,
  };
}

export function getDecisionId(
  day: MissionDay,
  optionIndex: number,
): DecisionId {
  if (day === 1) {
    return DAY1_DECISION_IDS[optionIndex] ?? 'BALANCED';
  }
  const daySpec = CANONICAL_DAYS.es[day];
  return daySpec.options[optionIndex]?.id ?? daySpec.options[0].id;
}

export function getDecisionTitleById(
  lang: AppLang,
  day: MissionDay,
  decisionId: DecisionId,
): string {
  const safeLang: AppLang = LOCALE_BUNDLES[lang] ? lang : 'es';
  if (day === 1) {
    const idx = DAY1_DECISION_IDS.indexOf(decisionId);
    return DAY1_SCENES[safeLang].options[idx >= 0 ? idx : 0][0];
  }
  const spec = CANONICAL_DAYS[safeLang][day];
  const found = spec.options.find((o) => o.id === decisionId);
  return found?.title ?? decisionId;
}

export function getResultNarrativeByDecisionId(
  lang: AppLang,
  decisionId: DecisionId | null | undefined,
): DecisionResultNarrative | null {
  if (!decisionId) return null;
  const safeLang: AppLang = LOCALE_BUNDLES[lang] ? lang : 'es';
  if (DAY1_RESULT_NARRATIVES[safeLang]?.[decisionId]) {
    return DAY1_RESULT_NARRATIVES[safeLang][decisionId];
  }
  const days: (2 | 3 | 4 | 5)[] = [2, 3, 4, 5];
  for (const d of days) {
    const spec = CANONICAL_DAYS[safeLang][d];
    const opt = spec.options.find((o) => o.id === decisionId);
    if (opt) {
      const mood: 'happy' | 'surprised' | 'thinking' =
        decisionId === 'POSTPONE_WATER' || decisionId === 'CONTINUE_OBSERVATIONS'
          ? 'thinking'
          : decisionId === 'FINAL_RESEARCH'
            ? 'surprised'
            : 'happy';
      return {
        title: opt.resultTitle,
        narrative: opt.consequence,
        energyExplanation: opt.indicatorExplanations.energy,
        healthExplanation: opt.indicatorExplanations.health,
        waterExplanation: opt.indicatorExplanations.water,
        researchExplanation: opt.indicatorExplanations.research,
        nautiDialogue: opt.nauti,
        nautiMood: mood,
        spokenNarration: `${opt.resultTitle}. ${opt.consequence} ${opt.nauti}`,
      };
    }
  }
  return null;
}

export function getDelayedConsequenceContent(
  lang: AppLang,
  decisionId: DecisionId,
): DelayedConsequenceSpec | null {
  const safeLang: AppLang = LOCALE_BUNDLES[lang] ? lang : 'es';
  const list = CANONICAL_DAYS[safeLang][5].delayedConsequences ?? [];
  return list.find((item) => item.if === decisionId) ?? null;
}
