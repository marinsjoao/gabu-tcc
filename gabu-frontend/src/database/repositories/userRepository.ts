import type { SQLiteDatabase } from 'expo-sqlite';
import type { User } from '../../types';

export async function getUser(db: SQLiteDatabase): Promise<User> {
  const user = await db.getFirstAsync<User>('SELECT * FROM User WHERE id = 1');
  if (!user) throw new Error('Usuário local não encontrado');
  return user;
}

export async function saveUserName(
  db: SQLiteDatabase,
  name: string
): Promise<void> {
  const normalizedName = name.trim();
  if (!normalizedName) throw new Error('O nome do usuário não pode ficar vazio');

  await db.runAsync('UPDATE User SET name = ? WHERE id = 1', normalizedName);
}

function todayStr(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return todayStr(d);
}

/** Soma moedas e atualiza o streak quando há recompensa por acerto. */
export async function addRewards(
  db: SQLiteDatabase,
  coins: number
): Promise<boolean> {
  if (!Number.isInteger(coins) || coins < 0) {
    throw new Error('A recompensa em moedas não pode ser negativa');
  }
  if (coins === 0) return false;

  const user = await getUser(db);
  const today = todayStr();
  const streakUpdated = user.last_study_date !== today;

  let streak = user.streak;
  if (streakUpdated) {
    streak = user.last_study_date === yesterdayStr() ? user.streak + 1 : 1;
  }
  const bestStreak = Math.max(user.best_streak, streak);

  await db.runAsync(
    `UPDATE User
        SET coins = coins + ?,
            best_coins = MAX(best_coins, coins + ?),
            streak = ?, best_streak = ?, last_study_date = ?
      WHERE id = 1`,
    coins,
    coins,
    streak,
    bestStreak,
    today
  );

  return streakUpdated;
}