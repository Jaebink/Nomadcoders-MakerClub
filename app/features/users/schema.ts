import { bigint, boolean, jsonb, pgEnum, pgPolicy, pgSchema, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { authenticatedRole, authUsers, authUid } from "drizzle-orm/supabase"
import { channels } from "../channels/schema";
import { sql } from "drizzle-orm"

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
}, (table) => [
    pgPolicy("profile-select-policy", {
        for: "select",
        to: authenticatedRole,
        as: "permissive",
        using: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("profile-insert-policy", {
        for: "insert",
        to: authenticatedRole,
        as: "permissive",
        withCheck: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("profile-update-policy", {
        for: "update",
        to: authenticatedRole,
        as: "permissive",
        withCheck: sql`${authUid} = ${table.profile_id}`,
    }),
    pgPolicy("profile-delete-policy", {
        for: "delete",
        to: authenticatedRole,
        as: "permissive",
        using: sql`${authUid} = ${table.profile_id}`,
    }),
]);

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
    channel_id: bigint({ mode: "number" }).references(() => channels.channel_id, {
        onDelete: "cascade",
    }),
}, (table) => [
    pgPolicy("concern-letter-select-policy", {
        for: "select",
        to: authenticatedRole,
        as: "permissive",
        using: sql`${authUid} = ${table.sender_id} or ${authUid} = ${table.receiver_id}`,
    }),
    pgPolicy("concern-letter-insert-policy", {
        for: "insert",
        to: authenticatedRole,
        as: "permissive",
        withCheck: sql`${authUid} = ${table.sender_id}`,
    }),
]);