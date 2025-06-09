ALTER TABLE "channels" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "concern_letters" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "concern_letters" ADD COLUMN "channel_id" bigint;--> statement-breakpoint
ALTER TABLE "concern_letters" ADD CONSTRAINT "concern_letters_channel_id_channels_channel_id_fk" FOREIGN KEY ("channel_id") REFERENCES "public"."channels"("channel_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "channel-select-policy" ON "channels" AS PERMISSIVE FOR SELECT TO "authenticated";--> statement-breakpoint
CREATE POLICY "channel-insert-policy" ON "channels" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "channels"."owner_id");--> statement-breakpoint
CREATE POLICY "channel-update-policy" ON "channels" AS PERMISSIVE FOR UPDATE TO "authenticated" WITH CHECK ((select auth.uid()) = "channels"."owner_id");--> statement-breakpoint
CREATE POLICY "channel-delete-policy" ON "channels" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "channels"."owner_id");--> statement-breakpoint
CREATE POLICY "concern-letter-select-policy" ON "concern_letters" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "concern_letters"."sender_id" or (select auth.uid()) = "concern_letters"."receiver_id");--> statement-breakpoint
CREATE POLICY "concern-letter-insert-policy" ON "concern_letters" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "concern_letters"."sender_id");--> statement-breakpoint
CREATE POLICY "profile-select-policy" ON "profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "profiles"."profile_id");--> statement-breakpoint
CREATE POLICY "profile-insert-policy" ON "profiles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "profiles"."profile_id");--> statement-breakpoint
CREATE POLICY "profile-update-policy" ON "profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" WITH CHECK ((select auth.uid()) = "profiles"."profile_id");--> statement-breakpoint
CREATE POLICY "profile-delete-policy" ON "profiles" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "profiles"."profile_id");