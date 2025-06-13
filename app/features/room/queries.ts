import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const sendLetter = async (client: SupabaseClient<Database>, { senderId, receivers, title, content, channelId = null }: { senderId: string, receivers: string[], title: string, content: string, channelId?: number | null }) => {
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
    
    console.log(`Letter sent to ${receivers.length} active receiver(s).`);

    return data?.letter_id; // 삽입된 편지의 ID를 반환 (옵션)
};

export const getRandomActiveReceiverIds = async (client: SupabaseClient<Database>, limit: number = 5): Promise<string[]> => {
    const { data, error: selectError } = await client
        .rpc('get_random_active_receivers', { num_limit: limit }); // RPC 함수 호출

    if (selectError) {
        console.error("Error fetching random active receivers using RPC:", selectError);
        throw selectError;
    }

    if (!data || data.length === 0) {
        console.warn("No active receivers found.");
        return []; // 수신자가 없으면 빈 배열 반환
    }

    // RPC 함수가 { id: '...' } 형태의 배열을 반환한다고 가정
    return data.map(item => item.id);
};

export const getReceiverIdinActive = async (client: SupabaseClient<Database>) => {
    const { data, error } = await client
        .from('active_receivers')
        .select('user_id')
        .order('created_at', { ascending: false })
    if (error) {
        throw error;
    }
    return data ? data.map(item => item.user_id) : [];
};
