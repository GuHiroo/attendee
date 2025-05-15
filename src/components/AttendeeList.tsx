'use client';

import { useState } from 'react';
import { Attendee, updateAttendeeStatus } from '@/lib/supabase';
import { FaCheck, FaTimes, FaUserAlt } from 'react-icons/fa';

type AttendeeListProps = {
  attendees: Attendee[];
  title: string;
  emptyMessage: string;
  onStatusChange: () => void;
};

export default function AttendeeList({ attendees, title, emptyMessage, onStatusChange }: AttendeeListProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: boolean) => {
    setUpdatingId(id);
    const success = await updateAttendeeStatus(id, newStatus);
    setUpdatingId(null);
    
    if (success) {
      onStatusChange();
    }
  };

  if (attendees.length === 0) {
    return <p className="text-center text-gray-600 py-4">{emptyMessage}</p>; // 调整颜色
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {attendees.length === 0 ? (
        <p className="text-gray-500">{emptyMessage}</p>
      ) : (
        <ul className="space-y-2">
          {attendees.map((attendee) => (
            <li 
              key={attendee.id} 
              className={`flex justify-between items-center p-3 rounded-lg border ${!attendee.is_registered ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'}`}
            >
              <div className="flex items-center">
                <FaUserAlt className="mr-3 text-gray-400" />
                <span>{attendee.name}</span>
                {!attendee.is_registered && (
                  <span className="ml-2 px-2 py-1 text-xs bg-yellow-200 text-yellow-800 rounded-full">エントリーなし</span>
                )}
              </div>
              <button
                onClick={() => handleStatusChange(attendee.id, !attendee.is_present)}
                disabled={updatingId === attendee.id}
                className={`p-2 rounded-full ${attendee.is_present ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'} disabled:opacity-50`}
              >
                {attendee.is_present ? <FaTimes /> : <FaCheck />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}