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
          <h1 className="text-3xl font-bold mb-2">出席统计系统</h1>
          <p className="text-gray-600">实时跟踪人员出席情况</p>
        </header>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-8">
            <SearchBar 
              attendees={attendees} 
              onSelectAttendee={handleSelectAttendee} 
              placeholder="搜索人员并标记出席状态..."
            />
            <AddAttendeeForm onAddSuccess={fetchAttendees} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-green-800">已出席人员</h2>
                <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full">
                  {presentAttendees.length} 人
                </span>
              </div>
              {loading ? (
                <p className="text-center py-4">加载中...</p>
              ) : (
                <AttendeeList
                  attendees={presentAttendees}
                  title=""
                  emptyMessage="暂无人员出席"
                  onStatusChange={fetchAttendees}
                />
              )}
            </div>

            <div className="bg-red-50 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-red-800">未出席人员</h2>
                <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full">
                  {absentAttendees.length} 人
                </span>
              </div>
              {loading ? (
                <p className="text-center py-4">加载中...</p>
              ) : (
                <AttendeeList
                  attendees={absentAttendees}
                  title=""
                  emptyMessage="所有人员已出席"
                  onStatusChange={fetchAttendees}
                />
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">全部人员</h2>
          {loading ? (
            <p className="text-center py-4">加载中...</p>
          ) : (
            <AttendeeList
              attendees={attendees}
              title=""
              emptyMessage="暂无人员数据"
              onStatusChange={fetchAttendees}
            />
          )}
        </div>
      </div>
    </div>
  );
}
