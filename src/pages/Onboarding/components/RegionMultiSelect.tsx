import { useState } from 'react';
import { REGION_OPTIONS, REGION_SELECT_OPTIONS, RegionCode } from '../types';

interface RegionMultiSelectProps {
  selected: RegionCode[];
  onChange: (next: RegionCode[]) => void;
}

// 체크박스 한 칸(20px): 선택=/check.svg(파란 체크), 미선택=/onboardblank.svg(회색 빈 박스).
// ⚠️ onboardblank.svg 는 채용형태 전용 onboarduncheck.svg 와 다른 파일 — 혼동 금지.
function CheckBox({ checked }: { checked: boolean }) {
  return (
    <img
      src={checked ? '/check.svg' : '/onboardblank.svg'}
      width={20}
      height={20}
      alt=""
      aria-hidden
    />
  );
}

// 트리거 안에 표시되는 선택 지역 칩: blue/100 배경 + blue/500 텍스트 + X(개별 제거).
// X 클릭은 드롭다운 토글로 전파되지 않도록 stopPropagation.
function RegionChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex w-[60px] items-center gap-[4px] rounded-[8px] bg-[#EBECFF] px-[8px] py-[4px]">
      <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-pretendard text-[14px] font-medium tracking-[-0.28px] text-[#4741FF]">
        {label}
      </span>
      <button
        type="button"
        aria-label={`${label} 선택 해제`}
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="flex shrink-0"
      >
        <img src="/onboardclose.svg" alt="" aria-hidden className="h-4 w-4" />
      </button>
    </span>
  );
}

export default function RegionMultiSelect({
  selected,
  onChange,
}: RegionMultiSelectProps) {
  const [open, setOpen] = useState(false);

  const allSelected = selected.length === REGION_OPTIONS.length;

  const toggleRegion = (region: RegionCode) => {
    if (selected.includes(region)) {
      onChange(selected.filter((r) => r !== region));
    } else {
      onChange([...selected, region]);
    }
  };

  // TODO(백엔드 연동 필요): "전체"의 인코딩 방식(단일 토큰 vs 전 지역 배열)을
  // BE A와 합의 전까지 프론트에서 전 지역 배열로 처리한다.
  const toggleAll = () => {
    onChange(allSelected ? [] : [...REGION_OPTIONS]);
  };

  return (
    <div className="relative flex flex-col gap-2 self-stretch">
      {/* 드롭다운 트리거: 반투명 흰 배경 + 그림자. 선택 지역을 칩으로 표시
          (전체 선택 시 '전체' 칩 1개), 미선택 시 placeholder. 우측 셰브론으로 열고닫음.
          칩 안 X 버튼 때문에 <button> 대신 <div>(중첩 버튼 방지). */}
      <div
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-[48px] cursor-pointer items-center gap-[10px] self-stretch rounded-[12px] bg-white/70 p-[12px] shadow-[0_0_15.2px_rgba(158,158,158,0.2)]"
      >
        <div className="flex flex-1 flex-wrap items-center gap-[10px]">
          {selected.length === 0 ? (
            <span className="font-pretendard text-[16px] text-[#AFB8C2]">
              선택해주세요.
            </span>
          ) : allSelected ? (
            // 전체 선택 → '전체' 칩 1개. X 는 전체 해제.
            <RegionChip label="전체" onRemove={() => onChange([])} />
          ) : (
            selected.map((r) => (
              <RegionChip key={r} label={r} onRemove={() => toggleRegion(r)} />
            ))
          )}
        </div>
        {/* 접힘 = ∨, 펼침 = rotate(180deg) → ^ */}
        <img
          src="/graycheck.svg"
          alt=""
          aria-hidden
          className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </div>

      {/* 펼침 패널(A-3): 테두리 제거 + 그림자, rounded-8, 패널 패딩 0(항목마다 px-12 py-8).
          bg-white 는 드롭다운 표면상 필요해 추가(그림자만으론 투명). */}
      {open && (
        // 오버레이(A-3): absolute로 문서 흐름에서 빼내 아래 섹션을 밀지 않고 위로 덮음.
        // top-full = 트리거 바로 아래, mt-[12px] = Figma gap-12 간격.
        // ❓ TODO: z-50 — 페이지 내 다른 오버레이(현재 LoginModal 등은 fixed 별도 스택)와 충돌 시 조정.
        <div className="absolute left-0 right-0 top-full z-50 mt-[12px] overflow-clip rounded-base bg-white p-0 shadow-[0_0_15.2px_rgba(90,90,90,0.2)]">
          {/* '전체'(좌열 첫 칸) + 17개 지역을 column-major 2열 × 9행으로 배치.
              grid-flow-col + 9행 고정 → 배열 순서대로 좌열을 세로로 채운 뒤 우열.
              (grid-rows-9 는 Tailwind core 미제공 → arbitrary repeat 사용) */}
          <div className="grid grid-flow-col grid-cols-2 grid-rows-[repeat(9,minmax(0,1fr))]">
            {REGION_SELECT_OPTIONS.map((r) => {
              const isAll = r === '전체';
              const checked = isAll ? allSelected : selected.includes(r as RegionCode);
              return (
                // A1: 선택 행 = 파란 블록(bg blue-50 값 + text-blue-500). '전체'도 동일 스타일(D5).
                <label
                  key={r}
                  className={`flex cursor-pointer items-center gap-[10px] rounded-base px-[12px] py-[8px] font-pretendard text-[16px] tracking-[-0.32px] ${
                    checked ? 'bg-[#F5F5FF] text-blue-500' : 'text-gray-500'
                  }`}
                >
                  {/* TODO(token: blue-50): config 정의 시 bg-[#F5F5FF] → bg-blue-50 교체 */}
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => (isAll ? toggleAll() : toggleRegion(r as RegionCode))}
                    className="sr-only"
                  />
                  <CheckBox checked={checked} />
                  {r}
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
