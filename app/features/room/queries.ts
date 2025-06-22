import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const getRandomActiveReceiverIds = async (client: SupabaseClient<Database>, limit: number = 5, senderId: string, channelId: number | null = null): Promise<{ user_id: string, username: string }[]> => {
    const rpcChannelId = channelId === null ? undefined : channelId;

    const { data, error: selectError } = await client
        .rpc('get_random_active_users', { num_limit: limit, sender_id: senderId, target_channel_id: rpcChannelId });

    if (selectError) {
        console.error("Error fetching random active receivers using RPC:", selectError);
        throw selectError;
    }

    if (!data || data.length === 0) {
        console.warn("No active receivers found.");
        return [];
    }

    return data.map(item => ({ user_id: item.id, username: item.username }));
};