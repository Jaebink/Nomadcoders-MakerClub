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

export const getLettersByReceiverId = async (client: SupabaseClient<Database>, { id }: { id: string }) => {
    const { data, error } = await client
        .from("concern_letters")
        .select("*")
        .eq("receiver_id", id)
        .order("created_at", { ascending: false });
    if (error) {
        throw error;
    }
    return data;
};
