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

export const getChannelById = async (client: SupabaseClient<Database>, channelId: number) => {
    const { data, error } = await client
        .from("channels")
        .select("*")
        .eq("channel_id", channelId)
        .single();
    if (error) {
        throw error;
    }
    return data;
};