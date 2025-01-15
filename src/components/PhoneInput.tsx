import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import CountryCodeSelect from './form/CountryCodeSelect';
import PhoneNumberInput from './form/PhoneNumberInput';
import FormError from './form/FormError';
import FormHelperText from './form/FormHelperText';
import FormLabel from './form/FormLabel';

interface PhoneInputProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  disabled?: boolean;
}

export default function PhoneInput({ register, errors, disabled }: PhoneInputProps) {
  return (
    <div>
      <FormLabel htmlFor="phoneNumber" required>
        Phone Number
      </FormLabel>
      <div className="mt-1 flex rounded-md shadow-sm">
        <CountryCodeSelect
          register={register}
          disabled={disabled}
          error={errors.countryCode?.message as string}
        />
        <PhoneNumberInput
          register={register}
          disabled={disabled}
          error={errors.phoneNumber?.message as string}
        />
      </div>
      <FormError error={errors.countryCode?.message as string} />
      <FormError error={errors.phoneNumber?.message as string} />
      <FormHelperText>
        Select country code and enter phone number without leading zeros
      </FormHelperText>
    </div>
  );
}