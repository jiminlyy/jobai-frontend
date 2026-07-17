import type { CompanyType } from '@/types/job';

/** 공고 출처. JobSummary.source(CompanyType)와 동일 — 재사용(v3 §6-1). */
export type ScrapSource = CompanyType; // 'PUBLIC' | 'PRIVATE'

/** 스크랩 정본 키. scrapId가 아니라 이것을 쓴다 (G8). */
export type ScrapKey = `${ScrapSource}:${number}`;
export const toScrapKey = (source: ScrapSource, sourceId: number): ScrapKey =>
  `${source}:${sourceId}`;

/* ── 서버 원본 (normalize 전) ───────────────────────── */
// S1: GET /api/v1/scraps → result.scraps[] (2026-07-16 실측 반영)
export interface RawScrapItem {
  scrapId: number; // ⚠️ 프론트 미사용 (G8)
  source: ScrapSource;
  sourceId: number;
  companyName: string;
  title: string;
  location: string; // 실측: "서울,인천" 콤마 결합
  employmentType: string; // 실측: "정규직,무기계약직" 콤마 결합
  deadline: string | null; // ✅ 실측: S1도 제공("2026-07-24"). Swagger 예시 누락이었음(G4)
  scrappedAt: string;
  dday: number | null; // ✅ 실측: 소문자. dDay 아님 (G1 확정)
  matchScore?: number | null; // ✅ 실측: S1 제공(56/59/65). optional — 부재 응답 대비
}

// S3: GET /api/v1/scraps/upcoming-deadlines → scraps[]
export interface RawUpcomingScrap {
  scrapId: number;
  source: ScrapSource;
  sourceId: number;
  companyName: string;
  title: string;
  location: string;
  employmentType: string;
  deadline: string;
  scrappedAt: string;
  dday: number | null; // dDay 분기 제거(G1 확정)
  matchScore?: number | null; // optional — upcoming 응답 실측 미확인. ?? null 폴백 안전
}

/* ── 프론트 정규화 모델 ─────────────────────────────── */
export interface Scrap {
  key: ScrapKey;
  source: ScrapSource;
  sourceId: number;
  companyName: string;
  title: string;
  location: string;
  employmentType: string;
  matchScore: number | null; // G9: S1 미제공 → 현재 항상 null. 백엔드 추가 시 자동 반영
  dDay: number | null;
  deadline: string | null; // S1에서는 항상 null (G4)
  scrappedAt: string;
}

// S2 요청/응답
export interface CreateScrapRequest {
  source: ScrapSource;
  sourceId: number;
}
export interface CreateScrapResponse {
  scrapId: number;
}

// 단건 토글 변수 (v2 §5.2 확정본: 추가 시 호출부가 optimistic 데이터 전달)
export interface ToggleScrapVars {
  source: ScrapSource;
  sourceId: number;
  scrapped: boolean; // 현재 스크랩 상태 (true → 취소, false → 추가)
  optimistic?: Scrap; // 추가 시 목록에 낙관적으로 넣을 데이터(카드/행에서 구성)
}
