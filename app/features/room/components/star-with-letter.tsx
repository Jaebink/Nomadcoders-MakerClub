import { AnimatedModal } from "~/common/components/ui/animated-modal"
import type { Database } from "~/supa-client";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

interface StarWithLetterProps {
    letter: Database["public"]["Tables"]["concern_letters"]["Row"];
    // 애니메이션 시작 지점과 끝 지점을 제어할 수 있도록 props 추가
    startFromX: number; 
    startFromY: number; 
    delay?: number; 
}
// { letter: Database["public"]["Tables"]["concern_letters"]["Row"] }
export const StarWithLetter = ({ letter, startFromX, startFromY, delay = 0, }: StarWithLetterProps) => {
        const [animationComplete, setAnimationComplete] = useState(false);
    return (
        <motion.div 
            key={letter.letter_id}
            // `relative` 부모가 있다면 `absolute`를 사용할 수 있습니다.
            // 하단바의 `map` 내부에서 렌더링되므로, `relative` 컨테이너 안에 있다면 `absolute`가 적절할 수 있습니다.
            // 하지만 화면 전체를 커버하는 `fixed` 컨테이너 안에 있다면,
            // 별 캐릭터의 크기 등을 고려하여 `top` / `left` / `right` / `bottom`을 명시해야 합니다.
            // 여기서는 하단바 내부에서 `flex`나 `grid` 등으로 배치될 것이라 가정하고,
            // '움직임'만 framer-motion으로 제어합니다.
            // z-index는 하단바 위에 나타나고 싶다면 하단바보다 높게.
            className="relative z-10" // 또는 absolute, fixed 등 부모 레이아웃에 맞게
            
            // ✨ initial: 원래 위치(0,0)에서 startFromX,Y 만큼 떨어져서 시작
            initial={{ x: startFromX, y: startFromY, opacity: 0 }} 
            // ✨ animate: 원래 위치(0,0)로 돌아옴
            animate={{ x: 0, y: 0, opacity: 1, scale: 1 }} 
            transition={{ 
                duration: 1.5, 
                delay: delay,   
                ease: "easeOut", 
            }}
            onAnimationComplete={() => { 
                setAnimationComplete(true);
            }}
            // style 속성은 필요에 따라 추가. 여기서는 컴포넌트의 원래 정적 위치를 잡는 데 사용
            style={{
                // 예를 들어, 하단 바 안에서 flexbox로 정렬될 경우
                // flex 아이템으로서의 기본적인 스타일만 필요할 수 있습니다.
                // 만약 absolute/fixed로 특정 픽셀 위치에 배치해야 한다면 여기에 top, left 등을 추가.
            }}
        >
            <img src="/fly-star.png" alt="편지를 들고 있는 별" className="size-50" />
            
            {animationComplete && (
                <div className="absolute" style={{ top: '52%', left: '32%', width: '40%', height: '25%' }}>
                    <AnimatedModal
                        letterId={letter.letter_id}
                        trigger="편지 열기"
                        title={letter.title}
                        children={<div>{letter.content}</div>}
                    />
                </div>
            )}
        </motion.div>
    )
}