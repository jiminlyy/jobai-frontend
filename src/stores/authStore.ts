import { create } from 'zustand';

// 우선 mock으로 처리
export interface AuthUser {
  id: string;
  name: string;
  jobRole: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
}

const mockUser: AuthUser = {
  id: 'u_001',
  name: '사용자이름',
  jobRole: '개발자',
};

export const useAuthStore = create<AuthState>(() => ({
  user: mockUser,
  isAuthenticated: true,
}));
