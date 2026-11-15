import type { AppLang } from '../locales';
import type { VerificationStatus } from '../types/scientificLibrary';

export interface ScientificLibraryStrings {
  moduleBadge: string;
  moduleTitle: string;
  moduleSubtitle: string;
  backToDesktop: string;
  nautiStudentPrompt: string;
  nautiAdminPrompt: string;
  studentModeBtn: string;
  adminModeBtn: string;
  adminLockTitle: string;
  adminLockBody: string;
  adminReviewerLabel: string;
  adminReviewerPlaceholder: string;
  adminCheckboxLabel: string;
  adminEnterBtn: string;
  adminCancelBtn: string;
  adminActiveBanner: string;
  exitAdminBtn: string;
  studentSearchPlaceholder: string;
  allCategoriesLabel: string;
  verifiedCountLabel: (count: number) => string;
  noStudentResultsTitle: string;
  noStudentResultsBody: string;
  openCardBtn: string;
  closeCardBtn: string;
  factCardSections: {
    didYouKnow: string;
    whyItMatters: string;
    whereToUse: string;
    nasaSource: string;
  };
  studyContextLabel: string;
  organismLabel: string;
  numericalDataLabel: string;
  limitationsLabel: string;
  verifiedBadgeLabel: string;
  verifiedByLabel: string;
  openOriginalSource: string;
  linkedExperiencesLabel: string;
  studyContextWarning: string;
  aiSummaryWarning: string;
  adminTabs: {
    search: string;
    manage: string;
    auditor: string;
  };
  searchUi: {
    title: string;
    subtitle: string;
    keywordPlaceholder: string;
    searchBtn: string;
    searchingBtn: string;
    sourceFilterLabel: string;
    allSourcesOption: string;
    categoryFilterLabel: string;
    suggestedLabel: string;
    bilingualNotice: (raw: string, translated: string) => string;
    resultsCount: (shown: number, total: number) => string;
    emptyPrompt: string;
    noHitsTitle: string;
    noHitsBody: string;
    errorTitle: string;
    prevPage: string;
    nextPage: string;
    previewMetadataBtn: string;
    importReferenceBtn: string;
    alreadyImportedBadge: string;
    importedToast: string;
    openNasaLink: string;
    metaModalTitle: string;
    metaFilesLabel: (count: number) => string;
    metaPublicationsLabel: string;
    metaFactorsLabel: string;
  };
  manageUi: {
    title: string;
    subtitle: string;
    newRecordBtn: string;
    addCategoryBtn: string;
    newCategoryTitle: string;
    categoryEsPlaceholder: string;
    categoryEnPlaceholder: string;
    saveCategoryBtn: string;
    filterAllStatuses: string;
    editBtn: string;
    deleteBtn: string;
    saveChangesBtn: string;
    cancelBtn: string;
    reviewerRequiredError: string;
    formTitleCreate: string;
    formTitleEdit: string;
    fieldLabels: {
      category: string;
      topic: string;
      scientificClaim: string;
      studentExplanation: string;
      whyItMatters: string;
      whereToUse: string;
      sourceTitle: string;
      sourceOrganization: string;
      sourceUrl: string;
      sourceIdentifier: string;
      authors: string;
      publicationDate: string;
      organismOrPopulation: string;
      researchContext: string;
      numericalValues: string;
      units: string;
      limitations: string;
      verificationStatus: string;
      verifiedBy: string;
      verificationDate: string;
      relatedExperiences: string;
      relatedContentIds: string;
    };
  };
  workflowLabels: Record<VerificationStatus, string>;
  auditorUi: {
    title: string;
    subtitle: string;
    guardrailBanner: string;
    filterAllExperiences: string;
    claimsHeading: string;
    figuresHeading: string;
    currentSourceHeading: string;
    linkedVerifiedHeading: string;
    sufficiencyLabels: {
      sufficient: string;
      partial: string;
      missing: string;
      fictionalDemo: string;
    };
    fictionalDemoNote: string;
    searchMatchingNasaBtn: string;
    suggestedRecordsHeading: string;
    approveAndLinkBtn: string;
    alreadyLinkedBadge: string;
    unlinkBtn: string;
    notPublishedWarning: string;
  };
  lookupUi: {
    heading: string;
    emptyNotice: string;
    viewSource: string;
    studyContextPrefix: string;
  };
  experienceNames: Record<string, string>;
}

const ES_STRINGS: ScientificLibraryStrings = {
  moduleBadge: 'Filómatas LAB · Ciencia verificada',
  moduleTitle: 'Biblioteca Científica NASA de NAUTI',
  moduleSubtitle:
    'Centro de conocimiento científico verificado para explorar, validar y conectar fuentes reales de la NASA en toda la plataforma.',
  backToDesktop: 'Volver al escritorio',
  nautiStudentPrompt:
    '¡Bienvenidos a la Biblioteca Científica! Aquí solo mostramos hechos verificados con fuentes reales de la NASA para explorar sin confusiones.',
  nautiAdminPrompt:
    'Modo Administrador activo: busca en NASA OSDR o NTRS, verifica el contexto de cada estudio y conecta referencias confiables a las experiencias.',
  studentModeBtn: 'Modo Estudiante',
  adminModeBtn: 'Modo Administrador',
  adminLockTitle: 'Acceso al Modo Administrador',
  adminLockBody:
    'Esta área permite buscar repositorios de la NASA, crear fichas científicas, aprobar estados de verificación y auditar referencias. Está reservada para docentes y administradores de contenido de Filómatas LAB.',
  adminReviewerLabel: 'Nombre de quien revisa / verifica',
  adminReviewerPlaceholder: 'Ej. Prof. Ana / Filómatas LAB',
  adminCheckboxLabel:
    'Confirmo que accedo como docente o administrador autorizado para revisar y verificar fuentes científicas.',
  adminEnterBtn: 'Entrar como Administrador',
  adminCancelBtn: 'Seguir en Modo Estudiante',
  adminActiveBanner:
    'Modo Administrador activo · Los estudiantes solo ven registros VERIFICADOS o PUBLICADOS.',
  exitAdminBtn: 'Salir a Modo Estudiante',
  studentSearchPlaceholder:
    'Buscar tema verificado (ej. agua, solar, plantas, Luna...)',
  allCategoriesLabel: 'Todas las categorías',
  verifiedCountLabel: (count) =>
    `${count} ${count === 1 ? 'ficha verificada' : 'fichas verificadas'}`,
  noStudentResultsTitle: 'No hay fichas verificadas para ese filtro',
  noStudentResultsBody:
    'Prueba otra categoría o palabra clave. Recuerda que los borradores en revisión administrativa no se muestran en Modo Estudiante.',
  openCardBtn: 'Ver ficha científica',
  closeCardBtn: 'Cerrar ficha',
  factCardSections: {
    didYouKnow: '🔬 ¿Sabías que...?',
    whyItMatters: '🚀 ¿Por qué importa?',
    whereToUse: '💡 ¿Dónde podríamos utilizarlo?',
    nasaSource: '📚 Fuente NASA',
  },
  studyContextLabel: 'Contexto del estudio',
  organismLabel: 'Organismo, población o sistema',
  numericalDataLabel: 'Valores numéricos verificados',
  limitationsLabel: 'Alcance y precisiones científicas',
  verifiedBadgeLabel: 'Fuente NASA verificada',
  verifiedByLabel: 'Verificado por',
  openOriginalSource: 'Abrir fuente original de la NASA',
  linkedExperiencesLabel: 'Conectado en NAUTI',
  studyContextWarning:
    'Lectura científica rigurosa: verifica siempre si el estudio fue realizado en animales, células, plantas, simulaciones o personas antes de generalizar resultados.',
  aiSummaryWarning:
    'Regla científica: los resúmenes automáticos son solo apoyo orientativo y nunca sustituyen la lectura y verificación de la fuente original de la NASA.',
  adminTabs: {
    search: 'Búsqueda NASA en vivo',
    manage: 'Gestión y verificación',
    auditor: 'Auditor científico',
  },
  searchUi: {
    title: 'Búsqueda en repositorios científicos de la NASA',
    subtitle:
      'Consulta en tiempo real NASA OSDR y NASA NTRS (con traducción automática español → inglés de términos científicos) e importa referencias como borradores por verificar.',
    keywordPlaceholder:
      'Buscar en español o inglés (ej. pérdida ósea, plant growth, water recovery...)',
    searchBtn: 'Buscar en NASA',
    searchingBtn: 'Consultando NASA...',
    sourceFilterLabel: 'Repositorio / fuente',
    allSourcesOption: 'Todos (OSDR + NTRS)',
    categoryFilterLabel: 'Categoría sugerida al importar',
    suggestedLabel: 'Búsquedas sugeridas:',
    bilingualNotice: (raw, translated) =>
      `Traducción científica aplicada: «${raw}» → «${translated}»`,
    resultsCount: (shown, total) =>
      `Mostrando ${shown} resultados reales de ${total.toLocaleString()} encontrados`,
    emptyPrompt:
      'Escribe palabras clave o elige una búsqueda sugerida para consultar resultados reales de la NASA.',
    noHitsTitle: 'Sin resultados en esta consulta',
    noHitsBody:
      'La NASA no devolvió registros para esos términos exactos. Prueba con términos más amplios en inglés o selecciona otra fuente.',
    errorTitle: 'No se pudo completar la consulta a la NASA',
    prevPage: 'Anterior',
    nextPage: 'Siguiente',
    previewMetadataBtn: 'Vista previa OSDR',
    importReferenceBtn: 'Importar referencia',
    alreadyImportedBadge: 'Ya importada en biblioteca',
    importedToast:
      'Referencia importada en estado SOURCE_FOUND. Revísala en «Gestión y verificación» antes de aprobar.',
    openNasaLink: 'Ver fuente NASA',
    metaModalTitle: 'Metadatos del estudio en NASA OSDR',
    metaFilesLabel: (count) => `Archivos del conjunto de datos (${count})`,
    metaPublicationsLabel: 'Publicaciones asociadas',
    metaFactorsLabel: 'Factores experimentales y protocolos',
  },
  manageUi: {
    title: 'Fichas científicas y flujo de verificación',
    subtitle:
      'Flujo obligatorio: DRAFT → SOURCE_FOUND → UNDER_REVIEW → VERIFIED → PUBLISHED. Solo VERIFIED y PUBLISHED llegan al Modo Estudiante.',
    newRecordBtn: '+ Crear ficha manual',
    addCategoryBtn: '+ Nueva categoría',
    newCategoryTitle: 'Agregar categoría extensible',
    categoryEsPlaceholder: 'Nombre en español (ej. Radiación cósmica)',
    categoryEnPlaceholder: 'Nombre en inglés (ej. Cosmic Radiation)',
    saveCategoryBtn: 'Guardar categoría',
    filterAllStatuses: 'Todos los estados',
    editBtn: 'Editar / Verificar',
    deleteBtn: 'Eliminar',
    saveChangesBtn: 'Guardar cambios',
    cancelBtn: 'Cancelar',
    reviewerRequiredError:
      'Para aprobar a VERIFIED o PUBLISHED es obligatorio indicar quién verifica (verified_by) y la fecha de verificación.',
    formTitleCreate: 'Crear nueva ficha científica',
    formTitleEdit: 'Editar y revisar ficha científica',
    fieldLabels: {
      category: 'Categoría',
      topic: 'Tema / Título para catálogo',
      scientificClaim: 'Afirmación científica verificable',
      studentExplanation: 'Explicación amigable para estudiantes',
      whyItMatters: '🚀 ¿Por qué importa?',
      whereToUse: '💡 ¿Dónde podríamos utilizarlo?',
      sourceTitle: 'Título de la fuente NASA',
      sourceOrganization: 'Organización NASA',
      sourceUrl: 'URL oficial de la fuente',
      sourceIdentifier: 'Identificador (ej. OSD-342, NTRS ID)',
      authors: 'Autores (separados por coma)',
      publicationDate: 'Fecha de publicación',
      organismOrPopulation: 'Organismo / población / sistema estudiado',
      researchContext: 'Contexto de investigación (animales, células, plantas, EEI, simulación)',
      numericalValues: 'Valores numéricos (separados por coma)',
      units: 'Unidades correspondientes (separadas por coma)',
      limitations: 'Limitaciones y alcance del hallazgo',
      verificationStatus: 'Estado en el flujo de verificación',
      verifiedBy: 'Verificado por (revisor humano)',
      verificationDate: 'Fecha de verificación',
      relatedExperiences: 'Experiencias de NAUTI conectadas',
      relatedContentIds: 'IDs de contenido asociados (separados por coma)',
    },
  },
  workflowLabels: {
    DRAFT: '1. DRAFT (Borrador)',
    SOURCE_FOUND: '2. SOURCE_FOUND (Fuente hallada)',
    UNDER_REVIEW: '3. UNDER_REVIEW (En revisión)',
    VERIFIED: '4. VERIFIED (Verificado)',
    PUBLISHED: '5. PUBLISHED (Publicado)',
  },
  auditorUi: {
    title: 'Auditor científico de experiencias NAUTI',
    subtitle:
      'Inspecciona afirmaciones y cifras usadas en Efecto Dominó, Detectives de la NASA, Escucha, imagina y construye y Traduciendo la ciencia, y asocia referencias verificadas sin alterar las mecánicas de juego.',
    guardrailBanner:
      'Modo seguro: el auditor evalúa evidencias y permite asociar referencias verificadas a cada contenido, pero nunca modifica mecánicas, puntajes ni decisiones de Efecto Dominó.',
    filterAllExperiences: 'Todas las experiencias',
    claimsHeading: 'Afirmaciones científicas presentes',
    figuresHeading: 'Cifras y valores detectados',
    currentSourceHeading: 'Fuente declarada actualmente en el contenido',
    linkedVerifiedHeading: 'Referencias verificadas asociadas en Biblioteca',
    sufficiencyLabels: {
      sufficient: 'Respaldo suficiente',
      partial: 'Parcial · revisar / completar',
      missing: 'Sin referencia asociada',
      fictionalDemo: 'Demostración ficticia declarada',
    },
    fictionalDemoNote:
      'Este módulo está marcado explícitamente como demostración pedagógica ficticia (no debe presentarse como estudio NASA real).',
    searchMatchingNasaBtn: 'Buscar respaldo en NASA',
    suggestedRecordsHeading: 'Referencias sugeridas de la Biblioteca',
    approveAndLinkBtn: 'Aprobar y asociar referencia',
    alreadyLinkedBadge: 'Asociada',
    unlinkBtn: 'Desvincular',
    notPublishedWarning:
      'Esta ficha sugerida aún no está VERIFIED o PUBLISHED. Verifícala primero en «Gestión y verificación» antes de mostrarla a estudiantes.',
  },
  lookupUi: {
    heading: 'Respaldo científico verificado (Biblioteca NAUTI)',
    emptyNotice: 'Sin referencias verificadas asociadas todavía.',
    viewSource: 'Ver fuente',
    studyContextPrefix: 'Contexto:',
  },
  experienceNames: {
    'efecto-domino': 'Efecto Dominó',
    'detectives-de-la-nasa': 'Detectives de la NASA',
    'escucha-imagina-construye': 'Escucha, imagina y construye',
    'traduciendo-la-ciencia': 'Traduciendo la ciencia',
  },
};

const EN_STRINGS: ScientificLibraryStrings = {
  moduleBadge: 'Filómatas LAB · Verified Science',
  moduleTitle: 'NAUTI NASA Scientific Library',
  moduleSubtitle:
    'Centralized verified science knowledge hub to explore, validate, and connect authentic NASA sources across all NAUTI experiences.',
  backToDesktop: 'Back to desktop',
  nautiStudentPrompt:
    'Welcome to the Scientific Library! Here we only display facts verified with real NASA sources so you can explore with confidence.',
  nautiAdminPrompt:
    'Administrator Mode active: search NASA OSDR or NTRS, review study context carefully, and connect verified references across experiences.',
  studentModeBtn: 'Student Mode',
  adminModeBtn: 'Administrator Mode',
  adminLockTitle: 'Administrator Mode Access',
  adminLockBody:
    'This workspace allows searching NASA repositories, drafting scientific records, approving verification stages, and auditing NAUTI content. It is restricted to teachers and Filómatas LAB content administrators.',
  adminReviewerLabel: 'Reviewer / Verifier name',
  adminReviewerPlaceholder: 'e.g., Prof. Ana / Filómatas LAB',
  adminCheckboxLabel:
    'I confirm I am accessing as an authorized educator or content administrator to review and verify NASA scientific sources.',
  adminEnterBtn: 'Enter Administrator Mode',
  adminCancelBtn: 'Stay in Student Mode',
  adminActiveBanner:
    'Administrator Mode active · Students can only view VERIFIED or PUBLISHED records.',
  exitAdminBtn: 'Return to Student Mode',
  studentSearchPlaceholder:
    'Search verified topics (e.g., water, solar, plants, Moon...)',
  allCategoriesLabel: 'All categories',
  verifiedCountLabel: (count) =>
    `${count} verified ${count === 1 ? 'record' : 'records'}`,
  noStudentResultsTitle: 'No verified records match this filter',
  noStudentResultsBody:
    'Try another category or keyword. Drafts under review remain hidden from Student Mode.',
  openCardBtn: 'Open fact card',
  closeCardBtn: 'Close card',
  factCardSections: {
    didYouKnow: '🔬 Did you know...?',
    whyItMatters: '🚀 Why does it matter?',
    whereToUse: '💡 Where could we use this?',
    nasaSource: '📚 NASA Source',
  },
  studyContextLabel: 'Research context',
  organismLabel: 'Organism, population, or system',
  numericalDataLabel: 'Verified numerical data',
  limitationsLabel: 'Scientific scope & limitations',
  verifiedBadgeLabel: 'Verified NASA source',
  verifiedByLabel: 'Verified by',
  openOriginalSource: 'Open original NASA source',
  linkedExperiencesLabel: 'Connected in NAUTI',
  studyContextWarning:
    'Scientific accuracy: always distinguish whether research studied animals, cells, plants, engineering models, or human crews before generalizing.',
  aiSummaryWarning:
    'Scientific rule: automated summaries are helpers only and are never treated as original scientific evidence.',
  adminTabs: {
    search: 'Live NASA Search',
    manage: 'Manage & Verify',
    auditor: 'Scientific Auditor',
  },
  searchUi: {
    title: 'Search NASA Scientific Repositories',
    subtitle:
      'Query NASA OSDR and NASA NTRS live (with automatic Spanish → English scientific term translation) and import hits as drafts for human verification.',
    keywordPlaceholder:
      'Search in English or Spanish (e.g., bone loss, pérdida ósea, water recovery...)',
    searchBtn: 'Search NASA',
    searchingBtn: 'Querying NASA...',
    sourceFilterLabel: 'Repository / source',
    allSourcesOption: 'All (OSDR + NTRS)',
    categoryFilterLabel: 'Suggested category on import',
    suggestedLabel: 'Suggested searches:',
    bilingualNotice: (raw, translated) =>
      `Scientific query expansion: “${raw}” → “${translated}”`,
    resultsCount: (shown, total) =>
      `Showing ${shown} live results out of ${total.toLocaleString()} matches`,
    emptyPrompt:
      'Enter keywords or pick a suggested topic to retrieve live results from NASA.',
    noHitsTitle: 'No matches for this query',
    noHitsBody:
      'NASA returned zero records for those exact keywords. Try broader English terms or another repository filter.',
    errorTitle: 'Unable to complete NASA query',
    prevPage: 'Previous',
    nextPage: 'Next',
    previewMetadataBtn: 'OSDR Preview',
    importReferenceBtn: 'Import reference',
    alreadyImportedBadge: 'Already in library',
    importedToast:
      'Reference imported with status SOURCE_FOUND. Review and approve it under “Manage & Verify”.',
    openNasaLink: 'Open NASA page',
    metaModalTitle: 'NASA OSDR Study Metadata',
    metaFilesLabel: (count) => `Dataset files (${count})`,
    metaPublicationsLabel: 'Associated publications',
    metaFactorsLabel: 'Experimental factors & protocols',
  },
  manageUi: {
    title: 'Scientific Records & Verification Workflow',
    subtitle:
      'Strict pipeline: DRAFT → SOURCE_FOUND → UNDER_REVIEW → VERIFIED → PUBLISHED. Only VERIFIED and PUBLISHED records appear in Student Mode.',
    newRecordBtn: '+ Create manual record',
    addCategoryBtn: '+ New category',
    newCategoryTitle: 'Add extensible category',
    categoryEsPlaceholder: 'Spanish name (e.g., Radiación cósmica)',
    categoryEnPlaceholder: 'English name (e.g., Cosmic Radiation)',
    saveCategoryBtn: 'Save category',
    filterAllStatuses: 'All statuses',
    editBtn: 'Edit / Verify',
    deleteBtn: 'Delete',
    saveChangesBtn: 'Save changes',
    cancelBtn: 'Cancel',
    reviewerRequiredError:
      'Human reviewer name (verified_by) and verification_date are mandatory before moving a record to VERIFIED or PUBLISHED.',
    formTitleCreate: 'Create new scientific record',
    formTitleEdit: 'Edit & verify scientific record',
    fieldLabels: {
      category: 'Category',
      topic: 'Topic / Catalog title',
      scientificClaim: 'Verifiable scientific claim',
      studentExplanation: 'Student-friendly explanation',
      whyItMatters: '🚀 Why does it matter?',
      whereToUse: '💡 Where could we use this?',
      sourceTitle: 'NASA source title',
      sourceOrganization: 'NASA organization',
      sourceUrl: 'Official source URL',
      sourceIdentifier: 'Identifier (e.g., OSD-342, NTRS ID)',
      authors: 'Authors (comma-separated)',
      publicationDate: 'Publication date',
      organismOrPopulation: 'Organism / population / system studied',
      researchContext: 'Research context (animals, cells, plants, ISS, simulation)',
      numericalValues: 'Numerical values (comma-separated)',
      units: 'Units (comma-separated)',
      limitations: 'Limitations & scope caveats',
      verificationStatus: 'Verification workflow stage',
      verifiedBy: 'Verified by (human reviewer)',
      verificationDate: 'Verification date',
      relatedExperiences: 'Connected NAUTI experiences',
      relatedContentIds: 'Associated content IDs (comma-separated)',
    },
  },
  workflowLabels: {
    DRAFT: '1. DRAFT',
    SOURCE_FOUND: '2. SOURCE_FOUND',
    UNDER_REVIEW: '3. UNDER_REVIEW',
    VERIFIED: '4. VERIFIED',
    PUBLISHED: '5. PUBLISHED',
  },
  auditorUi: {
    title: 'NAUTI Scientific Content Auditor',
    subtitle:
      'Inspect scientific claims and figures used across Domino Effect, NASA Detectives, Listen, Imagine & Build, and Translating Science, and associate verified references without modifying game mechanics.',
    guardrailBanner:
      'Safe mode: the auditor evaluates evidence sufficiency and links verified reference IDs without rewriting game rules, scores, or episode progression.',
    filterAllExperiences: 'All experiences',
    claimsHeading: 'Scientific claims inspected',
    figuresHeading: 'Numerical figures detected',
    currentSourceHeading: 'Currently cited source in content',
    linkedVerifiedHeading: 'Verified library references currently linked',
    sufficiencyLabels: {
      sufficient: 'Sufficient evidence',
      partial: 'Partial · review needed',
      missing: 'No verified link yet',
      fictionalDemo: 'Declared fictional demo',
    },
    fictionalDemoNote:
      'This module is explicitly labeled as a fictional classroom demo (never present as real NASA data).',
    searchMatchingNasaBtn: 'Search NASA backing',
    suggestedRecordsHeading: 'Suggested Library Records',
    approveAndLinkBtn: 'Approve & associate link',
    alreadyLinkedBadge: 'Linked',
    unlinkBtn: 'Unlink',
    notPublishedWarning:
      'This suggested record is not VERIFIED or PUBLISHED yet. Verify it first under “Manage & Verify”.',
  },
  lookupUi: {
    heading: 'Verified NASA Evidence (NAUTI Library)',
    emptyNotice: 'No verified references linked yet.',
    viewSource: 'View source',
    studyContextPrefix: 'Context:',
  },
  experienceNames: {
    'efecto-domino': 'Domino Effect',
    'detectives-de-la-nasa': 'NASA Detectives',
    'escucha-imagina-construye': 'Listen, Imagine & Build',
    'traduciendo-la-ciencia': 'Translating Science',
  },
};

const GN_STRINGS: ScientificLibraryStrings = {
  ...ES_STRINGS,
  moduleBadge: 'Filómatas LAB · Kuaapy añetegua',
  moduleTitle: 'Biblioteca Científica NASA · NAUTI',
  moduleSubtitle:
    'Kuaapy renda añetegua oñangareko ha ohechaukáva NASA marandu ojehechajeypyréva opaite NAUTI tembiasápe.',
  backToDesktop: 'Ejevy escritorio-pe',
  nautiStudentPrompt:
    '¡Tapeg̃uahẽ porã Biblioteca Científica-pe! Ko\'ápe ojehechauka kuaapy añetegua oguerekóva NASA kuatia tee.',
  nautiAdminPrompt:
    'Administrador reko oikóma: eheka NASA OSDR térã NTRS-pe, ehesa\'ỹijo mba\'eichaguápa tembikuaareka ha embojoaju kuaapy.',
  studentModeBtn: 'Temimbo\'e reko',
  adminModeBtn: 'Administrador reko',
  adminEnterBtn: 'Eike Administrador-icha',
  adminCancelBtn: 'Epyta Temimbo\'e rekópe',
  exitAdminBtn: 'Ejevy Temimbo\'e rekópe',
  allCategoriesLabel: 'Opaite kuaapy aty',
  openCardBtn: 'Ehecha kuatia kuaapy',
  closeCardBtn: 'Emboty kuatia',
  factCardSections: {
    didYouKnow: '🔬 ¿Reikuaápa ra\'e...?',
    whyItMatters: '🚀 ¿Mba\'érepa tuicha mba\'e?',
    whereToUse: '💡 ¿Moõpa ikatu jaiporu?',
    nasaSource: '📚 NASA kuatia tee',
  },
  openOriginalSource: 'Eipe\'a NASA kuatia ypykue',
  verifiedBadgeLabel: 'NASA kuatia ojehechajeypyréva',
  verifiedByLabel: 'Ohechajey va\'ekue',
  experienceNames: {
    'efecto-domino': 'Efecto Dominó',
    'detectives-de-la-nasa': 'Detectives de la NASA',
    'escucha-imagina-construye': "Ehendu, eimo'ã ha ejapo",
    'traduciendo-la-ciencia': 'Traduciendo la ciencia',
  },
};

export function getScientificLibraryStrings(
  lang: AppLang,
): ScientificLibraryStrings {
  if (lang === 'en') return EN_STRINGS;
  if (lang === 'gn-PY') return GN_STRINGS;
  return ES_STRINGS;
}
