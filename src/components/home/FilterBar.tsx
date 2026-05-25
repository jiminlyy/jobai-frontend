import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { COMPANY_FILTER_OPTIONS, type CompanyFilter } from '@/types/job';

const PLACEHOLDER_CHIPS = ['경력', '직무', '기술'];

const COMPANY_LABEL: Record<CompanyFilter, string> = {
  ALL: '전체',
  PRIVATE: '사기업',
  PUBLIC: '공기업',
};

export default function FilterBar() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [openKey, setOpenKey] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const raw = searchParams.get('companyType');
  const current: CompanyFilter =
    raw === 'PRIVATE' || raw === 'PUBLIC' ? raw : 'ALL';
  const companyActive = current !== 'ALL';

  useEffect(() => {
    if (!openKey) return;
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpenKey(null);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [openKey]);

  const toggle = (key: string) =>
    setOpenKey((prev) => (prev === key ? null : key));

  const selectCompany = (value: CompanyFilter) => {
    const next = new URLSearchParams(searchParams);
    if (value === 'ALL') next.delete('companyType');
    else next.set('companyType', value);
    setSearchParams(next, { replace: true });
    setOpenKey(null);
  };

  const reset = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('companyType');
    setSearchParams(next, { replace: true });
    setOpenKey(null);
  };

  return (
    <div ref={containerRef} className="mb-5 flex items-center gap-2">
      <Chip
        label={COMPANY_LABEL[current]}
        active={companyActive}
        open={openKey === 'company'}
        onClick={() => toggle('company')}
      >
        <ul className="py-1">
          {COMPANY_FILTER_OPTIONS.map(({ value, label }) => (
            <li key={value}>
              <button
                type="button"
                onClick={() => selectCompany(value)}
                className={
                  'w-full px-3 py-2 text-left text-[13px] transition-colors hover:bg-app-hover ' +
                  (current === value
                    ? 'font-semibold text-app-text'
                    : 'text-app-text-muted')
                }
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </Chip>

      {PLACEHOLDER_CHIPS.map((label) => (
        <Chip
          key={label}
          label={label}
          active={false}
          open={openKey === label}
          onClick={() => toggle(label)}
        >
          <div className="px-3 py-2 text-[12px] text-app-text-subtle">
            준비 중인 필터입니다
          </div>
        </Chip>
      ))}

      <button
        type="button"
        onClick={reset}
        className="ml-auto flex items-center gap-1 rounded-full px-3 py-1.5 text-[13px] text-app-text-muted transition-colors hover:bg-app-hover hover:text-app-text"
      >
        <span aria-hidden="true">↻</span>
        초기화
      </button>
    </div>
  );
}

interface ChipProps {
  label: string;
  active: boolean;
  open: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function Chip({ label, active, open, onClick, children }: ChipProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onClick}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={
          'flex items-center gap-1 rounded-full border px-3.5 py-1.5 text-[13px] transition-all ' +
          (active
            ? 'border-app-text bg-app-text font-medium text-white'
            : 'border-app-border bg-app-surface text-app-text-muted hover:border-app-border-strong hover:text-app-text')
        }
      >
        {label}
        <span
          aria-hidden="true"
          className={'text-[10px] transition-transform ' + (open ? 'rotate-180' : '')}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-10 mt-1.5 min-w-[120px] overflow-hidden rounded-lg border border-app-border bg-app-surface shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
          {children}
        </div>
      )}
    </div>
  );
}
