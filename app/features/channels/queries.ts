import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const getChannels = async (client: SupabaseClient<Database>) => {
    const { data, error } = await client
        .from("channels")
        .select("*")
        .order("created_at", { ascending: false });
    if (error) {
        throw error;
    }
    return data;
};