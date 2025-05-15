'use client';

import { useState } from 'react';
import { addUnregisteredAttendee } from '@/lib/supabase';
import { FaUserPlus } from 'react-icons/fa';

type AddAttendeeFormProps = {
  onAddSuccess: () => void;
};

export default function AddAttendeeForm({ onAddSuccess }: AddAttendeeFormProps) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    const success = await addUnregisteredAttendee(name.trim());
    setIsSubmitting(false);

    if (success) {
      setName('');
      onAddSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full max-w-md">
      <h3 className="text-lg font-medium text-gray-900">エントリーなしを追加</h3>
      <div className="flex space-x-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="氏名"
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          disabled={isSubmitting || !name.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center"
        >
          <FaUserPlus className="mr-2" />
          追加
        </button>
      </div>
    </form>
  );
}