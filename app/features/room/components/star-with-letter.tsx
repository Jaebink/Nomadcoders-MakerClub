import { AnimatedModal } from "~/common/components/ui/animated-modal"
import type { Database } from "~/supa-client";

export const StarWithLetter = ({ letter }: { letter: Database["public"]["Tables"]["concern_letters"]["Row"] }) => {
    return (
        <div key={letter.letter_id} className="relative">
            <img src="/letter.png" alt="" className="size-50" />
            <div className="absolute" style={{top: '52%', left: '32%', width: '40%', height: '25%'}}>
                <AnimatedModal
                    trigger="편지 열기"
                    title={letter.title}
                    children={<div>{letter.content}</div>}
                />
            </div>
        </div>
    )
}