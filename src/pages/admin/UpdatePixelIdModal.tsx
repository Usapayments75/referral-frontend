import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';

interface UpdatePixelIdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { pixelId: string }) => Promise<void>;
  userEmail: string;
  isSubmitting: boolean;
}

interface PixelIdForm {
  pixelId: string;
}

export default function UpdatePixelIdModal({
  isOpen,
  onClose,
  onSubmit,
  userEmail,
  isSubmitting
}: UpdatePixelIdModalProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PixelIdForm>();

  React.useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleFormSubmit = async (data: PixelIdForm) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error updating pixel ID:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Update Facebook Pixel ID
              </h3>
              <div className="mt-4">
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={userEmail}
                      disabled
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 bg-gray-50"
                    />
                  </div>

                  <div>
                    <label htmlFor="pixelId" className="block text-sm font-medium text-gray-700">
                      Facebook Pixel ID
                    </label>
                    <input
                      type="text"
                      id="pixelId"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      {...register('pixelId', {
                        required: 'Facebook Pixel ID is required',
                        pattern: {
                          value: /^\d+$/,
                          message: 'Please enter a valid Pixel ID (numbers only)'
                        }
                      })}
                      disabled={isSubmitting}
                    />
                    {errors.pixelId && (
                      <p className="mt-1 text-sm text-red-600">{errors.pixelId.message}</p>
                    )}
                  </div>

                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                          Updating...
                        </>
                      ) : (
                        'Update Pixel ID'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isSubmitting}
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
  );
}