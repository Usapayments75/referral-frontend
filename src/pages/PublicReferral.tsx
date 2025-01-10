import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import BusinessTypeSelect from '../components/form/BusinessTypeSelect';
import PhoneInput from '../components/PhoneInput';
import { formatPhoneNumber } from '../utils/countryData';
import { submitPublicReferral } from '../services/api/referral';
import SuccessMessage from '../components/referrals/SuccessMessage';
import { MessageCircle } from 'lucide-react';

interface ReferralForm {
	businessName: string;
	fullName: string;
	email: string;
	address: string;
	city: string;
	state: string;
	zipCode: string;
	phoneNumber: string;
	countryCode: string;
	businessType: string;
	monthlyVolume: string;
	smsConsent: boolean;
	description: string;
}

const faqs = [
  {
    question: "How Can Merchants Save Up To 100% On Processing Fees?",
    answer: "Our dual pricing program allows you to offset processing fees by passing the cost to your customers as a service charge, letting you save up to 100%"
  },
  {
    question: "What Types of Businesses Do You Work With?",
    answer: "We work with businesses of all sizes across various industries, including retail, restaurants, e-commerce, and service-based businesses."
  },
  {
    question: "How Long Does the Analysis Process Take?",
    answer: "Our analysis process typically takes 24-48 hours. We'll review your current processing statements and provide a detailed savings report."
  }
];

export default function PublicReferral() {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ReferralForm>({
    defaultValues: {
      countryCode: '+1',
      smsConsent: false
    }
  });

  const onSubmit = async (data: ReferralForm) => {
    if (!uuid) return;

    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const formattedPhone = formatPhoneNumber(data.countryCode, data.phoneNumber);
      await submitPublicReferral({
        uuid,
        firstName: data.fullName.split(' ')[0],
        lastName: data.fullName.split(' ').slice(1).join(' '),
        email: data.email,
        company: data.businessName,
        businessType: data.businessType,
        phoneNumber: formattedPhone,
        description: `Monthly Volume: ${data.monthlyVolume}\nAddress: ${data.address}\nCity: ${data.city}\nState: ${data.state}\nZIP: ${data.zipCode}\n\nAdditional Notes: ${data.description}`
      });
      setSubmitSuccess(true);
      reset();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit referral');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitSuccess) {
    return <SuccessMessage />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white py-4 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <img 
            src="https://usapayments.com/wp-content/uploads/2023/03/28facc_76a02a73c8fc4d41b0a72805a254af78_mv2_d_2500_1500_s_2-1.png"
            alt="USA Payments"
            className="h-12"
          />
          <nav className="hidden md:flex space-x-6">
            <a href="#analysis" className="text-gray-600 hover:text-gray-900">Get Free Analysis</a>
            <a href="#faq" className="text-gray-600 hover:text-gray-900">FAQ</a>
            <a href="https://usapayments.com/contact-us/" className="text-gray-600 hover:text-gray-900">Contact Us</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 via-purple-900 to-red-900 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Save Up To 100% On<br />Payment Processing Fees
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Discover how USA Payments can optimize your business's payment systems,<br />
            reduce costs, and boost your bottom line.
          </p>
          <a 
            href="#analysis"
            className="inline-block bg-white text-blue-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Your Free Analysis Now
          </a>
        </div>
      </section>

      {/* Analysis Form Section */}
      <section id="analysis" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Request A Free Payment<br />Processing Analysis
          </h2>
          
          <div className="bg-white rounded-lg shadow-xl p-8">
		  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                  Business Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="businessName"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  {...register('businessName', { required: 'Business name is required' })}
                  disabled={submitting}
                />
                {errors.businessName && (
                  <p className="mt-1 text-sm text-red-600">{errors.businessName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Full Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  {...register('fullName', { required: 'Full name is required' })}
                  disabled={submitting}
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  disabled={submitting}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Street Address<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    {...register('address', { required: 'Address is required' })}
                    disabled={submitting}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    {...register('city', { required: 'City is required' })}
                    disabled={submitting}
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                    State<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="state"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    {...register('state', { required: 'State is required' })}
                    disabled={submitting}
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                    ZIP Code<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    {...register('zipCode', { 
                      required: 'ZIP code is required',
                      pattern: {
                        value: /^\d{5}(-\d{4})?$/,
                        message: 'Please enter a valid ZIP code'
                      }
                    })}
                    disabled={submitting}
                  />
                  {errors.zipCode && (
                    <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
                  )}
                </div>
              </div>

              <BusinessTypeSelect
                register={register}
                disabled={submitting}
                error={errors.businessType?.message}
              />

              <PhoneInput
                register={register}
                errors={errors}
                disabled={submitting}
              />

              <div>
                <label htmlFor="monthlyVolume" className="block text-sm font-medium text-gray-700">
                  Monthly Processing Volume<span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="text"
                    id="monthlyVolume"
                    className="pl-7 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    placeholder="0.00"
                    {...register('monthlyVolume', { 
                      required: 'Monthly processing volume is required',
                      pattern: {
                        value: /^\d+(\.\d{0,2})?$/,
                        message: 'Please enter a valid amount'
                      }
                    })}
                    disabled={submitting}
                  />
                </div>
                {errors.monthlyVolume && (
                  <p className="mt-1 text-sm text-red-600">{errors.monthlyVolume.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Additional Notes
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  {...register('description')}
                  disabled={submitting}
                />
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="smsConsent"
                    type="checkbox"
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    {...register('smsConsent')}
                    disabled={submitting}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="smsConsent" className="font-medium text-gray-700">
                    SMS Consent
                  </label>
                  <p className="text-gray-500">
                    I agree to receive SMS messages about my application status.
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                      Submitting...
                    </>
                  ) : (
                    'Get Your Free Analysis Now'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="bg-gray-50 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Your Questions, Answered
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <button
                  onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                >
                  <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                  <span className={`transform transition-transform ${openFAQ === index ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                <div className={`px-6 py-4 bg-gray-50 transition-all duration-200 ${openFAQ === index ? 'block' : 'hidden'}`}>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 text-sm text-gray-500">
            <a href="https://usapayments.com/terms-and-conditions/" className="hover:text-gray-900">Terms and Conditions</a>
            <a href="https://usapayments.com/privacy-policy/" className="hover:text-gray-900">Privacy Policy</a>
            <a href="https://usapayments.com/privacy-policy/" className="hover:text-gray-900">Cookies</a>
          </div>
          <div className="text-sm text-gray-500 mt-4 md:mt-0">
            Copyright © {new Date().getFullYear()} USA Payments, All rights reserved.
          </div>
        </div>
      </footer>
	  <a
        href="https://usapayments.com/contact-us/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-blue-900 text-white px-4 py-3 rounded-md shadow-lg hover:bg-blue-800 transition-colors duration-200"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="font-medium">Get in touch</span>
      </a>
    </div>
  );
}