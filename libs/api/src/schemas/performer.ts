import { z } from 'zod';

// Input schema for upserting a performer
export const performerUpsertSchema = z.object({
  externalId: z.string().optional(),
  firstName: z.string({ error: 'First name is required' }).min(1, 'First name cannot be empty'),
  middleName: z.string().optional(),
  lastName: z.string({ error: 'Last name is required' }).min(1, 'Last name cannot be empty'),
  email: z.string({ error: 'Email is required' }).email('Invalid email address'),
  phone: z.string().optional(),
  age: z.number({ error: 'Age is required' }).int({ error: 'Age must be a whole number' }).min(18, 'Must be at least 18 years old'),
  isVerified18: z.boolean({ error: 'Age verification status is required' }),
  city: z.string({ error: 'City is required' }).min(1, 'City cannot be empty'),
  stateProvince: z.string({ error: 'State/Province is required' }).min(1, 'State/Province cannot be empty'),
  country: z.literal('US').or(z.literal('CA')).default('US'),
  genderId: z.number({ error: 'Gender is required' }).int({ error: 'Gender ID must be a whole number' }).min(1, 'A valid gender must be selected'),
  socialLinks: z.array(z.string().url('Invalid URL in social links')).default([]),
  actIds: z.array(z.string().uuid('Invalid act ID format')).default([]),
});

export type PerformerUpsertInput = z.infer<typeof performerUpsertSchema>;

// Output schema for a performer (what we return from queries)
export const performerSchema = z.object({
  id: z.string().uuid(),
  externalId: z.string().nullable(),
  firstName: z.string(),
  middleName: z.string().nullable(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  age: z.number(),
  isVerified18: z.boolean(),
  city: z.string(),
  stateProvince: z.string(),
  country: z.string(),
  genderId: z.number(),
  socialLinks: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Performer = z.infer<typeof performerSchema>;
