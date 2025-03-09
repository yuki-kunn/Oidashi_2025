import { supabase } from '$lib/supabase';

export const fetchHistoryList = async () => {
  const { data, error } = await supabase.from("history").select("*");

  if (error) {
    console.error("Supabase error:", error);
  }

  return data;
};

export const fetchOrgList = async () => {
  const { data, error } = await supabase.from("org").select("*");

  if (error) {
    console.error("Supabase error:", error);
  }

  return data;
};

export const fetchBtyList = async () => {
  const { data, error } = await supabase.from("butyo").select("*");

  if (error) {
    console.error("Supabase error:", error);
  }

  return data;
};