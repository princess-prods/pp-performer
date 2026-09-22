CREATE TABLE "act_categories" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "act_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "act_frequencies" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	CONSTRAINT "act_frequencies_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "acts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"frequency_id" integer NOT NULL,
	"category_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "acts_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "genders" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "genders_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "performer_acts" (
	"performer_id" uuid NOT NULL,
	"act_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "performer_acts_performer_id_act_id_pk" PRIMARY KEY("performer_id","act_id")
);
--> statement-breakpoint
CREATE TABLE "performers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"external_id" text,
	"first_name" text NOT NULL,
	"middle_name" text,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"age" integer NOT NULL,
	"is_verified_18" boolean DEFAULT false NOT NULL,
	"city" text NOT NULL,
	"state_province" text NOT NULL,
	"country" text DEFAULT 'US' NOT NULL,
	"gender_id" integer NOT NULL,
	"social_links" text[] DEFAULT '{}',
	"eye_color_id" integer,
	"hair_color_id" integer,
	"build_type_id" integer,
	"bra_size" text,
	"panty_size" text,
	"shoe_size" text,
	"dress_size" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "performers_external_id_unique" UNIQUE("external_id"),
	CONSTRAINT "performers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "acts" ADD CONSTRAINT "acts_frequency_id_act_frequencies_id_fk" FOREIGN KEY ("frequency_id") REFERENCES "public"."act_frequencies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "acts" ADD CONSTRAINT "acts_category_id_act_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."act_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "performer_acts" ADD CONSTRAINT "performer_acts_performer_id_performers_id_fk" FOREIGN KEY ("performer_id") REFERENCES "public"."performers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "performer_acts" ADD CONSTRAINT "performer_acts_act_id_acts_id_fk" FOREIGN KEY ("act_id") REFERENCES "public"."acts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "performers" ADD CONSTRAINT "performers_gender_id_genders_id_fk" FOREIGN KEY ("gender_id") REFERENCES "public"."genders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_performer_acts_performer_id" ON "performer_acts" USING btree ("performer_id");--> statement-breakpoint
CREATE INDEX "idx_performer_acts_act_id" ON "performer_acts" USING btree ("act_id");--> statement-breakpoint
CREATE INDEX "idx_performers_email" ON "performers" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_performers_external_id" ON "performers" USING btree ("external_id");