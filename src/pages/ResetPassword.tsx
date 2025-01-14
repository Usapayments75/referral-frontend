import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import api from '../services/axios';

interface ResetPasswordForm {
  new_password: string;
  confirm_new_password: string;
}

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, watch, formState: { errors } } = useForm<ResetPasswordForm>();
  const password = watch('new_password');

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      setError('Reset token is missing');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await api.post('/users/reset-password', {
        token,
        new_password: data.new_password,
        confirm_new_password: data.confirm_new_password
      });

      if (response.data.status === 'success') {
        navigate('/login', { 
          state: { message: 'Password has been reset successfully. Please log in with your new password.' }
        });
      } else {
        setError(response.data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Invalid Reset Link</h2>
            <p className="mt-2 text-sm text-gray-600">
              This password reset link is invalid or has expired.{' '}
              <Link to="/forgot-password" className="font-medium text-red-600 hover:text-red-500">
                Request a new one
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <KeyRound className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Set new password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Choose a strong password to protect your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1">
                <input
                  id="new_password"
                  type="password"
                  autoComplete="new-password"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                  {...register('new_password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                  })}
                  disabled={isSubmitting}
                />
                {errors.new_password && (
                  <p className="mt-1 text-sm text-red-600">{errors.new_password.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirm_new_password" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <div className="mt-1">
                <input
                  id="confirm_new_password"
                  type="password"
                  autoComplete="new-password"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                  {...register('confirm_new_password', {
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match',
                  })}
                  disabled={isSubmitting}
                />
                {errors.confirm_new_password && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirm_new_password.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Resetting password...
                  </div>
                ) : (
                  'Reset password'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}