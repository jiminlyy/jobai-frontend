import { memo } from 'react';
import type { JobDetail } from '@/types/jobApi';

interface JobInfoProps {
  job: JobDetail;
}

function JobInfo({ job }: JobInfoProps) {
  // deadline null = 상시모집 (목록 카드와 동일 규칙)
  const deadlineText = job.deadline ?? '상시모집';
  // 시작일·모집직무는 소스별 필드 → source 판별로 좁혀 조건부 렌더
  const beginDate = job.source === 'PUBLIC' ? job.beginDate : null;
  const jobRole = job.source === 'PRIVATE' ? job.jobCategory : job.jobRole;

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <h2 className="text-base font-bold text-app-text">{job.company}</h2>
      </div>

      <div className="grid grid-cols-[auto_1fr_auto_1fr] gap-x-8 gap-y-3 text-sm">
        <div className="text-app-text-muted">기업형태</div>
        <div className="text-app-text font-medium">
          {job.source === 'PUBLIC' ? '공기업' : '사기업'}
        </div>

        <div className="text-app-text-muted">접수기간</div>
        <div className="flex flex-col gap-y-1 text-app-text font-medium">
          {beginDate && (
            <div>
              <span className="text-app-text-muted mr-1">시작일</span>
              <span>{beginDate}</span>
            </div>
          )}
          <div>
            <span className="text-app-text-muted mr-1">마감일</span>
            <span>{deadlineText}</span>
          </div>
        </div>

        <div className="text-app-text-muted">고용형태</div>
        <div className="text-app-text font-medium">{job.employmentType || '-'}</div>

        <div className="text-app-text-muted">근무지역</div>
        <div className="text-app-text font-medium">{job.location || '-'}</div>

        {jobRole && (
          <>
            <div className="text-app-text-muted">모집직무</div>
            <div className="text-app-text font-medium">{jobRole}</div>
          </>
        )}
      </div>
    </div>
  );
}

export default memo(JobInfo);
