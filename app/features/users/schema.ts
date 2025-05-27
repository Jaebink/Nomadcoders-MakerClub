import { bigint, boolean, jsonb, pgEnum, pgSchema, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase"

// const users = pgSchema("auth").table("users", {
//     id: uuid().primaryKey()
// });

export const profiles = pgTable("profiles", {
    profile_id: uuid().primaryKey().references(() => authUsers.id, { onDelete: "cascade" }),
    name: text().notNull(),
    username: text().notNull(),
    views: jsonb(),
    created_at: timestamp().notNull().defaultNow(),
    updated_at: timestamp().notNull().defaultNow(),
});

export const concern = pgTable("concern", {
    concern_id: bigint({ mode: "number" })
        .primaryKey()
        .generatedAlwaysAsIdentity(),
    sender_id: uuid().references(() => profiles.profile_id, {
        onDelete: "cascade",
    }).notNull(),
    content: text().notNull(),
    seen: boolean().notNull().default(false),
    created_at: timestamp().notNull().defaultNow(),
});

export const concernRooms = pgTable("concern_rooms", {
    concern_room_id: bigint({ mode: "number" })
        .primaryKey()
        .generatedAlwaysAsIdentity(),
    created_at: timestamp().notNull().defaultNow(),
});

export const concernRoomMembers = pgTable("concern_room_members", {
    concern_room_id: bigint({ mode: "number" }).references(
        () => concernRooms.concern_room_id,
        {
            onDelete: "cascade",
        }
    ),
    profile_id: uuid().references(() => profiles.profile_id, {
        onDelete: "cascade",
    }),
    created_at: timestamp().notNull().defaultNow(),
}, (table) => [primaryKey({ columns: [table.concern_room_id, table.profile_id] }),
]);