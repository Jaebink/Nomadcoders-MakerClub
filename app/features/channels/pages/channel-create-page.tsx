import type { Route } from "./+types/channel-create-page"
import { Form, redirect } from "react-router";
import { useState } from "react";
import InputPair from "~/common/components/input-pair";
import { Button } from "~/common/components/ui/button";
import ChannelCard from "../components/channel-card";
import z from "zod";
import { createChannel, addUserToChannel } from "../mutations";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";

const formSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    image: z.instanceof(File).refine((file) => { return file.size <= 2097152 && file.type.startsWith("image/") }, "이미지 파일은 2MB 이하여야 합니다."),
});

export const action = async ({ request }: Route.ActionArgs) => {
    const { client } = makeSSRClient(request);
    const userId = await getLoggedInUserId(client);

    const formData = await request.formData();
    const { success, data, error } = formSchema.safeParse(Object.fromEntries(formData));

    if (!success) {
        return {
            ok: false,
            formError: error.flatten().fieldErrors,
        };
    }
    const { image, ...rest } = data;
    try {
        const { data: uploadData, error: uploadError }  = await client.storage
            .from("channel-imgs")
            .upload(`${userId}/${Date.now()}`, image, {
                contentType: image.type,
                upsert: false,
            });
        if (uploadError) {        
            return {
            ok: false,
            formErrors: { image: "이미지 업로드 실패" },
            };
        }
        const { data: { publicUrl } } = await client.storage.from("channel-imgs").getPublicUrl(uploadData.path);

        const channelId = await createChannel(client, {
            userId,
            name: rest.name,
            description: rest.description,
            imgUrl: publicUrl,
        });

        // channelId가 유효한지 다시 한번 확인 (createChannel 내부에서 에러 처리되어 throw 될 수도 있음)
        if (!channelId) {
            console.error("채널 생성이 실패했으나, 오류가 발생하지 않았습니다 (createChannel 로직 확인 필요).");
            return { ok: false, message: "채널 생성에 실패했습니다." };
        }

        await addUserToChannel(client, { userId, channelId });

        return redirect(`/channels/${channelId}`);
    } catch (error) {
        console.error("채널 생성 및 유저 추가 중 오류 발생:", error);
        return { ok: false, message: `채널 생성 및 유저 추가 중 오류가 발생했습니다. ${error instanceof Error ? error.message : "알 수 없는 오류"}` };
    }
}

export default function ChannelCreatePage({ actionData }: Route.ComponentProps) {
    const [preview, setPreview] = useState<string>("https://placehold.co/600x400");
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    return (
        <div className="grid grid-cols-4 gap-4 bg-slate-700 rounded-lg p-4 text-white">
            <h1 className="grid col-span-4 text-2xl font-bold text-white">채널 만들기</h1>
            <Form method="post" className="grid grid-cols-2 col-span-3 gap-4" encType="multipart/form-data">
                <InputPair id="name" name="name" label="채널 이름" type="text" description="채널 이름을 입력해주세요." placeholder="채널 이름을 입력해주세요." required onChange={(e) => {
                    setName(e.target.value);
                }} />
                <InputPair id="description" name="description" label="채널 설명" type="text" description="채널 설명을 입력해주세요." placeholder="채널 설명을 입력해주세요." required onChange={(e) => {
                    setDescription(e.target.value);
                }} />
                <InputPair id="image" name="image" label="채널 이미지" type="file" description="채널 이미지를 업로드해주세요." required onChange={(e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                        setPreview(URL.createObjectURL(file));
                    }
                }} />
                <Button type="submit" className="w-full">채널 만들기</Button>
                {actionData && "formErrors" in actionData && actionData?.formErrors?.image && (<p className="text-red-500">{actionData.formErrors.image}</p>)}
            </Form>
            <div className="grid col-span-1 gap-4">
                <h1 className="text-white">미리보기</h1>
                <ChannelCard disabled id={1} name={name} description={description} imageUrl={preview} />
            </div>
        </div>
    )
}
