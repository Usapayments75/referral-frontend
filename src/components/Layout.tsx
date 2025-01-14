import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Copy, Menu, X, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import CopyLinkButton from './ui/CopyLinkButton';
import { getReferralLink } from '../utils/referral';
import Logo from './Logo';
import { useContactLink } from '../hooks/useContactLink';

export default function Layout() {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const contactLink = useContactLink();

  useProfile();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm text-gray-800 p-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Logo />
            </Link>

            {/* Mobile menu button */}
            <div className="flex items-center space-x-4 lg:hidden">
              {user?.role === 'user' && (
                <div className="relative">
                  <button
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className="p-2 rounded-md hover:bg-gray-100"
                  >
                    <SettingsIcon className="h-5 w-5" />
                  </button>
                  {isSettingsOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <Link
                          to="/settings"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsSettingsOpen(false)}
                        >
                          Settings
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
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
                  <Link
                    to="/admin/settings"
                    className={`hover:text-gray-600 ${isActive('/admin/settings') ? 'text-red-600' : ''}`}
                  >
                    Settings
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
                    to={contactLink}
                    className={`hover:text-gray-600 ${isActive('/contact-us') ? 'text-red-600' : ''}`}
                  >
                    Contact Us
                  </Link>
                </>
              )}
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-200">
                {user?.role === 'user' && (
                  <div className="relative">
                    <button
                      onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                      className="p-2 rounded-md hover:bg-gray-100"
                      title="Settings"
                    >
                      <SettingsIcon className="h-5 w-5" />
                    </button>
                    {isSettingsOpen && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                          <Link
                            to="/settings"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsSettingsOpen(false)}
                          >
                            Settings
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <Link
                  to="/submit"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Submit Referral
                </Link>
                {user && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Log Out</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'} pt-4`}>
            <div className="flex flex-col space-y-4">
              {user?.role === 'admin' ? (
                <>
                  <Link
                    to="/admin"
                    className={`hover:text-gray-600 ${isActive('/admin') ? 'text-red-600' : ''}`}
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/users"
                    className={`hover:text-gray-600 ${isActive('/admin/users') ? 'text-red-600' : ''}`}
                    onClick={() => setIsOpen(false)}
                  >
                    Users
                  </Link>
                  <Link
                    to="/admin/tutorials"
                    className={`hover:text-gray-600 ${isActive('/admin/tutorials') ? 'text-red-600' : ''}`}
                    onClick={() => setIsOpen(false)}
                  >
                    Tutorials
                  </Link>
                  <Link
                    to="/admin/settings"
                    className={`hover:text-gray-600 ${isActive('/admin/settings') ? 'text-red-600' : ''}`}
                    onClick={() => setIsOpen(false)}
                  >
                    Settings
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    className={`hover:text-gray-600 ${isActive('/dashboard') ? 'text-red-600' : ''}`}
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/tutorials"
                    className={`hover:text-gray-600 ${isActive('/tutorials') ? 'text-red-600' : ''}`}
                    onClick={() => setIsOpen(false)}
                  >
                    Tutorials
                  </Link>
                  {user?.compensation_link ? (
                    <a
                      href={user.compensation_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-gray-600"
                      onClick={() => setIsOpen(false)}
                    >
                      My Commissions
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        alert('No compensation link available. Please contact an administrator.');
                        setIsOpen(false);
                      }}
                      className="hover:text-gray-600 opacity-50 cursor-not-allowed text-left"
                    >
                      My Commissions
                    </button>
                  )}
                  {user && (
                    <div onClick={() => setIsOpen(false)}>
                      <CopyLinkButton link={getReferralLink(user)} />
                    </div>
                  )}
                  <Link
                    target="_blank"
                    to={contactLink}
                    className={`hover:text-gray-600 ${isActive('/contact-us') ? 'text-red-600' : ''}`}
                    onClick={() => setIsOpen(false)}
                  >
                    Contact Us
                  </Link>
                  <Link
                    to="/submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Submit Referral
                  </Link>
                  {user && (
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Log Out</span>
                    </button>
                  )}
                </>
              )}
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