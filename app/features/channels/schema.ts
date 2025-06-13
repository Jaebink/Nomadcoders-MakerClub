import { pgTable, bigint, text, timestamp, uuid, pgPolicy } from "drizzle-orm/pg-core";
import { profiles } from "../users/schema";
import { authenticatedRole, authUid } from "drizzle-orm/supabase";
import { sql } from "drizzle-orm";

export const channels = pgTable("channels", {
    channel_id: bigint({ mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
    owner_id: uuid().references(() => profiles.profile_id, { onDelete: "cascade" }).notNull(),
    name: text().notNull(),
    description: text().notNull(),
    image: text().notNull(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
}, (table) => [
    pgPolicy("channel-select-policy", {
        for: "select",
        to: authenticatedRole,
        as: "permissive",
        using: sql`true`,
    }),
    pgPolicy("channel-insert-policy", {
        for: "insert",
        to: authenticatedRole,
        as: "permissive",
        withCheck: sql`${authUid} = ${table.owner_id}`,
    }),
    pgPolicy("channel-update-policy", {
        for: "update",
        to: authenticatedRole,
        as: "permissive",
        withCheck: sql`${authUid} = ${table.owner_id}`,
    }),
    pgPolicy("channel-delete-policy", {
        for: "delete",
        to: authenticatedRole,
        as: "permissive",
        using: sql`${authUid} = ${table.owner_id}`,
    }),
]);