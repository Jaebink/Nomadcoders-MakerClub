import { Link } from "react-router";
import { House, UsersRound, CircleUserRound } from "lucide-react";
export default function Navigation() {
    return (
        <div className="flex flex-col justify-between items-center p-4">
            <div className="text-white">로고</div>
            <div className="">
                <House className="w-6 h-6 text-white" />
                <Link to={"/"} className="text-white items-center">홈</Link>
                <UsersRound className="w-6 h-6 text-white" />
                <Link to={"/"} className="text-white items-center">채팅</Link>
            </div>
            <div className="text-white">
                <CircleUserRound className="w-6 h-6 text-white" />
                <Link to={"/"} className="text-white items-center">프로필</Link>
            </div>
        </div>
    )
}