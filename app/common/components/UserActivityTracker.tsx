import { useEffect, useRef } from 'react';
import { getLoggedInUserId } from '~/features/users/queries';
import { browserClient } from '~/supa-client'; // Supabase 클라이언트 경로에 맞게 수정하세요.

export default function UserActivityTracker() {
    const intervalRef = useRef<NodeJS.Timeout | null>(null); // setInterval ID를 저장할 ref

    const updateActivityStatus = async () => {
        // 현재 로그인된 사용자 정보를 가져옵니다.
        const userId = await getLoggedInUserId(browserClient);
        
        if (userId) {
            try {
                // profiles 테이블의 해당 사용자 레코드를 is_active: true, last_active_at: 현재 시간으로 업데이트합니다.
                await browserClient
                .from('profiles')
                .update({
                    is_active: true,
                    last_active_at: new Date().toISOString(),
                })
                .eq('profile_id', userId); // 'profile_id' 컬럼은 profiles 테이블의 사용자 ID 컬럼명에 맞게 변경하세요. (보통 'id' 또는 'user_id'일 수 있습니다.)
                console.log('User active status updated.'); // 개발 시 로그 확인용
            } catch (error) {
                console.error('Error updating user active status:', error);
            }
        }
    };

    useEffect(() => {
        // 컴포넌트가 마운트될 때 (앱 로드 또는 로그인 시) 즉시 한 번 업데이트
        updateActivityStatus();

        // 이후 일정 간격(30초)마다 반복 업데이트
        // 이 `setInterval`이 사용자가 앱을 이용하는 동안 `last_active_at`을 계속 갱신합니다.
        intervalRef.current = setInterval(updateActivityStatus, 30 * 1000); // 30초 = 30000 밀리초

        // 컴포넌트가 언마운트될 때 (예: 앱 닫기, 탭 전환, 로그아웃) 인터벌을 클리어합니다.
        // 이는 메모리 누수를 방지하고, 더 이상 활동하지 않을 때 불필요한 DB 호출을 막습니다.
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
        }};
    }, []); // 빈 의존성 배열 []: 이펙트가 컴포넌트 마운트 시 한 번 실행되고, 언마운트 시 클린업됩니다.

    return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다. 오직 백그라운드 로직만 수행합니다.
}