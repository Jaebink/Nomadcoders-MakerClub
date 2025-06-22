import { HoverCard, HoverCardContent, HoverCardTrigger } from "~/common/components/ui/hover-card";
import type { Route } from "./+types/profile-page";
import { getLoggedInUserId, getUserById, getLettersbySenderId, getAnswers } from "~/features/users/queries";
import { makeSSRClient } from "~/supa-client";

export const loader = async ({ request }: Route.LoaderArgs) => {
    const { client } = makeSSRClient(request);
    const userId = await getLoggedInUserId(client);
    const profile = await getUserById(client, { id: userId });
    const letters = await getLettersbySenderId(client, { userId });
    
    const lettersWithAnswers: (typeof letters[number] & { answers: any[] })[] = []; 
    // 타입 설명을 위해 `letters[number]`를 사용했습니다. 이는 letters 배열 안의 개별 객체 타입을 의미합니다.
    // `answers: any[]`는 각 편지에 추가될 답변 배열입니다.

    if (letters && letters.length > 0) {
        // letters 배열을 순회하면서 각 편지에 대한 답변을 가져옵니다.
        for (const letter of letters) {
            const answers = await getAnswers(client, { letterId: letter.letter_id });
            // 원본 편지 객체에 answers 배열을 추가하여 새로운 객체를 만듭니다.
            lettersWithAnswers.push({
                ...letter, // 기존 편지 객체의 모든 속성을 복사
                answers: answers // 해당 편지의 답변 배열 추가
            });
        }
    }
    return {
        userId,
        profile,
        letters: lettersWithAnswers,
    };
};

export default function ProfilePage({ loaderData }: Route.ComponentProps) {
    return (
        <div className="flex flex-col items-center h-full text-white">
            <h1 className="text-2xl font-bold">프로필</h1>
            <div className="flex flex-row items-center justify-start">
                <div className="flex flex-col items-center space-y-4">
                    <h2 className="text-lg font-bold">내가 보낸 편지</h2>
                    <div className="flex flex-row">
                        {loaderData.letters.map((letter) => (
                            <div key={letter.letter_id}>
                                <HoverCard>
                                    <HoverCardTrigger>
                                        <div className="bg-white rounded-lg py-8 px-12"></div>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="transform -translate-y-full">
                                        <div className="space-y-2">
                                            <h2 className="text-lg">{letter.title}</h2>
                                            <p className="text-sm">{letter.content}</p>
                                        </div>
                                        <div>
                                            <h2>답변</h2>
                                            {letter.answers && letter.answers.length > 0 ? ( // letter.answers로 바로 접근
                                                <ul>
                                                    {letter.answers.map((answer, ansIndex) => (
                                                        <li key={ansIndex}>{answer.response}</li> // response_content는 답변 내용 컬럼명 가정
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>아직 답변이 없습니다.</p>
                                            )}
                                        </div>
                                    </HoverCardContent>
                                </HoverCard>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center space-y-4">
                    <h2 className="text-lg font-bold">별 캐릭터</h2>
                    <img src="/star-char.png" alt="나의 별 캐릭터" className="size-48" />
                </div>
            </div>
        </div>
    )
}