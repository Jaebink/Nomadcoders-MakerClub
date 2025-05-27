import { Mailbox } from "lucide-react";
import { Switch } from "@radix-ui/react-switch";
import { Form } from "react-router";
import PopoverForm from "../../../common/components/ui/popover-form";
import { useEffect } from "react";
import { useState } from "react";

export default function RoomPage() {
    const [open, setOpen] = useState(false);
    const [concern, setConcern] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [message, setMessage] = useState('')
    const [isReceiving, setIsReceiving] = useState(false)
    const [notifications, setNotifications] = useState<string[]>([])
    const [showSuccess, setShowSuccess] = useState(false);

    const toggleReceiving = () => {
        const newIsReceiving = !isReceiving
        setIsReceiving(newIsReceiving)
        if (newIsReceiving) {
            // 실시간 알림 구독 시작
            startListeningForConcerns()
        }
    }

    useEffect(() => {
        if (isReceiving) {
            startListeningForConcerns()
        }
    }, [isReceiving])

    const startListeningForConcerns = () => {
        // 실제 구현 시 WebSocket이나 Firebase Realtime Database 등으로 구현
        // 여기서는 예시로 setTimeout을 사용
        const interval = setInterval(() => {
            if (isReceiving && notifications.length < 3) {
                const newConcern = "익명의 고민이 도착했습니다"
                setNotifications(prev => {
                    const newNotifications = [...prev, newConcern]
                    if (newNotifications.length >= 3) {
                        clearInterval(interval)
                    }
                    return newNotifications
                })
            }
        }, 5000) // 5초마다 새로운 고민 도착

        // 컴포넌트가 언마운트될 때 인터벌 정리
        return () => clearInterval(interval)
    }

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
        <div className="flex">
            <div className="w-full max-w-4xl mx-auto p-8">
                <img src="/public/star-char.png" alt="logo" className="size-50 mx-auto mb-8" />
                <Switch />
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
            <div className="fixed right-0 w-1/4 mt-10">
                <p className="text-center text-white mb-4">사람들의 편지를 수신하고 싶다면 아래 스위치를 켜세요.</p>
                <div className="flex justify-center mt-6">
                    <Switch
                        id="concern-receiving"
                        checked={isReceiving}
                        onCheckedChange={toggleReceiving}
                        className="mr-2"
                    />
                    <label htmlFor="concern-receiving" className="text-white">고민 해결사 일하기</label>
                </div>
            </div>
        </div>
    )
}