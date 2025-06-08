import { RootState } from '@/store/reducers';

export const isAuthenticated = (state: RootState): boolean => {
  return state.auth.isLoggedIn && !!state.auth.token;
};

export const isAdmin = (state: RootState): boolean => {
  return state.auth.user?.role === 'admin';
};

export const getAuthToken = (state: RootState): string | null => {
  return state.auth.token;
};

export const getCurrentUser = (state: RootState) => {
  return state.auth.user;
}; 