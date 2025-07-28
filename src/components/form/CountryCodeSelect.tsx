import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { COUNTRY_CODES } from '../../utils/countryData';

interface CountryCodeSelectProps {
  register: UseFormRegister<any>;
  disabled?: boolean;
  error?: string;
}

export default function CountryCodeSelect({ register, disabled, error }: CountryCodeSelectProps) {
  return (
    <div className="relative">
      <select
        {...register('countryCode', { required: 'Country code is required' })}
        className={`h-full rounded-l-md border-r-0 border-black border-opacity-20 bg-transparent py-3 pl-3 pr-7 text-gray-500 focus:border-red-500 focus:ring-red-500 text-base ${
          error ? 'border-red-300' : ''
        }`}
        disabled={disabled}
      >
        {COUNTRY_CODES.map((country) => (
          <option key={country.code} value={country.dial_code}>
            {country.flag} {country.dial_code}
          </option>
        ))}
      </select>
    </div>
  );
}