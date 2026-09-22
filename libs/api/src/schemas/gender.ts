export const Gender = {
  Male: 1,
  Female: 2,
  TransMale: 3,
  TransFemale: 4,
  NonBinary: 5,
} as const;

export type GenderId = (typeof Gender)[keyof typeof Gender];

export const GenderLabels: Record<GenderId, string> = {
  [Gender.Male]: 'Male',
  [Gender.Female]: 'Female',
  [Gender.TransMale]: 'Trans Male',
  [Gender.TransFemale]: 'Trans Female',
  [Gender.NonBinary]: 'Non-Binary',
};
