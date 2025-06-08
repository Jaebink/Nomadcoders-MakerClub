import type { Route } from "./+types/channel-page";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import { PopoverForm } from "~/common/components/ui/popover-form";
import { useState } from "react";
import { Form } from "react-router";

export const loader = async ({ request }: Route.LoaderArgs) => {
    const { client } = makeSSRClient(request);
    await getLoggedInUserId(client);
};

export default function ChannelPage() {
    const [open, setOpen] = useState(false);
    const [concern, setConcern] = useState('');
    const [message, setMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowSuccess(true);
    }
    return (
        <div className="flex flex-col gap-4 p-4 text-white">
            <h1 className="text-2xl font-bold">Channel Page</h1>
            <div className="bg-slate-700 p-4 rounded-lg">
                <div className="grid grid-cols-3 gap-4">
                    <img src="https://placehold.co/600x400" className="w-full h-full object-cover rounded-lg" alt="channel" />
                    <div className="col-span-2">
                        <h2 className="text-2xl font-bold">서울 사람들 모임</h2>
                        <p className="text-sm">서울 사람들 여기여기 모여라</p>
                    </div>
                </div>
                <div className="text-black bg-slate-700 p-4 rounded-lg h-full">
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
                            <Form onSubmit={handleSubmit} className="space-y-4 p-4">
                                <textarea
                                    placeholder="당신의 편지를 작성해주세요..."
                                    value={concern}
                                    onChange={(e) => setConcern(e.target.value)}
                                    className="text-black w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                    rows={8}
                                />
                                <button type="submit" disabled={isSending} className="w-full bg-blue-500 text-white p-2 rounded-md">채널에 참여해서 편지 보내기</button>
                            </Form>
                        }
                        showSuccess={showSuccess}
                        successChild={<div className="p-4">편지가 성공적으로 제출되었습니다!</div>}
                        title="채널 참여"
                        width="1000px"
                        height="400px"
                    />
                </div>
            </div>            
        </div>
    )
}