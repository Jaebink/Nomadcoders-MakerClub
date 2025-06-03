 CREATE TABLE "concern" (
	"letter_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "concern_letter_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"sender_id" uuid NOT NULL,
	"receiver_id" uuid NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"seen" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"profile_id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"username" text NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "concern" ADD CONSTRAINT "concern_sender_id_profiles_profile_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "concern" ADD CONSTRAINT "concern_receiver_id_profiles_profile_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_profile_id_users_id_fk" FOREIGN KEY ("profile_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;