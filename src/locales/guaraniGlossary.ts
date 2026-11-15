/**
 * Structured Paraguayan Guaraní (Avañe’ẽ) Terminology Glossary & Native Review Queue.
 *
 * IMPORTANT:
 * - No entry is marked "Reviewed" because machine-drafted translations must be
 *   verified by a native Paraguayan Guaraní speaker / bilingual educator before
 *   being certified as reviewed.
 * - Statuses are strictly 'Draft' or 'Needs linguistic review'.
 */

export type GlossaryReviewStatus =
  | 'Draft'
  | 'Needs linguistic review'
  | 'Reviewed';

export interface GlossaryEntry {
  id: string;
  spanish: string;
  english: string;
  guarani: string;
  context: string;
  status: Exclude<GlossaryReviewStatus, 'Reviewed'> | GlossaryReviewStatus;
  reviewerNotes: string;
}

export const GUARANI_GLOSSARY: readonly GlossaryEntry[] = [
  {
    id: 'energy',
    spanish: 'Energía',
    english: 'Energy',
    guarani: 'Tendyry',
    context: 'HUD indicator, tooltips, Day 1–5 resource balances',
    status: 'Needs linguistic review',
    reviewerNotes:
      'Used "Tendyry" (electricity/electrical energy) vs. "mbaretekue" (physical strength/force) because Base Aurora tracks electrical power.',
  },
  {
    id: 'health',
    spanish: 'Salud',
    english: 'Health',
    guarani: 'Tesãi',
    context: 'HUD indicator, crew well-being & life-support safety margin',
    status: 'Draft',
    reviewerNotes:
      'Standard Paraguayan Guaraní term for health/well-being (tesãi).',
  },
  {
    id: 'water',
    spanish: 'Agua',
    english: 'Water',
    guarani: 'Y',
    context: 'HUD indicator, Day 3 & Day 5 water recovery efficiency',
    status: 'Draft',
    reviewerNotes: 'Standard Guaraní term (y).',
  },
  {
    id: 'science_spendable',
    spanish: 'Ciencia (puntos para MODELAR)',
    english: 'Science (spendable points for MODEL)',
    guarani: 'Kuaapy',
    context: 'Spendable resource used strictly to activate MODELAR',
    status: 'Needs linguistic review',
    reviewerNotes:
      'Used "Kuaapy" (knowledge/science) to keep a clear lexical contrast against "Tembikuaareka" (Research goal). Verify pedagogical clarity for ages 10–16.',
  },
  {
    id: 'research_goal',
    spanish: 'Investigación (meta: 60)',
    english: 'Research (goal: 60)',
    guarani: 'Tembikuaareka',
    context: 'Accumulated mission research score (target >= 60)',
    status: 'Needs linguistic review',
    reviewerNotes:
      'Neologism/academic Guaraní used in Paraguay bilingual education for research/investigation; confirm naturalness with teachers.',
  },
  {
    id: 'help_tool',
    spanish: 'AYUDA (dato científico)',
    english: 'HELP (scientific fact)',
    guarani: 'AYUDA / Pytyvõ',
    context: 'Action button & modal revealing NASA scientific evidence',
    status: 'Needs linguistic review',
    reviewerNotes:
      'Kept "AYUDA" on button label paired with "Kuaapy marandu" / "pytyvõrã" in descriptions so classroom facilitators using mixed-language guides recognize the UI button; evaluate whether "PYTYVÕ" should replace "AYUDA" on the button.',
  },
  {
    id: 'model_tool',
    spanish: 'MODELAR (simulación predictiva)',
    english: 'MODEL (predictive simulation)',
    guarani: 'MODELAR / Tenonderã rechaha',
    context: 'Action button & modal previewing projected indicator deltas',
    status: 'Needs linguistic review',
    reviewerNotes:
      'Kept "MODELAR" on the button with Guaraní explanation ("jahecha tenondeve mba\'épa ikatu oiko"); confirm whether a pure Guaraní verb button label is preferred.',
  },
  {
    id: 'life_support',
    spanish: 'Soporte vital',
    english: 'Life support',
    guarani: 'Tekove ñangareko (soporte vital)',
    context: 'Day 1 option & cabin oxygen/temperature/safety systems',
    status: 'Needs linguistic review',
    reviewerNotes:
      'Descriptive phrasing ("care of life") paired with the technical term on first occurrence in Day 1.',
  },
  {
    id: 'solar_panel',
    spanish: 'Panel solar / paneles solares',
    english: 'Solar panel / solar panels',
    guarani: 'Panel solar / panel solar-kuéra',
    context: 'Day 1, Day 2, Day 4, Day 5, NASA Artemis I photo modal',
    status: 'Needs linguistic review',
    reviewerNotes:
      'Preserved "panel solar" with Guaraní plural suffix "-kuéra" and explanation ("ombohasa kuarahy resape tendyrýpe"). Avoided inventing an uncertified neologism.',
  },
  {
    id: 'lunar_regolith',
    spanish: 'Regolito lunar / polvo lunar',
    english: 'Lunar regolith / lunar dust',
    guarani: "Regolito lunar (Jasy yvyku'i hatã) / Jasy yvyku'i",
    context: 'Day 4 scenario, science hint, NASA dust shield reference, Trivia 4',
    status: 'Needs linguistic review',
    reviewerNotes:
      'Preserved scientific term "regolito lunar" alongside accessible Guaraní explanation "Jasy yvyku\'i hatã" (hard lunar dust/sand).',
  },
  {
    id: 'water_recovery',
    spanish: 'Sistema de recuperación de agua / eficiencia',
    english: 'Water recovery system / efficiency',
    guarani: "Y ñemopotĩ jey / mba'apo porãkue (eficiencia)",
    context: 'Day 3 scenario, ISS 98% fact, Day 5 delayed consequence',
    status: 'Needs linguistic review',
    reviewerNotes:
      'Verify whether "y ñemopotĩ jey" (water cleaning/recycling again) vs. "y ñeguenohẽ jey" best fits technical water recovery.',
  },
  {
    id: 'sensor',
    spanish: 'Sensor / sensores',
    english: 'Sensor / sensors',
    guarani: 'Ñanduhára (sensor)',
    context: 'Day 3, Day 5, Trivia prompt',
    status: 'Needs linguistic review',
    reviewerNotes:
      'Used descriptive "ñanduhára" (that which senses/perceives) with "(sensor)" gloss on Day 3; check age 10–16 comprehension.',
  },
  {
    id: 'filter',
    spanish: 'Filtro / filtros',
    english: 'Filter / filters',
    guarani: 'Mbogueha (filtro)',
    context: 'Tutorial Step 3, Day 3 maintenance description & tooltip',
    status: 'Needs linguistic review',
    reviewerNotes:
      'Check if "mbogua" / "mbogueha" vs. "filtro" is more natural in Paraguayan classrooms.',
  },
  {
    id: 'telemetry',
    spanish: 'Telemetría',
    english: 'Telemetry',
    guarani: 'Telemetría (mombyrygua techaukaha)',
    context: 'Tutorial Step 1 badge',
    status: 'Needs linguistic review',
    reviewerNotes:
      'Preserved scientific loanword "Telemetría" with brief explanatory gloss.',
  },
  {
    id: 'sustainable_mission',
    spanish: 'Misión sostenible',
    english: 'Sustainable mission',
    guarani: 'Tembiapo iñongatu porãva',
    context: 'Outcome SUSTAINABLE_MISSION title & thresholds (>=25)',
    status: 'Needs linguistic review',
    reviewerNotes:
      'Translated conceptually as "well-preserved/sustained mission"; verify preferred MEC term for "sostenible" (e.g., "ojeporukuaáva are", "iñongatupyre").',
  },
  {
    id: 'causal_link',
    spanish: 'Relación causal / efectos diferidos',
    english: 'Causal link / delayed effects',
    guarani: "Joaju mba'érepa / mba'e oñembyatýva uperire",
    context: 'Day 5 delayed subphase and End Report History tab',
    status: 'Needs linguistic review',
    reviewerNotes:
      'Verify natural phrasing for "delayed effects" and "causality" in Paraguayan Guaraní STEM pedagogy.',
  },
  {
    id: 'tickle_lines',
    spanish: '¡Jijiji! ¡Eso hace cosquillas! / ¡Para, para!',
    english: 'Hehehe! That tickles! / Stop, stop!',
    guarani: '¡Hihihi! ¡Upéva chembokirĩ! / ¡Epyta, epyta!',
    context: 'NAUTI interactive tickle response captions',
    status: 'Needs linguistic review',
    reviewerNotes:
      'Verify playful tone of "chembokirĩ" / "kĩrĩ" (to tickle) across regional Paraguayan Guaraní usage.',
  },
  {
    id: 'ui_verbs_imperative',
    spanish: 'Confirmar / Revisar / Empezar / Saltar',
    english: 'Confirm / Review / Start / Skip',
    guarani: 'Emoneĩ / Ehecha / Ñepyrũ / Ehasa',
    context: 'Primary action buttons across HUD, decision console, and modals',
    status: 'Needs linguistic review',
    reviewerNotes:
      'Confirm consistency of 2nd-person singular imperative ("e-") vs. inclusive 1st-person plural ("ja-/ña-") in team gameplay UI.',
  },
] as const;

export interface FlaggedPhraseItem {
  location: string;
  guaraniText: string;
  reason: string;
  status: 'Needs linguistic review';
}

export const GUARANI_REVIEW_QUEUE: readonly FlaggedPhraseItem[] = [
  {
    location: 'ui.helpBtn / ui.modelCostBtn',
    guaraniText: 'AYUDA / MODELAR · 1 Kuaapy',
    reason:
      'Button names AYUDA and MODELAR were kept recognizable alongside Guaraní subtitles; decide with bilingual educators whether to keep or localize the two button keywords to PYTYVÕ / HA’Ã.',
    status: 'Needs linguistic review',
  },
  {
    location: 'mission.day1.story ("Jasy yvytypa\'ũ guýpe")',
    guaraniText: 'Base Aurora opáy Jasy yvytypa\'ũ guýpe.',
    reason:
      'Poetic rendering of "beneath the lunar horizon"; check comprehension for ages 10–16.',
    status: 'Needs linguistic review',
  },
  {
    location: 'mission.days[3].science (98% ISS recovery)',
    guaraniText:
      'NASA ohechauka Estación Espacial Internacional-pe (ISS) y ñemopotĩ jey og̃uahẽva 98% rupi tembiporu katupyry rupive.',
    reason:
      'Verify Guaraní locative suffix "-pe" on acronym/loanword and scientific clarity that not every space system reaches 98%.',
    status: 'Needs linguistic review',
  },
  {
    location: 'mission.days[5].science (lunar south pole)',
    guaraniText:
      'Jasy polo sur ag̃ui, yvy ha Kuarahy karapã ikatu omoheñói kuarahy resape ha kuarahy\'ã hasýva.',
    reason:
      'Verify phrasing for "low Sun angles" ("Kuarahy karapã") and "topography" ("yvy") in Guaraní science register.',
    status: 'Needs linguistic review',
  },
  {
    location: 'audio.guaraniFallbackHint',
    guaraniText:
      'Ypykuépe ohechauka moñe\'ẽrã Avañe’ẽme añónte, ani hag̃ua oñembojehe\'a ñe\'ẽ ñemomarandu\'ỹre.',
    reason:
      'Verify naturalness of explanation about avoiding silent mixed-language TTS fallback.',
    status: 'Needs linguistic review',
  },
  {
    location: 'nauti.lines.welcome[0]',
    guaraniText:
      "¡Mba'éichapa, aty! Che ha'e NAUTI. Aikuaa heta mba'e arapýgui... ha katu ndajuhúi gueteri mba'éichapa ambopuka yvyporakuérape. ¡Ahesa'ỹijo gueteri! 🔬",
    reason:
      'Verify naturalness and humorous tone of "ambopuka yvyporakuérape" (make humans laugh) and "ahesa\'ỹijo gueteri" (still researching) with a proficient Paraguayan Guaraní speaker.',
    status: 'Needs linguistic review',
  },
  {
    location: 'ui.aboutBody / ui.experienceTagline',
    guaraniText:
      "Peteĩ jeporavo ikatu omoambue opaite mba'e. / Pende aty oñangareko va'erã peteĩ base Jasýpe. Opaite jeporavo ohupyty tendyry, y, tesãi ha tembikuaareka. ¡Pema'ẽke! Oĩ mba'e ojehechátava ára rire.",
    reason:
      'Verify naturalness of "ohupyty" (affects) and "base Jasýpe" (lunar base) for ages 10–16 in Paraguayan classrooms.',
    status: 'Needs linguistic review',
  },
  {
    location: 'ui.howToPlaySteps',
    guaraniText:
      "Emoñe'ẽ térã ehendu mba'épa oiko. / Peñemongeta pende atýpe ha peiporavo oñondive. / Pehecha mba'épa oiko ha pemohu'ã umi 5 ára.",
    reason:
      'Confirm consistency of 2nd-person plural inclusive imperatives ("peñemongeta", "peiporavo", "pemohu\'ã") with "emoñe\'ẽ / ehendu".',
    status: 'Needs linguistic review',
  },
  {
    location: 'demo.* (Isolated demonstration scenario & outcomes)',
    guaraniText:
      "Yvate gotyo: Jasy yvyku'i ovevéva / Emohenda ñemo'ãha mbarete / Eñongatu tendyry ha ehai marandu",
    reason:
      'Verify Guaraní phrasing for "micrometeoroid shower", "thermal shield", and demo consequence feedback.',
    status: 'Needs linguistic review',
  },
  {
    location: 'platform.* & catalog.* (NAUTI Main Menu & Integrated Efecto Dominó Catalog)',
    guaraniText:
      "Ehecha umi episodio / ¿Ha japytárõ tendyry'ỹre? / ¿Ha oĩrõ oñembyaíva Base Aurora-pe? / ¿Ha ñañemitỹ va'erãrõ ñane rembi'u? / ¿Ha peteĩ kuarahy aravai ñanemondýirõ?",
    reason:
      'Verify Paraguayan Guaraní conditional question framing ("¿Ha ...-rõ?") and integrated 4-system descriptions for Episodes 01–04.',
    status: 'Needs linguistic review',
  },
  {
    location: 'desktop.* & platform.backToDesktopBtn (NAUTI Desktop)',
    guaraniText:
      "¿Mba'épa jahecháta ko ára? / Eiporavo peteĩ tembiasa ha eñepyrũ eikuaa. / Ejevy escritorio-pe",
    reason:
      'Verify Paraguayan Guaraní phrasing for NAUTI Desktop greeting, provisional app titles, and "Back to desktop" button.',
    status: 'Needs linguistic review',
  },
  {
    location: 'ui.createdBy (Filómatas LAB attribution)',
    guaraniText: "Tembiapo mbo'epy rehegua ojapóva Filómatas LAB",
    reason:
      'Verify Paraguayan Guaraní phrasing for "An educational experience created by Filómatas LAB".',
    status: 'Needs linguistic review',
  },
  {
    location: 'platform.viewTutorialBtn & ui.finishTutorialBtn (Tutorial navigation)',
    guaraniText: "Ehecha mba'éichapa oñeñembosarái / Emohu'ã ñembokatupyry",
    reason:
      'Verify Paraguayan Guaraní phrasing for "View tutorial" and "Finish tutorial" buttons before final publication.',
    status: 'Needs linguistic review',
  },
  {
    location: 'ui.tutHelpGuide.* (Tutorial Step 2 NASA Scientific Help explanation)',
    guaraniText:
      "NASA kuaapy pytyvõrã / Opaite kuaapy pytyvõrã oguereko mbohapy pehẽngue / ¡Penemandu'áke! NAUTI nde'imo'ãi ndéve mba'e tapépa reiporavo va'erã.",
    reason:
      'Verify scientific accuracy and natural classroom phrasing in Paraguayan Guaraní for the 3-part NASA scientific hint explanation.',
    status: 'Needs linguistic review',
  },
  {
    location: 'ui.tooltipModel & ui.modelHelpPanel.* (MODELAR contextual help)',
    guaraniText:
      "Eikuaave / MODELAR: Eheka remoneĩ mboyve / MODELAR ha'e peteĩ techauka mbo'epy rehegua oñemombykýva, oñemopyendáva umi modelo, ñeha'ã ha ta'ãnga ojeporúva arapy ñeha'ãme.",
    reason:
      'Verify scientific accuracy and natural classroom phrasing in Paraguayan Guaraní for modeling, simulation, and visualization concepts.',
    status: 'Needs linguistic review',
  },
  {
    location: 'ui.tutorialOnboarding.* & catalog.episodes.*.coverSynopsis (Mandatory Onboarding & Episode Covers)',
    guaraniText:
      "Base Aurora mba'erepykuéra / ¿Mba'épa umi kuaapy punto? / Eikuaa mba'éichapa reiporavo va'erã / ¡Eha'ã ne kuaapy! / ¿Mba'éichapa ñamohu'ã porã tembiapo? / ¡Aty oĩmbáma!",
    reason:
      'Verify Paraguayan Guaraní phrasing for the 5-section onboarding guide, interactive practice prompts, completion screen, and simplified episode narrative synopses.',
    status: 'Needs linguistic review',
  },
  {
    location: 'desktop.apps["escucha-imagina-construye"] & src/data/escuchaImagina* (Listen, Imagine & Build)',
    guaraniText:
      "Ehendu, eimo'ã ha ejapo / Eikuaa tembiporu arapy rehegua rehendúvo, reimo'ãvo ha rehaívo atýpe / Panel solar fotovoltaico",
    reason:
      'Verify Paraguayan Guaraní classroom phrasing for spatial drawing descriptions, podcast narration, and solar array terms.',
    status: 'Needs linguistic review',
  },
  {
    location: 'desktop.tooltipLabels & desktop.apps.*.tooltip (NAUTI Desktop Experience Tooltips)',
    guaraniText:
      "Mba'épa oikuaa / Tembiapo ñeha'ã / Tembiapo oñembosako'íva",
    reason:
      'Verify naturalness of Paraguayan Guaraní labels for learning objectives and planned/interactive activities in desktop card tooltips.',
    status: 'Needs linguistic review',
  },
  {
    location: 'desktop.apps["detectives-de-la-nasa"] & src/data/detectivesNasa* (NASA Detectives)',
    guaraniText:
      "Ehesa'ỹijo mba'e ñembyaty arapýgui / Pista-kuéra ñembojoaju / Che jehupytykuéra",
    reason:
      'Verify Paraguayan Guaraní classroom phrasing for scientific mysteries, evidence connection board, and Mis descubrimientos digital cards.',
    status: 'Needs linguistic review',
  },
  {
    location:
      'desktop.apps["biblioteca-cientifica-nasa"] & src/data/scientificLibrary* (Biblioteca Científica NASA)',
    guaraniText:
      "Biblioteca Científica NASA · NAUTI / Temimbo'e reko / NASA kuatia ojehechajeypyréva",
    reason:
      'Verify Paraguayan Guaraní classroom phrasing for verified scientific facts, verification status labels, and research context explanations.',
    status: 'Needs linguistic review',
  },
] as const;
