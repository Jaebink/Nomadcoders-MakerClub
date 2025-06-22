CREATE TABLE "letter_responses" (
	"response_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "letter_responses_response_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"letter_id" bigint NOT NULL,
	"responder_id" uuid NOT NULL,
	"response" text NOT NULL,
	"responded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "letter_responses" ADD CONSTRAINT "letter_responses_letter_id_concern_letters_letter_id_fk" FOREIGN KEY ("letter_id") REFERENCES "public"."concern_letters"("letter_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "letter_responses" ADD CONSTRAINT "letter_responses_responder_id_profiles_profile_id_fk" FOREIGN KEY ("responder_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "concern_letters" DROP COLUMN "answer";