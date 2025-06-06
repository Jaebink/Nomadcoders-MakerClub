import type { Route } from "./+types/channels-page";
import { getLoggedInUserId } from "~/features/users/queries";
import { makeSSRClient } from "~/supa-client";
import ChannelCard from "../components/channel-card";
import { Button } from "~/common/components/ui/button";
import { Link } from "react-router";

export const loader = async ({ request }: Route.LoaderArgs) => {
    const { client } = makeSSRClient(request);
    await getLoggedInUserId(client);
};

export default function ChannelsPage() {
    return (
        <div className="grid grid-cols-4 gap-4">
            <div className="col-span-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">채널 목록</h1>
                    <Button asChild variant="secondary">
                        <Link to="/channels/create">채널 만들기</Link>
                    </Button>
                </div>
            </div>
            {Array.from({ length: 20 }).map((_, index) => (
                <ChannelCard id={index + 1} name={` 서울 사람들 ${index + 1}`} description={`서울 사람들의 모임 ${index + 1}`} imageUrl={`https://placehold.co/600x400`} />
            ))}
        </div>
    )
}