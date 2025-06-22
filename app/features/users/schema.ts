import { bigint, boolean, jsonb, pgPolicy, pgTable, text, timestamp, uuid, primaryKey } from "drizzle-orm/pg-core";
import { authenticatedRole, authUsers, authUid } from "drizzle-orm/supabase"
import { channels } from "../channels/schema";
import { relations, sql } from "drizzle-orm"

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
    receivers: jsonb().$type<Array<{
        user_id: string;
        seen: boolean;
        seen_at?: string | null;
        is_active: boolean;
    }>>().notNull().default([]),
    title: text().notNull(),
    content: text().notNull(),
    created_at: timestamp().notNull().defaultNow(),
    channel_id: bigint({ mode: "number" }).references(() => channels.channel_id, {
        onDelete: "cascade",
    }),
}, (table) => [
    pgPolicy("concern-letter-select-policy", {
        for: "select",
        to: authenticatedRole,
        as: "permissive",
        using: sql`${authUid} = ${table.sender_id} or ${authUid} in ${table.receivers}`,
    }),
    pgPolicy("concern-letter-insert-policy", {
        for: "insert",
        to: authenticatedRole,
        as: "permissive",
        withCheck: sql`${authUid} = ${table.sender_id}`,
    }),
]);

export const userChannels = pgTable("user_channels", {
    user_id: uuid().references(() => profiles.profile_id, {
        onDelete: "cascade",
    }).notNull(),
    channel_id: bigint({ mode: "number" }).references(() => channels.channel_id, {
        onDelete: "cascade",
    }).notNull(),
    joined_at: timestamp().notNull().defaultNow(),
}, (table) => [
    primaryKey({ columns: [table.user_id, table.channel_id] }),
]);

export const userChannelsRelations = relations(userChannels, ({ one }) => ({
    user: one(profiles, {
        fields: [userChannels.user_id],
        references: [profiles.profile_id],
    }),
    channel: one(channels, {
        fields: [userChannels.channel_id],
        references: [channels.channel_id],
    }),
}));

export const profilesRelations = relations(profiles, ({ many }) => ({
    userChannels: many(userChannels),
}));

export const letter_responses = pgTable("letter_responses", {
    response_id: bigint({ mode: "number" })
        .primaryKey()
        .generatedAlwaysAsIdentity(),
    letter_id: bigint({ mode: "number" }).references(() => concernLetters.letter_id, {
        onDelete: "cascade",
    }).notNull(),
    responder_id: uuid().references(() => profiles.profile_id, {
        onDelete: "cascade",
    }).notNull(),
    response: text().notNull(),
    responded_at: timestamp().notNull().defaultNow(),
});
