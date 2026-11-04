import type { SQLiteDatabase } from 'expo-sqlite';
import type { Question } from '../../types';
import { addRewards } from './userRepository';

const XP_CORRECT = 10;
const XP_WRONG = 2;
const COINS_CORRECT = 1;

export async function saveAnswer(
  db: SQLiteDatabase,
  question: Question,
  selectedIndex: number
): Promise<boolean> {
  const isCorrect = selectedIndex === question.correta;

  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `INSERT INTO UserAnswers (question_id, selected_index, is_correct)
       VALUES (?, ?, ?)`,
      question.id,
      selectedIndex,
      isCorrect ? 1 : 0
    );
    await addRewards(
      db,
      isCorrect ? XP_CORRECT : XP_WRONG,
      isCorrect ? COINS_CORRECT : 0
    );
  });

  return isCorrect;
}

export async function countAnswers(db: SQLiteDatabase): Promise<number> {
  const row = await db.getFirstAsync<{ total: number }>(
    'SELECT COUNT(*) AS total FROM UserAnswers'
  );
  return row?.total ?? 0;
}