import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Settings as SettingsIcon } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../services/axios';

interface SettingsForm {
  facebook_pixel_id: string;
}

export default function UserSettings() {
  const { user, token } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<SettingsForm>();

  useEffect(() => {
    const fetchPixelId = async () => {
      try {
        const response = await api.get('/users/user/get-pixel-id', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.data.status === 'success') {
          setValue('facebook_pixel_id', response.data.data.facebook_pixel_id || '');
        }
      } catch (err) {
        console.error('Failed to fetch pixel ID:', err);
      }
    };

    if (token) {
      fetchPixelId();
    }
  }, [token, setValue]);

  const onSubmit = async (data: SettingsForm) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await api.put('/users/update-pixel-id', 
        { facebook_pixel_id: data.facebook_pixel_id },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.status === 'success') {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.data.message || 'Failed to update Facebook Pixel ID');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <SettingsIcon className="h-6 w-6 text-gray-400" />
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
                Facebook Pixel ID updated successfully
              </div>
            )}

            <div>
              <label htmlFor="facebook_pixel_id" className="block text-sm font-medium text-gray-700">
                Facebook Pixel ID
              </label>
              <input
                type="text"
                id="facebook_pixel_id"
                className="mt-1 block w-full rounded-md border border-black border-opacity-20 shadow-sm focus:border-red-500 focus:ring-red-500 px-3 py-3 text-base"
                placeholder="Enter your Facebook Pixel ID"
                {...register('facebook_pixel_id')}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}