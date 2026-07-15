export interface EmptyScrapProps {
  /** 버튼 클릭 시 실행할 동작 (재사용을 위해 주입). 없으면 버튼 비활성 동작 */
  onAction?: () => void;
  /** 빈 상태 안내 문구 (기본: "아직 스크랩한 공고가 없어요") */
  title?: string;
  /** 버튼 라벨 (기본: "스크랩 하러 가기") */
  actionLabel?: string;
  /** 외부 레이아웃 보정용 클래스 */
  className?: string;
}

/**
 * 스크랩한 공고가 0건일 때 표시하는 공통 빈 상태 컴포넌트.
 * 버튼 동작은 onAction으로 주입받아 홈 카드 / 스크랩 페이지 등에서 재사용한다.
 */
export default function EmptyScrap({
  onAction,
  title = '아직 스크랩한 공고가 없어요',
  actionLabel = '스크랩 하러 가기',
  className = '',
}: EmptyScrapProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-[32px] text-center ${className}`}>
      {/* 장식용 일러스트이므로 alt는 비우고 aria-hidden 처리 */}
      {/* TODO(F8): 아이콘 h-16 w-16(64×64)이 Figma DeadlineCard 실측(54×52.652)과 불일치.
                    EmptyScrap을 ScrapPage(전체 페이지)와 공유 중이라 축소 시 페이지 빈 상태가
                    빈약해질 위험. ScrapPage 빈 상태 Figma 확인 후 통일 필요. */}
      <img src="/noscrap.svg" alt="" aria-hidden="true" className="h-16 w-16 select-none" />

      <div className="flex flex-col items-center gap-[20px]">
        <p className="text-[16px] font-semibold leading-[1.3] tracking-[-0.32px] text-app-text-subtle">
          {title}
        </p>

        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center justify-center rounded-[12px] bg-purple-50 px-[16px] py-[10px] text-[14px] font-semibold tracking-[-0.28px] text-purple-500 transition-colors hover:bg-purple-100"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
