export type EscuchaTechCategory =
  | 'solar_power'
  | 'water_recovery'
  | 'plant_growth'
  | 'oxygen_generation';

export type TechEpisodeStatus = 'available' | 'coming_soon';

export type EscuchaStage =
  | 'podcast'
  | 'challenge'
  | 'timer'
  | 'reveal'
  | 'reflection';

export type TechDeploymentStatus =
  | 'operating_in_space'
  | 'previously_tested'
  | 'under_development';

export type TargetDiagramId = 'solar_array_wing';

export interface ScientificSourceRecord {
  title: string;
  organization: string;
  author?: string;
  url: string;
  publicationDate?: string;
  deploymentStatus: TechDeploymentStatus;
  deploymentLabel: string;
}

export interface ScientificExplanationRecord {
  whatPieceIs: string;
  functionPerformed: string;
  howItConnects: string;
  whyDesignMatters: string;
  detailsToRecognize: readonly string[];
  scientificFact: string;
}

export interface TechnologyEpisodeRecord {
  id: string;
  order: number;
  category: EscuchaTechCategory;
  categoryLabel: string;
  status: TechEpisodeStatus;
  title: string;
  shortTopic: string;
  drawingChallengeSummary: string;
  estimatedMinutes: string;
  targetDiagramId?: TargetDiagramId;
  targetPieceTitle: string;
  referenceKindLabel: string;
  /** ~2-3 min podcast paragraphs spoken in sequence by NAUTI and shown in transcript */
  podcastTitle: string;
  podcastSegments: readonly string[];
  /** Stage 2 NAUTI announcement before the piece description */
  challengeIntroLines: readonly string[];
  /** Detailed spatial description matching the target illustration line-by-line */
  audioDescriptionLines: readonly string[];
  comparisonCriteria: readonly {
    id: string;
    label: string;
    detail: string;
  }[];
  scientificExplanation: ScientificExplanationRecord;
  reflectionQuestions: readonly string[];
  nasaSource: ScientificSourceRecord;
}

export interface EscuchaEpisodeProgress {
  episodeId: string | null;
  stage: EscuchaStage;
  timerDurationSeconds: number;
  timerCompleted: boolean;
  revealAuthorizedByTeacher: boolean;
  checkedCriteriaIds: readonly string[];
}
