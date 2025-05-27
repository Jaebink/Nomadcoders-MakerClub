import { Link } from "react-router";
import { House, UsersRound, CircleUserRound } from "lucide-react";

export default function Navigation() {
    return (
        <div className="fixed left-0 top-0 h-full w-16 flex flex-col justify-between items-center p-4">
            <div className="text-white">로고</div>
            <div className="flex flex-col items-center space-y-8">
                <Link to="/" className="flex flex-col items-center text-white hover:text-indigo-400 transition-colors">
                    <House className="w-6 h-6" />
                    <span className="text-xs mt-1">홈</span>
                </Link>
                <Link to="/" className="flex flex-col items-center text-white hover:text-indigo-400 transition-colors">
                    <UsersRound className="w-6 h-6" />
                    <span className="text-xs mt-1">채팅</span>
                </Link>
            </div>
            <div className="flex flex-col items-center">
                <Link to="/" className="flex flex-col items-center text-white hover:text-indigo-400 transition-colors">
                    <CircleUserRound className="w-6 h-6" />
                    <span className="text-xs mt-1">프로필</span>
                </Link>
            </div>
        </div>
    )
}