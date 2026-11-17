import type { SQLiteDatabase } from 'expo-sqlite';
import type { Question } from '../../types';
import { addRewards } from './userRepository';
import { getQuestionById } from '../../data/questions';

export async function saveAnswer(
  db: SQLiteDatabase,
  question: Question,
  selectedIndex: number
): Promise<{ isCorrect: boolean; streakUpdated: boolean }> {
  if (
    !Number.isInteger(selectedIndex) ||
    selectedIndex < 0 ||
    selectedIndex >= question.alternativas.length
  ) {
    throw new Error('A alternativa selecionada não é válida');
  }

  const isCorrect = selectedIndex === question.correta;
  let streakUpdated = false;

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `INSERT INTO UserAnswers (question_id, selected_index, is_correct)
       VALUES (?, ?, ?)`,
      question.id,
      selectedIndex,
      isCorrect ? 1 : 0
    );
    streakUpdated = await addRewards(db, isCorrect ? 1 : 0);
  });

  return { isCorrect, streakUpdated };
}

export type DisciplineAnswerStats = {
  correct: number;
  incorrect: number;
};

export type AnswerStatistics = {
  total: number;
  correct: number;
  incorrect: number;
  daysPlayed: number;
  byDiscipline: Record<string, DisciplineAnswerStats>;
};

type AnswerRow = {
  question_id: number;
  is_correct: number;
  answered_date: string | null;
};

export async function getAnswerStatistics(
  db: SQLiteDatabase
): Promise<AnswerStatistics> {
  const answers = await db.getAllAsync<AnswerRow>(
    `SELECT question_id, is_correct,
            date(answered_at, 'localtime') AS answered_date
       FROM UserAnswers`
  );

  const daysPlayed = new Set<string>();
  const byDiscipline: Record<string, DisciplineAnswerStats> = {};
  let correct = 0;

  for (const answer of answers) {
    if (answer.answered_date) daysPlayed.add(answer.answered_date);

    const isCorrect = answer.is_correct === 1;
    if (isCorrect) correct += 1;

    const discipline = getQuestionById(answer.question_id)?.tema;
    if (!discipline) continue;

    byDiscipline[discipline] ??= { correct: 0, incorrect: 0 };
    byDiscipline[discipline][isCorrect ? 'correct' : 'incorrect'] += 1;
  }

  return {
    total: answers.length,
    correct,
    incorrect: answers.length - correct,
    daysPlayed: daysPlayed.size,
    byDiscipline,
  };
}