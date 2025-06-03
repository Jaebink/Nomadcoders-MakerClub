import { Link } from "react-router";

interface ChannelCardProps {
    id: number;
    name: string;
    description: string;
    userIds: number[];
}

export default function ChannelCard({ id, name, description, userIds }: ChannelCardProps) {
    return (
        <Link to={`/channels/${id}`}>
            <a className="block">
                <div className="bg-gray-800 rounded-lg p-4">
                    <h1 className="text-white">{name}</h1>
                    <p className="text-gray-400">{description}</p>
                </div>
            </a>
        </Link>
    )
}
