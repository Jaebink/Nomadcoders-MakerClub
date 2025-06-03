import type { Route } from "./+types/channels-page";
import { getLoggedInUserId } from "~/features/users/queries";
import { makeSSRClient } from "~/supa-client";
import ChannelCard from "../components/channel-card";

export const loader = async ({ request }: Route.LoaderArgs) => {
    const { client } = makeSSRClient(request);
    await getLoggedInUserId(client);
};

export default function ChannelsPage() {
    return (
        <div className="flex flex-col gap-4">
            <ChannelCard id={1} name=" 서울 사람들 " description="서울 사람들의 모임" userIds={[1, 2, 3]} />
            <ChannelCard id={2} name=" 부산 사람들 " description="부산 사람들의 모임" userIds={[1, 2, 3, 4]} />
            <ChannelCard id={3} name=" 대전 사람들 " description="대전 사람들의 모임" userIds={[1, 2, 3, 4, 5]} />
        </div>
    )
}