import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createCondition, CreateConditionRequest } from '@/api/conditions';
import { OnboardingState, ONBOARDED_STORAGE_KEY } from '@/pages/Onboarding/types';

export function useSubmitOnboarding() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (s: OnboardingState) => {
      const payload: CreateConditionRequest = {
        keywords: s.jobTypes,
        locations: s.locations,
        jobTypes: s.jobTypes,
        experience: [s.experience], // 단일값 배열 래핑 (spec §9.3)
        scoreThreshold: s.scoreThreshold,
        notifyEmail: s.notifyEmail,
        slackWebhook: s.slackWebhook,
        discordWebhook: s.discordWebhook,
        isActive: true,
      };
      return createCondition(payload);
    },
    onSuccess: () => {
      // 실제 onboarded 플래그/엔드포인트 도입 전까지의 임시 게이트.
      localStorage.setItem(ONBOARDED_STORAGE_KEY, 'true');
      navigate('/', { replace: true });
    },
  });
}
