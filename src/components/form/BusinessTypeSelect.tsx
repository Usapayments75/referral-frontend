import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import FormLabel from './FormLabel';
import FormError from './FormError';

interface BusinessTypeSelectProps {
  register: UseFormRegister<any>;
  disabled?: boolean;
  error?: string;
}

export default function BusinessTypeSelect({ register, disabled, error }: BusinessTypeSelectProps) {
  return (
    <div>
      <FormLabel htmlFor="businessType" required>Industry</FormLabel>
      <input
        type="text"
        id="businessType"
        className={`mt-1 block w-full rounded-md border border-black border-opacity-20 shadow-sm focus:border-red-500 focus:ring-red-500 px-3 py-3 text-base ${
          error ? 'border-red-300' : ''
        }`}
        placeholder="Enter your industry"
        {...register('businessType', { required: 'Industry is required' })}
        disabled={disabled}
      />
      <FormError error={error} />
    </div>
  );
}