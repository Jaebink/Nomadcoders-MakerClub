import { Link, useLocation } from "react-router";
import { House, UsersRound, CircleUserRound } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Navigation({
    isLoggedIn,
}: {
    isLoggedIn: boolean,
}) {
    const location = useLocation();
    const isActive = (path: string) => {
        if (path === '/channels') {
            return location.pathname.startsWith('/channels');
        }
        return location.pathname === path;
    };
    const [hoveredPath, setHoveredPath] = useState('');
    const [markPosition, setMarkPosition] = useState<number|null>(null);


    const navItems = [
        { path: '/room', label: '홈', icon: <House /> },
        { path: '/channels', label: '채널', icon: <UsersRound /> }
    ];

    // 각 네비게이션 아이템의 ref 배열 생성
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    // 현재 active된 아이템의 위치로 마크 이동
    useEffect(() => {
        const activeIndex = navItems.findIndex(item => isActive(item.path));
        if (activeIndex !== -1 && itemRefs.current[activeIndex]) {
            setMarkPosition(itemRefs.current[activeIndex]!.offsetTop);
        }
    }, [location.pathname]);

    return (
        <div className="fixed left-0 top-0 h-full w-16 flex flex-col items-center p-0">
            <div className="text-white mb-8">로고</div>
            <div className="flex-1 w-full flex flex-col justify-center items-center">
                {/* 네비게이션 아이템들과 마크를 같은 relative flex-col 컨테이너에 배치 */}
                <div className="relative flex flex-row w-full h-full items-center justify-center">
                    {/* 움직이는 마크 */}
                    <div
                        className="absolute left-0 w-1 h-12 bg-yellow-400 rounded-r transition-all duration-300 ease-in-out"
                        style={{
                            top: markPosition ?? 0,
                            opacity: markPosition === null ? 0 : 1,
                            transition: markPosition === null ? 'none' : undefined
                        }}
                    />
                    <div className="flex flex-col items-center justify-center">
                    {navItems.map((item, index) => (
                        <div
                            key={item.path}
                            className="mb-8 last:mb-0 items-center w-full"
                            ref={el => {
                                if (el) itemRefs.current[index] = el;
                            }}
                            onMouseEnter={() => {
                                setHoveredPath(item.path);
                                setMarkPosition(itemRefs.current[index]?.offsetTop ?? 0);
                            }}
                            onMouseLeave={() => {
                                setHoveredPath('');
                                const activeIndex = navItems.findIndex(i => isActive(i.path));
                                setMarkPosition(itemRefs.current[activeIndex]?.offsetTop ?? 0);
                            }}
                            style={{ position: "relative" }}
                        >
                            <Link 
                                to={item.path}
                                className="flex items-center justify-center group/nav-item w-full"
                                style={{ height: "48px" }}
                            >
                                <div className={`w-6 h-6 transition-colors ${isActive(item.path) ? 'text-yellow-400' : 'text-white hover:text-yellow-400'}`}>
                                    {item.icon}
                                </div>
                                <span className={`absolute left-full ml-2 text-xs whitespace-nowrap text-white transition-all duration-200 ${
                                    isActive(item.path) || hoveredPath === item.path ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                                }`}>
                                    {item.label}
                                </span>
                            </Link>
                        </div>
                        ))}
                    </div>
                </div>
            </div>
            <div
                className="mb-8 last:mb-0 items-center w-full"
                ref={el => {
                    if (el) itemRefs.current[navItems.length] = el;
                }}
                onMouseEnter={() => {
                    setHoveredPath('/profile');
                }}
                onMouseLeave={() => {
                    setHoveredPath('');
                }}
                style={{ position: "relative" }}
            >
                <Link 
                    to={'/profile'}
                    className="flex items-center justify-center group/nav-item w-full"
                    style={{ height: "48px" }}
                >
                    <div className={`w-6 h-6 transition-colors ${isActive('/profile') ? 'text-yellow-400' : 'text-white hover:text-yellow-400'}`}>
                        <CircleUserRound />
                    </div>
                    <span className={`absolute left-full text-xs whitespace-nowrap text-white transition-all duration-200 ${
                        isActive('/profile') || hoveredPath === '/profile' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                    }`}>
                        프로필
                    </span>
                </Link>
            </div>
        </div>
    )
}