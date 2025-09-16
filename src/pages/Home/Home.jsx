import React from 'react'  
import { useAuth } from '../../context/AuthContext';
import { PublicHome } from './components/PublicHome';
import { UserHome } from './components/UserHome';

export function Home() {
  const { isAuthenticated, user } = useAuth();

  return isAuthenticated ? <UserHome user={user} /> : <PublicHome />;
}
