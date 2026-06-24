import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ONBOARDED_STORAGE_KEY } from '@/pages/Onboarding/types';

/**
 * 실제 onboarded 플래그/엔드포인트가 도입되기 전까지의 임시 게이트.
 * 홈(`/`)에 진입했는데 온보딩을 마치지 않았다면 `/onboarding` 으로 보낸다.
 */
export function useOnboardingGate() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const onboarded = localStorage.getItem(ONBOARDED_STORAGE_KEY) === 'true';
    if (!onboarded && pathname === '/') {
      navigate('/onboarding', { replace: true });
    }
  }, [pathname, navigate]);
}
