import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

interface ExitImpersonationButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ExitImpersonationButton({ 
  className = '',
  size = 'md'
}: ExitImpersonationButtonProps) {
  const { isImpersonating, stopImpersonation } = useAuthStore();
  const [isExiting, setIsExiting] = useState(false);

  if (!isImpersonating) return null;

  const handleExit = async () => {
    if (isExiting) return;
    
    setIsExiting(true);
    try {
      const result = await stopImpersonation();
      if (result.success) {
        toast.success('Impersonation ended successfully');
      } else {
        toast.error(result.message || 'Failed to end impersonation');
      }
    } catch (error) {
      console.error('Error ending impersonation:', error);
      toast.error('Failed to end impersonation');
    } finally {
      setIsExiting(false);
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <button
      onClick={handleExit}
      disabled={isExiting}
      className={`inline-flex items-center font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${sizeClasses[size]} ${className}`}
      title="Exit impersonation and return to admin view"
    >
      {isExiting ? (
        <>
          <div className={`animate-spin rounded-full border-b-2 border-red-600 mr-2 ${iconSizes[size]}`}></div>
          Exiting...
        </>
      ) : (
        <>
          <LogOut className={`mr-1 ${iconSizes[size]}`} />
          Exit Impersonation
        </>
      )}
    </button>
  );
}
