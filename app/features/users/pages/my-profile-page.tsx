// import type { Route } from "./+types/my-profile-page";
// import { getUserProfile } from "../queries";
// import { makeSSRClient } from "~/supa-client";

// export const loader = async ({ params, request }: Route.LoaderArgs) => {
//     const { client } = await makeSSRClient(request);
//     const user = await getUserProfile(client, { username: params.username });
//     return { user };
// };

export default function MyProfilePage() {
    return (
        <div className="flex flex-col items-center">
            <h1 className="text-3xl font-bold">name</h1>
            <p className="text-lg">username</p>
        </div>
    );
    
}
