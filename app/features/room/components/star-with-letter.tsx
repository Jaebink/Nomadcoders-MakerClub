import { AnimatedModal } from "~/common/components/ui/animated-modal"

export const StarWithLetter = ({ letter }: { letter: any }) => {
    return (
        <div key={letter.letter_id} className="relative">
            <img src="/public/letter.png" alt="" className="size-50" />
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