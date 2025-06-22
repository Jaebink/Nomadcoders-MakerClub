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
        .select('letter_id')
        .single();

        console.log("SEND_LETTER_QUERY: Insert Result - data:", data, "error:", insertError);
        
    if (insertError) {
        console.error("Error inserting concern letter:", insertError);
        throw insertError;
    }

    return data?.letter_id;
};

export const sendLetterAnswer = async (client: SupabaseClient<Database>, { letterId, responderId, answer }: { letterId: number, responderId: string, answer: string }) => {
    const { data, error: updateError } = await client
        .from('letter_responses')
        .insert({
            letter_id: letterId,
            responder_id: responderId,
            response: answer,
        })
        .select('letter_id')
        .single();
    if (updateError) {
        console.error("Error updating concern letter:", updateError);
        throw updateError;
    }

    return data?.letter_id;
};