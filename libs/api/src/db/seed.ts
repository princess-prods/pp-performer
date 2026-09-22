import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { genders, actFrequencies, actCategories, acts } from './schema.js';
import { Gender, GenderLabels } from '../schemas/gender.js';
import { ActFrequency, ActFrequencyLabels, ActFrequencyDescriptions } from '../schemas/act-frequency.js';
import { ActCategory, ActCategoryLabels } from '../schemas/act-category.js';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function seed() {
  console.log('Seeding database...');

  // Seed genders
  console.log('Seeding genders...');
  for (const [, id] of Object.entries(Gender)) {
    await db.insert(genders).values({
      id: id as number,
      name: GenderLabels[id as keyof typeof GenderLabels],
    }).onConflictDoUpdate({
      target: genders.id,
      set: { name: GenderLabels[id as keyof typeof GenderLabels] },
    });
  }

  // Seed act frequencies
  console.log('Seeding act frequencies...');
  for (const [, id] of Object.entries(ActFrequency)) {
    await db.insert(actFrequencies).values({
      id: id as number,
      name: ActFrequencyLabels[id as keyof typeof ActFrequencyLabels],
      description: ActFrequencyDescriptions[id as keyof typeof ActFrequencyDescriptions],
    }).onConflictDoUpdate({
      target: actFrequencies.id,
      set: {
        name: ActFrequencyLabels[id as keyof typeof ActFrequencyLabels],
        description: ActFrequencyDescriptions[id as keyof typeof ActFrequencyDescriptions],
      },
    });
  }

  // Seed act categories
  console.log('Seeding act categories...');
  for (const [, id] of Object.entries(ActCategory)) {
    await db.insert(actCategories).values({
      id: id as number,
      name: ActCategoryLabels[id as keyof typeof ActCategoryLabels],
    }).onConflictDoUpdate({
      target: actCategories.id,
      set: { name: ActCategoryLabels[id as keyof typeof ActCategoryLabels] },
    });
  }

  // Seed acts
  console.log('Seeding acts...');
  const actsData = [
    // Mainstream
    { name: 'Solo masturbation', frequencyId: ActFrequency.VeryHigh, categoryId: ActCategory.Mainstream },
    { name: 'Blowjob', frequencyId: ActFrequency.VeryHigh, categoryId: ActCategory.Mainstream },
    { name: 'Cunnilingus', frequencyId: ActFrequency.VeryHigh, categoryId: ActCategory.Mainstream },
    { name: 'Vaginal sex', frequencyId: ActFrequency.VeryHigh, categoryId: ActCategory.Mainstream },
    { name: 'Handjob', frequencyId: ActFrequency.VeryHigh, categoryId: ActCategory.Mainstream },
    { name: 'Anal sex', frequencyId: ActFrequency.High, categoryId: ActCategory.Mainstream },
    { name: 'Lesbian', frequencyId: ActFrequency.High, categoryId: ActCategory.Mainstream },
    { name: 'Threesome (MFF)', frequencyId: ActFrequency.High, categoryId: ActCategory.Mainstream },
    { name: 'Threesome (MMF)', frequencyId: ActFrequency.High, categoryId: ActCategory.Mainstream },
    { name: 'POV', frequencyId: ActFrequency.High, categoryId: ActCategory.Mainstream },
    { name: 'Creampie', frequencyId: ActFrequency.High, categoryId: ActCategory.Mainstream },
    { name: 'Facial', frequencyId: ActFrequency.High, categoryId: ActCategory.Mainstream },
    { name: 'Deep throat', frequencyId: ActFrequency.High, categoryId: ActCategory.Mainstream },
    // Standard
    { name: 'Double penetration', frequencyId: ActFrequency.MediumHigh, categoryId: ActCategory.Standard },
    { name: 'Gangbang', frequencyId: ActFrequency.Medium, categoryId: ActCategory.Standard },
    { name: 'Orgy', frequencyId: ActFrequency.Medium, categoryId: ActCategory.Standard },
    { name: 'MILF', frequencyId: ActFrequency.Medium, categoryId: ActCategory.Standard },
    { name: 'Teen (18+)', frequencyId: ActFrequency.Medium, categoryId: ActCategory.Standard },
    { name: 'Interracial', frequencyId: ActFrequency.Medium, categoryId: ActCategory.Standard },
    { name: 'Squirting', frequencyId: ActFrequency.Medium, categoryId: ActCategory.Standard },
    { name: 'Rimming', frequencyId: ActFrequency.Medium, categoryId: ActCategory.Standard },
    { name: 'Titjob', frequencyId: ActFrequency.Medium, categoryId: ActCategory.Standard },
    { name: 'Footjob', frequencyId: ActFrequency.Medium, categoryId: ActCategory.Standard },
    { name: 'Cum swallow', frequencyId: ActFrequency.Medium, categoryId: ActCategory.Standard },
    // BDSM
    { name: 'Bondage', frequencyId: ActFrequency.Medium, categoryId: ActCategory.BDSM },
    { name: 'Domination', frequencyId: ActFrequency.Medium, categoryId: ActCategory.BDSM },
    { name: 'Submission', frequencyId: ActFrequency.Medium, categoryId: ActCategory.BDSM },
    { name: 'Spanking', frequencyId: ActFrequency.Medium, categoryId: ActCategory.BDSM },
    { name: 'Choking', frequencyId: ActFrequency.Medium, categoryId: ActCategory.BDSM },
    { name: 'Role play', frequencyId: ActFrequency.Medium, categoryId: ActCategory.BDSM },
    { name: 'Discipline', frequencyId: ActFrequency.LowMedium, categoryId: ActCategory.BDSM },
    { name: 'Rope bondage', frequencyId: ActFrequency.LowMedium, categoryId: ActCategory.BDSM },
    { name: 'Electro play', frequencyId: ActFrequency.Low, categoryId: ActCategory.BDSM },
    { name: 'Wax play', frequencyId: ActFrequency.Low, categoryId: ActCategory.BDSM },
    { name: 'CBT', frequencyId: ActFrequency.Low, categoryId: ActCategory.BDSM },
    { name: 'Pegging', frequencyId: ActFrequency.LowMedium, categoryId: ActCategory.BDSM },
    { name: 'Strap-on', frequencyId: ActFrequency.Medium, categoryId: ActCategory.BDSM },
    { name: 'Femdom', frequencyId: ActFrequency.LowMedium, categoryId: ActCategory.BDSM },
    { name: 'Cuckold', frequencyId: ActFrequency.LowMedium, categoryId: ActCategory.BDSM },
    { name: 'Chastity', frequencyId: ActFrequency.Low, categoryId: ActCategory.BDSM },
    // Fetish
    { name: 'Foot worship', frequencyId: ActFrequency.Medium, categoryId: ActCategory.Fetish },
    { name: 'Stockings', frequencyId: ActFrequency.Medium, categoryId: ActCategory.Fetish },
    { name: 'Latex', frequencyId: ActFrequency.LowMedium, categoryId: ActCategory.Fetish },
    { name: 'Leather', frequencyId: ActFrequency.LowMedium, categoryId: ActCategory.Fetish },
    { name: 'High heels', frequencyId: ActFrequency.Medium, categoryId: ActCategory.Fetish },
    { name: 'Balloon', frequencyId: ActFrequency.VeryLow, categoryId: ActCategory.Fetish },
    { name: 'Food play', frequencyId: ActFrequency.Low, categoryId: ActCategory.Fetish },
    { name: 'Oil', frequencyId: ActFrequency.Medium, categoryId: ActCategory.Fetish },
    { name: 'Cosplay', frequencyId: ActFrequency.LowMedium, categoryId: ActCategory.Fetish },
    { name: 'Uniform', frequencyId: ActFrequency.Medium, categoryId: ActCategory.Fetish },
    // Extreme
    { name: 'Vaginal fisting', frequencyId: ActFrequency.Low, categoryId: ActCategory.Extreme },
    { name: 'Anal fisting', frequencyId: ActFrequency.Low, categoryId: ActCategory.Extreme },
    { name: 'Gaping', frequencyId: ActFrequency.LowMedium, categoryId: ActCategory.Extreme },
    { name: 'Double anal', frequencyId: ActFrequency.Low, categoryId: ActCategory.Extreme },
    { name: 'Double vaginal', frequencyId: ActFrequency.Low, categoryId: ActCategory.Extreme },
    { name: 'Triple penetration', frequencyId: ActFrequency.VeryLow, categoryId: ActCategory.Extreme },
    { name: 'High heel insertion', frequencyId: ActFrequency.VeryLow, categoryId: ActCategory.Extreme },
    { name: 'Object insertion', frequencyId: ActFrequency.Low, categoryId: ActCategory.Extreme },
    { name: 'Prolapse', frequencyId: ActFrequency.VeryLow, categoryId: ActCategory.Extreme },
    { name: 'Watersports', frequencyId: ActFrequency.Low, categoryId: ActCategory.Extreme },
    { name: 'Spitting', frequencyId: ActFrequency.Low, categoryId: ActCategory.Extreme },
    { name: 'Face sitting', frequencyId: ActFrequency.Medium, categoryId: ActCategory.Extreme },
    { name: 'Smothering', frequencyId: ActFrequency.Low, categoryId: ActCategory.Extreme },
    { name: 'Breath play', frequencyId: ActFrequency.Low, categoryId: ActCategory.Extreme },
    { name: 'Wrestling', frequencyId: ActFrequency.Low, categoryId: ActCategory.Extreme },
    { name: 'Catfight', frequencyId: ActFrequency.Low, categoryId: ActCategory.Extreme },
    { name: 'Tickling', frequencyId: ActFrequency.Low, categoryId: ActCategory.Extreme },
    { name: 'Trampling', frequencyId: ActFrequency.VeryLow, categoryId: ActCategory.Extreme },
    { name: 'Crushing', frequencyId: ActFrequency.VeryLow, categoryId: ActCategory.Extreme },
    // Style
    { name: 'Amateur', frequencyId: ActFrequency.High, categoryId: ActCategory.Style },
    { name: 'Professional', frequencyId: ActFrequency.High, categoryId: ActCategory.Style },
    { name: 'Gonzo', frequencyId: ActFrequency.Medium, categoryId: ActCategory.Style },
    { name: 'Glamcore', frequencyId: ActFrequency.Medium, categoryId: ActCategory.Style },
    { name: 'VR', frequencyId: ActFrequency.LowMedium, categoryId: ActCategory.Style },
    { name: 'Behind the scenes', frequencyId: ActFrequency.Low, categoryId: ActCategory.Style },
  ];

  for (const act of actsData) {
    await db.insert(acts).values(act).onConflictDoUpdate({
      target: acts.name,
      set: { frequencyId: act.frequencyId, categoryId: act.categoryId },
    });
  }

  console.log('Seeding complete!');
}

seed().catch(console.error);
