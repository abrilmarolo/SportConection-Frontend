import React from 'react'
import { useAuth } from '../../context/AuthContext';
export function Chat() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated ? (
        <div className='min-h-screen m-4'>
          <h1 className='text-2xl '>Soy Chat</h1>
        </div>
      ) : (
        <div className='min-h-screen'>No Tenes Acceso</div>
      )}
    </>
  );
}
