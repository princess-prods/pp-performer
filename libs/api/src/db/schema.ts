import { pgTable, serial, text, integer, uuid, timestamp, boolean, primaryKey, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Genders lookup table
export const genders = pgTable('genders', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
});

// Act frequencies lookup table
export const actFrequencies = pgTable('act_frequencies', {
  id: integer('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
});

// Act categories lookup table
export const actCategories = pgTable('act_categories', {
  id: integer('id').primaryKey(),
  name: text('name').notNull().unique(),
});

// Acts lookup table
export const acts = pgTable('acts', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  frequencyId: integer('frequency_id').notNull().references(() => actFrequencies.id),
  categoryId: integer('category_id').notNull().references(() => actCategories.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Performers table
export const performers = pgTable('performers', {
  id: uuid('id').defaultRandom().primaryKey(),
  externalId: text('external_id').unique(),
  firstName: text('first_name').notNull(),
  middleName: text('middle_name'),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  age: integer('age').notNull(),
  isVerified18: boolean('is_verified_18').notNull().default(false),
  city: text('city').notNull(),
  stateProvince: text('state_province').notNull(),
  country: text('country').notNull().default('US'),
  genderId: integer('gender_id').notNull().references(() => genders.id),
  socialLinks: text('social_links').array().default([]),
  // Physical attributes (nullable for now)
  eyeColorId: integer('eye_color_id'),
  hairColorId: integer('hair_color_id'),
  buildTypeId: integer('build_type_id'),
  braSize: text('bra_size'),
  pantySize: text('panty_size'),
  shoeSize: text('shoe_size'),
  dressSize: text('dress_size'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  index('idx_performers_email').on(table.email),
  index('idx_performers_external_id').on(table.externalId),
]);

// Junction table for performers <-> acts
export const performerActs = pgTable('performer_acts', {
  performerId: uuid('performer_id').notNull().references(() => performers.id, { onDelete: 'cascade' }),
  actId: uuid('act_id').notNull().references(() => acts.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  primaryKey({ columns: [table.performerId, table.actId] }),
  index('idx_performer_acts_performer_id').on(table.performerId),
  index('idx_performer_acts_act_id').on(table.actId),
]);

// Relations
export const gendersRelations = relations(genders, ({ many }) => ({
  performers: many(performers),
}));

export const actFrequenciesRelations = relations(actFrequencies, ({ many }) => ({
  acts: many(acts),
}));

export const actCategoriesRelations = relations(actCategories, ({ many }) => ({
  acts: many(acts),
}));

export const actsRelations = relations(acts, ({ one, many }) => ({
  frequency: one(actFrequencies, {
    fields: [acts.frequencyId],
    references: [actFrequencies.id],
  }),
  category: one(actCategories, {
    fields: [acts.categoryId],
    references: [actCategories.id],
  }),
  performerActs: many(performerActs),
}));

export const performersRelations = relations(performers, ({ one, many }) => ({
  gender: one(genders, {
    fields: [performers.genderId],
    references: [genders.id],
  }),
  performerActs: many(performerActs),
}));

export const performerActsRelations = relations(performerActs, ({ one }) => ({
  performer: one(performers, {
    fields: [performerActs.performerId],
    references: [performers.id],
  }),
  act: one(acts, {
    fields: [performerActs.actId],
    references: [acts.id],
  }),
}));
