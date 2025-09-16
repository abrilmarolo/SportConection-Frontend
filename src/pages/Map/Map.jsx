import React from 'react'
import { useAuth } from '../../context/AuthContext';

export function Map() {
  const { isAuthenticated, user } = useAuth();
  
    return(
        <>
            {isAuthenticated ? (
                <div>Map - User: {user.name}</div>
            ) : (
                <div>No Tenes Acceso</div>
            )}
        </>
    );
}

   