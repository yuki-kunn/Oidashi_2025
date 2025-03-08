import { supabase } from '$lib/supabase';

export const GET = async () => {
  const { data, error } = await supabase
    .from('history')
    .select('*');

  if (error) return { history: [] };

  return { history: data };
};