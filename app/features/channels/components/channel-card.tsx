import { Link } from "react-router";

interface ChannelCardProps {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
}

export default function ChannelCard({ id, name, description, imageUrl }: ChannelCardProps) {
    return (
        <Link to={`/channels/${id}`}>
            <div>
                <img src={imageUrl} alt="channel" className="w-full h-full object-cover rounded-t-lg" />
                <div className="bg-gray-600 rounded-b-lg p-4">
                    <h1 className="text-white text-lg">{name}</h1>
                    <p className="text-gray-400 text-xs">{description}</p>
                </div>
            </div>
        </Link>
    )
}
