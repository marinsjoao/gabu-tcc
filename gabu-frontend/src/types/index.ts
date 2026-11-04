export type Question = {
  id: number;
  materia: string;
  tema?: string;
  prova?: string | number;
  nivel?: string;
  pergunta: string;
  alternativas: string[];
  correta: number; // índice da alternativa correta
  explicacao: string;
};

export type User = {
  id: number;
  name: string | null;
  xp: number;
  coins: number;
  streak: number;
  best_streak: number;
  last_study_date: string | null; // 'YYYY-MM-DD'
  daily_goal: number;
  created_at: string;
};

export type UserAnswer = {
  id: number;
  question_id: number;
  selected_index: number;
  is_correct: number; // 0 | 1
  answered_at: string;
};