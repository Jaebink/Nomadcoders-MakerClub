import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const sendLetter = async (client: SupabaseClient<Database>, { senderId, receivers, title, content, channelId = null }: { senderId: string, receivers: { user_id: string; is_active: boolean; seen: boolean; seen_at: string | null; }[], title: string, content: string, channelId?: number | null }) => {
    const { data, error: insertError } = await client
        .from('concern_letters')
        .insert({
            sender_id: senderId,
            receivers: receivers,
            title: title,
            content: content,
            channel_id: channelId ?? null,
        })
        .select('letter_id') // 삽입된 편지의 ID를 반환하도록 요청 (필요하다면)
        .single(); // 단일 행 삽입이므로 single() 사용;
        
    if (insertError) {
        console.error("Error inserting concern letter:", insertError);
        throw insertError;
    }

    return data?.letter_id;
};

export const getRandomActiveReceiverIds = async (client: SupabaseClient<Database>, limit: number = 5, senderId: string): Promise<{ user_id: string, username: string }[]> => {
    const { data, error: selectError } = await client
        .rpc('get_random_active_users', { num_limit: limit, sender_id: senderId });

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