import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../store/authStore';
import Logo from '../components/Logo';

interface RegisterForm {
	fullName: string;
	emailAddress: string;
	password: string;
	confirmPassword: string;
}

export default function Register() {
	const navigate = useNavigate();
	const register = useAuthStore((state) => state.register);
	const [error, setError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { register: registerField, handleSubmit, watch, formState: { errors, getValues } } = useForm<RegisterForm>();
	const password = watch('password');

	const onSubmit = async (data: RegisterForm) => {
		setIsSubmitting(true);
		setError('');

		try {
			const result = await register(
				data.fullName,
				data.emailAddress,
				data.password,
				data.confirmPassword
			);

			if (result.success) {
				// Navigation will be handled by the auth route
			} else {
				setError(result.message);
			}
		} catch (err) {
			setError('An unexpected error occurred during registration');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<div className="flex justify-center">
					<Logo />
				</div>
				<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
					Create your account
				</h2>
				<p className="mt-2 text-center text-sm text-gray-600">
					Or{' '}
					<Link to="/login" className="font-medium text-red-600 hover:text-red-500">
						sign in to your account
					</Link>
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
							<label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
								Full Name
							</label>
							<div className="mt-1">
								<input
									id="fullName"
									type="text"
									autoComplete="name"
									className="appearance-none block w-full px-3 py-3 border border-black border-opacity-20 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 text-base"
									{...registerField('fullName', { required: 'Full name is required' })}
									disabled={isSubmitting}
								/>
								{errors.fullName && (
									<p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
								)}
							</div>
						</div>

						<div>
							<label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700">
								Email address
							</label>
							<div className="mt-1">
								<input
									id="emailAddress"
									type="email"
									autoComplete="email"
									className="appearance-none block w-full px-3 py-3 border border-black border-opacity-20 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 text-base"
									{...registerField('emailAddress', {
										required: 'Email is required',
										pattern: {
											value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
											message: 'Invalid email address',
										},
									})}
									disabled={isSubmitting}
								/>
								{errors.emailAddress && (
									<p className="mt-1 text-sm text-red-600">{errors.emailAddress.message}</p>
								)}
							</div>
						</div>

						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-700">
								Password
							</label>
							<div className="mt-1">
								<input
									id="password"
									type="password"
									autoComplete="new-password"
									className="appearance-none block w-full px-3 py-3 border border-black border-opacity-20 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 text-base"
									{...registerField('password', {
										required: 'Password is required',
										minLength: {
											value: 8,
											message: 'Password must be at least 8 characters',
										},
									})}
									disabled={isSubmitting}
								/>
								{errors.password && (
									<p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
								)}
							</div>
						</div>

						<div>
							<label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
								Confirm Password
							</label>
							<div className="mt-1">
								<input
									id="confirmPassword"
									type="password"
									autoComplete="new-password"
									className="appearance-none block w-full px-3 py-3 border border-black border-opacity-20 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 text-base"
									{...registerField('confirmPassword', {
										required: 'Please confirm your password',
										validate: (value) => {
											const password = getValues('password');
											return value === password || 'Passwords do not match';
										},
									})}
									disabled={isSubmitting}
								/>
								{errors.confirmPassword && (
									<p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
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
										Registering...
									</div>
								) : (
									'Create Account'
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}