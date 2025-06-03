import type { Route } from "./+types/room-page";
import { getLoggedInUserId, getUserById } from "~/features/users/queries";
import { makeSSRClient } from "~/supa-client";
import PopoverForm from "~/common/components/ui/popover-form";
import { Form } from "react-router";
import { useState } from "react";

export const loader = async ({ request }: Route.LoaderArgs) => {
    const { client } = makeSSRClient(request);
    const userId = await getLoggedInUserId(client);
    const profile = await getUserById(client, { id: userId });
    return {
        userId, 
        profile,
    };
};

export default function RoomPage({ loaderData }: Route.ComponentProps) {
    const [open, setOpen] = useState(false);
    const [concern, setConcern] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [message, setMessage] = useState('')
    const [isReceiving, setIsReceiving] = useState(false)
    const [notifications, setNotifications] = useState<string[]>([])
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!concern.trim()) {
            setMessage('고민을 입력해주세요')
            return
        }
        setIsSending(true)
        try {
            // 여기에 실제 서버 API 호출 코드를 추가
            // 예시: await fetch('/api/concerns', { method: 'POST', body: JSON.stringify({ concern }) })
            setMessage('고민이 전달되었습니다!')
            setConcern('')
            setShowSuccess(true) // 성공 상태로 변경
        } catch (error) {
            setMessage('고민 전달에 실패했습니다. 다시 시도해주세요.')
        } finally {
            setIsSending(false)
        }
    }
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="text-white">
                <h1 className="text-6xl font-bold">{loaderData.profile?.name}님 안녕하세요</h1>
                <p className="text-2xl mt-4">고민 상담소에 오신 것을 환영합니다!</p>
                <p className="text-xl mt-4">여기서는 당신의 고민을 익명으로 랜덤한 해결사들에게 전달할 수 있습니다.</p>
                <p className="text-lg mt-4">또한, 당신은 다른 사람의 고민을 수신하고 해결할 수 있습니다.</p>
            </div>
            <PopoverForm
                open={open}
                setOpen={(isOpen) => {
                    setOpen(isOpen);
                    if (!isOpen) {
                        // 팝오버가 닫힐 때 폼 리셋
                        setConcern('');
                        setMessage('');
                        setShowSuccess(false);
                    }
                }}
                openChild={
                    <Form onSubmit={handleSubmit} className="space-y-4 p-4">
                        <textarea
                            placeholder="당신의 편지를 작성해주세요..."
                            value={concern}
                            onChange={(e) => setConcern(e.target.value)}
                            className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            rows={8}
                        />
                        <button
                            type="submit"
                            disabled={isSending}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSending ? '전송 중...' : '편지 전달하기'}
                        </button>
                        <p className="text-center text-gray-600 mt-4">당신의 편지는 익명으로 랜덤한 해결사들에게 전달됩니다.</p>
                    </Form>
                }
                showSuccess={showSuccess}
                successChild={<div className="p-4">편지가 성공적으로 제출되었습니다!</div>}
                title="편지 작성하기"
                width="1000px"
                height="400px"
            />            
        </div>
    )
}