import { db, type StreakRecord } from '../database';

export const streaksRepository = {
	async getByHabitId(habitId: string): Promise<StreakRecord | undefined> {
		return await db.streaks.get(habitId);
	},

	async set(streak: StreakRecord): Promise<void> {
		await db.streaks.put(streak);
	},

	async delete(habitId: string): Promise<void> {
		await db.streaks.delete(habitId);
	}
};
