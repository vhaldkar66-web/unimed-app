/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Subject, Topic, Question } from '../types';

const SUPABASE_URL = 'https://fdguajjczjhfpriblhog.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkZ3VhampjempoZnByaWJsaG9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3NzAwNzgsImV4cCI6MjA5NjM0NjA3OH0.2E7WbQ-N83tTxVHDJV65ocec2GIdHLS8QGysKJnFtqY';

const HEADERS = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Accept': 'application/json'
};

async function fetchFromSupabase<T>(path: string): Promise<T> {
  const url = `${SUPABASE_URL}/rest/v1/${path}`;
  const response = await fetch(url, { headers: HEADERS });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

export async function fetchSubjects(): Promise<Subject[]> {
  return fetchFromSupabase<Subject[]>('subjects?select=id,name&order=name.asc');
}

export async function fetchTopics(subjectId: number): Promise<Topic[]> {
  return fetchFromSupabase<Topic[]>(`topics?subject_id=eq.${subjectId}&select=id,name&order=name.asc`);
}

/**
 * Fetches all questions for a list of topics.
 * If topicIds is empty, it returns an empty array.
 */
export async function fetchQuestions(topicIds: number[]): Promise<Question[]> {
  if (topicIds.length === 0) return [];
  
  // Supabase limits IN queries or URL length if too many IDs,
  // but for a single subject's topics (typically 10-50), a single IN query is perfectly safe.
  const topicFilter = `topic_id=in.(${topicIds.join(',')})`;
  const query = `questions?${topicFilter}&select=id,question_text,question_type,marks,topic_id,option_a,option_b,option_c,option_d,correct_option,explanation,answer_pdf_url,topics(name),appearances(year,session)`;
  
  return fetchFromSupabase<Question[]>(query);
}


/**
 * Fetches questions globally matching a search string.
 */
export async function searchGlobalQuestions(searchQuery: string): Promise<Question[]> {
  if (!searchQuery.trim()) return [];
  const q = encodeURIComponent(searchQuery);
  const queryStr = `questions?or=(question_text.ilike.*${q}*,option_a.ilike.*${q}*,option_b.ilike.*${q}*,option_c.ilike.*${q}*,option_d.ilike.*${q}*)&select=id,question_text,question_type,marks,topic_id,option_a,option_b,option_c,option_d,correct_option,explanation,answer_pdf_url,topics(name),appearances(year,session)&limit=100`;
  return fetchFromSupabase<Question[]>(queryStr);
}
