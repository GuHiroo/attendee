'use client';

import { useState, useEffect } from 'react';
import { Attendee } from '@/lib/supabase';
import { FaSearch } from 'react-icons/fa';

type SearchBarProps = {
  attendees: Attendee[];
  onSelectAttendee: (attendee: Attendee) => void;
  placeholder?: string;
};

export default function SearchBar({ attendees, onSelectAttendee, placeholder = '搜索人员...' }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAttendees, setFilteredAttendees] = useState<Attendee[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAttendees([]);
      return;
    }

    const filtered = attendees.filter(attendee =>
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAttendees(filtered);
  }, [searchTerm, attendees]);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>

      {isDropdownOpen && filteredAttendees.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredAttendees.map((attendee) => (
            <li
              key={attendee.id}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${attendee.is_present ? 'text-green-600' : 'text-red-600'}`}
              onClick={() => {
                onSelectAttendee(attendee);
                setSearchTerm('');
                setIsDropdownOpen(false);
              }}
            >
              {attendee.name} {attendee.is_present ? '(已出席)' : '(未出席)'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}