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
      className={`block w-full flex-1 rounded-r-md border-l-0 border-black border-opacity-20 focus:border-red-500 focus:ring-red-500 px-3 py-3 text-base ${
        error ? 'border-red-300' : ''
      }`}
      {...register('phoneNumber', {
        ...phoneNumberValidation,
        required: 'Phone number is required'
      })}
      disabled={disabled}
    />
  );
}