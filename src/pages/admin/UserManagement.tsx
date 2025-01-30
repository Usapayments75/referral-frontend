import React, { useState, useEffect } from 'react';
import { AlertCircle, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { User, PaginationMetadata } from '../../types';
import { userService } from '../../services/userService';
import CompensationLinkModal from './CompensationLinkModal';
import UpdatePasswordModal from './UpdatePasswordModal';
import UpdatePixelIdModal from './UpdatePixelIdModal';
import { useDebounce } from '../../hooks/useDebounce';

const ITEMS_PER_PAGE = 10;

export default function UserManagement() {
	const [users, setUsers] = useState<User[]>([]);
	const [pagination, setPagination] = useState<PaginationMetadata>({
		total: 0,
		totalPages: 0,
		currentPage: 1,
		limit: ITEMS_PER_PAGE
	});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [isCompensationModalOpen, setIsCompensationModalOpen] = useState(false);
	const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
	const [isPixelIdModalOpen, setIsPixelIdModalOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [searchEmail, setSearchEmail] = useState('');
	const debouncedSearchEmail = useDebounce(searchEmail, 500);

	useEffect(() => {
		fetchUsers(pagination.currentPage, debouncedSearchEmail);
	}, [pagination.currentPage, debouncedSearchEmail]);

	const fetchUsers = async (page: number, email: string = '') => {
		try {
			setLoading(true);
			const response = await userService.getAllUsers(page, ITEMS_PER_PAGE, email);
			setUsers(response.data);
			setPagination(response.pagination);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to fetch users');
		} finally {
			setLoading(false);
		}
	};

	const handleUpdatePixelId = async (data: { pixelId: string }) => {
		if (!selectedUser) return;
		setIsSubmitting(true);
		try {
			await userService.updatePixelId(selectedUser.email, data.pixelId);
			setIsPixelIdModalOpen(false);
			setSelectedUser(null);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to update Facebook Pixel ID');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleEditPixelId = (user: User) => {
		setSelectedUser(user);
		setIsPixelIdModalOpen(true);
	};

	const handlePageChange = (page: number) => {
		setPagination(prev => ({ ...prev, currentPage: page }));
	};

	const handleEditLink = (user: User) => {
		setSelectedUser(user);
		setIsCompensationModalOpen(true);
	};

	const handleEditPassword = (user: User) => {
		setSelectedUser(user);
		setIsPasswordModalOpen(true);
	};

	const handleSendPasswordReset = async (user: User) => {
		if (!window.confirm('Are you sure you want to send a password reset email to this user?')) {
			return;
		}

		setIsSubmitting(true);
		try {
			await userService.triggerPasswordReset(user.email);
			setSuccessMessage('Password reset email sent successfully');
			setTimeout(() => setSuccessMessage(null), 5000);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to send password reset email');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleUpdateCompensationLink = async (data: { compensationLink: string }) => {
		if (!selectedUser) return;

		setIsSubmitting(true);
		try {
			const response = await userService.updateCompensationLink(selectedUser.uuid, data.compensationLink);
			if (response) {
				await fetchUsers(pagination.currentPage, searchEmail);
				setIsCompensationModalOpen(false);
				setSelectedUser(null);
				setError(null);
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to update compensation link');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleUpdatePassword = async (data: { newPassword: string; confirmNewPassword: string }) => {
		if (!selectedUser) return;

		setIsSubmitting(true);
		try {
			await userService.updatePassword(
				selectedUser.email,
				data.newPassword,
				data.confirmNewPassword
			);
			setIsPasswordModalOpen(false);
			setSelectedUser(null);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to update password');
		} finally {
			setIsSubmitting(false);
		}
	};

	const renderPaginationButtons = () => {
		const buttons = [];
		const maxVisiblePages = 5;
		let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
		let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

		if (endPage - startPage + 1 < maxVisiblePages) {
			startPage = Math.max(1, endPage - maxVisiblePages + 1);
		}

		buttons.push(
			<button
				key="prev"
				onClick={() => handlePageChange(pagination.currentPage - 1)}
				disabled={pagination.currentPage === 1}
				className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
			>
				<span className="sr-only">Previous</span>
				<ChevronLeft className="h-4 w-4" />
			</button>
		);

		if (startPage > 1) {
			buttons.push(
				<button
					key={1}
					onClick={() => handlePageChange(1)}
					className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
				>
					1
				</button>
			);
			if (startPage > 2) {
				buttons.push(
					<span key="dots1" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
						...
					</span>
				);
			}
		}

		for (let i = startPage; i <= endPage; i++) {
			buttons.push(
				<button
					key={i}
					onClick={() => handlePageChange(i)}
					className={`relative inline-flex items-center px-4 py-2 border ${pagination.currentPage === i
						? 'z-10 bg-red-50 border-red-500 text-red-600'
						: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
						} text-sm font-medium`}
				>
					{i}
				</button>
			);
		}

		if (endPage < pagination.totalPages) {
			if (endPage < pagination.totalPages - 1) {
				buttons.push(
					<span key="dots2" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
						...
					</span>
				);
			}
			buttons.push(
				<button
					key={pagination.totalPages}
					onClick={() => handlePageChange(pagination.totalPages)}
					className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
				>
					{pagination.totalPages}
				</button>
			);
		}

		buttons.push(
			<button
				key="next"
				onClick={() => handlePageChange(pagination.currentPage + 1)}
				disabled={pagination.currentPage === pagination.totalPages}
				className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
			>
				<span className="sr-only">Next</span>
				<ChevronRight className="h-4 w-4" />
			</button>
		);

		return buttons;
	};

	if (loading && users.length === 0) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="sm:flex sm:items-center">
				<div className="sm:flex-auto">
					<h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
					<p className="mt-2 text-sm text-gray-700">
						Manage users and their compensation links
					</p>
				</div>
			</div>

			{/* Search Bar */}
			<div className="relative">
				<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
					<Search className="h-5 w-5 text-gray-400" />
				</div>
				<input
					type="email"
					placeholder="Search by email..."
					value={searchEmail}
					onChange={(e) => setSearchEmail(e.target.value)}
					className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
				/>
			</div>

			{error && (
				<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center">
					<AlertCircle className="h-5 w-5 text-red-400 mr-2" />
					{error}
				</div>
			)}

			{successMessage && (
				<div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md flex items-center">
					<svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
					</svg>
					{successMessage}
				</div>
			)}

			<div className="bg-white shadow rounded-lg overflow-hidden">
				<table className="min-w-full divide-y divide-gray-200">
					<thead className="bg-gray-50">
						<tr>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Name
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Email
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Role
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Compensation Link
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{users.map((user) => (
							<tr key={user.uuid}>
								<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
									{user.full_name}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{user.email}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									<span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin'
										? 'bg-purple-100 text-purple-800'
										: 'bg-green-100 text-green-800'
										}`}>
										{user.role}
									</span>
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									{user.compensation_link ? (
										<a
											href={user.compensation_link}
											target="_blank"
											rel="noopener noreferrer"
											className="text-red-600 hover:text-red-900"
										>
											View Link
										</a>
									) : (
										<span className="text-gray-400">No link set</span>
									)}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
									<div className="flex space-x-4">
										{user.role === 'user' && (
											<>
												<button
													onClick={() => handleEditLink(user)}
													className="text-blue-600 hover:text-blue-900"
												>
													Edit Link
												</button>
												<button
													onClick={() => handleEditPassword(user)}
													className="text-red-600 hover:text-red-900"
												>
													Update Password
												</button>
												<button
													onClick={() => handleSendPasswordReset(user)}
													className="text-orange-600 hover:text-orange-900"
													disabled={isSubmitting}
												>
													Send Reset Link
												</button>
												<button
													onClick={() => handleEditPixelId(user)}
													className="text-green-600 hover:text-green-900"
												>
													Update Pixel ID
												</button>
											</>
										)}
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{pagination.totalPages > 1 && (
					<div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
						<div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
							<div>
								<p className="text-sm text-gray-700">
									Showing <span className="font-medium">{((pagination.currentPage - 1) * pagination.limit) + 1}</span> to{' '}
									<span className="font-medium">
										{Math.min(pagination.currentPage * pagination.limit, pagination.total)}
									</span>{' '}
									of <span className="font-medium">{pagination.total}</span> results
								</p>
							</div>
							<div>
								<nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
									{renderPaginationButtons()}
								</nav>
							</div>
						</div>
					</div>
				)}
			</div>

			<CompensationLinkModal
				isOpen={isCompensationModalOpen}
				onClose={() => {
					setIsCompensationModalOpen(false);
					setSelectedUser(null);
				}}
				onSubmit={handleUpdateCompensationLink}
				currentLink={selectedUser?.compensation_link || ''}
				isSubmitting={isSubmitting}
			/>

			<UpdatePasswordModal
				isOpen={isPasswordModalOpen}
				onClose={() => {
					setIsPasswordModalOpen(false);
					setSelectedUser(null);
				}}
				onSubmit={handleUpdatePassword}
				userEmail={selectedUser?.email || ''}
				isSubmitting={isSubmitting}
			/>
			<UpdatePixelIdModal
				isOpen={isPixelIdModalOpen}
				onClose={() => {
					setIsPixelIdModalOpen(false);
					setSelectedUser(null);
				}}
				onSubmit={handleUpdatePixelId}
				userEmail={selectedUser?.email || ''}
				isSubmitting={isSubmitting}
			/>
		</div>
	);
}