import efectoDominoIcon from '../assets/images/efecto_domino_icon_1794736847909.jpg';
import traduciendoCienciaIcon from '../assets/images/traduciendo_ciencia_icon_1794738767999.jpg';
import escuchaImaginaIcon from '../assets/images/escucha_imagina_icon_1794753432292.jpg';
import detectivesNasaIcon from '../assets/images/detectives_nasa_icon_1794756804821.jpg';
import bibliotecaNasaIcon from '../assets/images/biblioteca_nasa_icon_1794757441870.jpg';
import { DESKTOP_STRINGS } from './uiStrings';
import type { AppLang } from '../locales';

export type DesktopAppId =
  | 'efecto-domino'
  | 'traduciendo-la-ciencia'
  | 'escucha-imagina-construye'
  | 'detectives-de-la-nasa'
  | 'biblioteca-cientifica-nasa'
  | 'explora-con-nauti'
  | 'laboratorio-nauti'
  | 'viajes-sonoros';

export type DesktopAppStatus = 'available' | 'in_preparation' | 'coming_soon';

export type DesktopAppDestination =
  | 'efecto_domino_welcome'
  | 'traduciendo_ciencia_intro'
  | 'escucha_imagina_intro'
  | 'detectives_nasa_intro'
  | 'biblioteca_nasa_intro'
  | 'coming_soon';

export type DesktopPlaceholderIconKey = 'explore' | 'lab' | 'sound';

export interface DesktopAppDefinition {
  id: DesktopAppId;
  order: number;
  status: DesktopAppStatus;
  destination: DesktopAppDestination;
  iconAsset?: string;
  placeholderIcon?: DesktopPlaceholderIconKey;
  cropIconRim?: boolean;
}

export interface DesktopAppTooltipContent {
  description: string;
  learningObjective: string;
  interactiveActivity: string;
}

export interface DesktopAppItem extends DesktopAppDefinition {
  name: string;
  subtitle: string;
  tooltip: DesktopAppTooltipContent;
}

/**
 * Configurable registry of educational experiences on the NAUTI Desktop.
 * New applications can be added here alongside localized metadata without
 * redesigning the desktop layout or modifying Efecto Dominó internals.
 */
export const DESKTOP_APPS: readonly DesktopAppDefinition[] = [
  {
    id: 'efecto-domino',
    order: 1,
    status: 'available',
    destination: 'efecto_domino_welcome',
    iconAsset: efectoDominoIcon,
    cropIconRim: true,
  },
  {
    id: 'traduciendo-la-ciencia',
    order: 2,
    status: 'in_preparation',
    destination: 'traduciendo_ciencia_intro',
    iconAsset: traduciendoCienciaIcon,
    cropIconRim: false,
  },
  {
    id: 'escucha-imagina-construye',
    order: 3,
    status: 'available',
    destination: 'escucha_imagina_intro',
    iconAsset: escuchaImaginaIcon,
    cropIconRim: false,
  },
  {
    id: 'detectives-de-la-nasa',
    order: 4,
    status: 'available',
    destination: 'detectives_nasa_intro',
    iconAsset: detectivesNasaIcon,
    cropIconRim: false,
  },
  {
    id: 'biblioteca-cientifica-nasa',
    order: 5,
    status: 'available',
    destination: 'biblioteca_nasa_intro',
    iconAsset: bibliotecaNasaIcon,
    cropIconRim: false,
  },
  {
    id: 'explora-con-nauti',
    order: 6,
    status: 'coming_soon',
    destination: 'coming_soon',
    placeholderIcon: 'explore',
  },
  {
    id: 'laboratorio-nauti',
    order: 7,
    status: 'coming_soon',
    destination: 'coming_soon',
    placeholderIcon: 'lab',
  },
  {
    id: 'viajes-sonoros',
    order: 8,
    status: 'coming_soon',
    destination: 'coming_soon',
    placeholderIcon: 'sound',
  },
] as const;

export function getDesktopApps(lang: AppLang): DesktopAppItem[] {
  const strings = DESKTOP_STRINGS[lang];
  return DESKTOP_APPS.map((def) => {
    const localized = strings.apps[def.id];
    return {
      ...def,
      name: localized.name,
      subtitle: localized.subtitle,
      tooltip: localized.tooltip,
    };
  });
}
