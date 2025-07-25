ALTER TABLE "user_channels" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "user-channel-select-policy" ON "user_channels" AS PERMISSIVE FOR SELECT TO "authenticated";--> statement-breakpoint
CREATE POLICY "user-channel-insert-policy" ON "user_channels" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.uid()) = "user_channels"."user_id");--> statement-breakpoint
CREATE POLICY "user-channel-update-policy" ON "user_channels" AS PERMISSIVE FOR UPDATE TO "authenticated" WITH CHECK ((select auth.uid()) = "user_channels"."user_id");--> statement-breakpoint
CREATE POLICY "user-channel-delete-policy" ON "user_channels" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "user_channels"."user_id");