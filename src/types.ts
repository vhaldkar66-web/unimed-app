/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Subject {
  id: number;
  name: string;
}

export interface Topic {
  id: number;
  name: string;
  subject_id: number;
}

export interface Appearance {
  year: number;
  session: string;
}

export interface Question {
  id: number;
  question_text: string;
  question_type: 'LAQ' | 'SAQ' | 'VSAQ' | 'Objective' | string;
  marks: number | null;
  topic_id: number;
  option_a?: string | null;
  option_b?: string | null;
  option_c?: string | null;
  option_d?: string | null;
  correct_option?: string | null;
  explanation?: string | null;
  answer_pdf_url?: string | null;
  topics: {
    name: string;
  } | null;
  appearances: Appearance[];
}

export interface FilterState {
  subject: string;
  topics: number[];
  type: string;
  yearFrom: string;
  yearTo: string;
  highYield: boolean;
  searchQuery: string;
  confidenceFilter: ConfidenceLevel | 'all';
}

export type ConfidenceLevel = 'low' | 'medium' | 'high';
