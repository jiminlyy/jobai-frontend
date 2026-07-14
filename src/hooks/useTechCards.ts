import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/axios';
import { normalizeTechCardsResult } from '@/api/normalizeJob';
import type { RawTechCardsResult, TechCardsResult } from '@/types/jobApi';

// 홈 IT 인사이트 카드 (GET /api/v1/home/tech-cards).
// 인증 불필요·파라미터 없음 → 단순 useQuery. withCredentials 는 전역 설정(axios.ts:35).
// envelope 는 자동 언랩되지 않으므로(axios.ts:39) res.data.result 로 접근.
export function useTechCards() {
  return useQuery<TechCardsResult>({
    queryKey: ['home', 'tech-cards'],
    // 하루 1회 집계성 데이터라 길게. 정책은 조정 가능(명세 §4-1).
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const res = await apiClient.get<{ result: RawTechCardsResult }>(
        '/api/v1/home/tech-cards',
      );
      return normalizeTechCardsResult(res.data.result);
    },
  });
}
