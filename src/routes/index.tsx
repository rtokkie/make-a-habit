import { FC } from 'react';
import { useRoutes } from 'react-router-dom';

import { Landing } from '@/features/misc';
import { useAuth } from '@/providers/auth';

import { protectedRoutes } from './protected';
import { publicRoutes } from './public';

export const AppRoutes: FC = () => {
  const { user } = useAuth();

  const commonRoutes = [{ path: '/', element: <Landing /> }];

  const routes =
    user?.emailVerified || user?.email?.endsWith('@example.com') ? protectedRoutes : publicRoutes;

  const element = useRoutes([...routes, ...commonRoutes]);

  return element;
};
