import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  DEFAULT_LIBRARY_CATEGORIES,
  VERIFIED_SEED_RECORDS,
} from '../data/scientificLibrarySeed';
import type { AppLang } from '../locales';
import type {
  LibraryCategory,
  NasaSearchHit,
  NasaSearchResponse,
  NasaSourceRepository,
  OsdrMetadataPreview,
  ScientificRecord,
  VerificationStatus,
} from '../types/scientificLibrary';

const STORAGE_KEY = 'nauti_scientific_library_v1';

interface CachedLibraryPayload {
  categories: LibraryCategory[];
  records: ScientificRecord[];
}

function readCachedLibrary(): CachedLibraryPayload {
  if (typeof window === 'undefined') {
    return {
      categories: [...DEFAULT_LIBRARY_CATEGORIES],
      records: [...VERIFIED_SEED_RECORDS],
    };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        categories: [...DEFAULT_LIBRARY_CATEGORIES],
        records: [...VERIFIED_SEED_RECORDS],
      };
    }
    const parsed = JSON.parse(raw) as Partial<CachedLibraryPayload>;
    const categories =
      Array.isArray(parsed.categories) && parsed.categories.length > 0
        ? parsed.categories
        : [...DEFAULT_LIBRARY_CATEGORIES];
    const records =
      Array.isArray(parsed.records) && parsed.records.length > 0
        ? parsed.records
        : [...VERIFIED_SEED_RECORDS];
    return { categories, records };
  } catch {
    return {
      categories: [...DEFAULT_LIBRARY_CATEGORIES],
      records: [...VERIFIED_SEED_RECORDS],
    };
  }
}

function saveCachedLibrary(payload: CachedLibraryPayload) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage quota issues gracefully
  }
}

export function isStudentVisibleStatus(status: VerificationStatus): boolean {
  return status === 'VERIFIED' || status === 'PUBLISHED';
}

export function getLocalizedRecordField(
  record: ScientificRecord,
  lang: AppLang,
  field:
    | 'topic'
    | 'scientific_claim'
    | 'student_explanation'
    | 'why_it_matters'
    | 'where_to_use'
    | 'research_context'
    | 'organism_or_population'
    | 'limitations',
): string {
  const loc = record.localized?.[lang]?.[field];
  if (loc && loc.trim()) return loc;
  const fallbackEn =
    lang === 'en' ? record.localized?.en?.[field] : undefined;
  if (fallbackEn && fallbackEn.trim()) return fallbackEn;
  const baseVal = record[field];
  return typeof baseVal === 'string' ? baseVal : '';
}

export interface ScientificLibraryContextValue {
  categories: LibraryCategory[];
  allRecords: ScientificRecord[];
  verifiedRecords: ScientificRecord[];
  loading: boolean;
  syncError: string | null;
  refreshLibrary: () => Promise<void>;
  createOrImportRecord: (
    draft: Partial<ScientificRecord> & {
      topic: string;
      source_title: string;
      source_url: string;
    },
  ) => Promise<{ ok: boolean; record?: ScientificRecord; error?: string }>;
  updateRecord: (
    id: string,
    patch: Partial<ScientificRecord>,
  ) => Promise<{ ok: boolean; record?: ScientificRecord; error?: string }>;
  deleteRecord: (id: string) => Promise<{ ok: boolean; error?: string }>;
  addCategory: (input: {
    labelEs: string;
    labelEn?: string;
    labelGn?: string;
    descriptionEs?: string;
    descriptionEn?: string;
    icon?: string;
  }) => Promise<{ ok: boolean; category?: LibraryCategory; error?: string }>;
  searchNasaLive: (params: {
    query: string;
    source: 'all' | NasaSourceRepository;
    from?: number;
    size?: number;
  }) => Promise<NasaSearchResponse>;
  fetchOsdrMetadata: (
    studyId: string,
  ) => Promise<{ ok: boolean; metadata?: OsdrMetadataPreview; error?: string }>;
  importHitAsDraft: (
    hit: NasaSearchHit,
    categoryOverride?: string,
  ) => Promise<{ ok: boolean; record?: ScientificRecord; error?: string }>;
  lookupVerifiedByIds: (ids: readonly string[]) => ScientificRecord[];
  lookupVerifiedByContentId: (contentId: string) => ScientificRecord[];
}

const ScientificLibraryContext =
  createContext<ScientificLibraryContextValue | null>(null);

export const ScientificLibraryProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const initial = useMemo(() => readCachedLibrary(), []);
  const [categories, setCategories] = useState<LibraryCategory[]>(
    initial.categories,
  );
  const [allRecords, setAllRecords] = useState<ScientificRecord[]>(
    initial.records,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const refreshLibrary = useCallback(async () => {
    setLoading(true);
    setSyncError(null);
    try {
      const res = await fetch('/api/library/records');
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = (await res.json()) as {
        ok: boolean;
        categories?: LibraryCategory[];
        records?: ScientificRecord[];
        error?: string;
      };
      if (data.ok && Array.isArray(data.records)) {
        const nextCategories =
          Array.isArray(data.categories) && data.categories.length > 0
            ? data.categories
            : [...DEFAULT_LIBRARY_CATEGORIES];
        setCategories(nextCategories);
        setAllRecords(data.records);
        saveCachedLibrary({
          categories: nextCategories,
          records: data.records,
        });
      }
    } catch (err) {
      setSyncError(
        err instanceof Error ? err.message : 'Unable to sync library server',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshLibrary();
  }, [refreshLibrary]);

  const verifiedRecords = useMemo(
    () => allRecords.filter((r) => isStudentVisibleStatus(r.verification_status)),
    [allRecords],
  );

  const createOrImportRecord = useCallback(
    async (
      draft: Partial<ScientificRecord> & {
        topic: string;
        source_title: string;
        source_url: string;
      },
    ) => {
      try {
        const res = await fetch('/api/library/records', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(draft),
        });
        const data = (await res.json()) as {
          ok: boolean;
          record?: ScientificRecord;
          error?: string;
        };
        if (!res.ok || !data.ok || !data.record) {
          return {
            ok: false,
            error: data.error || `HTTP ${res.status}`,
          };
        }
        const saved = data.record;
        setAllRecords((prev) => {
          const exists = prev.some((r) => r.id === saved.id);
          const next = exists
            ? prev.map((r) => (r.id === saved.id ? saved : r))
            : [saved, ...prev];
          saveCachedLibrary({ categories, records: next });
          return next;
        });
        return { ok: true, record: saved };
      } catch (err) {
        return {
          ok: false,
          error: err instanceof Error ? err.message : 'Network error',
        };
      }
    },
    [categories],
  );

  const updateRecord = useCallback(
    async (id: string, patch: Partial<ScientificRecord>) => {
      try {
        const res = await fetch(`/api/library/records/${encodeURIComponent(id)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        });
        const data = (await res.json()) as {
          ok: boolean;
          record?: ScientificRecord;
          error?: string;
        };
        if (!res.ok || !data.ok || !data.record) {
          return { ok: false, error: data.error || `HTTP ${res.status}` };
        }
        const updated = data.record;
        setAllRecords((prev) => {
          const next = prev.map((r) => (r.id === updated.id ? updated : r));
          saveCachedLibrary({ categories, records: next });
          return next;
        });
        return { ok: true, record: updated };
      } catch (err) {
        return {
          ok: false,
          error: err instanceof Error ? err.message : 'Network error',
        };
      }
    },
    [categories],
  );

  const deleteRecord = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/library/records/${encodeURIComponent(id)}`, {
          method: 'DELETE',
        });
        const data = (await res.json()) as { ok: boolean; error?: string };
        if (!res.ok || !data.ok) {
          return { ok: false, error: data.error || `HTTP ${res.status}` };
        }
        setAllRecords((prev) => {
          const next = prev.filter((r) => r.id !== id);
          saveCachedLibrary({ categories, records: next });
          return next;
        });
        return { ok: true };
      } catch (err) {
        return {
          ok: false,
          error: err instanceof Error ? err.message : 'Network error',
        };
      }
    },
    [categories],
  );

  const addCategory = useCallback(
    async (input: {
      labelEs: string;
      labelEn?: string;
      labelGn?: string;
      descriptionEs?: string;
      descriptionEn?: string;
      icon?: string;
    }) => {
      try {
        const res = await fetch('/api/library/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });
        const data = (await res.json()) as {
          ok: boolean;
          category?: LibraryCategory;
          error?: string;
        };
        if (!res.ok || !data.ok || !data.category) {
          return { ok: false, error: data.error || `HTTP ${res.status}` };
        }
        const created = data.category;
        setCategories((prev) => {
          const next = [...prev, created];
          saveCachedLibrary({ categories: next, records: allRecords });
          return next;
        });
        return { ok: true, category: created };
      } catch (err) {
        return {
          ok: false,
          error: err instanceof Error ? err.message : 'Network error',
        };
      }
    },
    [allRecords],
  );

  const searchNasaLive = useCallback(
    async ({
      query,
      source,
      from = 0,
      size = 8,
    }: {
      query: string;
      source: 'all' | NasaSourceRepository;
      from?: number;
      size?: number;
    }): Promise<NasaSearchResponse> => {
      const url = new URL('/api/nasa/search', window.location.origin);
      url.searchParams.set('q', query);
      url.searchParams.set('source', source);
      url.searchParams.set('from', String(from));
      url.searchParams.set('size', String(size));
      try {
        const res = await fetch(url.toString());
        const data = (await res.json()) as NasaSearchResponse;
        return data;
      } catch (err) {
        return {
          ok: false,
          query,
          translatedQuery: query,
          wasTranslated: false,
          source,
          from,
          size,
          total: 0,
          hits: [],
          error:
            err instanceof Error
              ? err.message
              : 'Network error querying NASA proxy',
        };
      }
    },
    [],
  );

  const fetchOsdrMetadata = useCallback(async (studyId: string) => {
    try {
      const res = await fetch(
        `/api/nasa/osdr/meta/${encodeURIComponent(studyId)}`,
      );
      const data = (await res.json()) as {
        ok: boolean;
        metadata?: OsdrMetadataPreview;
        error?: string;
      };
      return data;
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : 'Network error',
      };
    }
  }, []);

  const importHitAsDraft = useCallback(
    async (hit: NasaSearchHit, categoryOverride?: string) => {
      const summaryExcerpt = hit.abstract
        ? hit.abstract.slice(0, 420) + (hit.abstract.length > 420 ? '…' : '')
        : hit.title;
      return createOrImportRecord({
        category: categoryOverride || hit.suggestedCategory,
        topic: hit.title,
        scientific_claim: summaryExcerpt,
        student_explanation:
          'Borrador importado desde repositorio NASA: redactar explicación clara para estudiantes tras verificar la fuente original.',
        why_it_matters:
          'Pendiente de completar: explicar por qué este estudio importa para la vida en el espacio y en la Tierra.',
        where_to_use:
          'Pendiente de asignar experiencias o episodios de NAUTI tras la verificación humana.',
        source_title: hit.title,
        source_organization: hit.sourceOrganization,
        source_url: hit.sourceUrl,
        source_identifier: hit.sourceIdentifier,
        authors: hit.authors,
        publication_date: hit.publicationDate,
        organism_or_population: hit.organismOrPopulation,
        research_context: `${hit.repositoryLabel} · ${hit.missionOrProgram}. Verificar especie, muestra y diseño experimental en el documento original.`,
        numerical_values: [],
        units: [],
        limitations:
          'Importado como SOURCE_FOUND: revisar si la investigación se realizó en ratones, células, plantas, simulaciones o tripulación humana antes de aprobar.',
        verification_status: 'SOURCE_FOUND',
        verified_by: '',
        verification_date: '',
        related_experiences: [],
        related_content_ids: [],
        language: 'es',
        source_repository: hit.repository,
      });
    },
    [createOrImportRecord],
  );

  const lookupVerifiedByIds = useCallback(
    (ids: readonly string[]) => {
      if (!ids || ids.length === 0) return [];
      const set = new Set(ids);
      return verifiedRecords.filter((r) => set.has(r.id));
    },
    [verifiedRecords],
  );

  const lookupVerifiedByContentId = useCallback(
    (contentId: string) => {
      if (!contentId) return [];
      return verifiedRecords.filter((r) =>
        r.related_content_ids.includes(contentId),
      );
    },
    [verifiedRecords],
  );

  const value = useMemo<ScientificLibraryContextValue>(
    () => ({
      categories,
      allRecords,
      verifiedRecords,
      loading,
      syncError,
      refreshLibrary,
      createOrImportRecord,
      updateRecord,
      deleteRecord,
      addCategory,
      searchNasaLive,
      fetchOsdrMetadata,
      importHitAsDraft,
      lookupVerifiedByIds,
      lookupVerifiedByContentId,
    }),
    [
      categories,
      allRecords,
      verifiedRecords,
      loading,
      syncError,
      refreshLibrary,
      createOrImportRecord,
      updateRecord,
      deleteRecord,
      addCategory,
      searchNasaLive,
      fetchOsdrMetadata,
      importHitAsDraft,
      lookupVerifiedByIds,
      lookupVerifiedByContentId,
    ],
  );

  return React.createElement(
    ScientificLibraryContext.Provider,
    { value },
    children,
  );
};

export function useScientificLibrary(): ScientificLibraryContextValue {
  const ctx = useContext(ScientificLibraryContext);
  if (!ctx) {
    throw new Error(
      'useScientificLibrary must be used inside ScientificLibraryProvider',
    );
  }
  return ctx;
}
