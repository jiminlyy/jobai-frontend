import { Link } from 'react-router-dom';
import BookmarkButton from '@/components/common/BookmarkButton';
import ScoreGauge from '@/components/common/ScoreGauge';
import type { JobSummary } from '@/types/jobApi';
import { toScrapKey, type Scrap } from '@/types/scrap';

// matchScore === null 시 블러 "??" (JobCard 폴백과 동일 시각). ScoreGauge는 number만 받아
// null 처리가 없어(= JobCard도 인라인) 여기서 재현. semicircle 규격에 맞춘 최소 복제.
const C = Math.PI * 28;
function BlurScore() {
  return (
    <div className="relative h-14 w-20 flex-shrink-0">
      <svg viewBox="0 0 80 50" className="h-full w-full blur-[2px]">
        <path d="M 12 40 A 28 28 0 0 1 68 40" fill="none" stroke="#E5E7EB" strokeWidth="6" strokeLinecap="round" />
        <path d="M 12 40 A 28 28 0 0 1 68 40" fill="none" stroke="#C4B5FD" strokeWidth="6" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * 0.4} />
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex items-baseline justify-center">
        <span className="text-base font-bold text-app-text">??</span>
        <span className="ml-0.5 text-[10px] text-app-text-muted">점</span>
      </div>
    </div>
  );
}

export default function SearchResultRow({ job }: { job: JobSummary }) {
  const jobId = String(job.id);
  const noScore = job.matchScore === null;

  // 메타 좌측: 값 있는 것만 ' ・ '로 (§4.2 null 안전).
  // TODO(G3): '대기업'(companySize) 응답에 없음 → Phase 2-B. TODO(G4): '신입'(careerLevel) 응답에 없음 → Phase 2-B.
  const meta = [job.employmentType, job.location, job.jobCategory].filter(Boolean);

  // 스크랩 추가 시 낙관적 목록 데이터(JobCard와 동일 방식).
  const scrapOptimistic: Scrap = {
    key: toScrapKey(job.source, job.id),
    source: job.source,
    sourceId: job.id,
    companyName: job.company,
    title: job.title,
    location: job.location,
    employmentType: job.employmentType,
    matchScore: job.matchScore,
    dDay: job.dDay,
    deadline: null,
    scrappedAt: new Date().toISOString(),
  };

  return (
    // TODO(shadow): guestcard 토큰 = Figma 검색행(0 0 7.6px rgba(118,85,255,0.06))과 일치 확인됨.
    // TODO(blue-50 미정의): border #F5F5FF arbitrary(config에 blue-50 없음).
    <Link
      to={`/jobs/${job.source}/${jobId}`}
      className="flex items-center gap-[32px] rounded-lg border border-[#F5F5FF] bg-white p-[20px] shadow-guestcard transition hover:shadow-homecard"
    >
      {noScore ? <BlurScore /> : <ScoreGauge score={job.matchScore as number} variant="semicircle" />}

      <div className="flex min-w-0 flex-1 flex-col gap-[12px]">
        <div className="flex w-full flex-col gap-[4px]">
          <div className="flex w-full items-center justify-between gap-2">
            {/* 제목 — Title 3: 20 SemiBold/-0.4px/#171F29 */}
            <h3 className="line-clamp-2 font-pretendard text-[20px] font-semibold leading-[1.4] tracking-[-0.4px] text-[#171F29]">
              {job.title}
            </h3>
            {/* 스크랩 — Figma 28px. BookmarkButton default(32/20) 근사 */}
            <BookmarkButton source={job.source} sourceId={job.id} optimistic={scrapOptimistic} className="shrink-0" />
          </div>
          {/* 회사명 — Figma 정본 #171F29(제목과 동일, 회색 아님) */}
          <span className="font-pretendard text-[16px] font-medium leading-[1.5] tracking-[-0.32px] text-[#171F29]">
            {job.company}
          </span>
        </div>

        {/* 메타 행 — SubBody 14 Medium/-0.28px/#8995A2 */}
        <div className="flex w-full items-start justify-between gap-2 font-pretendard text-[14px] font-medium leading-[1.5] tracking-[-0.28px] text-[#8995A2]">
          {meta.length > 0 && (
            <span className="min-w-0 truncate">{meta.join(' ・ ')}</span>
          )}
          {/* TODO(D5): 마감일 표기 정본 확인 — Figma는 ~MM/DD 회색, 현행은 D-N(deadlineToDday) 유지 */}
          <span className="shrink-0 text-right">
            {job.dDay === null ? '상시' : `D-${job.dDay}`}
          </span>
        </div>
      </div>
    </Link>
  );
}
