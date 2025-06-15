import { createBrowserClient, createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import type { MergeDeep, SetNonNullable, SetFieldType } from "type-fest";
import type { Database as SupabaseDatabase } from "database.types";
import { createClient } from "@supabase/supabase-js";

export type Database = SupabaseDatabase

export const browserClient = createBrowserClient<Database>(
    "https://xcojeabbrrvkkfvwduoj.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhjb2plYWJicnJ2a2tmdndkdW9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNTk2MzYsImV4cCI6MjA2MzkzNTYzNn0.f1hxfNB9kg60vCv-XTXMAHHPX14-tlH5BGTmsKamltY"
);

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