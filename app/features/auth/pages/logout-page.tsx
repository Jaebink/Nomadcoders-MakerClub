import type { Route } from "./+types/logout-page";
import { makeSSRClient } from "~/supa-client";
import { redirect } from "react-router";
import { getLoggedInUserId } from "~/features/users/queries";

export const loader = async ({ request }: Route.LoaderArgs) => {
    const { client, headers } = makeSSRClient(request);
    const userId = await getLoggedInUserId(client);
    await client.from("profiles").update({
        is_active: false,
        last_active_at: new Date().toISOString(),
    }).eq("id", userId);
    await client.auth.signOut();

    return redirect("/", { headers });
};