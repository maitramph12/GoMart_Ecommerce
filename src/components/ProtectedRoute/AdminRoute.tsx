import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/reducers';
import { isAuthenticated, isAdmin } from '@/utils/auth';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const router = useRouter();
  const authState = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated({ auth: authState })) {
      router.push('/signin');
    } else if (!isAdmin({ auth: authState })) {
      router.push('/');
    }
  }, [authState, router]);

  if (!isAuthenticated({ auth: authState }) || !isAdmin({ auth: authState })) {
    return null;
  }

  return <>{children}</>;
};

export default AdminRoute; 