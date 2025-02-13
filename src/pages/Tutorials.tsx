import React, { useEffect, useState } from 'react';
import { AlertCircle, BookOpen } from 'lucide-react';
import { Tutorial } from '../types';
import { tutorialService } from '../services/tutorialService';

export default function Resources() {
	const [tutorials, setTutorials] = useState<Tutorial[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchTutorials = async () => {
			try {
				const data = await tutorialService.getPublicTutorials();
				setTutorials(data);
				setError(null);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Failed to fetch resources');
			} finally {
				setLoading(false);
			}
		};

		fetchTutorials();
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
			</div>
		);
	}

	if (error || tutorials.length === 0) {
		return (
			<div className="min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
				<BookOpen className="h-12 w-12 text-red-600 mb-4" />
				<h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
					Resources Hub Coming Soon
				</h2>
				<p className="text-lg text-gray-600 text-center max-w-2xl">
					We're building a dedicated resources page to help you get the most out of our portal. Here, you'll find video tutorials, step-by-step guides, and essential resources to understand how to partner with us effectively and use the platform efficiently.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="sm:flex sm:items-center">
				<div className="sm:flex-auto">
					<h1 className="text-2xl font-semibold text-gray-900">Resources</h1>
					<p className="mt-2 text-sm text-gray-700">
						Watch these tutorials to learn how to make the most of the referral program
					</p>
				</div>
			</div>

			{error && (
				<div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center">
					<AlertCircle className="h-5 w-5 text-red-400 mr-2" />
					{error}
				</div>
			)}

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{tutorials.map((tutorial) => (
					<div
						key={tutorial.id}
						className="bg-white overflow-hidden shadow rounded-lg"
					>
						<div className="aspect-w-16 aspect-h-9">
							<iframe
								src={tutorial.video_link}
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
								className="w-full h-full"
							/>
						</div>
						<div className="p-6">
							<h3 className="text-lg font-medium text-gray-900">{tutorial.title}</h3>
							<div
								className="mt-2 text-sm text-gray-500 prose max-w-none"
								dangerouslySetInnerHTML={{ __html: tutorial.description }}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}