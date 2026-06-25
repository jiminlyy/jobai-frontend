import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

export default function TopBar() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const q = searchParams.get('q') ?? '';

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const next = new URLSearchParams(searchParams);
    if (value) next.set('q', value);
    else next.delete('q');

    const target = { pathname: '/', search: next.toString() };
    const stayingOnHome = location.pathname === '/';
    navigate(target, { replace: stayingOnHome });
  };

  return (
    <div className="mb-8 flex items-center gap-5">
      <div className="relative h-[48px] w-[716px]">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-app-text-subtle">
          ⌕
        </span>
        <input
          type="text"
          value={q}
          onChange={handleSearchChange}
          placeholder="검색어를 입력하세요"
          className="h-full w-full rounded-[10px] border border-app-border bg-app-surface px-4 pl-10 text-sm text-app-text outline-none transition-colors placeholder:text-app-text-subtle focus:border-app-border-strong"
        />
      </div>
    </div>
  );
}
