import type { AppLang } from '../locales';

export type VerificationStatus =
  | 'DRAFT'
  | 'SOURCE_FOUND'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'PUBLISHED';

export const VERIFICATION_STAGES: readonly VerificationStatus[] = [
  'DRAFT',
  'SOURCE_FOUND',
  'UNDER_REVIEW',
  'VERIFIED',
  'PUBLISHED',
] as const;

export type NasaSourceRepository =
  | 'NASA_OSDR'
  | 'NASA_NTRS'
  | 'NASA_ISS_RESEARCH'
  | 'NASA_ARTEMIS'
  | 'OTHER_OFFICIAL_NASA';

export type LibraryCategoryId =
  | 'agua_soporte_vital'
  | 'energia'
  | 'salud_espacial'
  | 'investigacion_espacial'
  | string;

export interface LibraryCategory {
  id: LibraryCategoryId;
  order: number;
  icon: string;
  accentColor: string;
  labels: {
    es: string;
    en: string;
    'gn-PY': string;
  };
  descriptions: {
    es: string;
    en: string;
    'gn-PY': string;
  };
  isDefault?: boolean;
}

export interface ScientificRecord {
  id: string;
  category: LibraryCategoryId;
  topic: string;
  scientific_claim: string;
  student_explanation: string;
  why_it_matters?: string;
  where_to_use?: string;
  source_title: string;
  source_organization: string;
  source_url: string;
  source_identifier: string;
  authors: string[];
  publication_date: string;
  organism_or_population: string;
  research_context: string;
  numerical_values: string[];
  units: string[];
  limitations: string;
  verification_status: VerificationStatus;
  verified_by: string;
  verification_date: string;
  related_experiences: string[];
  related_content_ids: string[];
  language: AppLang;
  created_at: string;
  updated_at: string;
  source_repository?: NasaSourceRepository;
  /** Optional localized card text so verified entries read naturally in ES/EN/GN */
  localized?: Partial<
    Record<
      AppLang,
      {
        topic?: string;
        scientific_claim?: string;
        student_explanation?: string;
        why_it_matters?: string;
        where_to_use?: string;
        research_context?: string;
        organism_or_population?: string;
        limitations?: string;
      }
    >
  >;
}

export interface NasaSearchHit {
  externalId: string;
  repository: NasaSourceRepository;
  repositoryLabel: string;
  title: string;
  abstract: string;
  authors: string[];
  publicationDate: string;
  sourceUrl: string;
  sourceIdentifier: string;
  sourceOrganization: string;
  organismOrPopulation: string;
  missionOrProgram: string;
  keywords: string[];
  suggestedCategory: LibraryCategoryId;
}

export interface NasaSearchResponse {
  ok: boolean;
  query: string;
  translatedQuery: string;
  wasTranslated: boolean;
  source: 'all' | NasaSourceRepository;
  from: number;
  size: number;
  total: number;
  hits: NasaSearchHit[];
  warnings?: string[];
  error?: string;
}

export interface OsdrMetadataPreview {
  studyId: string;
  title: string;
  description: string;
  publicReleaseDate: string;
  submissionDate: string;
  people: { name: string; role: string; affiliation: string }[];
  publications: { title: string; authorList: string; doi: string; pubmedId: string }[];
  factors: string[];
  protocols: string[];
  fileCount: number;
  sampleFiles: { fileName: string; category: string; fileSize: number }[];
  studyUrl: string;
}

export interface AuditContentItem {
  contentId: string;
  experienceId:
    | 'efecto-domino'
    | 'detectives-de-la-nasa'
    | 'escucha-imagina-construye'
    | 'traduciendo-la-ciencia';
  experienceName: Record<AppLang, string>;
  title: Record<AppLang, string>;
  contentLocation: string;
  claims: string[];
  numericalValues: string[];
  existingSourceTitle?: string;
  existingSourceUrl?: string;
  isDeclaredFictionalDemo?: boolean;
  suggestedCategory: LibraryCategoryId;
  recommendedQuery: string;
  suggestedRecordIds: string[];
}
