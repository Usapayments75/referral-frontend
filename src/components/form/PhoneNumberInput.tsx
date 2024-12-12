import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { phoneNumberValidation } from '../../utils/validation';

interface PhoneNumberInputProps {
  register: UseFormRegister<any>;
  disabled?: boolean;
  error?: string;
}

export default function PhoneNumberInput({ register, disabled, error }: PhoneNumberInputProps) {
  return (
    <input
      type="tel"
      id="phoneNumber"
      placeholder="123456789"
      className={`block w-full flex-1 rounded-r-md border-l-0 border-gray-300 focus:border-red-500 focus:ring-red-500 sm:text-sm ${
        error ? 'border-red-300' : ''
      }`}
      {...register('phoneNumber', phoneNumberValidation)}
      disabled={disabled}
    />
  );
}