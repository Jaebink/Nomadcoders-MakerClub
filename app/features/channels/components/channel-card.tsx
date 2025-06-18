import { Link } from "react-router";

interface ChannelCardProps {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    className?: string;
    disabled?: boolean;
}

export default function ChannelCard({ id, name, description, imageUrl, className, disabled }: ChannelCardProps) {
    return (
        <Link to={`/channels/${id}`} style={{ pointerEvents: disabled ? 'none' : 'auto'}}>
            <div className={className}>
                <img src={imageUrl} alt="channel" className="w-full h-full object-cover rounded-t-lg" />
                <div className="bg-gray-600 rounded-b-lg p-4">
                    <h1 className="text-white md:text-lg text-sm">{name}</h1>
                    <p className="text-gray-400 text-xs">{description}</p>
                </div>
            </div>
        </Link>
    )
}
