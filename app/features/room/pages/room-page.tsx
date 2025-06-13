import type { Route } from "./+types/room-page";
import { getLettersByReceiverId, getLoggedInUserId, getUserById } from "~/features/users/queries";
import { makeSSRClient } from "~/supa-client";
import PopoverForm from "~/common/components/ui/popover-form";
import { Form } from "react-router";
import { useState } from "react";
import { Switch } from "~/common/components/ui/switch";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/common/components/ui/hover-card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { StarWithLetter } from "../components/star-with-letter";
import { sendLetter, getRandomActiveReceiverIds } from "../queries";
import { Button } from "~/common/components/ui/button";

export const loader = async ({ request }: Route.LoaderArgs) => {
    const { client } = makeSSRClient(request);
    const userId = await getLoggedInUserId(client);
    const profile = await getUserById(client, { id: userId });
    const letters = await getLettersByReceiverId(client, { userId });
    return {
        userId, 
        profile,
        letters,
    };
};

export const action = async ({ request, params }: Route.ActionArgs) => {
    const { client } = await makeSSRClient(request);
    const userId = await getLoggedInUserId(client);

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    const receiverIds = await getRandomActiveReceiverIds(client, 5);

    if (receiverIds.length === 0) {
        // 보낼 수신자가 없는 경우
        console.warn("No active receivers found to send random letter.");
        return { ok: false, message: "No active receivers available." };
    }

    await sendLetter(client, {
        senderId: userId,
        receivers: receiverIds as string[],
        title: title,
        content: content,
        channelId: null,
    });
    console.log(`Letter sent to ${receiverIds.length} random active receiver(s).`);

    return { ok: true, message: "Letter sent successfully to random receivers." };
};

export default function RoomPage({ loaderData }: Route.ComponentProps) {
    const [open, setOpen] = useState(false);
    const [concern, setConcern] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [message, setMessage] = useState('')
    const [showSuccess, setShowSuccess] = useState(false);

    const [isReceiveOpen, setIsReceiveOpen] = useState(false);

    const [letters, setLetters] = useState(loaderData.letters);
    
    

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            // 여기에 실제 서버 API 호출 코드를 추가
            // 예시: await fetch('/api/concerns', { method: 'POST', body: JSON.stringify({ concern }) })            
            setIsSending(true)
            setShowSuccess(true)
        } catch (error) {
            setMessage('고민 전달에 실패했습니다. 다시 시도해주세요.')
        } finally {
            setIsSending(false)
        }
    }

    /*
     * 채널 연결 코드 *
    useEffect(() => {
            const changes = browserClient
                .channel(
                    `room:${userId}-${loaderData.participants[0].profile.profile_id}`
                )
                .on(
                    "postgres_changes",
                    { event: "INSERT", schema: "public", table: "messages" },
                    (payload) => {
                    setMessages((prev) => [
                        ...prev,
                        payload.new as Database["public"]["Tables"]["messages"]["Row"],
                    ]);
                    }
                )
                .subscribe();
            return () => {
                changes.unsubscribe();
            };
        }, [userId, loaderData.participants[0].profile.profile_id]);
     */
    
    return (
        <div className="flex flex-col items-center space-y-40">
            <div className="text-white space-y-4">
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
                    <Form method="post" onSubmit={handleSubmit} className="space-y-4 p-4">
                        <input type="text" name="title" placeholder="제목을 입력해주세요..." className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                        <textarea
                            name="content"
                            placeholder="당신의 고민을 작성해주세요..."
                            onChange={(e) => setConcern(e.target.value)}
                            value={concern}
                            className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            rows={8}
                            required
                        />
                        <Button
                            type="submit"
                            disabled={isSending}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSending ? '전송 중...' : '편지 전달하기'}
                        </Button>
                        <p className="text-center text-gray-600 mt-2">당신의 편지는 익명으로 랜덤한 해결사들에게 전달됩니다.</p>
                    </Form>
                }
                showSuccess={showSuccess}
                successChild={<div className="p-4">편지가 성공적으로 제출되었습니다!</div>}
                title="편지 작성하기"
            />        
            <div className={`flex flex-col items-center fixed bottom-0 transition-transform duration-300 ease-in-out ${isReceiveOpen ? 'translate-y-0' : 'translate-y-[calc(100%-3.5rem)]'}`}>
                <div className="flex items-center justify-center h-10 px-4 gap-4">
                    <button className="px-4 h-full bg-gray-600 hover:bg-gray-500 transition duration-200 rounded-t-md" onClick={() => setIsReceiveOpen((prev) => !prev)}>
                        {isReceiveOpen ? <ChevronDown className="text-white" /> : <ChevronUp className="text-white" />}
                    </button>
                    <div className="flex items-center absolute right-0 bg-gray-200 gap-2" >
                        <p>고민 해결사로 일하기</p>
                        <Switch />
                    </div>
                </div>
                <div className="flex flex-row items-center bg-gray-200 p-4 gap-40 h-60 w-300 rounded-t-lg">
                    {letters.map((letter) => (
                        <StarWithLetter letter={letter} />
                    ))}
                </div>
            </div>
        </div>
    )
}