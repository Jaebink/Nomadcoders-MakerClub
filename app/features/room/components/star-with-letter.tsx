import { AnimatedModal } from "~/common/components/ui/animated-modal"
import type { Database } from "~/supa-client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface StarWithLetterProps {
    letter: Database["public"]["Tables"]["concern_letters"]["Row"];
    isAnimated: boolean;
    onAnimateComplete: () => void;
    errorMessage: {
        answer?: string;
        sendingAnswer?: string;
    } | undefined;
}

// 별이 화면 밖에서 시작할 위치를 계산하는 함수
const getStartOffsetPosition = () => {
    if (typeof window === 'undefined') {
        return { x: 0, y: 0 }; // 서버 사이드 렌더링 시 기본값
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const rand = Math.random();
    let offsetX: number;
    let offsetY: number;

    if (rand < 0.3) { // 왼쪽에서 출발
        offsetX = -viewportWidth;
        offsetY = (Math.random() - 0.5) * viewportHeight;
    } else if (rand < 0.6) { // 오른쪽에서 출발
        offsetX = viewportWidth;
        offsetY = (Math.random() - 0.5) * viewportHeight;
    } else { // 위쪽에서 출발
        offsetX = (Math.random() - 0.5) * viewportWidth;
        offsetY = -viewportHeight;
    }
    return { x: offsetX, y: offsetY };
};

export const StarWithLetter = ({ letter, isAnimated, onAnimateComplete, errorMessage }: StarWithLetterProps) => {
    const starRef = useRef<HTMLDivElement>(null);
    const tweenRef = useRef<gsap.core.Tween | null>(null);
    
    useEffect(() => {
        // 애니메이션 트리거 신호가 오고, 별과 목표 요소의 ref가 연결되었으며, 클라이언트 환경일 때
        if (starRef.current && typeof window !== 'undefined') {
            const starElement = starRef.current;
            
            if (isAnimated || tweenRef.current?.isActive) {
                return;
            }
            const timeout = setTimeout(() => {
                const { x: startX, y: startY } = getStartOffsetPosition();
                
                tweenRef.current = gsap.from(
                    starElement,
                    {
                        x: startX,
                        y: startY,
                        duration: 2,
                        ease: "power1.out",
                        onComplete: () => {
                            onAnimateComplete();
                            gsap.set(starElement, {
                                clearProps: "x,y,position,transform",
                            });
                        }
                    }
                );
            }, 100);
            return () => {
                clearTimeout(timeout);
                if (tweenRef.current && !isAnimated) {
                    tweenRef.current.kill();
                    tweenRef.current = null;
                }
            };
        }
        
    }, [letter.letter_id, isAnimated]);
    
    return (
        <div key={letter.letter_id} ref={starRef} className="relative">
            <img src="/fly-star.png" alt="편지를 들고 있는 별" className="h-50" />
            <div className="absolute" style={{top: '52%', left: '32%', width: '40%', height: '25%'}}>
                <AnimatedModal                    
                    letterId={letter.letter_id}
                    trigger="편지 열기"
                    title={letter.title}
                    children={<div>{letter.content}</div>}
                    errorMessage={errorMessage}
                />                
            </div>
        </div>
    )
}