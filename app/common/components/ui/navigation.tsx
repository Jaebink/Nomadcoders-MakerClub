import { Link, useLocation } from "react-router";
import { House, UsersRound, CircleUserRound } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "~/lib/utils";
import { Menu, X } from "lucide-react";

export default function Navigation({
    isLoggedIn,
    className,
}: {
    isLoggedIn: boolean,
    className?: string,
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

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className={cn("fixed left-0 top-0 h-full w-16 flex flex-col p-0", className)}>
            <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden cursor-pointer fixed top-4 right-4 z-40 p-3 bg-gray-800 text-white rounded-full shadow-lg"
                >
                <Menu size={24} />
            </button>

            <div
                className={cn(
                    "fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity md:hidden",
                    isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
            >
                <div // 👈 **이 div가 모바일 메뉴 패널입니다.**
                    className="absolute right-0 top-0 h-full w-64 bg-gray-800 p-4 transform transition-transform duration-300 flex flex-col" // 💡 flex flex-col 추가
                    style={{
                    transform: isMobileMenuOpen ? "translateX(0)" : "translateX(100%)"
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* 상단: "메뉴" 텍스트와 닫기 버튼 */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="text-white text-xl font-bold">메뉴</div> {/* 로고 역할 */}
                        <button onClick={() => setIsMobileMenuOpen(false)}>
                            <X className="text-white" size={24} />
                        </button>
                    </div>
                    
                    {/* 중간: 네비게이션 아이템들 (남는 공간을 모두 차지) */}
                    <div className="flex-1 space-y-6 flex flex-col justify-center"> {/* 💡 flex-1, flex flex-col justify-center 추가 */}
                    {navItems.map((item) => (
                        <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                            "flex items-center text-white p-3 rounded-lg",
                            isActive(item.path) ? "bg-gray-700" : "hover:bg-gray-700"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                        >
                        <span className="mr-3">{item.icon}</span>
                        <span>{item.label}</span>
                        </Link>
                    ))}
                    </div>

                    {/* 하단: 프로필 링크 */}
                    <Link
                        to="/profile"
                        className={cn(
                        "flex items-center text-white p-3 rounded-lg",
                        isActive('/profile') ? "bg-gray-700" : "hover:bg-gray-700"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <CircleUserRound className="mr-3" />
                        <span>프로필</span>
                    </Link>
                </div>
            </div>

            <div className="hidden md:flex flex-col flex-1">
                <div className="text-white mb-8">로고</div>
                <div className="flex-1 w-full flex flex-col justify-center items-center">
                    <div className="relative flex flex-row w-full h-full items-center justify-center">
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
        </div>
    )
}