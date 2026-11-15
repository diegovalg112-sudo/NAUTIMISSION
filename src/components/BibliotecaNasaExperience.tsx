import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Home,
  Lock,
  Search,
  ShieldCheck,
  Square,
  Unlock,
  Volume2,
  X,
} from 'lucide-react';
import { getExperienceCredits } from '../data/experienceCredits';
import { getScientificLibraryStrings } from '../data/scientificLibraryStrings';
import { PLATFORM_STRINGS, UI_STRINGS } from '../data/uiStrings';
import type { MusicAudioControls } from '../hooks/useMusicAudio';
import type { SpeechControlsState } from '../hooks/useSpeech';
import type { LibraryCategoryId, ScientificRecord } from '../types/scientificLibrary';
import {
  getLocalizedRecordField,
  useScientificLibrary,
} from '../utils/scientificLibraryStore';
import { BibliotecaNasaAdmin } from './BibliotecaNasaAdmin';
import { ExperienceCredits } from './ExperienceCredits';
import { FilomatasLogo } from './FilomatasLogo';
import { LanguageSelector } from './LanguageSelector';
import { NautiCharacterRig, type TickleIntensity } from './NautiCharacterRig';
import { NautiLogo } from './NautiLogo';
import {
  ScientificFactCard,
  ScientificFactDetailModal,
} from './ScientificFactCard';
import { SoundControlButton } from './SoundControlButton';

interface BibliotecaNasaExperienceProps {
  audio: MusicAudioControls;
  speech: SpeechControlsState;
  onListen: (customText?: string) => void;
  onStopVoice: () => void;
  onOpenVoiceSettings: () => void;
  onBackToDesktop: () => void;
  tickleCaption?: string | null;
  onTickleSound?: (intensity: TickleIntensity) => void;
}

export const BibliotecaNasaExperience: React.FC<
  BibliotecaNasaExperienceProps
> = ({
  audio,
  speech,
  onListen,
  onStopVoice,
  onOpenVoiceSettings,
  onBackToDesktop,
  tickleCaption = null,
  onTickleSound,
}) => {
  const lang = audio.audioLang;
  const t = UI_STRINGS[lang];
  const p = PLATFORM_STRINGS[lang];
  const s = getScientificLibraryStrings(lang);
  const credits = getExperienceCredits('biblioteca-cientifica-nasa', lang);

  const { categories, verifiedRecords } = useScientificLibrary();

  const [mode, setMode] = useState<'student' | 'admin'>('student');
  const [adminGateOpen, setAdminGateOpen] = useState<boolean>(false);
  const [reviewerName, setReviewerName] = useState<string>(() => {
    if (typeof window === 'undefined') return 'Filómatas LAB';
    return (
      window.sessionStorage.getItem('nauti_lib_reviewer') || 'Filómatas LAB'
    );
  });
  const [adminConfirmedCheck, setAdminConfirmedCheck] = useState<boolean>(false);

  const [selectedCategory, setSelectedCategory] = useState<
    'all' | LibraryCategoryId
  >('all');
  const [studentQuery, setStudentQuery] = useState<string>('');
  const [activeDetail, setActiveDetail] = useState<ScientificRecord | null>(
    null,
  );

  const filteredVerified = useMemo(() => {
    const q = studentQuery.trim().toLowerCase();
    return verifiedRecords.filter((rec) => {
      if (selectedCategory !== 'all' && rec.category !== selectedCategory) {
        return false;
      }
      if (!q) return true;
      const hay = [
        getLocalizedRecordField(rec, lang, 'topic'),
        getLocalizedRecordField(rec, lang, 'student_explanation'),
        getLocalizedRecordField(rec, lang, 'scientific_claim'),
        rec.source_title,
        rec.source_identifier,
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [verifiedRecords, selectedCategory, studentQuery, lang]);

  const nautiMessage =
    mode === 'admin' ? s.nautiAdminPrompt : s.nautiStudentPrompt;

  return (
    <div className="relative z-10 flex h-full min-h-0 w-full flex-col gap-2.5 overflow-hidden p-2 sm:p-3">
      {/* Top NAUTI Command Header */}
      <header className="flex flex-none flex-wrap items-center justify-between gap-2 rounded-2xl border-2 border-[#48C5B5]/45 bg-[#101D35]/90 px-3 py-2 text-white shadow-[0_4px_0_#070e1c]">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={onBackToDesktop}
            title={p.backToDesktopBtn}
            aria-label={p.backToDesktopBtn}
            className="inline-flex min-h-[36px] flex-none items-center gap-1 rounded-xl border-2 border-[#48C5B5]/60 bg-[#101D35] px-2.5 py-1 text-xs font-black text-[#EAF4F2] shadow-[0_2px_0_#070e1c] transition hover:bg-[#162747]"
          >
            <Home className="h-3.5 w-3.5 text-[#48C5B5]" aria-hidden="true" />
            <span className="hidden lg:inline">{p.backToDesktopBtn}</span>
          </button>

          <div className="hidden min-w-0 items-center gap-2 sm:flex">
            <NautiLogo className="h-7 sm:h-8" alt={t.platformName} />
            <span className="h-5 w-px bg-[#48C5B5]/35" aria-hidden="true" />
            <FilomatasLogo className="h-6 sm:h-7" />
          </div>

          <span className="truncate text-xs font-black text-[#F2C66D] sm:text-sm">
            📚 {s.moduleTitle}
          </span>
        </div>

        <div className="flex flex-none flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Student / Admin Mode Switcher */}
          <div className="inline-flex rounded-xl border border-[#314975] bg-[#0a1529] p-0.5">
            <button
              type="button"
              onClick={() => setMode('student')}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-black transition ${
                mode === 'student'
                  ? 'bg-[#48C5B5] text-[#101D35]'
                  : 'text-[#EAF4F2]/80 hover:text-white'
              }`}
            >
              <BookOpen className="mr-1 inline h-3 w-3" />
              {s.studentModeBtn}
            </button>
            <button
              type="button"
              onClick={() => {
                if (mode === 'admin') return;
                setAdminConfirmedCheck(false);
                setAdminGateOpen(true);
              }}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-black transition ${
                mode === 'admin'
                  ? 'bg-[#F2C66D] text-[#101D35]'
                  : 'text-[#EAF4F2]/80 hover:text-white'
              }`}
            >
              {mode === 'admin' ? (
                <Unlock className="mr-1 inline h-3 w-3" />
              ) : (
                <Lock className="mr-1 inline h-3 w-3" />
              )}
              {s.adminModeBtn}
            </button>
          </div>

          <LanguageSelector
            value={audio.audioLang}
            onChange={audio.setAudioLang}
            variant="hud"
          />
          <SoundControlButton
            audio={audio}
            speech={speech}
            onReplayCurrent={() => onListen(nautiMessage)}
            onOpenVoiceModal={onOpenVoiceSettings}
          />
        </div>
      </header>

      {/* Main Content Stage */}
      <div className="cockpit-scroll min-h-0 flex-1 overflow-y-auto pr-1 pb-3">
        {mode === 'student' ? (
          <div className="mx-auto max-w-[1160px] space-y-3">
            {/* Compact Hero + NAUTI Companion */}
            <div className="grid grid-cols-1 gap-3 rounded-3xl border-2 border-[#48C5B5]/50 bg-[#101D35]/90 p-3.5 text-white shadow-[0_6px_0_#070e1c] md:grid-cols-12 md:items-center">
              <div className="md:col-span-8">
                <span className="inline-block rounded-lg bg-[#48C5B5]/20 px-2.5 py-0.5 text-[10px] font-black tracking-wide text-[#48C5B5] uppercase">
                  {s.moduleBadge}
                </span>
                <h1 className="mt-1 text-lg leading-tight font-black text-[#EAF4F2] sm:text-2xl">
                  {s.moduleTitle}
                </h1>
                <p className="mt-1 text-xs leading-relaxed font-semibold text-[#EAF4F2]/85 sm:text-sm">
                  {s.moduleSubtitle}
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      speech.isSpeaking
                        ? onStopVoice()
                        : onListen(nautiMessage)
                    }
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#48C5B5] px-3 py-1.5 text-xs font-black text-[#101D35] transition hover:bg-[#5cd8c8]"
                  >
                    {speech.isSpeaking ? (
                      <>
                        <Square className="h-3.5 w-3.5 fill-current" />
                        <span>{t.stopVoice}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>{t.listenAgain}</span>
                      </>
                    )}
                  </button>
                  <span className="inline-flex items-center gap-1 rounded-xl bg-[#162747] px-2.5 py-1.5 text-[11px] font-black text-[#86efac]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{s.verifiedCountLabel(verifiedRecords.length)}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-2xl border border-[#48C5B5]/35 bg-[#0a1529]/80 p-2.5 md:col-span-4">
                <div className="w-16 flex-none sm:w-20">
                  <NautiCharacterRig
                    expression="happy"
                    gaze="center"
                    isSpeaking={speech.isSpeaking}
                    mouthPulse={speech.mouthPulse}
                    onTickleSound={onTickleSound}
                  />
                </div>
                <p className="text-[11px] leading-snug font-bold text-[#EAF4F2]">
                  {tickleCaption || nautiMessage}
                </p>
              </div>
            </div>

            {/* Category Explorer Cards */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((cat) => {
                const count = verifiedRecords.filter(
                  (r) => r.category === cat.id,
                ).length;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() =>
                      setSelectedCategory(isSelected ? 'all' : cat.id)
                    }
                    className={`flex flex-col justify-between rounded-2xl border-2 p-3 text-left transition ${
                      isSelected
                        ? 'border-[#F2C66D] bg-[#162747] text-white shadow-[0_4px_0_#b45309]'
                        : 'border-[#48C5B5]/40 bg-[#101D35]/85 text-[#EAF4F2] hover:border-[#48C5B5]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xl">{cat.icon}</span>
                      <span className="tabular-nums rounded-lg bg-[#EAF4F2]/15 px-2 py-0.5 text-[10px] font-black text-[#F2C66D]">
                        {count}
                      </span>
                    </div>
                    <h2 className="mt-1.5 text-xs font-black sm:text-sm">
                      {cat.labels[lang]}
                    </h2>
                    <p className="mt-0.5 line-clamp-2 text-[11px] font-semibold text-[#EAF4F2]/75">
                      {cat.descriptions[lang]}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Search + Category Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border-2 border-[#bce8f5] bg-white/95 p-3 text-[#101D35]">
              <div className="relative min-w-[220px] flex-1">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#52708b]" />
                <input
                  type="text"
                  value={studentQuery}
                  onChange={(e) => setStudentQuery(e.target.value)}
                  placeholder={s.studentSearchPlaceholder}
                  className="min-h-[40px] w-full rounded-xl border-2 border-[#bce8f5] bg-[#f8fcff] py-1.5 pr-3 pl-9 text-xs font-semibold text-[#101D35] focus:border-[#48C5B5] focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setStudentQuery('');
                }}
                className={`rounded-xl px-3 py-2 text-xs font-black transition ${
                  selectedCategory === 'all'
                    ? 'bg-[#101D35] text-white'
                    : 'border border-[#cbd5e1] bg-[#f8fafc] text-[#101D35]'
                }`}
              >
                {s.allCategoriesLabel} ({verifiedRecords.length})
              </button>
            </div>

            {/* Verified Student Scientific Fact Cards */}
            {filteredVerified.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-[#bce8f5] bg-white/90 p-6 text-center text-[#101D35]">
                <p className="text-sm font-black">{s.noStudentResultsTitle}</p>
                <p className="mt-1 text-xs font-semibold text-[#52708b]">
                  {s.noStudentResultsBody}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {filteredVerified.map((rec) => (
                  <ScientificFactCard
                    key={rec.id}
                    record={rec}
                    category={categories.find((c) => c.id === rec.category)}
                    lang={lang}
                    onOpenDetail={setActiveDetail}
                  />
                ))}
              </div>
            )}

            {/* Study Context Scientific Literacy Banner */}
            <div className="rounded-2xl border-2 border-[#c7d2fe] bg-[#eef2ff] px-4 py-2.5 text-xs font-bold text-[#312e81]">
              🔬 {s.studyContextWarning}
            </div>

            {/* Creator Recognition ("Detrás de esta experiencia") */}
            {credits && <ExperienceCredits credits={credits} lang={lang} />}
          </div>
        ) : (
          <div className="mx-auto max-w-[1180px] space-y-3">
            {/* Admin Active Status Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border-2 border-[#F2C66D] bg-[#101D35] px-4 py-2.5 text-white">
              <div className="flex items-center gap-2 text-xs font-black">
                <ShieldCheck className="h-4 w-4 text-[#F2C66D]" />
                <span>{s.adminActiveBanner}</span>
                <span className="rounded-lg bg-white/15 px-2 py-0.5 text-[10px] text-[#48C5B5]">
                  {reviewerName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMode('student')}
                className="rounded-xl bg-[#48C5B5] px-3 py-1.5 text-xs font-black text-[#101D35] hover:bg-[#5cd8c8]"
              >
                {s.exitAdminBtn}
              </button>
            </div>

            <BibliotecaNasaAdmin lang={lang} reviewerName={reviewerName} />
          </div>
        )}
      </div>

      {/* Student Fact Card Detail Modal */}
      {activeDetail && (
        <ScientificFactDetailModal
          record={activeDetail}
          category={categories.find((c) => c.id === activeDetail.category)}
          lang={lang}
          onClose={() => setActiveDetail(null)}
          onListenText={(text) => onListen(text)}
        />
      )}

      {/* Admin Gate Confirmation Modal */}
      {adminGateOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#061229]/75 p-3 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={s.adminLockTitle}
          onClick={() => setAdminGateOpen(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!adminConfirmedCheck) return;
              const cleanReviewer = reviewerName.trim() || 'Filómatas LAB';
              setReviewerName(cleanReviewer);
              if (typeof window !== 'undefined') {
                window.sessionStorage.setItem(
                  'nauti_lib_reviewer',
                  cleanReviewer,
                );
              }
              setAdminGateOpen(false);
              setMode('admin');
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-3xl border-2 border-[#F2C66D] bg-[#f4fcff] text-[#101D35] shadow-2xl"
          >
            <div className="flex items-center justify-between bg-[#101D35] px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-[#F2C66D]" />
                <h2 className="text-sm font-black">{s.adminLockTitle}</h2>
              </div>
              <button
                type="button"
                onClick={() => setAdminGateOpen(false)}
                className="rounded-lg bg-white/15 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3 p-4 text-xs">
              <p className="leading-relaxed font-semibold text-[#15385e]">
                {s.adminLockBody}
              </p>

              <label className="block">
                <span className="font-black text-[#101D35]">
                  {s.adminReviewerLabel}
                </span>
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder={s.adminReviewerPlaceholder}
                  className="mt-1 w-full rounded-xl border-2 border-[#bce8f5] bg-white px-3 py-2 font-semibold"
                />
              </label>

              <label className="flex cursor-pointer items-start gap-2 rounded-xl border border-[#bce8f5] bg-white p-2.5 font-bold text-[#101D35]">
                <input
                  type="checkbox"
                  checked={adminConfirmedCheck}
                  onChange={(e) => setAdminConfirmedCheck(e.target.checked)}
                  className="mt-0.5"
                />
                <span>{s.adminCheckboxLabel}</span>
              </label>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setAdminGateOpen(false)}
                  className="rounded-xl border border-[#cbd5e1] bg-white px-3 py-2 font-black text-[#101D35]"
                >
                  {s.adminCancelBtn}
                </button>
                <button
                  type="submit"
                  disabled={!adminConfirmedCheck}
                  className="rounded-xl bg-[#F2C66D] px-4 py-2 font-black text-[#101D35] shadow-[0_2px_0_#b45309] disabled:opacity-45"
                >
                  {s.adminEnterBtn}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
