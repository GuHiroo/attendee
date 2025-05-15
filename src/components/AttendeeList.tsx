'use client';

import { useState } from 'react';
import { Attendee, updateAttendeeStatus } from '@/lib/supabase';


type AttendeeListProps = {
  attendees: Attendee[];
  title: string;
  emptyMessage: string;
  onStatusChange: () => void;
};

export default function AttendeeList({ attendees, title, emptyMessage, onStatusChange }: AttendeeListProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleChangeStatus = async (id: string, newStatus: boolean) => {
    setIsLoading(id);
    await updateAttendeeStatus(id, newStatus);
    onStatusChange(); // Refresh the list in the parent component
    setIsLoading(null);
  };

  if (attendees.length === 0) {
    return <p className="text-center text-gray-700 py-4">{emptyMessage}</p>; // 将 text-gray-600 改为 text-gray-700 或更深
  }

  return (
    <div>
      {title && <h3 className="text-lg font-semibold mb-2 text-gray-800">{title}</h3>}
      <ul className="space-y-2">
        {attendees.map(attendee => (
          <li 
            key={attendee.id} 
            className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow duration-150"
          >
            <span className="text-gray-800 font-medium">{attendee.name}</span> {/* 将默认颜色或浅色改为 text-gray-800 并加粗 font-medium */}
            <button
              onClick={() => handleChangeStatus(attendee.id, !attendee.is_present)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-150 
                ${attendee.is_present 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
              disabled={isLoading === attendee.id}
            >
              {isLoading === attendee.id 
                ? '更新中...' 
                : attendee.is_present ? '欠席にする' : '出席にする'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}