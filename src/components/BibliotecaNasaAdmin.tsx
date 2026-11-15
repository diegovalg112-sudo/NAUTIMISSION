import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  ExternalLink,
  FilePlus2,
  FlaskConical,
  Loader2,
  Pencil,
  Search,
  ShieldAlert,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import {
  SOURCE_REPOSITORY_LABELS,
  SUGGESTED_NASA_QUERIES,
} from '../data/scientificLibrarySeed';
import { getScientificLibraryStrings } from '../data/scientificLibraryStrings';
import type { AppLang } from '../locales';
import {
  VERIFICATION_STAGES,
  type NasaSearchHit,
  type NasaSearchResponse,
  type NasaSourceRepository,
  type OsdrMetadataPreview,
  type ScientificRecord,
  type VerificationStatus,
} from '../types/scientificLibrary';
import { useScientificLibrary } from '../utils/scientificLibraryStore';
import { ScientificAuditorPanel } from './ScientificAuditorPanel';

interface BibliotecaNasaAdminProps {
  lang: AppLang;
  reviewerName: string;
}

type AdminTab = 'search' | 'manage' | 'auditor';

const EXPERIENCES_LIST = [
  'efecto-domino',
  'detectives-de-la-nasa',
  'escucha-imagina-construye',
  'traduciendo-la-ciencia',
] as const;

export const BibliotecaNasaAdmin: React.FC<BibliotecaNasaAdminProps> = ({
  lang,
  reviewerName,
}) => {
  const s = getScientificLibraryStrings(lang);
  const {
    categories,
    allRecords,
    createOrImportRecord,
    updateRecord,
    deleteRecord,
    addCategory,
    searchNasaLive,
    fetchOsdrMetadata,
    importHitAsDraft,
  } = useScientificLibrary();

  const [activeTab, setActiveTab] = useState<AdminTab>('search');

  // --- Tab 1: Live NASA Search ---
  const [queryInput, setQueryInput] = useState<string>('');
  const [sourceFilter, setSourceFilter] = useState<'all' | NasaSourceRepository>('all');
  const [importCategoryOverride, setImportCategoryOverride] = useState<string>('');
  const [searching, setSearching] = useState<boolean>(false);
  const [searchPageFrom, setSearchPageFrom] = useState<number>(0);
  const [searchResult, setSearchResult] = useState<NasaSearchResponse | null>(null);
  const [importingId, setImportingId] = useState<string | null>(null);
  const [importToast, setImportToast] = useState<string | null>(null);
  const [metaPreview, setMetaPreview] = useState<{
    loading: boolean;
    data?: OsdrMetadataPreview;
    error?: string;
  } | null>(null);

  // --- Tab 2: Manage & Verification Workflow ---
  const [statusFilter, setStatusFilter] = useState<'ALL' | VerificationStatus>('ALL');
  const [editingRecord, setEditingRecord] = useState<Partial<ScientificRecord> | null>(
    null,
  );
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [savingForm, setSavingForm] = useState<boolean>(false);
  const [newCategoryOpen, setNewCategoryOpen] = useState<boolean>(false);
  const [newCatEs, setNewCatEs] = useState<string>('');
  const [newCatEn, setNewCatEn] = useState<string>('');

  const runSearch = async (q: string, nextFrom = 0) => {
    const clean = q.trim();
    if (!clean) return;
    setSearching(true);
    setImportToast(null);
    setSearchPageFrom(nextFrom);
    const res = await searchNasaLive({
      query: clean,
      source: sourceFilter,
      from: nextFrom,
      size: 8,
    });
    setSearchResult(res);
    setSearching(false);
  };

  const importedUrlsOrIds = useMemo(() => {
    const set = new Set<string>();
    for (const r of allRecords) {
      if (r.source_url) set.add(r.source_url);
      if (r.source_identifier) set.add(r.source_identifier);
    }
    return set;
  }, [allRecords]);

  const handleImportHit = async (hit: NasaSearchHit) => {
    setImportingId(hit.externalId);
    setImportToast(null);
    const res = await importHitAsDraft(
      hit,
      importCategoryOverride || hit.suggestedCategory,
    );
    setImportingId(null);
    if (res.ok) {
      setImportToast(s.searchUi.importedToast);
    } else {
      setImportToast(res.error || 'Import error');
    }
  };

  const handleOpenOsdrPreview = async (studyId: string) => {
    setMetaPreview({ loading: true });
    const res = await fetchOsdrMetadata(studyId);
    if (res.ok && res.metadata) {
      setMetaPreview({ loading: false, data: res.metadata });
    } else {
      setMetaPreview({
        loading: false,
        error: res.error || 'Unable to load OSDR metadata',
      });
    }
  };

  const openCreateForm = () => {
    setIsCreatingNew(true);
    setFormError(null);
    setEditingRecord({
      category: categories[0]?.id ?? 'investigacion_espacial',
      topic: '',
      scientific_claim: '',
      student_explanation: '',
      why_it_matters: '',
      where_to_use: '',
      source_title: '',
      source_organization: 'NASA',
      source_url: '',
      source_identifier: '',
      authors: [],
      publication_date: '',
      organism_or_population: '',
      research_context: '',
      numerical_values: [],
      units: [],
      limitations: '',
      verification_status: 'DRAFT',
      verified_by: reviewerName,
      verification_date: new Date().toISOString().slice(0, 10),
      related_experiences: [],
      related_content_ids: [],
      language: lang,
    });
  };

  const openEditForm = (rec: ScientificRecord) => {
    setIsCreatingNew(false);
    setFormError(null);
    setEditingRecord({
      ...rec,
      verified_by: rec.verified_by || reviewerName,
      verification_date:
        rec.verification_date || new Date().toISOString().slice(0, 10),
    });
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    setFormError(null);

    const status = editingRecord.verification_status || 'DRAFT';
    if (
      (status === 'VERIFIED' || status === 'PUBLISHED') &&
      (!editingRecord.verified_by?.trim() ||
        !editingRecord.verification_date?.trim())
    ) {
      setFormError(s.manageUi.reviewerRequiredError);
      return;
    }

    if (
      !editingRecord.topic?.trim() ||
      !editingRecord.source_title?.trim() ||
      !editingRecord.source_url?.trim()
    ) {
      setFormError('Topic, source_title, and source_url are required.');
      return;
    }

    setSavingForm(true);
    const res = isCreatingNew
      ? await createOrImportRecord({
          ...editingRecord,
          topic: editingRecord.topic.trim(),
          source_title: editingRecord.source_title.trim(),
          source_url: editingRecord.source_url.trim(),
        })
      : await updateRecord(editingRecord.id!, editingRecord);
    setSavingForm(false);

    if (!res.ok) {
      setFormError(res.error || 'Error');
      return;
    }
    setEditingRecord(null);
    setIsCreatingNew(false);
  };

  const filteredManageRecords = useMemo(() => {
    if (statusFilter === 'ALL') return allRecords;
    return allRecords.filter((r) => r.verification_status === statusFilter);
  }, [allRecords, statusFilter]);

  return (
    <div className="space-y-3">
      {/* Admin sub-tabs + AI summary guardrail */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border-2 border-[#F2C66D] bg-[#fefce8] px-3.5 py-2 text-xs font-bold text-[#713f12]">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 flex-none text-[#b45309]" />
          <span>{s.aiSummaryWarning}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setActiveTab('search')}
          className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-black transition ${
            activeTab === 'search'
              ? 'bg-[#101D35] text-white shadow-[0_3px_0_#48C5B5]'
              : 'border-2 border-[#bce8f5] bg-white text-[#101D35] hover:border-[#48C5B5]'
          }`}
        >
          <Search className="h-3.5 w-3.5" />
          <span>{s.adminTabs.search}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('manage')}
          className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-black transition ${
            activeTab === 'manage'
              ? 'bg-[#101D35] text-white shadow-[0_3px_0_#48C5B5]'
              : 'border-2 border-[#bce8f5] bg-white text-[#101D35] hover:border-[#48C5B5]'
          }`}
        >
          <Database className="h-3.5 w-3.5" />
          <span>
            {s.adminTabs.manage} ({allRecords.length})
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('auditor')}
          className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-black transition ${
            activeTab === 'auditor'
              ? 'bg-[#101D35] text-white shadow-[0_3px_0_#48C5B5]'
              : 'border-2 border-[#bce8f5] bg-white text-[#101D35] hover:border-[#48C5B5]'
          }`}
        >
          <FlaskConical className="h-3.5 w-3.5" />
          <span>{s.adminTabs.auditor}</span>
        </button>
      </div>

      {/* TAB 1: LIVE NASA SEARCH */}
      {activeTab === 'search' && (
        <div className="space-y-3 rounded-2xl border-2 border-[#bce8f5] bg-white p-4">
          <div>
            <h2 className="text-base font-black text-[#101D35]">
              {s.searchUi.title}
            </h2>
            <p className="mt-0.5 text-xs font-semibold text-[#52708b]">
              {s.searchUi.subtitle}
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void runSearch(queryInput, 0);
            }}
            className="grid grid-cols-1 gap-2 sm:grid-cols-12"
          >
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder={s.searchUi.keywordPlaceholder}
              className="min-h-[42px] rounded-xl border-2 border-[#bce8f5] bg-[#f8fcff] px-3 text-xs font-semibold text-[#101D35] focus:border-[#48C5B5] focus:outline-none sm:col-span-6"
            />
            <select
              value={sourceFilter}
              onChange={(e) =>
                setSourceFilter(e.target.value as 'all' | NasaSourceRepository)
              }
              aria-label={s.searchUi.sourceFilterLabel}
              className="min-h-[42px] rounded-xl border-2 border-[#bce8f5] bg-white px-2.5 text-xs font-bold text-[#101D35] sm:col-span-3"
            >
              <option value="all">{s.searchUi.allSourcesOption}</option>
              {(Object.keys(SOURCE_REPOSITORY_LABELS) as NasaSourceRepository[]).map(
                (repoKey) => (
                  <option key={repoKey} value={repoKey}>
                    {SOURCE_REPOSITORY_LABELS[repoKey][lang]}
                  </option>
                ),
              )}
            </select>
            <button
              type="submit"
              disabled={searching || !queryInput.trim()}
              className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-xl bg-[#48C5B5] px-4 text-xs font-black text-[#101D35] shadow-[0_3px_0_#1e7a70] transition hover:bg-[#5cd8c8] disabled:opacity-50 sm:col-span-3"
            >
              {searching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{s.searchUi.searchingBtn}</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>{s.searchUi.searchBtn}</span>
                </>
              )}
            </button>
          </form>

          {/* Suggested Searches + Import Category selector */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-black text-[#52708b]">
                {s.searchUi.suggestedLabel}
              </span>
              {SUGGESTED_NASA_QUERIES.map((sq) => (
                <button
                  key={sq.enQuery}
                  type="button"
                  onClick={() => {
                    setQueryInput(sq.enQuery);
                    setImportCategoryOverride(sq.category);
                    void runSearch(sq.enQuery, 0);
                  }}
                  className="rounded-lg border border-[#bce8f5] bg-[#EAF4F2] px-2.5 py-1 text-[11px] font-black text-[#101D35] hover:border-[#48C5B5]"
                >
                  {lang === 'en'
                    ? sq.enLabel
                    : lang === 'gn-PY'
                      ? sq.gnLabel
                      : sq.esLabel}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-[#52708b]">
                {s.searchUi.categoryFilterLabel}:
              </span>
              <select
                value={importCategoryOverride}
                onChange={(e) => setImportCategoryOverride(e.target.value)}
                className="rounded-lg border border-[#cbd5e1] bg-white px-2 py-1 text-[11px] font-bold text-[#101D35]"
              >
                <option value="">Auto</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.labels[lang]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {importToast && (
            <div className="flex items-center justify-between gap-2 rounded-xl border border-[#86efac] bg-[#dcfce7] px-3 py-2 text-xs font-bold text-[#166534]">
              <span>{importToast}</span>
              <button
                type="button"
                onClick={() => setActiveTab('manage')}
                className="rounded-lg bg-[#166534] px-2.5 py-1 text-[11px] font-black text-white"
              >
                {s.adminTabs.manage}
              </button>
            </div>
          )}

          {/* Results area */}
          {!searchResult && !searching && (
            <div className="rounded-2xl border border-dashed border-[#bce8f5] bg-[#f8fcff] p-6 text-center text-xs font-semibold text-[#52708b]">
              {s.searchUi.emptyPrompt}
            </div>
          )}

          {searchResult && !searchResult.ok && (
            <div className="rounded-2xl border-2 border-[#fda4af] bg-[#fff1f2] p-4 text-xs text-[#be123c]">
              <p className="font-black">{s.searchUi.errorTitle}</p>
              <p className="mt-1 font-semibold">{searchResult.error}</p>
            </div>
          )}

          {searchResult && searchResult.ok && (
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-black text-[#101D35]">
                  {s.searchUi.resultsCount(
                    searchResult.hits.length,
                    searchResult.total,
                  )}
                </span>
                {searchResult.wasTranslated && (
                  <span className="rounded-lg bg-[#eef2ff] px-2.5 py-1 text-[11px] font-bold text-[#3730a3]">
                    {s.searchUi.bilingualNotice(
                      searchResult.query,
                      searchResult.translatedQuery,
                    )}
                  </span>
                )}
              </div>

              {searchResult.warnings && searchResult.warnings.length > 0 && (
                <div className="rounded-xl border border-[#fde047] bg-[#fefce8] px-3 py-2 text-[11px] font-bold text-[#854d0e]">
                  {searchResult.warnings.join(' · ')}
                </div>
              )}

              {searchResult.hits.length === 0 ? (
                <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-5 text-center">
                  <p className="text-xs font-black text-[#101D35]">
                    {s.searchUi.noHitsTitle}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[#52708b]">
                    {s.searchUi.noHitsBody}
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {searchResult.hits.map((hit) => {
                    const alreadyImported =
                      importedUrlsOrIds.has(hit.sourceUrl) ||
                      importedUrlsOrIds.has(hit.sourceIdentifier);
                    return (
                      <article
                        key={hit.externalId}
                        className="rounded-2xl border-2 border-[#d7ebf5] bg-[#f8fcff] p-3.5"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="rounded-lg bg-[#101D35] px-2 py-0.5 text-[10px] font-black text-[#48C5B5]">
                              {hit.repositoryLabel}
                            </span>
                            <span className="rounded-lg bg-white px-2 py-0.5 text-[10px] font-black text-[#101D35] ring-1 ring-[#cbd5e1]">
                              {hit.sourceIdentifier}
                            </span>
                            {hit.publicationDate && (
                              <span className="text-[10px] font-bold text-[#52708b]">
                                {hit.publicationDate}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-bold text-[#0f766e]">
                            🧬 {hit.organismOrPopulation}
                          </span>
                        </div>

                        <h3 className="mt-1.5 text-sm font-black text-[#101D35]">
                          {hit.title}
                        </h3>

                        {hit.abstract && (
                          <p className="mt-1 line-clamp-3 text-xs leading-relaxed font-semibold text-[#334155]">
                            {hit.abstract}
                          </p>
                        )}

                        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-[#e2e8f0] pt-2">
                          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-[#52708b]">
                            {hit.authors.length > 0 && (
                              <span>{hit.authors.join(', ')}</span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <a
                              href={hit.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-xl border border-[#cbd5e1] bg-white px-2.5 py-1.5 text-[11px] font-black text-[#101D35] hover:bg-[#f1f5f9]"
                            >
                              <span>{s.searchUi.openNasaLink}</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>

                            {hit.repository === 'NASA_OSDR' && (
                              <button
                                type="button"
                                onClick={() =>
                                  void handleOpenOsdrPreview(hit.sourceIdentifier)
                                }
                                className="rounded-xl border border-[#48C5B5] bg-[#EAF4F2] px-2.5 py-1.5 text-[11px] font-black text-[#101D35] hover:bg-[#d5ece8]"
                              >
                                {s.searchUi.previewMetadataBtn}
                              </button>
                            )}

                            {alreadyImported ? (
                              <span className="inline-flex items-center gap-1 rounded-xl bg-[#dcfce7] px-2.5 py-1.5 text-[11px] font-black text-[#166534]">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>{s.searchUi.alreadyImportedBadge}</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                disabled={importingId === hit.externalId}
                                onClick={() => void handleImportHit(hit)}
                                className="inline-flex items-center gap-1 rounded-xl bg-[#F2C66D] px-3 py-1.5 text-[11px] font-black text-[#101D35] shadow-[0_2px_0_#b45309] hover:bg-[#fde047]"
                              >
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>{s.searchUi.importReferenceBtn}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {searchResult.total > 8 && (
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    disabled={searching || searchPageFrom === 0}
                    onClick={() =>
                      void runSearch(
                        searchResult.query,
                        Math.max(0, searchPageFrom - 8),
                      )
                    }
                    className="rounded-xl border border-[#cbd5e1] bg-white px-3 py-1.5 text-xs font-black text-[#101D35] disabled:opacity-40"
                  >
                    {s.searchUi.prevPage}
                  </button>
                  <button
                    type="button"
                    disabled={
                      searching || searchPageFrom + 8 >= searchResult.total
                    }
                    onClick={() =>
                      void runSearch(searchResult.query, searchPageFrom + 8)
                    }
                    className="rounded-xl border border-[#cbd5e1] bg-white px-3 py-1.5 text-xs font-black text-[#101D35] disabled:opacity-40"
                  >
                    {s.searchUi.nextPage}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MANAGE & 5-STAGE VERIFICATION WORKFLOW */}
      {activeTab === 'manage' && (
        <div className="space-y-3 rounded-2xl border-2 border-[#bce8f5] bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="text-base font-black text-[#101D35]">
                {s.manageUi.title}
              </h2>
              <p className="mt-0.5 text-xs font-semibold text-[#52708b]">
                {s.manageUi.subtitle}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setNewCategoryOpen((v) => !v)}
                className="rounded-xl border border-[#bce8f5] bg-[#EAF4F2] px-3 py-1.5 text-xs font-black text-[#101D35] hover:border-[#48C5B5]"
              >
                {s.manageUi.addCategoryBtn}
              </button>
              <button
                type="button"
                onClick={openCreateForm}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#48C5B5] px-3.5 py-1.5 text-xs font-black text-[#101D35] shadow-[0_2px_0_#1e7a70] hover:bg-[#5cd8c8]"
              >
                <FilePlus2 className="h-4 w-4" />
                <span>{s.manageUi.newRecordBtn}</span>
              </button>
            </div>
          </div>

          {newCategoryOpen && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newCatEs.trim()) return;
                const res = await addCategory({
                  labelEs: newCatEs.trim(),
                  labelEn: newCatEn.trim() || newCatEs.trim(),
                });
                if (res.ok) {
                  setNewCatEs('');
                  setNewCatEn('');
                  setNewCategoryOpen(false);
                }
              }}
              className="flex flex-wrap items-center gap-2 rounded-xl border border-[#48C5B5] bg-[#f0fdfa] p-3"
            >
              <span className="text-xs font-black text-[#101D35]">
                {s.manageUi.newCategoryTitle}:
              </span>
              <input
                type="text"
                value={newCatEs}
                onChange={(e) => setNewCatEs(e.target.value)}
                placeholder={s.manageUi.categoryEsPlaceholder}
                className="rounded-lg border border-[#cbd5e1] bg-white px-2.5 py-1 text-xs font-semibold"
              />
              <input
                type="text"
                value={newCatEn}
                onChange={(e) => setNewCatEn(e.target.value)}
                placeholder={s.manageUi.categoryEnPlaceholder}
                className="rounded-lg border border-[#cbd5e1] bg-white px-2.5 py-1 text-xs font-semibold"
              />
              <button
                type="submit"
                className="rounded-lg bg-[#101D35] px-3 py-1 text-xs font-black text-white"
              >
                {s.manageUi.saveCategoryBtn}
              </button>
            </form>
          )}

          {/* Status filter pills */}
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`rounded-xl px-2.5 py-1 text-[11px] font-black ${
                statusFilter === 'ALL'
                  ? 'bg-[#101D35] text-white'
                  : 'bg-[#f1f5f9] text-[#101D35]'
              }`}
            >
              {s.manageUi.filterAllStatuses} ({allRecords.length})
            </button>
            {VERIFICATION_STAGES.map((st) => {
              const count = allRecords.filter(
                (r) => r.verification_status === st,
              ).length;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`rounded-xl px-2.5 py-1 text-[11px] font-black ${
                    statusFilter === st
                      ? 'bg-[#101D35] text-white'
                      : 'bg-[#f1f5f9] text-[#101D35]'
                  }`}
                >
                  {s.workflowLabels[st]} ({count})
                </button>
              );
            })}
          </div>

          {/* Records list */}
          <div className="space-y-2">
            {filteredManageRecords.map((rec) => {
              const cat = categories.find((c) => c.id === rec.category);
              const isPublic =
                rec.verification_status === 'VERIFIED' ||
                rec.verification_status === 'PUBLISHED';
              return (
                <div
                  key={rec.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border-2 border-[#e2e8f0] bg-[#f8fcff] p-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`rounded-lg px-2 py-0.5 text-[10px] font-black ${
                          isPublic
                            ? 'bg-[#dcfce7] text-[#166534]'
                            : 'bg-[#fef9c3] text-[#854d0e]'
                        }`}
                      >
                        {s.workflowLabels[rec.verification_status]}
                      </span>
                      <span className="rounded-lg bg-white px-2 py-0.5 text-[10px] font-bold text-[#101D35] ring-1 ring-[#cbd5e1]">
                        {cat?.icon} {cat?.labels[lang] ?? rec.category}
                      </span>
                      <span className="text-[10px] font-bold text-[#52708b]">
                        {rec.source_identifier}
                      </span>
                    </div>
                    <h3 className="mt-1 text-xs font-black text-[#101D35] sm:text-sm">
                      {rec.topic}
                    </h3>
                    <p className="mt-0.5 text-[11px] font-semibold text-[#52708b]">
                      🧬 {rec.organism_or_population}
                      {rec.verified_by
                        ? ` · ✓ ${rec.verified_by} (${rec.verification_date})`
                        : ''}
                    </p>
                  </div>

                  <div className="flex flex-none items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEditForm(rec)}
                      className="inline-flex items-center gap-1 rounded-xl bg-[#101D35] px-3 py-1.5 text-xs font-black text-white hover:bg-[#1e355d]"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      <span>{s.manageUi.editBtn}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteRecord(rec.id)}
                      aria-label={s.manageUi.deleteBtn}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[#fecdd3] bg-[#fff1f2] text-[#be123c] hover:bg-[#ffe4e6]"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: SCIENTIFIC AUDITOR */}
      {activeTab === 'auditor' && (
        <ScientificAuditorPanel
          lang={lang}
          reviewerName={reviewerName}
          onJumpToNasaSearch={(q, cat) => {
            setQueryInput(q);
            setImportCategoryOverride(cat);
            setActiveTab('search');
            void runSearch(q, 0);
          }}
          onEditRecord={(rec) => {
            setActiveTab('manage');
            openEditForm(rec);
          }}
        />
      )}

      {/* OSDR Metadata Preview Modal */}
      {metaPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#061229]/75 p-3 backdrop-blur-sm"
          onClick={() => setMetaPreview(null)}
        >
          <div
            className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border-2 border-[#48C5B5] bg-white text-[#101D35]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between bg-[#101D35] px-4 py-3 text-white">
              <h3 className="text-sm font-black">{s.searchUi.metaModalTitle}</h3>
              <button
                type="button"
                onClick={() => setMetaPreview(null)}
                className="rounded-lg bg-white/15 p-1.5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="cockpit-scroll flex-1 space-y-3 overflow-y-auto p-4 text-xs">
              {metaPreview.loading && (
                <div className="flex items-center gap-2 font-bold text-[#52708b]">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{s.searchUi.searchingBtn}</span>
                </div>
              )}
              {metaPreview.error && (
                <p className="font-bold text-[#be123c]">{metaPreview.error}</p>
              )}
              {metaPreview.data && (
                <>
                  <div>
                    <span className="rounded bg-[#EAF4F2] px-2 py-0.5 text-[10px] font-black text-[#0f766e]">
                      {metaPreview.data.studyId}
                    </span>
                    <h4 className="mt-1 text-sm font-black text-[#101D35]">
                      {metaPreview.data.title}
                    </h4>
                    <p className="mt-1 leading-relaxed font-semibold text-[#334155]">
                      {metaPreview.data.description}
                    </p>
                  </div>
                  {metaPreview.data.factors.length > 0 && (
                    <div>
                      <p className="font-black text-[#101D35]">
                        {s.searchUi.metaFactorsLabel}
                      </p>
                      <p className="mt-0.5 font-semibold text-[#52708b]">
                        {metaPreview.data.factors.join(' · ')}
                        {metaPreview.data.protocols.length > 0
                          ? ` | ${metaPreview.data.protocols.join(', ')}`
                          : ''}
                      </p>
                    </div>
                  )}
                  {metaPreview.data.publications.length > 0 && (
                    <div>
                      <p className="font-black text-[#101D35]">
                        {s.searchUi.metaPublicationsLabel}
                      </p>
                      <ul className="mt-1 list-disc space-y-1 pl-4 font-semibold text-[#334155]">
                        {metaPreview.data.publications.map((p, idx) => (
                          <li key={idx}>
                            {p.title}{' '}
                            {p.doi ? (
                              <span className="text-[#0f766e]">({p.doi})</span>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div>
                    <p className="font-black text-[#101D35]">
                      {s.searchUi.metaFilesLabel(metaPreview.data.fileCount)}
                    </p>
                    <ul className="mt-1 space-y-1 font-mono text-[11px] text-[#475569]">
                      {metaPreview.data.sampleFiles.map((f, i) => (
                        <li key={i}>
                          • {f.fileName} ({f.category})
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Scientific Record Modal */}
      {editingRecord && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#061229]/75 p-2.5 backdrop-blur-sm sm:p-4"
          onClick={() => setEditingRecord(null)}
        >
          <form
            onSubmit={handleSaveForm}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border-2 border-[#48C5B5] bg-[#f4fcff] text-[#101D35]"
          >
            <div className="flex flex-none items-center justify-between bg-[#101D35] px-4 py-3 text-white">
              <h3 className="text-sm font-black sm:text-base">
                {isCreatingNew
                  ? s.manageUi.formTitleCreate
                  : s.manageUi.formTitleEdit}
              </h3>
              <button
                type="button"
                onClick={() => setEditingRecord(null)}
                className="rounded-lg bg-white/15 p-1.5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="cockpit-scroll min-h-0 flex-1 space-y-3 overflow-y-auto p-4 text-xs">
              {formError && (
                <div className="flex items-start gap-2 rounded-xl border border-[#fda4af] bg-[#fff1f2] p-3 font-bold text-[#be123c]">
                  <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <label className="block">
                  <span className="font-black text-[#101D35]">
                    {s.manageUi.fieldLabels.category}
                  </span>
                  <select
                    value={editingRecord.category || ''}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        category: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#cbd5e1] bg-white px-2.5 py-2 font-bold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.labels[lang]}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="font-black text-[#101D35]">
                    {s.manageUi.fieldLabels.verificationStatus}
                  </span>
                  <select
                    value={editingRecord.verification_status || 'DRAFT'}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        verification_status: e.target
                          .value as VerificationStatus,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#cbd5e1] bg-white px-2.5 py-2 font-bold"
                  >
                    {VERIFICATION_STAGES.map((st) => (
                      <option key={st} value={st}>
                        {s.workflowLabels[st]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="font-black text-[#101D35]">
                  {s.manageUi.fieldLabels.topic} *
                </span>
                <input
                  type="text"
                  required
                  value={editingRecord.topic || ''}
                  onChange={(e) =>
                    setEditingRecord({ ...editingRecord, topic: e.target.value })
                  }
                  className="mt-1 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 py-2 font-semibold"
                />
              </label>

              <label className="block">
                <span className="font-black text-[#101D35]">
                  {s.manageUi.fieldLabels.scientificClaim}
                </span>
                <textarea
                  rows={2}
                  value={editingRecord.scientific_claim || ''}
                  onChange={(e) =>
                    setEditingRecord({
                      ...editingRecord,
                      scientific_claim: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 py-2 font-semibold"
                />
              </label>

              <label className="block">
                <span className="font-black text-[#101D35]">
                  {s.manageUi.fieldLabels.studentExplanation}
                </span>
                <textarea
                  rows={3}
                  value={editingRecord.student_explanation || ''}
                  onChange={(e) =>
                    setEditingRecord({
                      ...editingRecord,
                      student_explanation: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 py-2 font-semibold"
                />
              </label>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <label className="block">
                  <span className="font-black text-[#101D35]">
                    {s.manageUi.fieldLabels.whyItMatters}
                  </span>
                  <textarea
                    rows={2}
                    value={editingRecord.why_it_matters || ''}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        why_it_matters: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 py-2 font-semibold"
                  />
                </label>
                <label className="block">
                  <span className="font-black text-[#101D35]">
                    {s.manageUi.fieldLabels.whereToUse}
                  </span>
                  <textarea
                    rows={2}
                    value={editingRecord.where_to_use || ''}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        where_to_use: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 py-2 font-semibold"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <label className="block">
                  <span className="font-black text-[#101D35]">
                    {s.manageUi.fieldLabels.sourceTitle} *
                  </span>
                  <input
                    type="text"
                    required
                    value={editingRecord.source_title || ''}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        source_title: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 py-2 font-semibold"
                  />
                </label>

                <label className="block">
                  <span className="font-black text-[#101D35]">
                    {s.manageUi.fieldLabels.sourceUrl} *
                  </span>
                  <input
                    type="url"
                    required
                    value={editingRecord.source_url || ''}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        source_url: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 py-2 font-semibold"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                <label className="block">
                  <span className="font-black text-[#101D35]">
                    {s.manageUi.fieldLabels.sourceOrganization}
                  </span>
                  <input
                    type="text"
                    value={editingRecord.source_organization || ''}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        source_organization: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#cbd5e1] bg-white px-2.5 py-1.5 font-semibold"
                  />
                </label>
                <label className="block">
                  <span className="font-black text-[#101D35]">
                    {s.manageUi.fieldLabels.sourceIdentifier}
                  </span>
                  <input
                    type="text"
                    value={editingRecord.source_identifier || ''}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        source_identifier: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#cbd5e1] bg-white px-2.5 py-1.5 font-semibold"
                  />
                </label>
                <label className="block">
                  <span className="font-black text-[#101D35]">
                    {s.manageUi.fieldLabels.publicationDate}
                  </span>
                  <input
                    type="text"
                    value={editingRecord.publication_date || ''}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        publication_date: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#cbd5e1] bg-white px-2.5 py-1.5 font-semibold"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <label className="block">
                  <span className="font-black text-[#101D35]">
                    {s.manageUi.fieldLabels.organismOrPopulation}
                  </span>
                  <input
                    type="text"
                    value={editingRecord.organism_or_population || ''}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        organism_or_population: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 py-1.5 font-semibold"
                  />
                </label>
                <label className="block">
                  <span className="font-black text-[#101D35]">
                    {s.manageUi.fieldLabels.authors}
                  </span>
                  <input
                    type="text"
                    value={(editingRecord.authors || []).join(', ')}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        authors: e.target.value
                          .split(',')
                          .map((x) => x.trim())
                          .filter(Boolean),
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 py-1.5 font-semibold"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <label className="block">
                  <span className="font-black text-[#101D35]">
                    {s.manageUi.fieldLabels.researchContext}
                  </span>
                  <textarea
                    rows={2}
                    value={editingRecord.research_context || ''}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        research_context: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 py-1.5 font-semibold"
                  />
                </label>
                <label className="block">
                  <span className="font-black text-[#101D35]">
                    {s.manageUi.fieldLabels.limitations}
                  </span>
                  <textarea
                    rows={2}
                    value={editingRecord.limitations || ''}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        limitations: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 py-1.5 font-semibold"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <label className="block">
                  <span className="font-black text-[#101D35]">
                    {s.manageUi.fieldLabels.numericalValues}
                  </span>
                  <input
                    type="text"
                    value={(editingRecord.numerical_values || []).join(', ')}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        numerical_values: e.target.value
                          .split(',')
                          .map((x) => x.trim())
                          .filter(Boolean),
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 py-1.5 font-semibold"
                  />
                </label>
                <label className="block">
                  <span className="font-black text-[#101D35]">
                    {s.manageUi.fieldLabels.units}
                  </span>
                  <input
                    type="text"
                    value={(editingRecord.units || []).join(', ')}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        units: e.target.value
                          .split(',')
                          .map((x) => x.trim())
                          .filter(Boolean),
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 py-1.5 font-semibold"
                  />
                </label>
              </div>

              {/* Human verification sign-off */}
              <div className="grid grid-cols-1 gap-2.5 rounded-2xl border-2 border-[#86efac] bg-[#f0fdf4] p-3 sm:grid-cols-2">
                <label className="block">
                  <span className="font-black text-[#166534]">
                    {s.manageUi.fieldLabels.verifiedBy}
                  </span>
                  <input
                    type="text"
                    value={editingRecord.verified_by || ''}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        verified_by: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#86efac] bg-white px-3 py-1.5 font-semibold"
                  />
                </label>
                <label className="block">
                  <span className="font-black text-[#166534]">
                    {s.manageUi.fieldLabels.verificationDate}
                  </span>
                  <input
                    type="date"
                    value={editingRecord.verification_date || ''}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        verification_date: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#86efac] bg-white px-3 py-1.5 font-semibold"
                  />
                </label>
              </div>

              {/* Connect experiences & content IDs */}
              <div className="space-y-2 rounded-2xl border border-[#cbd5e1] bg-white p-3">
                <span className="block font-black text-[#101D35]">
                  {s.manageUi.fieldLabels.relatedExperiences}
                </span>
                <div className="flex flex-wrap gap-2">
                  {EXPERIENCES_LIST.map((expId) => {
                    const checked = (
                      editingRecord.related_experiences || []
                    ).includes(expId);
                    return (
                      <label
                        key={expId}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#f8fafc] px-2.5 py-1 font-bold"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const curr =
                              editingRecord.related_experiences || [];
                            const next = e.target.checked
                              ? Array.from(new Set([...curr, expId]))
                              : curr.filter((x) => x !== expId);
                            setEditingRecord({
                              ...editingRecord,
                              related_experiences: next,
                            });
                          }}
                        />
                        <span>{s.experienceNames[expId]}</span>
                      </label>
                    );
                  })}
                </div>
                <label className="block pt-1">
                  <span className="font-black text-[#101D35]">
                    {s.manageUi.fieldLabels.relatedContentIds}
                  </span>
                  <input
                    type="text"
                    value={(editingRecord.related_content_ids || []).join(', ')}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        related_content_ids: e.target.value
                          .split(',')
                          .map((x) => x.trim())
                          .filter(Boolean),
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-[#cbd5e1] bg-[#f8fafc] px-3 py-1.5 font-mono text-[11px]"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-none items-center justify-end gap-2 border-t border-[#d6eef7] bg-white px-4 py-3">
              <button
                type="button"
                onClick={() => setEditingRecord(null)}
                className="rounded-xl border border-[#cbd5e1] bg-white px-4 py-2 text-xs font-black text-[#101D35]"
              >
                {s.manageUi.cancelBtn}
              </button>
              <button
                type="submit"
                disabled={savingForm}
                className="rounded-xl bg-[#48C5B5] px-5 py-2 text-xs font-black text-[#101D35] shadow-[0_3px_0_#1e7a70] disabled:opacity-50"
              >
                {s.manageUi.saveChangesBtn}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
