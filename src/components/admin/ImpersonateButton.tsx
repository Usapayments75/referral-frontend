import { useState } from 'react';
import { User } from 'lucide-react';
import { User as UserType } from '../../types';

interface ImpersonateButtonProps {
  user: UserType;
  onImpersonate: (userUuid: string) => Promise<void>;
  disabled?: boolean;
}

export default function ImpersonateButton({ user, onImpersonate, disabled = false }: ImpersonateButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (disabled || loading) return;
    
    setLoading(true);
    try {
      await onImpersonate(user.uuid);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-md transition-colors ${
        disabled || loading
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-purple-100 text-purple-700 hover:bg-purple-200 hover:text-purple-800'
      }`}
      title={`Impersonate ${user.full_name}`}
    >
      <User className="h-4 w-4 mr-1" />
      {loading ? 'Starting...' : 'Log-in As'}
    </button>
  );
}
