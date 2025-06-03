import { createBrowserClient, createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import type { MergeDeep, SetNonNullable, SetFieldType } from "type-fest";
import type { Database as SupabaseDatabase } from "database.types";
import { createClient } from "@supabase/supabase-js";

export type Database = SupabaseDatabase

export const makeSSRClient = (request: Request) => {
    const headers = new Headers();
    const serverSideClient = createServerClient<Database>(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return parseCookieHeader(request.headers.get("Cookie") ?? "") as { name: string; value: string }[];
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        headers.append("Set-Cookie", serializeCookieHeader(name, value, options));
                    });
                },
            },
        }
    );
    return {
        client: serverSideClient,
        headers,
    };
};

// export const adminClient = createClient<Database>(
//     process.env.SUPABASE_URL!,
//     process.env.SUPABASE_SERVICE_ROLE_KEY!
// );