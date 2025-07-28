import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

export function useInactivityTimer() {
  const { logout, isAuthenticated } = useAuthStore();
  const timeoutRef = useRef<number | null>(null);

  const resetTimer = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (isAuthenticated) {
      timeoutRef.current = window.setTimeout(() => {
        logout();
        window.location.href = '/login';
      }, INACTIVITY_TIMEOUT);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    // Reset timer on user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      resetTimer();
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Start the initial timer
    resetTimer();

    // Cleanup function
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isAuthenticated, logout]);

  return { resetTimer };
} 