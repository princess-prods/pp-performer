export const ActFrequency = {
  VeryHigh: 1,
  High: 2,
  MediumHigh: 3,
  Medium: 4,
  LowMedium: 5,
  Low: 6,
  VeryLow: 7,
} as const;

export type ActFrequencyId = (typeof ActFrequency)[keyof typeof ActFrequency];

export const ActFrequencyLabels: Record<ActFrequencyId, string> = {
  [ActFrequency.VeryHigh]: 'Very High',
  [ActFrequency.High]: 'High',
  [ActFrequency.MediumHigh]: 'Medium-High',
  [ActFrequency.Medium]: 'Medium',
  [ActFrequency.LowMedium]: 'Low-Medium',
  [ActFrequency.Low]: 'Low',
  [ActFrequency.VeryLow]: 'Very Low',
};

export const ActFrequencyDescriptions: Record<ActFrequencyId, string> = {
  [ActFrequency.VeryHigh]: 'Appears in most mainstream productions',
  [ActFrequency.High]: 'Regularly featured in commercial content',
  [ActFrequency.MediumHigh]: 'Common but not ubiquitous',
  [ActFrequency.Medium]: 'Standard category, regularly produced',
  [ActFrequency.LowMedium]: 'Niche but with consistent audience',
  [ActFrequency.Low]: 'Specialty/fetish content',
  [ActFrequency.VeryLow]: 'Rare/extreme niche',
};
