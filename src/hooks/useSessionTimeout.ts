import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

interface UseSessionTimeoutOptions {
  timeoutMinutes?: number;
  warningMinutes?: number;
  onWarning?: () => void;
  onTimeout?: () => void;
}

export function useSessionTimeout({
  timeoutMinutes = 30,
  warningMinutes = 5,
  onWarning,
  onTimeout
}: UseSessionTimeoutOptions = {}) {
  const { logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const resetTimer = () => {
    lastActivityRef.current = Date.now();
    
    // Clear existing timers
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    setShowWarning(false);

    if (!isAuthenticated) return;

    // Set warning timer
    const warningTime = (timeoutMinutes - warningMinutes) * 60 * 1000;
    warningRef.current = setTimeout(() => {
      setShowWarning(true);
      setTimeRemaining(warningMinutes * 60);
      
      // Start countdown
      countdownRef.current = setInterval(() => {
        setTimeRemaining((prev: number) => {
          if (prev <= 1) {
            // Time's up, logout
            if (countdownRef.current) {
              clearInterval(countdownRef.current);
            }
            logout();
            navigate('/login');
            onTimeout?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      onWarning?.();
    }, warningTime);

    // Set logout timer
    const logoutTime = timeoutMinutes * 60 * 1000;
    timeoutRef.current = setTimeout(() => {
      logout();
      navigate('/login');
      onTimeout?.();
    }, logoutTime);
  };

  const handleUserActivity = () => {
    resetTimer();
  };

  const handleExtendSession = () => {
    resetTimer();
  };

  const handleLogoutNow = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    logout();
    navigate('/login');
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    // Set up activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, true);
    });

    // Initial timer setup
    resetTimer();

    // Cleanup function
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningRef.current) {
        clearTimeout(warningRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [isAuthenticated, timeoutMinutes, warningMinutes, logout, navigate, onWarning, onTimeout]);

  return {
    resetTimer,
    lastActivity: lastActivityRef.current,
    showWarning,
    timeRemaining,
    handleExtendSession,
    handleLogoutNow
  };
} 