import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function SuccessMessage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Thank you for the Referral!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Your referral has been submitted successfully. We'll review it and get in touch soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}