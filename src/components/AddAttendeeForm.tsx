'use client';

import { useState } from 'react';
import { addUnregisteredAttendee } from '@/lib/supabase';
import { FaUserPlus } from 'react-icons/fa';

type AddAttendeeFormProps = {
  onAddSuccess: () => void;
};

export default function AddAttendeeForm({ onAddSuccess }: AddAttendeeFormProps) {
  const [name, setName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsAdding(true);
    const success = await addUnregisteredAttendee(name.trim());
    setIsAdding(false);

    if (success) {
      setName('');
      onAddSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="未登録者名を入力" // 手动输入未报名人员姓名 -> 未登録者名を入力
        className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-grow"
        required
      />
      <button
        type="submit"
        disabled={isAdding || !name.trim()}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {isAdding ? '追加中...' : '追加して出席にする'} {/* 添加并标记出席 -> 追加して出席にする, 添加中... -> 追加中... */}
      </button>
    </form>
  );
}