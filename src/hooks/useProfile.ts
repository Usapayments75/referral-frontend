import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export function useProfile() {
  const { refreshProfile } = useAuthStore();

  useEffect(() => {
    refreshProfile();  
  }, [refreshProfile]);
}