import React, { useState, useEffect } from 'react';
import { Users, AlertCircle, X, Contact } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useForm } from 'react-hook-form';
import api from '../services/axios';

interface Contact {
    uuid: string;
    full_name: string;
    email: string;
    partner_id: string;
    role: string;
    compensation_link: string | null;
    parent_id: string;
}

interface PasswordForm {
    new_password: string;
    confirm_password: string;
}

export default function SubAccounts() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [resettingPassword, setResettingPassword] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const { user } = useAuthStore();

    const { register, handleSubmit, formState: { errors }, watch, reset } = useForm<PasswordForm>();
    const newPassword = watch('new_password');

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                if (!user?.uuid) return;

                const response = await api.get(`/users/user/${user.uuid}/contacts`);
                if (response.data.status === 'success') {
                    setContacts(response.data.data.contacts);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch sub accounts');
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, [user?.uuid]);

    const openPasswordModal = (contact: Contact) => {
        setSelectedContact(contact);
        setShowPasswordModal(true);
        reset(); // Reset form when opening modal
    };

    const closePasswordModal = () => {
        setSelectedContact(null);
        setShowPasswordModal(false);
        reset();
    };

    const handleResetPassword = async (data: PasswordForm) => {
        if (!selectedContact) return;

        try {
            setResettingPassword(selectedContact.partner_id);
            setError(null);
            setSuccessMessage(null);

            const response = await api.put('/users/contacts/update-password', {
                contact_id: selectedContact.partner_id,
                new_password: data.new_password,
                confirm_password: data.confirm_password
            });

            if (response.data.message === 'Password updated successfully.') {
                setSuccessMessage(`Password has been reset successfully for ${selectedContact.full_name}`);
                setTimeout(() => setSuccessMessage(null), 5000);
                closePasswordModal();
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to reset password');
        } finally {
            setResettingPassword(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-2xl font-semibold text-gray-900">Sub Accounts</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Manage your sub accounts and their access
                        </p>
                    </div>
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

                {contacts.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <Users className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No sub accounts</h3>
                        <p className="mt-1 text-sm text-gray-500">You haven't created any sub accounts yet.</p>
                    </div>
                ) : (
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
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {contacts.map((contact) => (
                                    <tr key={contact.uuid}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {contact.full_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {contact.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {contact.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => openPasswordModal(contact)}
                                                disabled={resettingPassword === contact.partner_id}
                                                className="inline-flex items-center px-3 py-1.5 border border-red-600 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {resettingPassword === contact.partner_id ? (
                                                    <>
                                                        <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-t-2 border-b-2 border-red-600 rounded-full"></div>
                                                        Resetting...
                                                    </>
                                                ) : (
                                                    'Reset Password'
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Password Reset Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closePasswordModal} />

                        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                            <div className="absolute top-0 right-0 pt-4 pr-4">
                                <button
                                    onClick={closePasswordModal}
                                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    <span className="sr-only">Close</span>
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Reset Password for {selectedContact?.full_name}
                                    </h3>
                                    <div className="mt-4">
                                        <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-4">
                                            <div>
                                                <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">
                                                    New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    id="new_password"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                                                    {...register('new_password', {
                                                        required: 'New password is required',
                                                        minLength: {
                                                            value: 8,
                                                            message: 'Password must be at least 8 characters'
                                                        }
                                                    })}
                                                />
                                                {errors.new_password && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.new_password.message}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
                                                    Confirm Password
                                                </label>
                                                <input
                                                    type="password"
                                                    id="confirm_password"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                                                    {...register('confirm_password', {
                                                        required: 'Please confirm your password',
                                                        validate: value => value === newPassword || 'Passwords do not match'
                                                    })}
                                                />
                                                {errors.confirm_password && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.confirm_password.message}</p>
                                                )}
                                            </div>

                                            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                                <button
                                                    type="submit"
                                                    disabled={resettingPassword === selectedContact?.partner_id}
                                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                                >
                                                    Reset Password
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={closePasswordModal}
                                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:w-auto sm:text-sm"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}