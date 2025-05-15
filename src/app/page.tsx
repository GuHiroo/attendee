'use client';

import { useState, useEffect } from 'react';
import { supabase, getAttendees, Attendee } from '@/lib/supabase';
import SearchBar from '@/components/SearchBar';
import AddAttendeeForm from '@/components/AddAttendeeForm';
import AttendeeList from '@/components/AttendeeList';

export default function Home() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendees = async () => {
    setLoading(true);
    const data = await getAttendees();
    setAttendees(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAttendees();

    // 设置实时订阅
    const channel = supabase
      .channel('attendees-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'attendees',
      }, () => {
        fetchAttendees();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const presentAttendees = attendees.filter(a => a.is_present);
  const absentAttendees = attendees.filter(a => !a.is_present);

  const handleSelectAttendee = async (attendee: Attendee) => {
    const updatedAttendees = attendees.map(a => {
      if (a.id === attendee.id) {
        return { ...a, is_present: !a.is_present };
      }
      return a;
    });
    setAttendees(updatedAttendees);
    await supabase
      .from('attendees')
      .update({ is_present: !attendee.is_present })
      .eq('id', attendee.id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">出席管理システム</h1> {/* 出席统计系统 -> 出席管理システム, 调整颜色 */}
          <p className="text-gray-700">リアルタイムで出席状況を追跡</p> {/* 实时跟踪人员出席情况 -> リアルタイムで出席状況を追跡, 调整颜色 */}
        </header>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-8">
            <SearchBar 
              attendees={attendees} 
              onSelectAttendee={handleSelectAttendee} 
              placeholder="名前を検索して出席状況をマーク..." // 搜索人员并标记出席状态... -> 名前を検索して出席状況をマーク...
            />
            <AddAttendeeForm onAddSuccess={fetchAttendees} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-green-800">出席者一覧</h2> {/* 已出席人员 -> 出席者一覧 */}
                <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full">
                  {presentAttendees.length} 名 {/* 人 -> 名 */}
                </span>
              </div>
              {loading ? (
                <p className="text-center py-4 text-gray-700">読み込み中...</p> 
              ) : (
                <AttendeeList
                  attendees={presentAttendees}
                  title=""
                  emptyMessage="出席者はいません" // 暂无人员出席 -> 出席者はいません
                  onStatusChange={fetchAttendees}
                />
              )}
            </div>

            <div className="bg-red-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-red-800">欠席者一覧</h2> {/* 未出席人员 -> 欠席者一覧 */}
                <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full">
                  {absentAttendees.length} 名 {/* 人 -> 名 */}
                </span>
              </div>
              {loading ? (
                <p className="text-center py-4 text-gray-700">読み込み中...</p>
              ) : (
                <AttendeeList
                  attendees={absentAttendees}
                  title=""
                  emptyMessage="欠席者はいません" // 暂无人员缺席 -> 欠席者はいません (注意：原文是“暂无人员缺席”，这里统一为“欠席者はいません”)
                  onStatusChange={fetchAttendees}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
