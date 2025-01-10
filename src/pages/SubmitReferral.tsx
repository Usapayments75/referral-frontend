import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/authStore';
import PhoneInput from '../components/PhoneInput';
import BusinessTypeSelect from '../components/form/BusinessTypeSelect';
import { formatPhoneNumber } from '../utils/countryData';
import { zohoService } from '../services/zoho';
import SuccessMessage from '../components/referrals/SuccessMessage';

interface ReferralForm {
	firstName: string;
	lastName: string;
	email: string;
	company: string;
	businessType: string;
	countryCode: string;
	phoneNumber: string;
	description: string;
}

export default function SubmitReferral() {
	const { user } = useAuthStore();
	const [submitting, setSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [submitSuccess, setSubmitSuccess] = useState(false);

	const { register, handleSubmit, reset, formState: { errors } } = useForm<ReferralForm>({
		defaultValues: {
			countryCode: '+1'
		}
	});

	const onSubmit = async (data: ReferralForm) => {
		if (!user) return;

		setSubmitting(true);
		setSubmitError(null);
		setSubmitSuccess(false);

		try {
			const formattedPhone = formatPhoneNumber(data.countryCode, data.phoneNumber);
			await zohoService.submitReferral({
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				company: data.company,
				businessType: data.businessType,
				phoneNumber: formattedPhone,
				title: formattedPhone, // Using phone number as title for now
				description: data.description
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
		<div className="min-h-screen flex flex-col bg-gray-50">
			<div className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-2xl mx-auto">
					<div className="text-center mb-14">
						<img
							src="https://usapayments.com/wp-content/uploads/2023/03/28facc_76a02a73c8fc4d41b0a72805a254af78_mv2_d_2500_1500_s_2-1.png"
							alt="USA Payments"
							className="h-24 mx-auto"
						/>
					</div>
					<div className="bg-white shadow rounded-lg p-8">
						<div className="flex items-center space-x-3 mb-6">
							<Send className="h-6 w-6 text-red-600" />
							<h1 className="text-2xl font-semibold text-gray-900">Submit a Referral</h1>
						</div>

						{submitError && (
							<div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
								{submitError}
							</div>
						)}

						<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
							<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
								<div>
									<label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
										First Name
									</label>
									<input
										type="text"
										id="firstName"
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
										{...register('firstName', { required: 'First name is required' })}
										disabled={submitting}
									/>
									{errors.firstName && (
										<p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
									)}
								</div>

								<div>
									<label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
										Last Name
									</label>
									<input
										type="text"
										id="lastName"
										className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
										{...register('lastName', { required: 'Last name is required' })}
										disabled={submitting}
									/>
									{errors.lastName && (
										<p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
									)}
								</div>
							</div>

							<div>
								<label htmlFor="email" className="block text-sm font-medium text-gray-700">
									Email Address
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

							<div>
								<label htmlFor="company" className="block text-sm font-medium text-gray-700">
									Company
								</label>
								<input
									type="text"
									id="company"
									className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
									{...register('company', { required: 'Company is required' })}
									disabled={submitting}
								/>
								{errors.company && (
									<p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
								)}
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
										'Submit Referral'
									)}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>

			<footer className="mt-auto border-t border-gray-200 bg-white py-4">
				<div className="max-w-7xl mx-auto px-8 sm:px-16 flex justify-between items-center">
					<div className="flex items-center space-x-6 text-sm text-gray-600">
						<a
							href="https://usapayments.com/terms-and-conditions/"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-gray-900"
						>
							Terms and Conditions
						</a>
						<span className="text-gray-300">|</span>
						<a
							href="https://usapayments.com/privacy-policy/"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-gray-900"
						>
							Privacy Policy
						</a>
						<span className="text-gray-300">|</span>
						<a
							href="https://usapayments.com/privacy-policy/"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-gray-900"
						>
							Cookies
						</a>
					</div>
					<div className="text-sm text-gray-600">
						Copyright © 2024 USA Payments, All rights reserved.
					</div>
				</div>
			</footer>
		</div>
	);
}