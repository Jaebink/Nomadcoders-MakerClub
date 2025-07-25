import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "~/supa-client";
import { redirect } from "react-router";

export const getUserProfile = async (client: SupabaseClient<Database>) => {
    const { data, error } = await client
        .from("profiles")
        .select(`
            profile_id,
            name,
            username
        `)
        .single();
    if (error) {
        throw error;
    }
    return data;
};

export const getUserById = async (client: SupabaseClient<Database>, { id }: { id: string }) => {
    const { data, error } = await client
        .from("profiles")
        .select(`
            profile_id,
            name,
            username,
            is_active
        `)
        .eq("profile_id", id)
        .single();
    if (error) {
        throw error;
    }
    return data;
};

export const getLoggedInUserId = async (client: SupabaseClient<Database>) => {
    const { data, error } = await client.auth.getUser();
    if (error || data.user === null) {
        throw redirect("/auth/login");
    }
    return data.user.id;
};

export const getLettersByReceiverId = async (client: SupabaseClient<Database>, { userId }: { userId : string }) => {
    const { data, error } = await client
        .from("concern_letters")
        .select("*, letter_responses!left(letter_id)")
        .contains("receivers", JSON.stringify([{ user_id: userId }]))
        .is("letter_responses.letter_id", null)
        .order("created_at", { ascending: true });
    if (error) {
        throw error;
    }
    return data;
};

export const getLettersbySenderId = async (client: SupabaseClient<Database>, { userId }: { userId : string }) => {
    const { data, error } = await client
        .from("concern_letters")
        .select("*")
        .eq("sender_id", userId)
        .order("created_at", { ascending: false });
    if (error) {
        throw error;
    }
    return data;
};  

export const getAnswers = async (client: SupabaseClient<Database>, { letterId }: { letterId : number }) => {
    const { data, error } = await client
        .from("letter_responses")
        .select("*")
        .eq("letter_id", letterId)
        .order("responded_at", { ascending: false });
    if (error) {
        throw error;
    }
    return data;
}; 