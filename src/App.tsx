import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import JobDetailPage from './pages/JobDetailPage';
import ScrapPage from '@/pages/ScrapPage';
import ApplicationStatusPage from '@/pages/ApplicationStatusPage';
import MyPage from '@/pages/MyPage';
import PlaceholderPage from './pages/PlaceholderPage';
import OnboardingPage from '@/pages/Onboarding/OnboardingPage';
import { useOnboardingGate } from '@/hooks/useOnboardingGate';

export default function App() {
  useOnboardingGate();

  return (
    <Routes>
      {/* 온보딩은 사이드바/탑바 없는 전체화면 — MainLayout 밖에 둔다. */}
      <Route path="/onboarding" element={<OnboardingPage />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />

        {/* // 추가해야함 라우트 */}
        <Route path="/application" element={<ApplicationStatusPage />} />
        <Route path="/scrap" element={<ScrapPage />} />
        <Route path="/profile" element={<MyPage />} />
        <Route
          path="/insight"
          element={<PlaceholderPage icon="📊" title="시장 인사이트" />}
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
