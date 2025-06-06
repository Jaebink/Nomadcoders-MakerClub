import { Form } from "react-router";
import InputPair from "~/common/components/input-pair";

export default function ChannelCreatePage() {
    return (
        <div className="grid grid-cols-2 gap-4">
            <h1 className="text-2xl font-bold text-white">채널 만들기</h1>
            <Form method="post" className="flex col-span-2">
                <InputPair label="채널 이름" description="채널 이름을 입력해주세요." className="" />
                <InputPair label="채널 이름" description="채널 이름을 입력해주세요." />
                
                
            </Form>
        </div>
    )
}
