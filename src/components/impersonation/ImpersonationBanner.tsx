import { useState, useEffect } from 'react';
import { User, X, Clock, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export default function ImpersonationBanner() {
  const { 
    isImpersonating, 
    impersonatedUser, 
    originalAdminUser, 
    impersonationStartTime,
    stopImpersonation 
  } = useAuthStore();
  
  const [timeElapsed, setTimeElapsed] = useState('');
  const [isExiting, setIsExiting] = useState(false);

  // Update elapsed time
  useEffect(() => {
    if (!isImpersonating || !impersonationStartTime) return;

    const updateTime = () => {
      const now = new Date();
      const start = new Date(impersonationStartTime);
      const elapsed = Math.floor((now.getTime() - start.getTime()) / 1000);
      
      const hours = Math.floor(elapsed / 3600);
      const minutes = Math.floor((elapsed % 3600) / 60);
      const seconds = elapsed % 60;
      
      if (hours > 0) {
        setTimeElapsed(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setTimeElapsed(`${minutes}m ${seconds}s`);
      } else {
        setTimeElapsed(`${seconds}s`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isImpersonating, impersonationStartTime]);

  const handleExitImpersonation = async () => {
    if (isExiting) return;
    
    setIsExiting(true);
    try {
      const result = await stopImpersonation();
      if (result.success) {
        toast.success('Impersonation ended successfully');
        // The auth store will handle the redirect back to admin
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

  if (!isImpersonating || !impersonatedUser || !originalAdminUser) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 border-l-4 border-yellow-600 p-4 sticky top-0 z-50 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-yellow-800" />
          </div>
          <div className="ml-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <User className="h-4 w-4 text-yellow-800 mr-1" />
                <span className="text-yellow-900 font-semibold text-sm">
                  Impersonating:
                </span>
                <span className="text-yellow-800 font-bold ml-1">
                  {impersonatedUser.full_name}
                </span>
                <span className="text-yellow-700 text-sm ml-1">
                  ({impersonatedUser.email})
                </span>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-yellow-800 mr-1" />
                <span className="text-yellow-800 text-sm">
                  Duration: {timeElapsed}
                </span>
              </div>
              
              <div className="text-yellow-800 text-sm">
                Admin: {originalAdminUser.full_name}
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleExitImpersonation}
          disabled={isExiting}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm font-medium transition-colors"
        >
          {isExiting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Exiting...
            </>
          ) : (
            <>
              <X className="h-4 w-4 mr-1" />
              Exit Impersonation
            </>
          )}
        </button>
      </div>
      
      {/* Warning message */}
      <div className="mt-2 text-yellow-800 text-xs">
        <AlertTriangle className="h-3 w-3 inline mr-1" />
        You are viewing the portal as this user. All actions are logged. Session expires automatically after 2 hours.
      </div>
    </div>
  );
}
