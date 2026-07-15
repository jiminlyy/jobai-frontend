import type { JobSummary } from '@/types/jobApi';
import SearchResultRow from './SearchResultRow';

// 검색 결과 1열 리스트 (§6 행 간격 20px). 무한스크롤 sentinel은 호출부(HomePage)가 관리.
export default function SearchResultList({ jobs }: { jobs: JobSummary[] }) {
  return (
    <div className="flex flex-col gap-[20px]">
      {jobs.map((job) => (
        <SearchResultRow key={job.id} job={job} />
      ))}
    </div>
  );
}
