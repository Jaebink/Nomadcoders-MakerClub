import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";

export const createChannel = async (client: SupabaseClient<Database>, { userId, name, description, imgUrl }: { userId: string, name: string, description: string, imgUrl: string }) => {
    const { data, error } = await client
        .from("channels")
        .insert({
            owner_id: userId,
            name,
            description,
            image: imgUrl
        })
        .select("channel_id")
        .single();
    if (error) throw error;
    return data.channel_id;
};

export const addUserToChannel = async (client: SupabaseClient<Database>, { userId, channelId }: { userId: string, channelId: number }) => {
    const { data, error } = await client
        .from("user_channels")
        .upsert({
            user_id: userId,
            channel_id: channelId
        },
        {
            onConflict: "user_id, channel_id",
            ignoreDuplicates: true
        })
        .select("user_id, channel_id")
        .single();
    if (error) throw error;
    return data;
};