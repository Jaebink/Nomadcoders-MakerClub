import { pgTable, bigint, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { profiles } from "../users/schema";

export const channels = pgTable("channels", {
    channel_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    owner_id: uuid().references(() => profiles.profile_id, { onDelete: "cascade" }).notNull(),
    name: text().notNull(),
    description: text().notNull(),
    image: text().notNull(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
});