import type { Route } from "./+types/room-page";
import { getLettersByReceiverId, getLoggedInUserId, getUserById } from "~/features/users/queries";
import { browserClient, makeSSRClient } from "~/supa-client";
import PopoverForm from "~/common/components/ui/popover-form";
import { Form, useFetcher, useRevalidator } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { Switch } from "~/common/components/ui/switch";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/common/components/ui/hover-card";
import { AlertCircleIcon, ChevronDown, ChevronUp } from "lucide-react";
import { StarWithLetter } from "../components/star-with-letter";
import { getRandomActiveReceiverIds } from "../queries";
import { sendLetter, sendLetterAnswer } from "../mutations";
import { Button } from "~/common/components/ui/button";
import type { Database } from "~/supa-client";
import { Alert, AlertDescription } from "~/common/components/ui/alert";
import { z } from "zod";

const formSchema = z.object({
    answer: z.string().min(1).max(10),
});

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

export const action = async ({ request }: Route.ActionArgs) => {    
    const { client } = await makeSSRClient(request);
    const userId = await getLoggedInUserId(client);
    
    const formData = await request.formData();
    const intent = formData.get('intent') as string;
    
    if (intent === 'send-letter') {        
        try {
            const title = formData.get('title') as string;
            const content = formData.get('content') as string;
            
            const receiverIds = await getRandomActiveReceiverIds(client, 5, userId, null);
            
            if (receiverIds.length === 0) {
                console.warn("준비된 고민 해결사가 없습니다");
                return {
                    ok: false, 
                    actionErrors: {
                        receivers: "준비된 고민 해결사가 없습니다", 
                    },
                    intent: "send-letter",
                };
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
            return {
                ok: true,
                actionErrors: null,
                intent: "send-letter"
            };
        } catch (sendError: any) {
            // sendLetter나 getRandomActiveReceiverIds에서 발생한 에러를 여기서 캐치합니다.
            console.error("ACTION: Error during send-letter process:", sendError); // ★ 추가/확인: 상세 에러 출력
            return { 
                ok: false, 
                actionErrors: {
                    sending: `편지 전달 중 오류 발생: ${sendError.message || sendError}`
                }, 
                intent: "send-letter",
            };
        }
    } else if (intent === 'update-isActive') {
        const isActiveString = formData.get('is_active_status');
        
        if (isActiveString === null) {
            return { 
                ok: false, 
                actionErrors: {
                    active: "is_active_status 값이 전달되지 않았습니다"
                }, 
                intent: "update-isActive",
            };
        }
        
        const newIsActive = isActiveString === "on";
        
        const { data, error, count } = await client
            .from("profiles")
            .update({ is_active: newIsActive })
            .eq("profile_id", userId);
        
        if (error) {
            return { 
                ok: false, 
                actionErrors: {
                    updateActive: "프로필 활성화 상태 업데이트에 실패했습니다"
                }, 
                intent: "update-isActive",
            };
        }
        // count 속성을 사용하여 영향을 받은 행의 개수를 확인합니다.
        // count는 null이거나 숫자가 될 수 있습니다.
        if (count === 0) {
            return { 
                ok: false, 
                actionErrors: {
                    updateActive: "프로필 활성화 상태 업데이트에 실패했습니다 (영향 받은 행 없음)"
                }, 
                intent: "update-isActive",
            };
        }
        
        return { 
            ok: true, 
            actionErrors: null,
            intent: "update-isActive"
        };
    } else if (intent === 'answer-letter') {
        const letterId = formData.get('letter_id') as unknown as number;
        const {success, data, error} = formSchema.safeParse(Object.fromEntries(formData));
        if (!userId) {
            console.log("로그인 사용자만");
            return { 
                ok: false, 
                actionErrors: {
                    login: "로그인이 필요합니다"
                }, 
                intent: "answer-letter",
            };
        }
        if (!success) {
            return {
                ok: false,
                actionErrors: {
                    answer: `답변 내용이 올바르지 않습니다\n(Error: ${error.flatten().fieldErrors.answer})`
                },
                intent: "answer-letter",
            };
        }
        try {
            // throw new Error("test");
            await sendLetterAnswer(client, {
                letterId: letterId,
                responderId: userId,
                content: data.answer,
            });
        } catch (sendingAnswerError: any) {
            console.error("ACTION: 편지 전송 에러:", sendingAnswerError);
            return { 
                ok: false, 
                actionErrors: {
                    sendingAnswer: `편지 답변 중 오류 발생: ${sendingAnswerError.message || sendingAnswerError}`
                }, 
                intent: "answer-letter",
            };
        }
        
        return { 
            ok: true, 
            actionErrors: null, 
            intent: "answer-letter" 
        };
    }
    
    return { 
        ok: false, 
        actionErrors: {
            request: "알 수 없는 요청입니다"
        },
        intent: "unknown"
    };
};

export default function RoomPage({ loaderData, actionData }: Route.ComponentProps) {
    const [open, setOpen] = useState(false);
    const [concern, setConcern] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [message, setMessage] = useState('')
    const [showSuccess, setShowSuccess] = useState(false);

    const [isReceiveOpen, setIsReceiveOpen] = useState(false);

    const [letters, setLetters] = useState(loaderData.letters);

    // 편지 애니메이션 상태 관리
    const STAR_ANIMATE_STATUS_KEY = 'star_animate_status';
    const [starAnimateStatus, setStarAnimateStatus] = useState<{ [key: string]: boolean }>(() => {
        if (typeof window !== 'undefined') {
            const starAnimateStatus = localStorage.getItem(STAR_ANIMATE_STATUS_KEY);
            return starAnimateStatus ? JSON.parse(starAnimateStatus) : {};
        }
        return {};
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STAR_ANIMATE_STATUS_KEY, JSON.stringify(starAnimateStatus));
        }
    }, [starAnimateStatus]);

    const handleStarAnimateComplete = useCallback((letterId: number) => {
        setStarAnimateStatus((prev) => ({ ...prev, [letterId]: true }));
    }, []);

    // 고민 해결사 상태 관리
    const [isActive, setIsActive] = useState<boolean>(loaderData.profile?.is_active ?? false);
    const fetcher = useFetcher();
    const { revalidate } = useRevalidator();

    useEffect(() => {
        if (actionData?.intent === "send-letter") {
            if (actionData.ok) {
                setShowSuccess(true);
            } else {
                setShowSuccess(false);
            }
            setIsSending(false);
        }
        if (fetcher.state === 'idle' && fetcher.data?.intent === "update-isActive") {
            if (fetcher.data.ok) {
                revalidate();
            } else {
                console.error("is_active 상태 업데이트 실패:", fetcher.data.message);
                setIsActive((prevIsActive) => !prevIsActive);
            }
        }
    }, [actionData, fetcher.data, fetcher.state, setIsActive, revalidate, setIsSending, setMessage, setShowSuccess]);

    useEffect(() => {
        setIsActive(loaderData.profile?.is_active ?? false);
    }, [loaderData.profile?.is_active]);

    // 편지 전송
    const handleSubmit = async (e: React.FormEvent) => {
        setIsSending(true)        
    }

    // 구독으로 편지 수신 시 편지 목록 업데이트
    useEffect(() => {
        const changes = browserClient
            .channel(
                `channel:${loaderData.userId}`
            )
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "concern_letters" },
                (payload) => {
                    setLetters((prev) => [
                        ...prev,
                        payload.new as Database["public"]["Tables"]["concern_letters"]["Row"],
                    ]);
                }
            )
            .subscribe();
        return () => {
            changes.unsubscribe();
        };
    }, [loaderData.userId]);

    // 고민 해결사 상태 변경
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
                        setConcern('');
                        setMessage('');
                        setShowSuccess(false);
                    }
                }}
                openChild={
                    <Form method="post" onSubmit={handleSubmit} className="space-y-4 p-4" action="/room">
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
                        <input type="hidden" name="intent" value="send-letter" />
                        <p className="text-center text-gray-600 mt-2">당신의 편지는 익명으로 랜덤한 해결사들에게 전달됩니다.</p>
                        <p className="text-center text-blue-600 mt-2">유저가 없을 경우 편지가 전달되지 않지만 현재 항상 활성화인 테스트 유저를 만들어 놨습니다.</p>
                        {actionData?.actionErrors && "receivers" in actionData?.actionErrors ? (
                            <Alert variant="destructive">
                                <AlertCircleIcon />
                                <AlertDescription>{actionData.actionErrors.receivers}</AlertDescription>
                            </Alert>
                        ) : null}
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
                <div className="flex flex-row items-center bg-gray-200 p-4 h-60 w-screen md:w-300 rounded-t-lg">
                    {letters.map((letter, index) => (
                        <StarWithLetter
                            key={index}
                            letter={letter}
                            isAnimated={starAnimateStatus[letter.letter_id] || false}
                            onAnimateComplete={() => handleStarAnimateComplete(letter.letter_id)}
                            errorMessage={actionData?.actionErrors ? {
                                answer: actionData.actionErrors.answer,
                                sendingAnswer: actionData.actionErrors.sendingAnswer,
                            } : undefined}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export const shouldRevalidate = () => false;