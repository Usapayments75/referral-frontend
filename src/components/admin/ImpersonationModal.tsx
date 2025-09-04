import { useState } from 'react';
import { X, AlertTriangle, User } from 'lucide-react';
import { User as UserType } from '../../types';

interface ImpersonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  targetUser: UserType | null;
  isSubmitting?: boolean;
}

export default function ImpersonationModal({
  isOpen,
  onClose,
  onConfirm,
  targetUser,
  isSubmitting = false
}: ImpersonationModalProps) {
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen || !targetUser) return null;

  const handleConfirm = async () => {
    if (!confirmed || isSubmitting) return;
    await onConfirm();
    setConfirmed(false);
  };

  const handleClose = () => {
    setConfirmed(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <h3 className="ml-4 text-lg font-medium text-gray-900">
              Confirm Impersonation
            </h3>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex items-center p-4 bg-blue-50 rounded-lg mb-4">
            <User className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-800">Target User</p>
              <p className="text-sm text-blue-600">{targetUser.full_name}</p>
              <p className="text-xs text-blue-500">{targetUser.email}</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Important Security Notice:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>You will assume this user's identity and permissions</li>
                  <li>All actions will be logged for security audit</li>
                  <li>Session will automatically expire after 2 hours</li>
                  <li>Some dangerous actions are restricted during impersonation</li>
                  <li>You can exit impersonation at any time</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="confirm-checkbox"
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              disabled={isSubmitting}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded disabled:cursor-not-allowed"
            />
            <label htmlFor="confirm-checkbox" className="ml-2 block text-sm text-gray-900">
              I understand the security implications and confirm this impersonation
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!confirmed || isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Starting...
              </div>
            ) : (
              'Start Impersonation'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
