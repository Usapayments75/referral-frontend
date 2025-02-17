import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useContactLink } from '../../hooks/useContactLink';

export default function FloatingContactButton() {
  const contactLink = useContactLink();

  return (
    <a
      href={contactLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-red-600 text-white px-4 py-3 rounded-md shadow-sm shadow-lg hover:bg-red-700 transition-colors duration-200 group"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="font-medium">Get in touch</span>
    </a>
  );
}