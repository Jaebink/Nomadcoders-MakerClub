import type { Route } from "./+types/room-page";
import { getLettersByReceiverId, getLoggedInUserId, getUserById } from "~/features/users/queries";
import { browserClient, makeSSRClient } from "~/supa-client";
import PopoverForm from "~/common/components/ui/popover-form";
import { Form, useFetcher, useRevalidator } from "react-router";
import { useEffect, useState } from "react";
import { Switch } from "~/common/components/ui/switch";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/common/components/ui/hover-card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { StarWithLetter } from "../components/star-with-letter";
import { sendLetter, getRandomActiveReceiverIds } from "../queries";
import { Button } from "~/common/components/ui/button";
import type { Database } from "~/supa-client";

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
    const intent = formData.get('intent') as string;

    if (intent === 'send-letter') {
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
    
        const receiverIds = await getRandomActiveReceiverIds(client, 5, userId);
    
        if (receiverIds.length === 0) {
            console.warn("준비된 고민 해결사가 없습니다.");
            return { ok: false, message: "준비된 고민 해결사가 없습니다.", intent: "send-letter" };
        }
    
        await sendLetter(client, {
            senderId: userId,
            receivers: receiverIds.map(receiver => ({
                user_id: receiver.user_id,
                is_active: true,
                seen: false,
                seen_at: null
            })),
            title: title,
            content: content,
            channelId: null,
        });
    
        return { ok: true, message: "편지 전달에 성공했습니다.", intent: "send-letter" };
    } else if (intent === 'update-isActive') {
        const isActiveString = formData.get('is_active_status');

        if (isActiveString === null) {
            return { ok: false, message: "is_active_status 값이 전달되지 않았습니다.", intent: "update-isActive" };
        }

        const newIsActive = isActiveString === "on";

        const { data, error, count } = await client
            .from("profiles")
            .update({ is_active: newIsActive })
            .eq("profile_id", userId);

        console.log("ACTION: Supabase Update Raw Result - data:", data, "error:", error, "count:", count);

        if (error) {
            console.error("Supabase is_active 업데이트 에러:", error);
            return { ok: false, message: "프로필 활성화 상태 업데이트에 실패했습니다.", intent: "update-isActive" };
        }

        // count 속성을 사용하여 영향을 받은 행의 개수를 확인합니다.
        // count는 null이거나 숫자가 될 수 있습니다.
        if (count === 0) {
            console.warn("ACTION: Supabase is_active 업데이트: 영향 받은 행 없음 (DB 변경 없음). userId:", userId, "newIsActive:", newIsActive, "count:", count);
            return { ok: false, message: "프로필 활성화 상태 업데이트에 실패했습니다. (영향 받은 행 없음)", intent: "update-isActive" };
        }
        
        return { ok: true, message: "프로필 활성화 상태가 성공적으로 업데이트되었습니다.", intent: "update-isActive" };
    }

    return { ok: false, message: "알 수 없는 요청입니다.", intent: "unknown" };
};

export default function RoomPage({ loaderData, actionData }: Route.ComponentProps) {
    const [open, setOpen] = useState(false);
    const [concern, setConcern] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [message, setMessage] = useState('')
    const [showSuccess, setShowSuccess] = useState(false);

    const [isReceiveOpen, setIsReceiveOpen] = useState(false);

    const [letters, setLetters] = useState(loaderData.letters);

    const [isActive, setIsActive] = useState<boolean>(loaderData.profile?.is_active ?? false);
    const fetcher = useFetcher();
    const { revalidate } = useRevalidator();

    useEffect(() => {
        if (actionData?.intent === "send-letter") {
            if (actionData.ok) {
                setShowSuccess(true);
            } else {
                setMessage(actionData.message || '고민 전달에 실패했습니다. 다시 시도해주세요.');
            }
            setIsSending(false);
        }
        if (fetcher.state === 'idle' && fetcher.data?.intent === "update-isActive") {
            if (fetcher.data.ok) {
                console.log("is_active 상태 업데이트 성공! loader 재유효화 요청 직전.");
                revalidate();
                console.log("is_active 상태 업데이트 성공! loader 재유효화 요청 완료.");
            } else {
                console.error("is_active 상태 업데이트 실패:", fetcher.data.message);
                setIsActive((prevIsActive) => !prevIsActive);
            }
        }
    }, [actionData, fetcher.data, fetcher.state, setIsActive, revalidate, setIsSending, setMessage, setShowSuccess]);

    useEffect(() => {
        console.log("DEBUG: loaderData.profile?.is_active 변경 감지:", loaderData.profile?.is_active);
        setIsActive(loaderData.profile?.is_active ?? false);
    }, [loaderData.profile?.is_active]);

    const handleSubmit = async (e: React.FormEvent) => {
        setIsSending(true)
    }

    useEffect(() => {
        const changes = browserClient
            .channel(
                `channel:${loaderData.userId}`
            )
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "concern_letters" },
                (payload) => {
                    console.log("DEBUG: New letter received:", payload.new);
                setLetters((prev) => [
                    ...prev,
                    payload.new as Database["public"]["Tables"]["concern_letters"]["Row"],
                ]);
                console.log("DEBUG: New letter received:", payload.new);
                }
            )
            .subscribe();
        return () => {
            console.log("DEBUG: Unsubscribing from channel");
            changes.unsubscribe();
        };
    }, [loaderData.userId]);

    const handleSwitchChange = (checked: boolean) => {
        setIsActive(checked);
        fetcher.submit(
            {
                intent: "update-isActive",
                is_active_status: checked ? "on" : "off",
            },
            { method: "post", action: "/room" }
        );
    };
    
    return (
        <div className="flex flex-col items-center space-y-40">
            <div className="text-white space-y-4">
                <h1 className="md:text-4xl text-2xl font-bold">{loaderData.profile?.name}님 안녕하세요</h1>
                {/* 현재 isActive 상태 표시 (디버깅용) */}
                <p className="text-xl">
                    현재 활동 상태: <span className="font-bold">{isActive ? "활성" : "비활성"}</span>
                </p>
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
                    <fetcher.Form method="post">
                        <div className="flex items-center absolute right-0 bg-gray-200 gap-2" >
                            <p>고민 해결사로 일하기</p>
                            <Switch checked={isActive} onCheckedChange={handleSwitchChange} />
                            <input type="hidden" name="is_active_status" value={isActive ? 'on' : 'off'} />
                            <input type="hidden" name="intent" value="update-isActive" />
                        </div>
                    </fetcher.Form>
                </div>
                <div className="flex flex-row items-center bg-gray-200 p-4 gap-40 h-60 w-300 rounded-t-lg">
                    {letters.map((letter) => (
                        <StarWithLetter key={letter.letter_id} letter={letter} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export const shouldRevalidate = () => false;