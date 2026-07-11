import type { JobLlmSummary } from '@/types/jobApi';

interface AiSummaryCardProps {
  summary: JobLlmSummary;
}

// 요약 완료 상태의 표시용 카드 — 4개 그룹. 빈 배열 그룹은 숨긴다.
// 버튼/로딩/에러 상태는 부모(JobSummarySection)가 관리.
export default function AiSummaryCard({ summary }: AiSummaryCardProps) {
  const groups: { label: string; items: string[]; chip?: boolean }[] = [
    { label: '기술 스택', items: summary.techStack, chip: true },
    { label: '주요 업무', items: summary.responsibilities },
    { label: '자격 요건', items: summary.qualifications },
    { label: '우대 사항', items: summary.preferredQualifications },
  ];

  return (
    <div
      className="flex w-full flex-col items-start gap-5 self-stretch rounded-2xl border border-blue-100 p-5 shadow-[0_0_15.2px_0_rgba(118,85,255,0.12)]"
      style={{
        background:
          'radial-gradient(37.08% 60.83% at 96.7% 14.54%, rgba(115,84,255,0.07) 2.34%, rgba(255,255,255,0.07) 100%), #FFF',
      }}
    >
      <div className="flex items-center gap-2">
        <img src="/star.svg" alt="" aria-hidden className="h-6 w-6" />
        <h3 className="font-pretendard text-[20px] font-semibold leading-[140%] tracking-[-0.4px] text-black">
          AI 공고 요약
        </h3>
      </div>

      {groups
        .filter((g) => g.items.length > 0)
        .map((g) => (
          <div key={g.label} className="flex w-full flex-col gap-2">
            <div className="text-sm font-semibold text-app-text">{g.label}</div>
            {g.chip ? (
              <div className="flex flex-wrap gap-2">
                {g.items.map((it) => (
                  <span
                    key={it}
                    className="rounded-md bg-app-primary/10 px-3 py-1 text-xs font-medium text-app-primary"
                  >
                    {it}
                  </span>
                ))}
              </div>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {g.items.map((it) => (
                  <li key={it} className="flex gap-2 text-sm text-app-text">
                    <span className="text-app-text-subtle">·</span>
                    <span className="leading-relaxed">{it}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
    </div>
  );
}
