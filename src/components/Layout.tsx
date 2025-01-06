import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Copy } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import CopyLinkButton from './ui/CopyLinkButton';
import { getReferralLink } from '../utils/referral';
import Logo from './Logo';

export default function Layout() {
	const { user, logout } = useAuthStore();
	const location = useLocation();
	const navigate = useNavigate();

	useProfile();

	const isActive = (path: string) => location.pathname === path;

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	const handleCompensationClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		if (!user?.compensation_link) {
			e.preventDefault();
			alert('No compensation link available. Please contact an administrator.');
		}
	};

	return (
		<div className="min-h-screen bg-gray-50">
			<nav className="bg-white shadow-sm text-gray-800 p-4">
				<div className="container mx-auto flex justify-between items-center">
					<Link to="/" className="flex items-center space-x-2">
						<Logo />
					</Link>

					<div className="flex items-center space-x-6">
						{user?.role === 'admin' ? (
							<>
								<Link
									to="/admin"
									className={`hover:text-gray-600 ${isActive('/admin') ? 'text-red-600' : ''}`}
								>
									Dashboard
								</Link>
								<Link
									to="/admin/users"
									className={`hover:text-gray-600 ${isActive('/admin/users') ? 'text-red-600' : ''}`}
								>
									Users
								</Link>
								<Link
									to="/admin/tutorials"
									className={`hover:text-gray-600 ${isActive('/admin/tutorials') ? 'text-red-600' : ''}`}
								>
									Tutorials
								</Link>
							</>
						) : (
							<>
								<Link
									to="/dashboard"
									className={`hover:text-gray-600 ${isActive('/dashboard') ? 'text-red-600' : ''}`}
								>
									Dashboard
								</Link> 
								<Link
									to="/tutorials"
									className={`hover:text-gray-600 ${isActive('/tutorials') ? 'text-red-600' : ''}`}
								>
									Tutorials
								</Link>
								{user?.compensation_link ? (
									<a
										href={user.compensation_link}
										target="_blank"
										rel="noopener noreferrer"
										className="hover:text-gray-600"
									>
										My Commissions
									</a>
								) : (
									<button
										onClick={() => alert('No compensation link available. Please contact an administrator.')}
										className="hover:text-gray-600 opacity-50 cursor-not-allowed"
									>
										My Commissions
									</button>
								)}
								{user && (
									<CopyLinkButton link={getReferralLink(user)} />
								)}
								<Link
									target="_blank"
									to="https://usapayments.com/contact-us/"
									className={`hover:text-gray-600 ${isActive('/contact-us') ? 'text-red-600' : ''}`}
								>
									Contact Us
								</Link>
							</>
						)}
						<div className="flex items-center space-x-4 ml-4 pl-4">
						{/* border-gray-200 */}
							{/* <span className="text-sm">{user?.full_name}</span> */}
							<Link
								to="/submit"
								className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
							>
								Submit Referral
							</Link>
						</div>
					</div>
				</div>
			</nav>

			<main className="container mx-auto py-8 px-4">
				<Outlet />
			</main>
		</div>
	);
}