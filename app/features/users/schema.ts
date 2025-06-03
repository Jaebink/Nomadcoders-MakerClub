import { bigint, boolean, jsonb, pgEnum, pgSchema, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase"

// const users = pgSchema("auth").table("users", {
//     id: uuid().primaryKey()
// });

export const profiles = pgTable("profiles", {
    profile_id: uuid().primaryKey().references(() => authUsers.id, { onDelete: "cascade" }),
    name: text().notNull(),
    username: text().notNull(),
    is_active: boolean().notNull().default(false),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
});

export const concernLetters = pgTable("concern_letters", {
    letter_id: bigint({ mode: "number" })
        .primaryKey()
        .generatedAlwaysAsIdentity(),
    sender_id: uuid().references(() => profiles.profile_id, {
        onDelete: "cascade",
    }).notNull(),
    receiver_id: uuid().references(() => profiles.profile_id, {
        onDelete: "cascade",
    }).notNull(),
    title: text().notNull(),
    content: text().notNull(),
    seen: boolean().notNull().default(false),
    created_at: timestamp().notNull().defaultNow(),
});