import type { Question } from '../types';
import rawQuestions from './questions.json';

export const questions: Question[] = rawQuestions as Question[];

export function getQuestionById(id: number): Question | undefined {
  return questions.find((q) => q.id === id);
}