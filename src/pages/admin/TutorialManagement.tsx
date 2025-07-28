import { useState, useEffect } from 'react';
import { Video, Plus, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tutorial } from '../../types';
import { tutorialService } from '../../services/tutorialService';
import TutorialForm from './TutorialForm';
import toast from 'react-hot-toast';

export default function TutorialManagement() {
  const navigate = useNavigate();
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTutorial, setEditingTutorial] = useState<Tutorial | null>(null);

  useEffect(() => {
    fetchTutorials();
  }, []);

  const fetchTutorials = async () => {
    try {
      const data = await tutorialService.getAllTutorials();
      setTutorials(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tutorials');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: any) => {
    setIsSubmitting(true);
    try {
      await tutorialService.createTutorial(data);
      await fetchTutorials();
      setShowForm(false);
      setError(null);
      navigate('/admin/tutorials');
      toast.success('Tutorial created successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tutorial');
      toast.error('Failed to create tutorial.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!editingTutorial) return;
    setIsSubmitting(true);
    try {
      await tutorialService.updateTutorial(parseInt(editingTutorial.id), data);
      await fetchTutorials();
      setEditingTutorial(null);
      setError(null);
      navigate('/admin/tutorials');
      toast.success('Tutorial updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update tutorial');
      toast.error('Failed to update tutorial.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this tutorial?')) return;
    
    try {
      await tutorialService.deleteTutorial(parseInt(id));
      await fetchTutorials();
      setError(null);
      toast.success('Tutorial deleted successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete tutorial');
      toast.error('Failed to delete tutorial.');
    }
  };

  if (loading) {
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
          <h1 className="text-2xl font-semibold text-gray-900">Tutorial Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Add and manage tutorial videos for users
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setEditingTutorial(null);
              setShowForm(true);
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Tutorial
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
          {error}
        </div>
      )}

      {(showForm || editingTutorial) && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingTutorial ? 'Edit Tutorial' : 'Add New Tutorial'}
          </h2>
          <TutorialForm
            tutorial={editingTutorial || undefined}
            onSubmit={editingTutorial ? handleUpdate : handleCreate}
            isSubmitting={isSubmitting}
            onCancel={() => {
              setShowForm(false);
              setEditingTutorial(null);
            }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tutorials.map((tutorial) => (
          <div
            key={tutorial.id}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Video className="h-6 w-6 text-red-500" />
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingTutorial(tutorial)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <Pencil className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(tutorial.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900">{tutorial.title}</h3>
              <div 
                className="mt-2 text-sm text-gray-500 prose max-w-none"
                dangerouslySetInnerHTML={{ __html: tutorial.description }}
              />
              <div className="mt-4 flex items-center justify-between">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  tutorial.is_public 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {tutorial.is_public ? 'Public' : 'Private'}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(tutorial.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}