import { useState, useRef } from 'react';
import EditableField from '@/components/mypage/EditableField';
import JobConditionsEditor from '@/components/mypage/JobConditionsEditor';
import { useResumes, useActivateResume, useDeleteResume } from '@/hooks/useResumes';
import { useUploadResume } from '@/hooks/useUploadResume';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

interface UserProfile {
  name: string;
  email: string;
  jobConditions: {
    positions: string[];
    locations: string[];
    experiences: string[];
  };
}

interface ProfileSectionProps {
  user: UserProfile;
  onNameChange: (name: string) => void;
  onJobConditionsChange: (conditions: UserProfile['jobConditions']) => void;
}

export default function ProfileSection({
  user,
  onNameChange,
  onJobConditionsChange,
}: ProfileSectionProps) {
  const [editingJobConditions, setEditingJobConditions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // 이력서: 서버 상태는 TanStack Query 훅으로 관리(B2 기존 패턴). 활성/삭제/업로드
  // 성공 시 각 훅의 onSuccess 가 ['resumes'] 무효화 → isActive 는 서버가 진실.
  const { data: resumeData, isLoading: resumesLoading } = useResumes();
  const upload = useUploadResume(setProgress);
  const activate = useActivateResume();
  const remove = useDeleteResume();

  // 백엔드가 최신순 반환하나 방어적으로 uploadedAt 내림차순 유지.
  const resumes = [...(resumeData ?? [])].sort((a, b) =>
    b.uploadedAt.localeCompare(a.uploadedAt),
  );

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setUploadError(null);
    if (file.type !== 'application/pdf') {
      setUploadError('PDF 파일만 업로드할 수 있어요.');
      return;
    }
    if (file.size > MAX_SIZE) {
      setUploadError('5MB 이하만 업로드할 수 있어요.');
      return;
    }
    setProgress(0);
    // status 로 완료 판정하지 않는다 — 업로드 성공 = 목록 refetch 로 새 이력서를
    // isActive:true 로 다시 받아 표시(훅 onSuccess 의 invalidate).
    upload.mutate(file, {
      onError: () => setUploadError('업로드에 실패했어요. 다시 시도해 주세요.'),
    });
  };

  const handleDelete = (resumeId: number) => {
    // 복구 불가(S3 파일 동반 삭제) — 확인 절차 필수. 공통 모달 없어 window.confirm 대체(B4).
    if (!window.confirm('삭제하면 복구할 수 없어요. 삭제할까요?')) return;
    remove.mutate(resumeId);
  };

  return (
    <div className="space-y-6">
      {/* 프로필 섹션 */}
      <div className="border border-app-border rounded-lg p-6 bg-white">
        <h2 className="font-semibold text-app-text mb-6">프로필</h2>

        <div className="flex items-start gap-4 mb-6 pb-6">
          <img src="/profile-icon.png" alt="프로필" className="w-16 h-16 rounded-full" />
          <div className="flex-1 space-y-4">
            <div className="flex items-center">
              <div className="flex items-center gap-4">
                <div className="text-xs text-app-text-muted min-w-12">이름</div>
                <div className="flex items-center gap-0">
                  <div className="text-sm font-medium text-app-text">{user.name}</div>
                  <EditableField value={user.name} onSave={onNameChange} iconSrc="/edit-icon.png" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-xs text-app-text-muted min-w-12">이메일</div>
              <div className="text-sm text-app-text">{user.email}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 공고 조건 설정 */}
      <div className="border border-app-border rounded-lg p-6 bg-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-1.5">
            <h2 className="font-semibold text-app-text">공고 조건 설정</h2>
            <button
              onClick={() => setEditingJobConditions(!editingJobConditions)}
              className="p-0 hover:opacity-80"
            >
              <img src="/edit-icon.png" alt="수정" className="w-5 h-5" />
            </button>
          </div>
        </div>
 
        {editingJobConditions ? (
          <JobConditionsEditor
            conditions={user.jobConditions}
            onSave={(conditions) => {
              onJobConditionsChange(conditions);
              setEditingJobConditions(false);
            }}
            onCancel={() => setEditingJobConditions(false)}
          />
        ) : (
          <div className="space-y-4">
            {/* 직무 - 가로 */}
            <div className="flex items-center gap-3">
              <div className="text-xs text-app-text-muted min-w-12">직무</div>
              <div className="flex gap-2 flex-wrap">
                {user.jobConditions.positions.map((pos, idx) => (
                  <span key={idx} className="inline-block px-3 py-1 bg-app-primary/10 text-app-primary text-xs rounded-full">
                    {pos} 
                  </span>
                ))}
              </div>
            </div>
 
            {/* 지역 - 가로 */}
            <div className="flex items-center gap-3">
              <div className="text-xs text-app-text-muted min-w-12">지역</div>
              <div className="flex gap-2 flex-wrap">
                {user.jobConditions.locations.map((loc, idx) => (
                  <span key={idx} className="inline-block px-3 py-1 bg-app-primary/10 text-app-primary text-xs rounded-full">
                    {loc} 
                  </span>
                ))}
              </div>
            </div>
 
            {/* 경력 - 드롭다운 */}
            <div className="flex items-center gap-3">
              <div className="text-xs text-app-text-muted min-w-12">경력</div>
              <select className="px-3 py-1.5 border border-app-border rounded text-xs">
                <option>{user.jobConditions.experiences[0]}</option>
                <option>신입</option>
                <option>1년 이상</option>
                <option>3년 이상</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 이력서 관리 */}
      <div className="border border-app-border rounded-lg p-6 bg-white">
        <div className="flex items-center gap-1.5 mb-6">
          <h2 className="font-semibold text-app-text">이력서 관리</h2>
        </div>

        <div className="space-y-3">
          {resumesLoading ? (
            <div className="text-sm text-app-text-muted">불러오는 중...</div>
          ) : resumes.length === 0 ? (
            <div className="text-sm text-app-text-muted">등록된 이력서가 없어요.</div>
          ) : (
            resumes.map((resume) => (
              <div
                key={resume.resumeId}
                className="flex items-center justify-between py-2"
              >
                <div className="flex items-center gap-3">
                  {resume.isActive ? (
                    <img src="/submit-icon.png" alt="활성" className="w-8 h-8" />
                  ) : (
                    <img src="/submit-no-icon.png" alt="비활성" className="w-8 h-8" />
                  )}
                  <div>
                    <div className="text-sm font-medium text-app-text">
                      {resume.originalFilename}
                    </div>
                    {/* fileSize 는 이미 "1.2 MB" 문자열 — 다시 포맷하지 않는다. */}
                    <div className="text-xs text-app-text-muted">
                      {resume.fileSize} · {resume.uploadedAt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* 활성 이력서에는 [활성화] 숨김 — 활성 배지만 표시(자동 비활성화는 서버가 처리). */}
                  {resume.isActive ? (
                    <span className="px-3 py-1.5 text-xs font-semibold rounded bg-app-primary text-white">
                      활성
                    </span>
                  ) : (
                    <button
                      onClick={() => activate.mutate(resume.resumeId)}
                      disabled={activate.isPending}
                      className="px-3 py-1.5 text-xs font-semibold rounded bg-app-bg text-app-text-muted border border-app-border hover:bg-app-hover transition-colors disabled:opacity-50"
                    >
                      활성화
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(resume.resumeId)}
                    disabled={remove.isPending}
                    className="px-3 py-1.5 text-xs font-semibold rounded border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 업로드 진행률 바 (onProgress 0~100) */}
        {upload.isPending && (
          <div className="mt-4 h-1 w-full bg-app-border rounded-full overflow-hidden">
            <div
              className="h-full bg-app-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={upload.isPending}
          className="flex items-center justify-center gap-2 w-full mt-4 py-2 border border-dashed border-app-border rounded text-sm text-app-text-muted hover:bg-app-bg transition-colors disabled:opacity-50"
        >
          <img src="/upload-icon.png" alt="업로드" className="w-3 h-3" />
          <span>{upload.isPending ? '업로드 중...' : 'PDF 업로드'}</span>
        </button>

        {uploadError && <p className="mt-2 text-xs text-red-500">{uploadError}</p>}

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="hidden"
        />
      </div>
    </div>
  );
}