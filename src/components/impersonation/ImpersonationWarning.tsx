import { AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface ImpersonationWarningProps {
  message?: string;
  action?: string;
  className?: string;
}

export default function ImpersonationWarning({ 
  message = "This action is restricted during impersonation for security reasons.",
  action = "the requested action",
  className = ""
}: ImpersonationWarningProps) {
  const { isImpersonating } = useAuthStore();

  if (!isImpersonating) return null;

  return (
    <div className={`bg-yellow-50 border border-yellow-200 rounded-md p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Action Restricted During Impersonation
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              You cannot perform {action} while impersonating another user. 
              {message && (
                <>
                  <br />
                  <span className="font-medium">{message}</span>
                </>
              )}
            </p>
          </div>
          <div className="mt-3 text-xs text-yellow-600">
            Exit impersonation to perform administrative actions.
          </div>
        </div>
      </div>
    </div>
  );
}
