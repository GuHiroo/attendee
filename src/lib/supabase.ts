import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export type Attendee = {
  id: string;
  name: string;
  is_present: boolean;
  is_registered: boolean;
  created_at: string;
};

export async function getAttendees() {
  const { data, error } = await supabase
    .from('attendees')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching attendees:', error);
    return [];
  }
  
  return data as Attendee[];
}

export async function updateAttendeeStatus(id: string, isPresent: boolean) {
  const { error } = await supabase
    .from('attendees')
    .update({ is_present: isPresent })
    .eq('id', id);
  
  if (error) {
    console.error('Error updating attendee status:', error);
    return false;
  }
  
  return true;
}

export async function addUnregisteredAttendee(name: string) {
  const { error } = await supabase
    .from('attendees')
    .insert([{ name, is_present: true, is_registered: false }]);
  
  if (error) {
    console.error('Error adding unregistered attendee:', error);
    return false;
  }
  
  return true;
}