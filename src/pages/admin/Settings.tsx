import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Settings as SettingsIcon, Plus, Pencil, Trash2, X } from 'lucide-react';
import { settingsService } from '../../services/settingsService';
import { Setting } from '../../types';

interface SettingForm {
    key: string;
    value: string;
}

export default function Settings() {
    const [settings, setSettings] = useState<Setting[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingSetting, setEditingSetting] = useState<Setting | null>(null);
    const [showForm, setShowForm] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<SettingForm>();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await settingsService.getAllSettings();
            setSettings(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch settings');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: SettingForm) => {
        setIsSubmitting(true);
        setError(null);

        try {
            if (editingSetting) {
                await settingsService.updateSetting(editingSetting.key, data.value);
            } else {
                await settingsService.createSetting(data.key, data.value);
            }
            await fetchSettings();
            setShowForm(false);
            setEditingSetting(null);
            reset();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save setting');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (setting: Setting) => {
        setEditingSetting(setting);
        setShowForm(true);
        reset({ key: setting.key, value: setting.value });
    };

    const handleDelete = async (key: string) => {
        if (!window.confirm('Are you sure you want to delete this setting?')) return;

        try {
            await settingsService.deleteSetting(key);
            await fetchSettings();
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete setting');
        }
    };

    if (loading) {
        return (
            <div className="h-48 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Manage system settings and configurations
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <button
                        onClick={() => {
                            setEditingSetting(null);
                            setShowForm(true);
                            reset({ key: '', value: '' });
                        }}
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Setting
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                    {error}
                </div>
            )}

            {showForm && (
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-medium text-gray-900">
                            {editingSetting ? 'Edit Setting' : 'Add New Setting'}
                        </h2>
                        <button
                            onClick={() => {
                                setShowForm(false);
                                setEditingSetting(null);
                            }}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label htmlFor="key" className="block text-sm font-medium text-gray-700">
                                Key
                            </label>
                            <input
                                type="text"
                                id="key"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                                {...register('key', {
                                    required: 'Key is required',
                                    disabled: !!editingSetting
                                })}
                            />
                            {errors.key && (
                                <p className="mt-1 text-sm text-red-600">{errors.key.message}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                                Value
                            </label>
                            <textarea
                                id="value"
                                rows={4}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                                {...register('value', { required: 'Value is required' })}
                            />
                            {errors.value && (
                                <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingSetting(null);
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                                        Saving...
                                    </>
                                ) : (
                                    editingSetting ? 'Update Setting' : 'Add Setting'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Key
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Value
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {settings.map((setting) => (
                            <tr key={setting.key}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {setting.key}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    <div className="max-h-20 overflow-y-auto">
                                        {setting.value}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => handleEdit(setting)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(setting.key)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {settings.length === 0 && (
                            <tr>
                                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No settings found. Add your first setting to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
