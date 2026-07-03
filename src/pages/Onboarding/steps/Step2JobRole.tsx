import { Dispatch, useEffect } from 'react';
import { OnboardingState, ROLES, Role } from '../types';
import { OnboardingAction } from '../onboardingReducer';

// v2 합본 스와핑 방식(spec v2 §1·§3): 개별 6장 카드가 아니라 "상태별 완성 이미지"
// 4장을 통째로 교체한다. 카드 위치·기울기·겹침·z-index가 모두 이미지 안에 포함되어
// 있으므로 FE는 "상태에 맞는 이미지 한 장 선택 + 클릭 위치 판별"만 담당한다.
// 한글 파일명 URL 인코딩 이슈를 피해 import로만 참조(번들러가 안전한 해시명으로 변환).
import initialCard from '@/assets/onboarding/초기카드.png';
import devSelected from '@/assets/onboarding/개발자선택.png';
import dsnSelected from '@/assets/onboarding/디자이너선택.png';
import plnSelected from '@/assets/onboarding/기획자선택.png';

// 선택된 역할 → 그 역할이 solid로 강조된 합본 이미지.
const SELECTED_IMAGE: Record<Role, string> = {
  developer: devSelected,
  designer: dsnSelected,
  planner: plnSelected,
};

// 프리로드 대상 4장(초기 + 선택 3장).
const ALL_IMAGES = [initialCard, devSelected, dsnSelected, plnSelected];

interface StepProps {
  state: OnboardingState;
  dispatch: Dispatch<OnboardingAction>;
}

export default function Step2JobRole({ state, dispatch }: StepProps) {
  const select = (role: Role) =>
    dispatch({ type: 'SET_FIELD', key: 'jobRole', value: role });

  // 4장 프리로드: 선택 이미지는 초기에 렌더되지 않으므로, 첫 클릭 시 늦게 떠서
  // 깜빡이는 현상 방지(spec v2 §4-2).
  useEffect(() => {
    ALL_IMAGES.forEach((src) => {
      new Image().src = src;
    });
  }, []);

  // 지금 상태에 맞는 이미지 한 장 선택(핵심 로직). 미선택(null)이면 초기카드 =
  // 3장 모두 solid "골라주세요" 신호(spec v2 §3·§6.3의 초기 표시).
  const currentImage =
    state.jobRole === null ? initialCard : SELECTED_IMAGE[state.jobRole];

  return (
    <div className="flex flex-col items-start gap-8 self-stretch">
      {/* 헤더 — Title 1 확정값: 28/600/140%/-0.56px/gray-900 #171F29. */}
      <h2 className="font-pretendard text-[28px] font-semibold leading-[140%] tracking-[-0.56px] text-[#171F29]">
        희망하는 직무를
        <br />
        선택해주세요.
      </h2>

      {/* 합본 카드 컨테이너 — 캔버스 비율 고정(초기카드 514/326 기준). 4장 캔버스가
          1~2% 다르므로(spec v2 §6.1) object-contain으로 흔들림 완화. */}
      <div className="relative w-full self-stretch aspect-[514/326]">
        {/* 상태에 따라 통째로 바뀌는 배경 이미지. 장식이므로 alt 최소화, 클릭은
            위에 얹은 투명 버튼 3개가 받도록 pointer-events-none. */}
        <img
          src={currentImage}
          alt="희망 직무 선택 카드"
          draggable={false}
          className="pointer-events-none h-full w-full select-none object-contain"
        />

        {/* 좌·중·우 3등분 투명 클릭 버튼. 좌우 순서(개발자=왼쪽, 디자이너=가운데,
            기획자=오른쪽)는 4장 모든 상태에서 불변이라 3등분이 가장 강건(spec v2 §4-4).
            상태별 경계 미세조정은 후순위 TODO(spec v2 §6.2). */}
        {ROLES.map(({ key, label }, i) => (
          <button
            key={key}
            type="button"
            onClick={() => select(key)}
            aria-pressed={state.jobRole === key}
            aria-label={`${label} 선택`}
            style={{ left: `${(i * 100) / 3}%` }}
            className="absolute top-0 h-full w-1/3 cursor-pointer border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2"
          />
        ))}
      </div>
    </div>
  );
}
