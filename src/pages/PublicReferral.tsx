import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import BusinessTypeSelect from '../components/form/BusinessTypeSelect';
import PhoneInput from '../components/PhoneInput';
import { formatPhoneNumber } from '../utils/countryData';
import { submitPublicReferral } from '../services/api/referral';
import SuccessMessage from '../components/referrals/SuccessMessage';
import { MessageCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useContactLink } from '../hooks/useContactLink';

interface ReferralForm {
  businessName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  businessType: string;
  description: string;
  smsConsent: boolean;
}

export default function PublicReferral() {
	const { uuid } = useParams<{ uuid: string }>();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const contactLink = useContactLink();


  const { register, handleSubmit, formState: { errors } } = useForm<ReferralForm>({
    defaultValues: {
      countryCode: '+1',
      smsConsent: false
    }
  });



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
  

  const onSubmit = async (data: ReferralForm) => {
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
        description: `
SMS Consent: ${data.smsConsent ? 'Yes' : 'No'}

Additional Notes:
${data.description || 'None provided'}
        `.trim()
      });
      setSubmitSuccess(true);
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
            <a  href={contactLink}  target="_blank"
              rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">Contact Us</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#0E314F] to-[#9B122C] text-white py-20">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <BusinessTypeSelect
                  register={register}
                  disabled={submitting}
                  error={errors.businessType?.message}
                />
              </div>

              <PhoneInput
                register={register}
                errors={errors}
                disabled={submitting}
              />

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

              <div className="flex items-start space-x-3">
                <div className="flex items-center h-5">
                  <input
                    id="smsConsent"
                    type="checkbox"
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    {...register('smsConsent')}
                    disabled={submitting}
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="smsConsent" className="text-sm text-gray-700">
                    SMS Updates
                  </label>
                  <p className="mt-1 text-sm text-gray-500">
                    I agree to receive SMS messages about my application status and important updates.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center pt-6">
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
         href={contactLink}
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