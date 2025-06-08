import type { Route } from "./+types/room-page";
import { getLoggedInUserId, getUserById } from "~/features/users/queries";
import { makeSSRClient } from "~/supa-client";
import PopoverForm from "~/common/components/ui/popover-form";
import { Form } from "react-router";
import { useState } from "react";
import { Switch } from "~/common/components/ui/switch";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/common/components/ui/hover-card";
import { cn } from "~/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

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

    const [isReceiveOpen, setIsReceiveOpen] = useState(false);
    const [receiveConcerns, setReceiveConcerns] = useState<any[]>([]);

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
                <h1 className="text-4xl font-bold">{loaderData.profile?.name}님 안녕하세요</h1>
                <HoverCard>
                    <HoverCardTrigger className="cursor-pointer">
                        고민 편지 작성에 대해서
                    </HoverCardTrigger>
                    <HoverCardContent>
                        <div>
                            <p>여기서는 당신의 고민을 익명으로 랜덤한 해결사들에게 전달할 수 있습니다.</p>
                            <p>또한, 당신은 다른 사람의 고민을 수신하고 해결할 수 있습니다.</p>
                        </div>
                    </HoverCardContent>
                </HoverCard>
                <p className="text-lg mt-4">오늘은 무슨 고민이 있어서 오셨나요?</p>
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
                            onChange={(e) => setConcern(e.target.value)}
                            value={concern}
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
            
            {/* <div className="flex flex-col items-center fixed bottom-0 w-1/4">                
                <button
                    className="p-2 bg-gray-800 hover:bg-gray-700 transition duration-200"
                    onClick={() => setIsReceiveOpen((prev) => !prev)}
                >
                    {isReceiveOpen ? <ChevronUp className="text-white" /> : <ChevronDown className="text-white" />}
                </button>
                <div className="flex flex-row items-center bg-gray-200 h-60 w-200">
                    <p>고민1</p>
                    <p>고민2</p>
                    <p>고민3</p>
                </div>
            </div> */}
            <div className={`flex flex-col items-center fixed bottom-0 transition-transform duration-300 ease-in-out ${isReceiveOpen ? 'translate-y-0' : 'translate-y-[calc(100%-3.5rem)]'}`}>
                <div className="flex items-center justify-center h-10 px-4 gap-4">
                    <button className="px-4 py-1 bg-gray-600 hover:bg-gray-500 transition duration-200 rounded-t-md" onClick={() => setIsReceiveOpen((prev) => !prev)}>
                        {isReceiveOpen ? <ChevronUp className="text-white" /> : <ChevronDown className="text-white" />}
                    </button>
                    <div className="flex items-center absolute right-0 bg-gray-200 gap-2" >
                        <p>고민 해결사로 일하기</p>
                        <Switch />
                    </div>
                </div>
                <div className="flex flex-row items-center bg-gray-200 h-60 w-300 rounded-t-lg">
                    <p>고민1</p>
                    <p>고민2</p>
                    <p>고민3</p>
                </div>
            </div>
        </div>
    )
}