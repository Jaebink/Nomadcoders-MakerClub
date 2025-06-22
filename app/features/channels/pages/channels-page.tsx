import type { Route } from "./+types/channels-page";
import { getLoggedInUserId } from "~/features/users/queries";
import { makeSSRClient } from "~/supa-client";
import ChannelCard from "../components/channel-card";
import { Button } from "~/common/components/ui/button";
import { Link } from "react-router";
import { getChannels } from "../queries";

export const loader = async ({ request }: Route.LoaderArgs) => {
    const { client } = makeSSRClient(request);
    await getLoggedInUserId(client);
    const channels = await getChannels(client);
    return { channels };
};

export default function ChannelsPage({ loaderData }: Route.ComponentProps) {
    return (
        <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">채널 목록</h1>
                <Button asChild variant="secondary">
                    <Link to="/channels/create">채널 만들기</Link>
                </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {loaderData.channels.map((channel: any) => (
                    <ChannelCard id={channel.channel_id} name={channel.name} description={channel.description} imageUrl={channel.image} />
                ))}
            </div>
        </div>
    )
}