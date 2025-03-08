import { supabase } from '$lib/supabase';

export const fetchHistoryList = async () => {
  const { data, error } = await supabase.from("history").select("*");

  if (error) {
    console.error("Supabase error:", error);
  }

  return data;
};
