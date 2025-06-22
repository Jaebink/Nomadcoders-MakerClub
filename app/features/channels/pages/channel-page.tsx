import type { Route } from "./+types/channel-page";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import { PopoverForm } from "~/common/components/ui/popover-form";
import { useState } from "react";
import { Form, Link } from "react-router";
import { getChannelById } from "../queries";
import { Button } from "~/common/components/ui/button";
import { getRandomActiveReceiverIds } from "~/features/room/queries";
import { sendLetter } from "~/features/room/mutations";
import { addUserToChannel } from "../mutations";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
    const { client } = makeSSRClient(request);
    await getLoggedInUserId(client);
    const channel = await getChannelById(client, Number(params.channelId));
    return { channel };
};

export const action = async ({ request, params }: Route.ActionArgs) => {
    const { client } = await makeSSRClient(request);
    const userId = await getLoggedInUserId(client);

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    
    // 제목 또는 내용이 없는 경우 처리
    if (!title || !content) {
        return { ok: false, message: "제목과 내용을 모두 입력해주세요." };
    }

    // 채널 ID 유효성 검사 및 추출
    const channelIdParam = params.channelId;
    if (!channelIdParam) {
        return { ok: false, message: "채널 ID가 없습니다." };
    }
    const targetChannelId = Number(channelIdParam);
    if (isNaN(targetChannelId)) {
        return { ok: false, message: "유효하지 않은 채널 ID입니다." };
    }

    await addUserToChannel(client, { userId, channelId: targetChannelId });

    const receiverIds = await getRandomActiveReceiverIds(client, 5, userId, Number(params.channelId));
    if (receiverIds.length === 0) {
        console.warn("준비된 고민 해결사가 없습니다.");
        return { ok: false, message: "준비된 고민 해결사가 없습니다."};
    }

    try {
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
            channelId: Number(params.channelId),
        });
    } catch (error) {
        console.error("편지 전달 중 오류 발생:", error);
        return { ok: false, message: "편지 전달 중 오류가 발생했습니다." };
    }

    return { ok: true, message: "편지 전달에 성공했습니다."};
};

export default function ChannelPage({ loaderData }: Route.ComponentProps) {
    const [open, setOpen] = useState(false);
    const [concern, setConcern] = useState('');
    const [message, setMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSending, setIsSending] = useState(false);
    
    const handleSubmit = (e: React.FormEvent) => {
        setIsSending(true)
        setShowSuccess(true);

    }
    return (
        <div className="flex flex-col gap-4 p-4 text-white">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">{loaderData.channel.name}</h1>
                <Button variant="outline" asChild className="text-black">
                    <Link to="/channels">돌아가기</Link>
                </Button>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg">
                <div className="grid grid-cols-3 gap-4">
                    <img src={loaderData.channel.image} className="aspect-[3/2] object-cover rounded-lg bg-gray-500" alt="channel" />
                    <div className="col-span-2">
                        <p className="text-sm">{loaderData.channel.description}</p>
                    </div>
                </div>
                <div className="text-black bg-slate-700 p-10 rounded-lg h-full">
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
                            <Form method="post" onSubmit={handleSubmit} className="space-y-4 p-4">
                                <input type="text" name="title" placeholder="제목을 입력해주세요..." className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                                <textarea
                                    name="content"
                                    placeholder="당신의 편지를 작성해주세요..."
                                    onChange={(e) => setConcern(e.target.value)}
                                    value={concern}
                                    className="text-black w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
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
                            </Form>
                        }
                        showSuccess={showSuccess}
                        successChild={<div className="p-4">편지가 성공적으로 제출되었습니다!</div>}
                        title="채널 참여"
                    />
                </div>
            </div>            
        </div>
    )
}