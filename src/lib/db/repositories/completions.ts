import { db, type HabitCompletion } from '../database';
import { v4 as uuidv4 } from 'uuid';

export const completionsRepository = {
	async getByHabitId(habitId: string): Promise<HabitCompletion[]> {
		return await db.completions.where('habitId').equals(habitId).toArray();
	},

	async getByDateRange(start: Date, end: Date): Promise<HabitCompletion[]> {
		return await db.completions.where('completedAt').between(start, end).toArray();
	},

	async create(completion: Omit<HabitCompletion, 'id'>): Promise<string> {
		const id = uuidv4();
		await db.completions.add({
			...completion,
			id
		});
		return id;
	}
};
