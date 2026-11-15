export type ResourceKey = 'energy' | 'water' | 'health' | 'research';

export interface Resources {
  energy: number;
  water: number;
  health: number;
  research: number;
}

export type Day1DecisionId = 'LIFE_SUPPORT' | 'LABORATORY' | 'BALANCED';
export type Day2DecisionId = 'SCHEDULE_SCIENCE' | 'CONSERVE_ENERGY';
export type Day3DecisionId = 'MAINTAIN_WATER' | 'POSTPONE_WATER';
export type Day4DecisionId = 'MAINTAIN_SOLAR' | 'CONTINUE_OBSERVATIONS';
export type Day5DecisionId = 'FINAL_CONSERVATION' | 'FINAL_RESEARCH';

export type DecisionId =
  | Day1DecisionId
  | Day2DecisionId
  | Day3DecisionId
  | Day4DecisionId
  | Day5DecisionId;

export type MissionDay = 1 | 2 | 3 | 4 | 5;

export type OutcomeId =
  | 'CRITICAL_FAILURE'
  | 'SUSTAINABLE_MISSION'
  | 'FRAGILE_SCIENTIFIC_MISSION'
  | 'SCIENTIFIC_GOAL_PENDING';

export type ResourceDelta = Partial<Resources>;

export interface DelayedEffectCardRecord {
  key: DecisionId;
  sourceDay: 2 | 3 | 4;
  effects: ResourceDelta;
}

export type SnapshotStage =
  | 'start'
  | 'day1'
  | 'day2'
  | 'day3'
  | 'day4'
  | 'day5_delayed'
  | 'day5_final';

export interface ResourceSnapshot {
  stage: SnapshotStage;
  day: number;
  resources: Resources;
}

export interface DecisionHistoryRecord {
  day: MissionDay;
  decisionId: DecisionId;
  decisionTitle: string;
  appliedEffects: Resources;
  resourcesAfter: Resources;
  specialRuleApplied?: boolean;
}

export interface MissionSimulationState {
  resources: Resources;
  decisions: Partial<Record<MissionDay, DecisionId>>;
  appliedTransactions: string[];
  snapshots: ResourceSnapshot[];
  history: DecisionHistoryRecord[];
  delayedApplied: DelayedEffectCardRecord[];
  haltedByCriticalFailure: boolean;
  haltedAtStage: SnapshotStage | null;
}

export const INITIAL_RESOURCES: Resources = {
  energy: 50,
  water: 50,
  health: 50,
  research: 50,
};

export const THRESHOLDS = {
  critical: 0,
  sustainability: 25,
  researchGoal: 60,
} as const;

export const DECISION_EFFECTS: Record<MissionDay, Partial<Record<DecisionId, ResourceDelta>>> = {
  1: {
    LIFE_SUPPORT: { energy: -7, health: 8, water: 0, research: 0 },
    LABORATORY: { energy: -17, health: -4, water: 0, research: 3 },
    BALANCED: { energy: -10, health: 0, water: 0, research: 1 },
  },
  2: {
    SCHEDULE_SCIENCE: { energy: -5, health: 0, water: 0, research: 2 },
    CONSERVE_ENERGY: { energy: 4, health: 1, water: 0, research: 0 },
  },
  3: {
    MAINTAIN_WATER: { energy: -5, health: 1, water: 0, research: 1 },
    POSTPONE_WATER: { energy: -3, health: 0, water: 0, research: 3 },
  },
  4: {
    MAINTAIN_SOLAR: { energy: -5, health: 0, water: 0, research: 1 },
    CONTINUE_OBSERVATIONS: { energy: -4, health: 0, water: 0, research: 3 },
  },
  5: {
    FINAL_CONSERVATION: { energy: 3, health: 2, water: 0, research: 0 },
    FINAL_RESEARCH: { energy: -8, health: -1, water: 0, research: 4 },
  },
};

export const DAY5_DELAYED_EFFECTS: Record<
  'POSTPONE_WATER' | 'MAINTAIN_WATER' | 'CONTINUE_OBSERVATIONS' | 'MAINTAIN_SOLAR' | 'CONSERVE_ENERGY' | 'SCHEDULE_SCIENCE',
  { sourceDay: 2 | 3 | 4; effects: ResourceDelta }
> = {
  POSTPONE_WATER: { sourceDay: 3, effects: { water: -5, health: -1 } },
  MAINTAIN_WATER: { sourceDay: 3, effects: {} },
  CONTINUE_OBSERVATIONS: { sourceDay: 4, effects: { energy: -6 } },
  MAINTAIN_SOLAR: { sourceDay: 4, effects: {} },
  CONSERVE_ENERGY: { sourceDay: 2, effects: {} },
  SCHEDULE_SCIENCE: { sourceDay: 2, effects: {} },
};

export const RESOURCE_KEYS: readonly ResourceKey[] = [
  'energy',
  'water',
  'health',
  'research',
];

export function cloneResources(r: Resources): Resources {
  return {
    energy: r.energy,
    water: r.water,
    health: r.health,
    research: r.research,
  };
}

export function normalizeDelta(delta: ResourceDelta): Resources {
  return {
    energy: delta.energy ?? 0,
    water: delta.water ?? 0,
    health: delta.health ?? 0,
    research: delta.research ?? 0,
  };
}

export function applyResourceDelta(base: Resources, delta: ResourceDelta): Resources {
  return {
    energy: base.energy + (delta.energy ?? 0),
    water: base.water + (delta.water ?? 0),
    health: base.health + (delta.health ?? 0),
    research: base.research + (delta.research ?? 0),
  };
}

export function isCriticalFailure(resources: Resources): boolean {
  return (
    resources.energy <= THRESHOLDS.critical ||
    resources.water <= THRESHOLDS.critical ||
    resources.health <= THRESHOLDS.critical
  );
}

export function isSustainabilityFragile(resources: Resources): boolean {
  return (
    resources.energy < THRESHOLDS.sustainability ||
    resources.water < THRESHOLDS.sustainability ||
    resources.health < THRESHOLDS.sustainability
  );
}

export function evaluateOutcome(resources: Resources): OutcomeId {
  if (isCriticalFailure(resources)) {
    return 'CRITICAL_FAILURE';
  }
  if (resources.research >= THRESHOLDS.researchGoal) {
    return resources.energy >= THRESHOLDS.sustainability &&
      resources.water >= THRESHOLDS.sustainability &&
      resources.health >= THRESHOLDS.sustainability
      ? 'SUSTAINABLE_MISSION'
      : 'FRAGILE_SCIENTIFIC_MISSION';
  }
  return 'SCIENTIFIC_GOAL_PENDING';
}

export function getEffectiveDecisionDelta(
  day: MissionDay,
  decisionId: DecisionId,
  priorDecisions: Partial<Record<MissionDay, DecisionId>>,
): { effects: Resources; specialRuleApplied: boolean } {
  const baseDelta = DECISION_EFFECTS[day]?.[decisionId];
  if (!baseDelta) {
    throw new Error(`Invalid decision ${decisionId} for day ${day}`);
  }
  const normalized = normalizeDelta(baseDelta);
  if (
    day === 5 &&
    decisionId === 'FINAL_RESEARCH' &&
    priorDecisions[2] === 'SCHEDULE_SCIENCE'
  ) {
    return {
      effects: {
        ...normalized,
        energy: -5,
      },
      specialRuleApplied: true,
    };
  }
  return { effects: normalized, specialRuleApplied: false };
}

export function evaluateDay5DelayedList(
  decisions: Partial<Record<MissionDay, DecisionId>>,
): DelayedEffectCardRecord[] {
  const items: DelayedEffectCardRecord[] = [];
  if (decisions[3] === 'POSTPONE_WATER') {
    items.push({
      key: 'POSTPONE_WATER',
      sourceDay: 3,
      effects: { ...DAY5_DELAYED_EFFECTS.POSTPONE_WATER.effects },
    });
  } else if (decisions[3] === 'MAINTAIN_WATER') {
    items.push({
      key: 'MAINTAIN_WATER',
      sourceDay: 3,
      effects: {},
    });
  }

  if (decisions[4] === 'CONTINUE_OBSERVATIONS') {
    items.push({
      key: 'CONTINUE_OBSERVATIONS',
      sourceDay: 4,
      effects: { ...DAY5_DELAYED_EFFECTS.CONTINUE_OBSERVATIONS.effects },
    });
  } else if (decisions[4] === 'MAINTAIN_SOLAR') {
    items.push({
      key: 'MAINTAIN_SOLAR',
      sourceDay: 4,
      effects: {},
    });
  }

  if (decisions[2] === 'CONSERVE_ENERGY') {
    items.push({
      key: 'CONSERVE_ENERGY',
      sourceDay: 2,
      effects: {},
    });
  } else if (decisions[2] === 'SCHEDULE_SCIENCE') {
    items.push({
      key: 'SCHEDULE_SCIENCE',
      sourceDay: 2,
      effects: {},
    });
  }

  return items;
}

export function createInitialSimulationState(): MissionSimulationState {
  const start = cloneResources(INITIAL_RESOURCES);
  return {
    resources: start,
    decisions: {},
    appliedTransactions: [],
    snapshots: [{ stage: 'start', day: 0, resources: cloneResources(start) }],
    history: [],
    delayedApplied: [],
    haltedByCriticalFailure: false,
    haltedAtStage: null,
  };
}

export function applyDecisionIdempotent(
  state: MissionSimulationState,
  day: MissionDay,
  decisionId: DecisionId,
  decisionTitle: string,
): MissionSimulationState {
  const txId = `decision_day_${day}`;
  if (state.appliedTransactions.includes(txId) || state.haltedByCriticalFailure) {
    return state;
  }

  const { effects, specialRuleApplied } = getEffectiveDecisionDelta(
    day,
    decisionId,
    state.decisions,
  );
  const nextResources = applyResourceDelta(state.resources, effects);
  const stageMap: Record<MissionDay, SnapshotStage> = {
    1: 'day1',
    2: 'day2',
    3: 'day3',
    4: 'day4',
    5: 'day5_final',
  };
  const stage = stageMap[day];
  const critical = isCriticalFailure(nextResources);

  return {
    ...state,
    resources: nextResources,
    decisions: {
      ...state.decisions,
      [day]: decisionId,
    },
    appliedTransactions: [...state.appliedTransactions, txId],
    snapshots: [
      ...state.snapshots,
      { stage, day, resources: cloneResources(nextResources) },
    ],
    history: [
      ...state.history,
      {
        day,
        decisionId,
        decisionTitle,
        appliedEffects: effects,
        resourcesAfter: cloneResources(nextResources),
        specialRuleApplied,
      },
    ],
    haltedByCriticalFailure: critical,
    haltedAtStage: critical ? stage : state.haltedAtStage,
  };
}

export function applyDay5DelayedIdempotent(
  state: MissionSimulationState,
): MissionSimulationState {
  const txId = 'day5_delayed_effects';
  if (state.appliedTransactions.includes(txId) || state.haltedByCriticalFailure) {
    return state;
  }

  const delayedItems = evaluateDay5DelayedList(state.decisions);
  let nextResources = cloneResources(state.resources);
  for (const item of delayedItems) {
    nextResources = applyResourceDelta(nextResources, item.effects);
  }
  const critical = isCriticalFailure(nextResources);

  return {
    ...state,
    resources: nextResources,
    appliedTransactions: [...state.appliedTransactions, txId],
    snapshots: [
      ...state.snapshots,
      { stage: 'day5_delayed', day: 5, resources: cloneResources(nextResources) },
    ],
    delayedApplied: delayedItems,
    haltedByCriticalFailure: critical,
    haltedAtStage: critical ? 'day5_delayed' : state.haltedAtStage,
  };
}

export function sumDelayedEffects(items: DelayedEffectCardRecord[]): Resources {
  return items.reduce<Resources>(
    (acc, item) => ({
      energy: acc.energy + (item.effects.energy ?? 0),
      water: acc.water + (item.effects.water ?? 0),
      health: acc.health + (item.effects.health ?? 0),
      research: acc.research + (item.effects.research ?? 0),
    }),
    { energy: 0, water: 0, health: 0, research: 0 },
  );
}
