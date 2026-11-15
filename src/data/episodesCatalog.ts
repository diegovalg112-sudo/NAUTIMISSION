import { CATALOG_STRINGS } from './uiStrings';
import type { AppLang } from '../locales';

export type EpisodeId =
  | 'ep-01-energia-aurora'
  | 'ep-02-falla-base-aurora'
  | 'ep-03-alimentos-lunares'
  | 'ep-04-tormenta-solar';

export type EpisodeStatus = 'available' | 'coming_soon';

export type EpisodeIllustrationKey =
  | 'energy_shortage'
  | 'system_malfunction'
  | 'food_production'
  | 'solar_storm';

export type EpisodeEntryRoute = 'aurora_survival_5_days' | 'coming_soon';

export type IntegratedSystemVariable =
  | 'energy'
  | 'water'
  | 'health'
  | 'research';

/**
 * Shared simulation model contract for every Efecto Dominó episode at Base Aurora.
 * Reflecting the NASA Space Apps Challenge "Build a Junior Astronaut Mission Trainer"
 * integrative systems approach, every episode operates over 5 connected days where
 * each team decision affects all four interdependent variables simultaneously.
 */
export const SHARED_EPISODE_ENGINE_SPEC = {
  daysCount: 5,
  integratedVariables: ['energy', 'water', 'health', 'research'] as const,
  supportsDelayedConsequences: true,
  supportsModelarAndTrivia: true,
} as const;

export interface EpisodeCatalogDefinition {
  id: EpisodeId;
  order: 1 | 2 | 3 | 4;
  status: EpisodeStatus;
  illustrationKey: EpisodeIllustrationKey;
  entryRoute: EpisodeEntryRoute;
  daysCount: number;
  integratedVariables: readonly IntegratedSystemVariable[];
}

export interface EpisodeCatalogItem extends EpisodeCatalogDefinition {
  numberLabel: string;
  title: string;
  initialProblem: string;
  description: string;
  coverSynopsis: string;
}

/**
 * Independent catalog of Efecto Dominó episodes at Base Aurora.
 * Playability depends strictly on each episode's own `status`
 * (`'available'` vs `'coming_soon'`), never on sequential completion or locks.
 * Every episode shares the same 5-day, 4-variable integrated decision engine.
 */
export const EPISODE_CATALOG: readonly EpisodeCatalogDefinition[] = [
  {
    id: 'ep-01-energia-aurora',
    order: 1,
    status: 'available',
    illustrationKey: 'energy_shortage',
    entryRoute: 'aurora_survival_5_days',
    daysCount: SHARED_EPISODE_ENGINE_SPEC.daysCount,
    integratedVariables: SHARED_EPISODE_ENGINE_SPEC.integratedVariables,
  },
  {
    id: 'ep-02-falla-base-aurora',
    order: 2,
    status: 'coming_soon',
    illustrationKey: 'system_malfunction',
    entryRoute: 'coming_soon',
    daysCount: SHARED_EPISODE_ENGINE_SPEC.daysCount,
    integratedVariables: SHARED_EPISODE_ENGINE_SPEC.integratedVariables,
  },
  {
    id: 'ep-03-alimentos-lunares',
    order: 3,
    status: 'coming_soon',
    illustrationKey: 'food_production',
    entryRoute: 'coming_soon',
    daysCount: SHARED_EPISODE_ENGINE_SPEC.daysCount,
    integratedVariables: SHARED_EPISODE_ENGINE_SPEC.integratedVariables,
  },
  {
    id: 'ep-04-tormenta-solar',
    order: 4,
    status: 'coming_soon',
    illustrationKey: 'solar_storm',
    entryRoute: 'coming_soon',
    daysCount: SHARED_EPISODE_ENGINE_SPEC.daysCount,
    integratedVariables: SHARED_EPISODE_ENGINE_SPEC.integratedVariables,
  },
] as const;

export function getEpisodeCatalog(lang: AppLang): EpisodeCatalogItem[] {
  const c = CATALOG_STRINGS[lang];
  return EPISODE_CATALOG.map((def) => {
    const localized = c.episodes[def.id];
    return {
      ...def,
      numberLabel: localized.numberLabel,
      title: localized.title,
      initialProblem: localized.initialProblem,
      description: localized.description,
      coverSynopsis: localized.coverSynopsis,
    };
  });
}
