import type { AINewsItem } from '@/data/mockNews';
import newsIcon from '/iconamoon_news-fill.svg';

interface AINewsCardProps {
  news: AINewsItem[];
}

// 우측 chevron (size-24). rotate-180 은 사용처에서 부여.
function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" />
    </svg>
  );
}

export default function AINewsCard({ news }: AINewsCardProps) {
  return (
    // 카드 컨테이너 — height 306 / w-302 / padding 20 / gap 20 / radius 16 + shadow-homecard + bg-card-radial.
    <div className="relative flex h-[306px] w-[302px] flex-col gap-5 rounded-2xl border border-app-primary-soft bg-card-radial p-5 shadow-homecard">
      {/* 헤더 — news아이콘24 + 타이틀 18 SemiBold/-0.36px/black, gap-12. 헤더 chevron 없음. */}
      <div className="flex items-center gap-3">
        <img src={newsIcon} alt="" className="h-6 w-6 flex-shrink-0" />
        <div className="text-[18px] font-semibold leading-[150%] tracking-[-0.36px] text-black">
          IT 한눈에
        </div>
      </div>
      <ul className="flex flex-col">
        {news.map((item, i) => (
          <li
            key={i}
            className={i < news.length - 1 ? 'border-b-[0.7px] border-gray-200' : ''}
          >
            {/* 항목 — px-4 py-12, justify-between, 제목/서브 gap-8 */}
            <div className="flex w-full items-center justify-between gap-1 px-1 py-3">
              <div className="flex min-w-0 flex-col gap-2">
                {/* 항목 제목 — 14 Medium/-0.28px/black — PASS */}
                <div className="truncate text-sm font-medium leading-[150%] tracking-[-0.28px] text-black">
                  {item.title}
                </div>
                {/* 항목 서브 — 12 Regular/-0.24px/gray-600, 불릿 제거 */}
                <div className="truncate text-xs font-normal leading-[150%] tracking-[-0.24px] text-gray-600">
                  {item.summary}
                </div>
              </div>
              {/* 항목 chevron 24 rotate-180 */}
              <ChevronIcon className="h-6 w-6 flex-shrink-0 rotate-180 text-app-text-subtle" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
