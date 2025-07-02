import type { Route } from './+types/home-page';
import { redirect } from 'react-router';
import LoadingButton from '../components/loading-button';
import { getLoggedInUserId } from '~/features/users/queries';
import { makeSSRClient } from '~/supa-client';

export const loader = async ({ request }: Route.LoaderArgs) => {
    const { client } = makeSSRClient(request);
    const userId = await getLoggedInUserId(client);
    if (userId) {
        return redirect('/room');
    }
    return null;
};

export default function HomePage() {
    return (
        <div>
            <div className="flex flex-col items-center text-center">
                <img src="/star-char.png" alt="Maker Club 로고" className="size-48 mb-8" />                                
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-gray-800 p-6 rounded-xl transform transition hover:scale-105">
                        <div className="text-indigo-400 text-4xl mb-4">💭</div>
                        <h3 className="text-xl font-bold text-white mb-2">고민 전달</h3>
                        <p className="text-gray-400">고민을 전달하고 피드백을 받아보세요. 함께 더 나은 해결책을 찾아갑니다.</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl transform transition hover:scale-105">
                        <div className="text-indigo-400 text-4xl mb-4">💼</div>
                        <h3 className="text-xl font-bold text-white mb-2">해결사로 일하기</h3>
                        <p className="text-gray-400">어느 누군가의 고민을 해결해보세요. 해결사로 일하면서 성장해보세요.</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl transform transition hover:scale-105">
                        <div className="text-indigo-400 text-4xl mb-4">🚀</div>
                        <h3 className="text-xl font-bold text-white mb-2">채널 활용</h3>
                        <p className="text-gray-400">내가 찾는 채널에서 고민을 나눠보세요. 더 나은 해결책을 찾아갑니다.</p>
                    </div>
                </div>
                
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-white">여러분의 고민을 해결사들에게 맡겨보시겠어요?</h2>
                    <p className="text-gray-300 text-lg">고민 해결사들이 여러분의 고민을 기다리고 있어요!</p>                    
                    <LoadingButton text="고민 해결사 등록하기" type="link" to='/auth/join' className='w-1/2' />
                </div>
            </div>
        </div>
        
    )
}