export type EraId = '1995' | '2000' | '2005' | '2010' | '2015' | '2020' | '2026' | '2040';
export interface EraDesignLanguage {
  philosophy: string;
  typography: string;
  palette: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  signatureUI: string[];
  layoutModel: string;
}

export interface BrowserChromeConfig {
  title: string;
  url: string;
  engine: string;
  statusText: string;
  showTabs?: boolean;
  retroMenus?: boolean;
}
export interface EraStats {
  webPopulation: string;
  topWebsites: string[];
  avgSpeed: string;
  keyTech: string[];
  culturePillar: string;
}

export interface InteractiveWidgetConfig {
  type: string;
  title: string;
  initialData?: any;
}
export interface EraConfig {
  id: EraId;
  year: string;
  eraName: string;
  tagline: string;
  subtitle: string;
  description: string;
  colorScheme: {
    bg: string;
    cardBg: string;
    border: string;
    text: string;
    accent: string;
    glow: string;
  };
  designLanguage: EraDesignLanguage;
  browserChrome: BrowserChromeConfig;
  stats: EraStats;
  soundPreset: 'dialup' | 'bubble' | 'click' | 'chime' | 'flat' | 'digital' | 'spatial' | 'quantum';
  easterEggHint: string;
  easterEggCode?: string;
  interactiveHighlights: string[];
}
