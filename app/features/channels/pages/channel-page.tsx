import type { Route } from "./+types/channel-page";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";

export const loader = async ({ request }: Route.LoaderArgs) => {
    const { client } = makeSSRClient(request);
    await getLoggedInUserId(client);
};

export default function ChannelPage() {
    return (
        <div className="text-white">
            <h1>Channel 1</h1>
            <h1>Channel 2</h1>
        </div>
    )
}