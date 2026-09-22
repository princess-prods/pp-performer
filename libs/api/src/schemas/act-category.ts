export const ActCategory = {
  Mainstream: 1,
  Standard: 2,
  BDSM: 3,
  Fetish: 4,
  Extreme: 5,
  Style: 6,
} as const;

export type ActCategoryId = (typeof ActCategory)[keyof typeof ActCategory];

export const ActCategoryLabels: Record<ActCategoryId, string> = {
  [ActCategory.Mainstream]: 'Mainstream',
  [ActCategory.Standard]: 'Standard',
  [ActCategory.BDSM]: 'BDSM',
  [ActCategory.Fetish]: 'Fetish',
  [ActCategory.Extreme]: 'Extreme',
  [ActCategory.Style]: 'Style',
};
