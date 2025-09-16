import React from 'react'
import { useAuth } from '../../context/AuthContext';
export function Match() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated ? (
        <div className='min-h-screen m-4'>
          <h1 className='text-2xl '>Soy Match</h1>
        </div>
      ) : (
        <div>No Tenes Acceso</div>
      )}
    </>
  );
}
