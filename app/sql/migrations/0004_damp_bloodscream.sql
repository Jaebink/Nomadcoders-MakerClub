ALTER TABLE "concern_letters" RENAME COLUMN "receiver_id" TO "receivers";--> statement-breakpoint
ALTER TABLE "concern_letters" ALTER COLUMN "channel_id" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "concern_letters" DROP COLUMN "seen";--> statement-breakpoint