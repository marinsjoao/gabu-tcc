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

/** Soma XP/moedas e atualiza o streak diário. */
export async function addRewards(
  db: SQLiteDatabase,
  xp: number,
  coins: number
): Promise<void> {
  const user = await getUser(db);
  const today = todayStr();

  let streak = user.streak;
  if (user.last_study_date !== today) {
    streak = user.last_study_date === yesterdayStr() ? user.streak + 1 : 1;
  }
  const bestStreak = Math.max(user.best_streak, streak);

  await db.runAsync(
    `UPDATE User
        SET xp = xp + ?, coins = coins + ?,
            streak = ?, best_streak = ?, last_study_date = ?
      WHERE id = 1`,
    xp,
    coins,
    streak,
    bestStreak,
    today
  );
}